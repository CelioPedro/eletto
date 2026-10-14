"use client";

import { useState } from "react";

type RiskLevel = "BAIXO" | "MODERADO" | "ELEVADO" | "CRÍTICO";

export type DossierAiSummaryProps = {
  personId: number;
  candidateName: string;
  office: string | null;
  party: string | null;
  state: string | null;
  totalAssetsCents: number;
  assetGrowthPct: number | null;
  totalDonationsCents: number;
  totalExpensesCents: number;
  signalsCount: number;
  signals: Array<{ rule: string; explanation: string | null; severity?: string }>;
  topSuppliers: Array<{ counterpartyName: string | null; counterpartyDoc: string | null; amountCents: number }>;
  earmarksCount: number;
  totalEarmarksCents: number;
};

type AiAnalysis = {
  riskLevel: RiskLevel;
  forensicScore: number;
  executiveSummary: string;
  keyFindings: string[];
  recommendedSteps: string[];
};

export function DossierAiSummary(props: DossierAiSummaryProps) {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/dossier-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      const data = await res.json();
      if (!data.success || !data.analysis) {
        throw new Error(data.error || "Falha ao gerar parecer pericial");
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Erro na conexão com o Gemini");
    } finally {
      setLoading(false);
    }
  }

  const riskBadgeStyles: Record<RiskLevel, string> = {
    BAIXO: "bg-emerald-100 text-emerald-800 border-emerald-300",
    MODERADO: "bg-blue-100 text-blue-800 border-blue-300",
    ELEVADO: "bg-amber-100 text-amber-800 border-amber-300",
    CRÍTICO: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse",
  };

  return (
    <section className="mb-8 break-inside-avoid">
      <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 mb-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded bg-slate-900 text-[10px] text-white">✦</span>
          Parecer Pericial de Risco & Sumário Executivo (IA Gemini)
        </h2>

        {!analysis && !loading ? (
          <button
            type="button"
            onClick={handleGenerate}
            className="print:hidden inline-flex items-center gap-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 font-sans text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <span className="text-yellow-300">✦</span>
            <span>Gerar Parecer com Gemini</span>
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-6 text-center">
          <div className="inline-block animate-spin text-2xl text-blue-600 mb-2">◌</div>
          <div className="font-semibold text-xs text-blue-900">
            Auditando dados patrimoniais, triangulações e fornecedores com o Google Gemini...
          </div>
          <div className="text-[11px] text-blue-700 mt-1 font-mono">
            Processando métricas oficiais em tempo real
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span>Erro ao emitir parecer: {error}</span>
          <button
            type="button"
            onClick={handleGenerate}
            className="font-bold underline text-rose-900 ml-3 cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!analysis && !loading && !error ? (
        <div className="print:hidden rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center">
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Clique no botão acima para submeter todo o histórico patrimonial, despesas e sinais deste candidato à
            avaliação pericial em tempo real do <strong>Google Gemini</strong>. O laudo gerado será incorporado diretamente neste dossiê.
          </p>
        </div>
      ) : null}

      {analysis ? (
        <div className="rounded-lg border border-slate-300 bg-slate-50/70 p-5 space-y-4">
          {/* Header with Risk Level and Forensic Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] uppercase font-bold text-slate-600">Classificação de Risco:</span>
              <span className={`rounded px-2.5 py-0.5 font-mono text-xs font-extrabold uppercase border ${riskBadgeStyles[analysis.riskLevel]}`}>
                {analysis.riskLevel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block font-mono text-[9px] uppercase text-slate-500">Score de Anomalia</span>
                <span className="font-mono text-base font-extrabold text-slate-900">
                  {analysis.forensicScore} <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="print:hidden text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline ml-2 cursor-pointer"
                title="Regerar análise atualizada com a IA"
              >
                Regerar
              </button>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="text-justify text-xs leading-relaxed text-slate-800 whitespace-pre-line">
            {analysis.executiveSummary}
          </div>

          {/* Grid of Key Findings & Recommended Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Key Findings */}
            <div className="rounded border border-amber-200 bg-amber-50/60 p-3.5 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-2">
                ⚠ Vulnerabilidades & Fatos Críticos
              </span>
              <ul className="space-y-1.5 text-amber-950 text-[11.5px] leading-snug">
                {analysis.keyFindings.map((item, idx) => (
                  <li key={idx} className="flex gap-1.5">
                    <span className="text-amber-700 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Diligences */}
            <div className="rounded border border-blue-200 bg-blue-50/60 p-3.5 text-xs">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-2">
                🔍 Diligências Periciais Recomendadas
              </span>
              <ul className="space-y-1.5 text-blue-950 text-[11.5px] leading-snug">
                {analysis.recommendedSteps.map((item, idx) => (
                  <li key={idx} className="flex gap-1.5">
                    <span className="text-blue-600 font-bold shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-1 flex items-center justify-between">
            <span>Metodologia analítica: Triagem automatizada com Google Gemini Pro/Flash sobre bases abertas TSE</span>
            <span className="text-emerald-600 font-semibold">✓ Parecer anexado ao relatório</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
