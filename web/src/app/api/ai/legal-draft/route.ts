import { NextRequest, NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      candidateName,
      candidateCpf,
      pieceType,
      office,
      party,
      state,
      year,
      totalAssetsCents,
      assetGrowthPct,
      totalDonationsCents,
      totalExpensesCents,
      topDonors,
      topSuppliers,
      signals,
      earmarks,
      tone = "robusto",
    } = body;

    const pieceLabelMap: Record<string, string> = {
      representacao_30a: "Representação por Captação e Gasto Ilícito de Recursos (Art. 30-A da Lei nº 9.504/1997)",
      noticia_crime: "Notícia-Crime Eleitoral perante o MPE / PF (Falsidade Ideológica Eleitoral e Caixa Dois - Arts. 350 e 354 do Código Eleitoral)",
      aije: "Ação de Investigação Judicial Eleitoral - AIJE (Abuso de Poder Econômico - Art. 22 da Lei Complementar nº 64/1990)",
      impugnacao_contas: "Impugnação de Prestação de Contas Eleitorais (Resolução TSE nº 23.607/2019)",
    };

    const pieceTitle = pieceLabelMap[pieceType] || "Representação Eleitoral";

    const systemPrompt = `Você é um jurista sênior e perito forense eleitoral brasileiro com larga experiência em litígios perante o Tribunal Superior Eleitoral (TSE) e o Ministério Público Eleitoral (MPE).
Sua missão é redigir a fundamentação fático-jurídica pericial para uma peça contenciosa contra o agente político auditado, utilizando técnica formal, precisa, contundente e estritamente embasada nos dados fornecidos.

Responda SEMPRE E UNICAMENTE com um objeto JSON com esta estrutura:
{
  "fatosDetalhados": "Texto fluido e persuasivo em 2 a 3 parágrafos narrando o quadro fático com os valores reais em Reais, a evolução patrimonial e as anomalias auditadas",
  "enquadramentoJuridico": "Texto denso em 2 a 3 parágrafos demonstrando a subsunção dos fatos aos dispositivos legais de regência (citando o TSE, artigos aplicáveis, proporcionalidade e gravidade para cassação/sanção)",
  "pedidos": [
    "Rol de requerimentos objetivos e concretos, incluindo pedidos de diligências (ex: quebra de sigilo bancário/fiscal de fornecedores se couber, intimação da PF/Receita Federal, juntada de extratos, citação do réu, procedência com aplicação da sanção legal)"
  ],
  "resumoEstrategico": "Síntese executiva da tese formulada em 1 a 2 frases"
}

Diretrizes:
- Use terminologia forense brasileira impecável ('douto Juízo', 'subsunção', 'acervo probatório', 'lisura do pleito', etc.).
- Cite os dados numéricos exatos fornecidos (valores em R$, percentuais de patrimônio, fornecedores e sinais).
- Não invente fatos externos; use a auditoria fornecida como verdade documental.`;

    const factsPayload = {
      tipoPeca: pieceTitle,
      candidato: {
        nome: candidateName,
        cpf: candidateCpf,
        cargo: office,
        partido: party,
        uf: state,
        anoEleicao: year,
      },
      patrimonioDeclarado: {
        totalReais: totalAssetsCents ? totalAssetsCents / 100 : 0,
        variacaoPercentual: assetGrowthPct,
      },
      contabilidadeCampanha: {
        receitasTotaisReais: totalDonationsCents ? totalDonationsCents / 100 : 0,
        despesasTotaisReais: totalExpensesCents ? totalExpensesCents / 100 : 0,
        principaisDoadores: topDonors || [],
        principaisFornecedores: topSuppliers || [],
      },
      sinaisDeAlertaIdentificados: signals || [],
      emendasOrcamentarias: earmarks || [],
      tom: tone,
    };

    const userPrompt = `Redija a fundamentação jurídica contenciosa para a peça '${pieceTitle}' com base nesta auditoria oficial:\n\n${JSON.stringify(factsPayload, null, 2)}`;

    const geminiRes = await generateGeminiJson(systemPrompt, userPrompt);

    return NextResponse.json({
      success: true,
      model: geminiRes.model,
      draft: geminiRes.data,
    });
  } catch (err: any) {
    console.error("Erro na API /api/ai/legal-draft:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erro interno ao processar requisição com Gemini" },
      { status: 500 }
    );
  }
}
