"use client";

import { formatBRL } from "@/lib/format";
import type { CandidateComparisonProfile } from "@/lib/queries";

interface ComparatorScoreboardProps {
  c1: CandidateComparisonProfile;
  c2: CandidateComparisonProfile;
}

export function ComparatorScoreboard({ c1, c2 }: ComparatorScoreboardProps) {
  const c1Name = c1.header.person.canonicalName?.split(" ")[0] || "Candidato 1";
  const c2Name = c2.header.person.canonicalName?.split(" ")[0] || "Candidato 2";

  const metrics = [
    {
      title: "Patrimônio Declarado (TSE)",
      desc: "Total de bens declarados na última candidatura",
      val1: c1.declaredAssetsTotalCents,
      val2: c2.declaredAssetsTotalCents,
      format: (v: number) => formatBRL(v),
      type: "currency" as const,
    },
    {
      title: "Total Arrecadado em Campanhas",
      desc: "Soma de todas as doações e receitas registradas",
      val1: c1.finance.donationsTotalCents,
      val2: c2.finance.donationsTotalCents,
      format: (v: number) => formatBRL(v),
      type: "currency" as const,
    },
    {
      title: "Total de Despesas Contratadas",
      desc: "Volume financeiro total pago a fornecedores",
      val1: c1.finance.expensesTotalCents,
      val2: c2.finance.expensesTotalCents,
      format: (v: number) => formatBRL(v),
      type: "currency" as const,
    },
    {
      title: "Fundo Eleitoral / Partidário",
      desc: "Recursos públicos recebidos de fundos oficiais",
      val1: c1.finance.electoralFundTotalCents,
      val2: c2.finance.electoralFundTotalCents,
      format: (v: number) => formatBRL(v),
      type: "currency" as const,
    },
    {
      title: "Sinais de Risco de Compliance",
      desc: "Alertas de doação circular, sócios ou inconsistências",
      val1: c1.signalsCount,
      val2: c2.signalsCount,
      format: (v: number) => `${v} sinal${v === 1 ? "" : "is"}`,
      type: "count" as const,
      isRisk: true,
    },
  ];

  return (
    <div className="relative border border-[var(--border-1)] bg-[var(--surface)]">
      {/* Header do Placar */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="tag-pill mb-2">
            <span className="tag-pill__square bg-[#1D63FF]" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider">
              Placar Frente a Frente · Dados Oficiais
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[var(--fg-1)] tracking-tight">
            Métricas Patrimoniais & Arrecadação Declarada (TSE)
          </h3>
        </div>

        {/* Legenda dos Candidatos */}
        <div className="flex items-center gap-3 text-xs font-mono border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 font-semibold text-[#1D63FF]">
            <span className="w-2 h-2 bg-[#1D63FF]" />
            {c1Name}
          </span>
          <span className="text-[var(--muted-2)]">vs</span>
          <span className="flex items-center gap-1.5 font-semibold text-[var(--fg-1)]">
            <span className="w-2 h-2 bg-[var(--muted)]" />
            {c2Name}
          </span>
        </div>
      </div>

      {/* Grid Contínuo de Métricas (Sem caixas aninhadas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-1)]">
        {metrics.map((m, idx) => {
          const total = m.val1 + m.val2;
          const pct1 = total > 0 ? Math.round((m.val1 / total) * 100) : 50;
          const pct2 = 100 - pct1;

          return (
            <div
              key={idx}
              className="p-5 sm:p-6 flex flex-col justify-between hover:bg-[var(--hover)]/30 transition-colors"
            >
              <div>
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-1)]">
                  {m.title}
                </div>
                <div className="text-[11.5px] text-[var(--muted)] mt-1 line-clamp-1 leading-snug">
                  {m.desc}
                </div>
              </div>

              <div className="my-5">
                {/* Valores Comparativos */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-mono text-[15px] font-bold text-[#1D63FF]">
                    {m.format(m.val1)}
                  </div>
                  <div className="font-mono text-[15px] font-bold text-right text-[var(--fg-1)]">
                    {m.format(m.val2)}
                  </div>
                </div>

                {/* Barra de Proporção Técnica (3px, sem cantos redondos, sem roxo) */}
                <div className="mt-2.5 h-[3px] w-full bg-[var(--hover)] flex overflow-hidden">
                  <div
                    style={{ width: `${pct1}%` }}
                    className="h-full bg-[#1D63FF] transition-all duration-300"
                    title={`${c1Name}: ${pct1}%`}
                  />
                  <div
                    style={{ width: `${pct2}%` }}
                    className="h-full bg-[var(--muted-2)] transition-all duration-300"
                    title={`${c2Name}: ${pct2}%`}
                  />
                </div>

                {/* Porcentagens Tabulares */}
                <div className="flex justify-between items-center text-[10.5px] font-mono text-[var(--muted-2)] mt-1.5">
                  <span>{pct1}%</span>
                  <span>{pct2}%</span>
                </div>
              </div>

              {/* Linha de Diferença Técnica */}
              <div className="pt-3 border-t border-[var(--border-1)] flex items-center justify-between text-[11.5px]">
                <span className="font-mono text-[10.5px] uppercase text-[var(--muted)]">Diferença</span>
                <span className="font-mono font-medium text-[var(--fg-1)]">
                  {m.type === "currency"
                    ? formatBRL(Math.abs(m.val1 - m.val2))
                    : `${Math.abs(m.val1 - m.val2)} ocorrência(s)`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
