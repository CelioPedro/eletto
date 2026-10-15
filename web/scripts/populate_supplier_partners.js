const { Pool } = require('pg');
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:keypccontra@localhost:5432/elosys' 
});

async function main() {
  console.log("=== Ingesting Candidate Supplier Partners (Sócio de Fornecedor) ===");
  const startTime = Date.now();

  // 1. Identify matches and company names
  console.log("Step 1: Identifying candidate-owned supplier companies...");
  const query = `
    WITH candidate_declared AS (
      SELECT 
        da.person_id,
        regexp_replace(
          substring(da.description from '[0-9]{2}\\.?[0-9]{3}\\.?[0-9]{3}/?[0-9]{4}-?[0-9]{2}'),
          '[^0-9]', '', 'g'
        ) AS clean_cnpj,
        da.asset_type,
        min(da.year) AS min_year
      FROM declared_assets da
      WHERE da.description ~* '[0-9]{2}\\.?[0-9]{3}\\.?[0-9]{3}/?[0-9]{4}-?[0-9]{2}'
        AND (
          da.asset_type IN ('Quotas ou quinhões de capital', 'Outras participações societárias')
          OR da.description ~* '(quota|quotas|quinhão|quinhões|capital social|sócio|sócia|titular|participação societária|empresa individual|eireli)'
        )
        AND da.asset_type NOT IN (
          'Depósito bancário em conta corrente no país',
          'Caderneta de poupança',
          'Aplicação de renda fixa (CDB, RDB e outros)',
          'Fundo de investimento financeiro - FIF',
          'Outras aplicações e Investimentos',
          'Ações (inclusive as provenientes de linha telefônica)',
          'VGBL - Vida Gerador de Benefício Livre'
        )
      GROUP BY da.person_id, regexp_replace(
          substring(da.description from '[0-9]{2}\\.?[0-9]{3}\\.?[0-9]{3}/?[0-9]{4}-?[0-9]{2}'),
          '[^0-9]', '', 'g'
        ), da.asset_type
    ),
    candidate_companies AS (
      SELECT 
        cd.person_id,
        cd.clean_cnpj,
        min(cd.min_year) AS first_year_declared,
        CASE 
          WHEN bool_or(cd.asset_type = 'Quotas ou quinhões de capital') THEN 'Sócio / Titular (Quotas)'
          WHEN bool_or(cd.asset_type = 'Outras participações societárias') THEN 'Sócio / Participação Societária'
          ELSE 'Sócio / Titular Declarado'
        END AS partner_role
      FROM candidate_declared cd
      WHERE length(cd.clean_cnpj) = 14
        AND cd.clean_cnpj NOT IN (
          '00000000000191', '00360305000104', '00000000000100', '00000000000000',
          '60746948000112', '60701190000104', '90400888000142', '92702067000196',
          '76535764000143', '33000167000101', '00416968000101', '30680829000143'
        )
      GROUP BY cd.person_id, cd.clean_cnpj
    ),
    supplier_payments AS (
      SELECT 
        cc.person_id,
        c.id AS company_id,
        cc.partner_role,
        CASE WHEN cc.first_year_declared IS NOT NULL THEN 'Declarado em ' || cc.first_year_declared ELSE NULL END AS partner_since,
        mode() WITHIN GROUP (ORDER BY coalesce(ce.supplier_name_rfb, ce.supplier_name)) AS resolved_name,
        sum(ce.amount_cents) AS payments_total_cents,
        count(ce.id) AS payments_count,
        count(DISTINCT co.person_id) AS payer_candidacies,
        max(CASE WHEN co.person_id = cc.person_id THEN 1 ELSE 0 END) AS paid_by_self
      FROM candidate_companies cc
      JOIN companies c ON c.cnpj = cc.clean_cnpj
      JOIN campaign_expense ce ON ce.supplier_company_id = c.id
      JOIN campaign_org co ON co.id = ce.campaign_org_id
      GROUP BY cc.person_id, c.id, cc.partner_role, cc.first_year_declared
    )
    SELECT *
    FROM supplier_payments
    WHERE (resolved_name IS NULL OR (
      resolved_name NOT ILIKE '%banco%'
      AND resolved_name NOT ILIKE '%caixa economica%'
      AND resolved_name NOT ILIKE '%nu financeira%'
      AND resolved_name NOT ILIKE '%oi s.a%'
      AND resolved_name NOT ILIKE '%petrobras%'
      AND resolved_name NOT ILIKE '%a identificar%'
    ))
  `;

  const matches = await pool.query(query);
  console.log(`Found ${matches.rows.length} validated candidate-supplier relationships!`);

  // Step 2: Enrich company names in companies table where null
  console.log("Step 2: Enriching companies.legal_name where missing...");
  const companyNameUpdates = new Map();
  for (const row of matches.rows) {
    if (row.resolved_name && !companyNameUpdates.has(row.company_id)) {
      companyNameUpdates.set(row.company_id, row.resolved_name);
    }
  }

  let enrichedCount = 0;
  for (const [companyId, name] of companyNameUpdates.entries()) {
    const res = await pool.query(
      `UPDATE companies SET legal_name = $1 WHERE id = $2 AND legal_name IS NULL`,
      [name, companyId]
    );
    if (res.rowCount > 0) enrichedCount++;
  }
  console.log(`Enriched ${enrichedCount} company names.`);

  // Step 3: Populate candidate_supplier_partner
  console.log("Step 3: Populating candidate_supplier_partner table...");
  await pool.query("BEGIN");
  await pool.query("TRUNCATE candidate_supplier_partner RESTART IDENTITY");

  const nowIso = new Date().toISOString();
  let inserted = 0;

  // Insert in batches directly
  const batchSize = 100;
  for (let i = 0; i < matches.rows.length; i += batchSize) {
    const chunk = matches.rows.slice(i, i + batchSize);
    const values = [];
    const valueTuples = [];

    chunk.forEach((r, idx) => {
      const offset = idx * 11;
      valueTuples.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11})`
      );
      values.push(
        BigInt(r.person_id),
        BigInt(r.company_id),
        0n, // company_partner_id (synthetic match)
        'declaracao_bens_cnpj',
        r.partner_role,
        r.partner_since,
        BigInt(r.payments_total_cents),
        BigInt(r.payments_count),
        BigInt(r.payer_candidacies),
        BigInt(r.paid_by_self),
        nowIso
      );
    });

    await pool.query(`
      INSERT INTO candidate_supplier_partner (
        person_id, company_id, company_partner_id, match_basis, partner_role,
        partner_since, payments_total_cents, payments_count, payer_candidacies,
        paid_by_self, computed_at
      )
      VALUES ${valueTuples.join(', ')}
      ON CONFLICT (person_id, company_id) DO UPDATE SET
        payments_total_cents = EXCLUDED.payments_total_cents,
        payments_count = EXCLUDED.payments_count,
        payer_candidacies = EXCLUDED.payer_candidacies,
        paid_by_self = EXCLUDED.paid_by_self,
        partner_role = EXCLUDED.partner_role,
        partner_since = EXCLUDED.partner_since,
        computed_at = EXCLUDED.computed_at
    `, values);

    inserted += chunk.length;
  }

  await pool.query("COMMIT");

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Successfully populated candidate_supplier_partner with ${inserted} rows in ${elapsed}s!`);

  // Final summary
  const summary = await pool.query(`
    SELECT 
      count(*) AS total,
      sum(paid_by_self) AS self_count,
      sum(payments_total_cents) AS total_cents,
      count(DISTINCT person_id) AS distinct_people,
      count(DISTINCT company_id) AS distinct_companies
    FROM candidate_supplier_partner
  `);
  console.table(summary.rows);

  await pool.end();
}

main().catch(async (err) => {
  console.error("Migration failed:", err);
  try { await pool.query("ROLLBACK"); } catch (_) {}
  await pool.end();
  process.exit(1);
});
