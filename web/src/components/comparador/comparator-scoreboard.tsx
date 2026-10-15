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
    <div className="rounded-xl border border-[var(--border-2)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-1)]">
        <div>
          <h3 className="font-bold text-base text-[var(--fg-1)] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            Placar Geral Frente a Frente
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Métricas financeiras e patrimoniais oficiais consolidadas via TSE
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {c1Name}
          </span>
          <span className="text-[var(--muted-2)]">vs</span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            {c2Name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const total = m.val1 + m.val2;
          const pct1 = total > 0 ? Math.round((m.val1 / total) * 100) : 50;
          const pct2 = 100 - pct1;
          const c1IsHigher = m.val1 > m.val2;
          const c2IsHigher = m.val2 > m.val1;

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)] flex flex-col justify-between hover:border-[var(--border-2)] transition-colors"
            >
              <div>
                <div className="font-semibold text-xs text-[var(--fg-1)] tracking-tight">
                  {m.title}
                </div>
                <div className="text-[11px] text-[var(--muted-2)] mt-0.5 line-clamp-1">
                  {m.desc}
                </div>
              </div>

              <div className="my-4">
                <div className="flex items-baseline justify-between gap-2">
                  <div className={`font-mono text-sm font-bold ${c1IsHigher ? (m.isRisk ? "text-amber-400" : "text-blue-400") : "text-[var(--fg-1)]"}`}>
                    {m.format(m.val1)}
                  </div>
                  <div className={`font-mono text-sm font-bold text-right ${c2IsHigher ? (m.isRisk ? "text-amber-400" : "text-purple-400") : "text-[var(--fg-1)]"}`}>
                    {m.format(m.val2)}
                  </div>
                </div>

                {/* Barra de Proporção Visual */}
                <div className="mt-2.5 h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${pct1}%` }}
                    className={`h-full transition-all duration-500 ${m.isRisk ? "bg-amber-500" : "bg-blue-500"}`}
                    title={`${c1Name}: ${pct1}%`}
                  />
                  <div
                    style={{ width: `${pct2}%` }}
                    className={`h-full transition-all duration-500 ${m.isRisk ? "bg-rose-500" : "bg-purple-500"}`}
                    title={`${c2Name}: ${pct2}%`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--muted-2)] mt-1">
                  <span>{pct1}%</span>
                  <span>{pct2}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-1)] flex items-center justify-between text-[11px]">
                <span className="text-[var(--muted)]">Diferença</span>
                <span className="font-mono font-medium text-[var(--fg-2)]">
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
