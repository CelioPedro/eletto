import { NextRequest, NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      candidateName,
      office,
      party,
      state,
      totalAssetsCents,
      assetGrowthPct,
      totalDonationsCents,
      totalExpensesCents,
      signalsCount,
      signals,
      topSuppliers,
      earmarksCount,
      totalEarmarksCents,
      supplierPartners = [],
    } = body;

    const systemPrompt = `Você é um perito criminal e analista sênior de inteligência financeira e eleitoral brasileira (padrão COAF / Polícia Federal / TSE).
Sua missão é emitir um PARECER PERICIAL EXECUTIVO DE RISCO sobre o agente político auditado com base nos dados oficiais tabulados.

Responda SEMPRE E UNICAMENTE com um objeto JSON com esta estrutura:
{
  "riskLevel": "BAIXO" | "MODERADO" | "ELEVADO" | "CRÍTICO",
  "forensicScore": 0 a 100 (número inteiro: 0 = idôneo/sem alertas; 100 = altíssimo risco/anomalia grave),
  "executiveSummary": "Síntese técnica e pericial em 2 a 3 parágrafos objetivos avaliando a conformidade financeira, o vulto das transações e as eventuais anomalias apuradas",
  "keyFindings": [
    "Ponto crítico 1 (ex: concentração de despesas em gráfica ou fornecedor atípico)",
    "Ponto crítico 2 (ex: evolução patrimonial ou salto de bens sem explicação imediata)",
    "Ponto crítico 3 (ex: indícios de triangulação financeira ou doações circulares identificadas)"
  ],
  "recommendedSteps": [
    "Diligência pericial recomendada 1 (ex: consulta ao QSA na Receita Federal dos 3 maiores fornecedores)",
    "Diligência pericial recomendada 2 (ex: cruzamento de notas fiscais eletrônicas perante a Secretaria de Fazenda)",
    "Diligência pericial recomendada 3 (ex: verificação de capacidade operacional dos prestadores de serviço)"
  ]
}

Diretrizes:
- Seja técnico, objetivo e embasado estritamente nos dados recebidos.
- Diferencie movimentação partidária regular de despesas atípicas de alto risco.
- Se houver registros em 'conflitoInteressesSocietario' (especialmente com 'paidBySelf: true'), trate como anomalia grave/crítica de autofinanciamento e confusão patrimonial com recursos eleitorais, elevando o forensicScore (geralmente >= 75) e destacando obrigatoriamente nos keyFindings e recommendedSteps (ex: quebra de sigilo bancário da pessoa jurídica e verificação de prestação efetiva dos serviços).`;

    const profileData = {
      agentePolitico: {
        nome: candidateName,
        cargo: office,
        partido: party,
        uf: state,
      },
      patrimonio: {
        valorReais: totalAssetsCents ? totalAssetsCents / 100 : 0,
        crescimentoPercentual: assetGrowthPct,
      },
      campanha: {
        receitasReais: totalDonationsCents ? totalDonationsCents / 100 : 0,
        despesasReais: totalExpensesCents ? totalExpensesCents / 100 : 0,
        maioresFornecedores: topSuppliers || [],
      },
      conflitoInteressesSocietario: supplierPartners || [],
      sinaisDeAlerta: {
        quantidade: signalsCount || 0,
        detalhes: signals || [],
      },
      emendasParlamentares: {
        quantidade: earmarksCount || 0,
        totalReais: totalEarmarksCents ? totalEarmarksCents / 100 : 0,
      },
    };

    const userPrompt = `Analise os dados deste agente político e emita o Parecer Pericial de Risco:\n\n${JSON.stringify(profileData, null, 2)}`;

    const geminiRes = await generateGeminiJson(systemPrompt, userPrompt);

    return NextResponse.json({
      success: true,
      model: geminiRes.model,
      analysis: geminiRes.data,
    });
  } catch (err: any) {
    console.error("Erro na API /api/ai/dossier-summary:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erro interno ao processar parecer com Gemini" },
      { status: 500 }
    );
  }
}
