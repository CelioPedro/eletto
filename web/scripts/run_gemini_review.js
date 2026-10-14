const https = require('https');
const { Pool } = require('pg');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:keypccontra@localhost:5432/elosys';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('ERRO: GEMINI_API_KEY não definida nas variáveis de ambiente.');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

const SYSTEM_PROMPT = 
`Você analisa SINAIS DE ALERTA gerados por um sistema sobre dados PÚBLICOS de financiamento de campanha eleitoral no Brasil (prestação de contas do TSE). Os sinais NÃO são acusação — são indícios que precisam de checagem humana. Seu trabalho é TRIAR: dizer se esse caso específico merece ou não a atenção de um humano. É uma decisão de priorização, não um julgamento.

Responda SEMPRE com um objeto JSON, e só ele:
{
  "verdict": "bizarro" | "plausivel" | "inconclusivo",
  "confianca": "baixa" | "media" | "alta",
  "explicacao": "2 a 4 frases em português, objetivas, citando os fatos que pesaram",
  "fatos": ["ponto concreto 1", "ponto concreto 2", "..."]
}

- "plausivel": dá pra explicar por um padrão comum e legítimo — mesma coligação/partido, conta nacional do partido repassando recursos aos próprios candidatos, devolução de sobra, doação entre aliados do mesmo grupo, compra em lote, preço dentro do razoável pro item.
- "bizarro": tem pelo menos UM fato que dificulta a explicação simples e justifica um humano olhar — por exemplo: ciclo curto e fechado entre pessoas SEM partido/coligação em comum; empresa que doou milhões e recebeu de volta quase o mesmo; fornecedor cujo ramo não tem nada a ver com o serviço; valor de uma ordem de grandeza acima do resto das transações da cadeia; preço muito acima de mercado sem lote que justifique. Não precisa de prova — precisa de um fato concreto que você consiga nomear.
- "inconclusivo": os fatos não apontam nem pra um lado nem pro outro.

NUNCA afirme que houve crime, fraude ou irregularidade — "bizarro" quer dizer "vale conferir", não "é culpado". Mas também NÃO se esconda no "inconclusivo": se há um fato que chama atenção, diga "bizarro" e nomeie o fato. Reserve "inconclusivo" pros casos em que realmente não dá pra dizer nada.`;

async function callGemini(systemPrompt, userPrompt) {
  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
  for (const model of models) {
    try {
      const payload = JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const res = await new Promise((resolve, reject) => {
        const req = https.request(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 30000
          },
          (r) => {
            let data = '';
            r.on('data', chunk => data += chunk);
            r.on('end', () => resolve({ statusCode: r.statusCode, data }));
          }
        );
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        req.write(payload);
        req.end();
      });

      if (res.statusCode === 200) {
        const json = JSON.parse(res.data);
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        const usage = json.usageMetadata || {};
        const parsed = JSON.parse(text);
        return {
          model,
          data: parsed,
          raw: text,
          tokensPrompt: usage.promptTokenCount || 0,
          tokensCompletion: usage.candidatesTokenCount || 0
        };
      }
      console.warn(`Model ${model} returned HTTP ${res.statusCode}: ${res.data.substring(0, 150)}`);
    } catch (err) {
      console.warn(`Error with ${model}:`, err.message);
    }
  }
  throw new Error('All Gemini models failed or high demand');
}

async function getCandidateBlurb(client, personId) {
  const res = await client.query(`
    SELECT party_abbr, office, state, string_agg(DISTINCT year::text, ',') AS years
    FROM politician_history
    WHERE person_id = $1
    GROUP BY person_id, party_abbr, office, state
    ORDER BY max(year) DESC
    LIMIT 1
  `, [personId]);
  if (!res.rows[0]) return {};
  const r = res.rows[0];
  return { partido: r.party_abbr, cargo: r.office, uf: r.state, anos: r.years };
}

async function getCircularFacts(client, signalId, explanation) {
  // Actors
  const actorsRes = await client.query(`
    SELECT sa.type, sa.actor_id 
    FROM signal_actor sa 
    WHERE sa.signal_id = $1
  `, [signalId]);

  const entities = [];
  for (const a of actorsRes.rows) {
    if (a.type === 'person') {
      const p = (await client.query('SELECT id, canonical_name FROM people WHERE id = $1', [a.actor_id])).rows[0];
      if (p) {
        const blurb = await getCandidateBlurb(client, p.id);
        entities.push({ nome: p.canonical_name, ...blurb });
      }
    } else {
      const c = (await client.query(`
        SELECT coalesce(cr.legal_name, c.legal_name) AS name 
        FROM companies c 
        LEFT JOIN company_registry cr ON cr.company_id = c.id 
        WHERE c.id = $1
      `, [a.actor_id])).rows[0];
      if (c) {
        entities.push({ nome: c.name, tipo: 'empresa' });
      }
    }
  }

  // Evidences
  const evRes = await client.query(`
    SELECT table_name, record_id 
    FROM signal_evidence 
    WHERE signal_id = $1
  `, [signalId]);

  const txMap = new Map();
  for (const ev of evRes.rows) {
    let row, tipo;
    if (ev.table_name === 'campaign_donation') {
      row = (await client.query(`
        SELECT d.amount_cents, d.year, d.donor_name AS de, p.canonical_name AS para
        FROM campaign_donation d
        JOIN campaign_org co ON co.id = d.campaign_org_id
        JOIN people p ON p.id = co.person_id
        WHERE d.id = $1
      `, [ev.record_id])).rows[0];
      tipo = 'doação';
    } else if (ev.table_name === 'campaign_expense') {
      row = (await client.query(`
        SELECT ce.amount_cents, ce.year, p.canonical_name AS de, ce.supplier_name AS para
        FROM campaign_expense ce
        JOIN campaign_org co ON co.id = ce.campaign_org_id
        JOIN people p ON p.id = co.person_id
        WHERE ce.id = $1
      `, [ev.record_id])).rows[0];
      tipo = 'despesa';
    }
    if (!row) continue;
    const key = `${row.de}|${row.para}|${tipo}`;
    let item = txMap.get(key);
    if (!item) {
      item = { de: row.de, para: row.para, tipo, valor_cents: 0, qtd: 0, anos: new Set() };
      txMap.set(key, item);
    }
    item.valor_cents += Number(row.amount_cents) || 0;
    item.qtd += 1;
    if (row.year) item.anos.add(row.year);
  }

  const transacoes = Array.from(txMap.values()).map(t => ({
    ...t,
    anos: Array.from(t.anos).sort()
  }));

  return { resumo: explanation, entidades: entities, transacoes };
}

async function getDisproportionateFacts(client, signalId, explanation) {
  const ev = (await client.query(`
    SELECT ce.description, ce.origin, ce.amount_cents, ce.year, ce.supplier_name,
           ce.supplier_cpf_cnpj, co.person_id AS candidate_person_id,
           p.canonical_name AS candidate_name
    FROM signal_evidence se
    JOIN campaign_expense ce ON ce.id = se.record_id
    LEFT JOIN campaign_org co ON co.id = ce.campaign_org_id
    LEFT JOIN people p ON p.id = co.person_id
    WHERE se.signal_id = $1 AND se.table_name = 'campaign_expense'
    LIMIT 1
  `, [signalId])).rows[0];

  if (!ev) return { resumo: explanation };

  const facts = {
    resumo: explanation,
    descricao_item: ev.description,
    categoria_tse: ev.origin,
    valor_contratado_cents: Number(ev.amount_cents),
    ano: ev.year,
    fornecedor: ev.supplier_name,
    fornecedor_cnpj: ev.supplier_cpf_cnpj,
  };

  if (ev.candidate_person_id) {
    const blurb = await getCandidateBlurb(client, ev.candidate_person_id);
    facts.candidato = { nome: ev.candidate_name, ...blurb };
  }

  return facts;
}

function buildUserPrompt(rule, facts) {
  const kind = rule === 'circular_donations'
    ? 'DOAÇÃO CIRCULAR (loop de movimentação de campanha: o dinheiro sai de uma campanha e, seguindo doações e despesas, volta pra mesma cadeia)'
    : 'DESPESA DE CAMPANHA DESPROPORCIONAL (item tipicamente barato — caneta, adesivo, crachá... — contratado por valor alto)';

  return `Tipo de sinal: ${kind}.\n\nFatos (JSON):\n${JSON.stringify(facts, null, 2)}\n\nCom base SÓ nesses fatos, esse sinal é rotineiro/explicável ou genuinamente estranho? Responda no formato JSON pedido.`;
}

async function reviewSignals(limitPerRule = 25) {
  const client = await pool.connect();
  try {
    // Ensure index
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS signal_ai_review_sig_model_uidx 
      ON signal_ai_review(signal_id, model);
    `);

    const rules = ['circular_donations', 'disproportionate_expense'];
    let totalReviewed = 0;

    for (const rule of rules) {
      console.log(`\n=== Buscando sinais de '${rule}' para revisão com Gemini ===`);
      
      const targetsRes = await client.query(`
        SELECT s.id, s.explanation, s.amount_cents
        FROM signal s
        JOIN rule_run r ON r.id = s.rule_run_id
        WHERE r.rule = $1
          AND s.id NOT IN (SELECT signal_id FROM signal_ai_review)
        ORDER BY coalesce(s.amount_cents, 0) DESC
        LIMIT $2
      `, [rule, limitPerRule]);

      console.log(`Encontrados ${targetsRes.rows.length} sinais prioritários.`);

      for (let i = 0; i < targetsRes.rows.length; i++) {
        const row = targetsRes.rows[i];
        console.log(`[${i + 1}/${targetsRes.rows.length}] Analisando sinal #${row.id} (${(row.amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})...`);
        
        let facts;
        if (rule === 'circular_donations') {
          facts = await getCircularFacts(client, row.id, row.explanation);
        } else {
          facts = await getDisproportionateFacts(client, row.id, row.explanation);
        }

        const userPrompt = buildUserPrompt(rule, facts);

        try {
          const aiRes = await callGemini(SYSTEM_PROMPT, userPrompt);
          const { verdict, confianca, explicacao, fatos } = aiRes.data;

          const cleanVerdict = ['bizarro', 'plausivel', 'inconclusivo'].includes(verdict?.toLowerCase()) 
            ? verdict.toLowerCase() 
            : 'inconclusivo';
          const cleanConfidence = ['baixa', 'media', 'alta'].includes(confianca?.toLowerCase()) 
            ? confianca.toLowerCase() 
            : null;
          const cleanFacts = Array.isArray(fatos) ? fatos : [String(fatos || '')];

          await client.query(`
            INSERT INTO signal_ai_review 
              (signal_id, model, reviewed_at, verdict, confidence, explanation, facts, prompt, raw_response, tokens_prompt, tokens_completion)
            VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (signal_id, model) DO UPDATE SET
              reviewed_at = EXCLUDED.reviewed_at,
              verdict = EXCLUDED.verdict,
              confidence = EXCLUDED.confidence,
              explanation = EXCLUDED.explanation,
              facts = EXCLUDED.facts,
              prompt = EXCLUDED.prompt,
              raw_response = EXCLUDED.raw_response,
              tokens_prompt = EXCLUDED.tokens_prompt,
              tokens_completion = EXCLUDED.tokens_completion
          `, [
            row.id,
            aiRes.model,
            new Date().toISOString(),
            cleanVerdict,
            cleanConfidence,
            explicacao || '(sem explicação)',
            JSON.stringify(cleanFacts),
            userPrompt,
            aiRes.raw,
            aiRes.tokensPrompt,
            aiRes.tokensCompletion
          ]);

          console.log(` -> Veredito: [${cleanVerdict.toUpperCase()}] (${cleanConfidence || 'médio'}) - ${explicacao?.substring(0, 80)}...`);
          totalReviewed++;

          // Pause slightly to respect rate limits
          await new Promise(r => setTimeout(r, 600));
        } catch (err) {
          console.error(`Erro ao analisar sinal #${row.id}:`, err.message);
        }
      }
    }

    console.log(`\n Concluído! Total de sinais analisados pelo Gemini: ${totalReviewed}`);
  } finally {
    client.release();
    await pool.end();
  }
}

// Support running with an argument for limit per rule: node run_gemini_review.js 25
const limit = Number(process.argv[2]) || 15;
reviewSignals(limit).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
