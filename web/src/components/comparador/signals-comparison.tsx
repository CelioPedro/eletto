"use client";

import Link from "next/link";
import { formatBRL } from "@/lib/format";
import type { CandidateComparisonProfile } from "@/lib/queries";

interface SignalsComparisonProps {
  c1: CandidateComparisonProfile;
  c2: CandidateComparisonProfile;
}

export function SignalsComparison({ c1, c2 }: SignalsComparisonProps) {
  const c1Name = c1.header.person.canonicalName?.split(" ")[0] || "Candidato 1";
  const c2Name = c2.header.person.canonicalName?.split(" ")[0] || "Candidato 2";

  const renderSignalList = (candidate: CandidateComparisonProfile, colorClass: string) => {
    if (candidate.signals.length === 0) {
      return (
        <div className="py-8 px-4 text-center rounded-[0px] border border-dashed border-[var(--border-1)] bg-[var(--card-tone)]/40 text-xs text-[var(--muted-2)] font-mono">
          Nenhum sinal de risco detectado pelo motor de conformidade.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2.5">
        {candidate.signals.map((sig) => {
          const isHigh = sig.severity === "high";
          const amountCents = sig.expense?.amountCents ?? sig.cycleAmountCents;
          return (
            <div
              key={sig.id}
              className="p-3.5 rounded-[0px] border border-[var(--border-1)] bg-[var(--card-tone)] hover:border-[var(--border-2)] transition-colors flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-[0px] text-[10px] font-mono font-bold uppercase ${
                  isHigh ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}>
                  {sig.type.replace(/_/g, " ")}
                </span>
                {amountCents != null && (
                  <span className="font-mono text-xs font-semibold text-[var(--fg-1)]">
                    {formatBRL(amountCents)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] line-clamp-2">
                {sig.explanation}
              </p>
              {sig.rule && (
                <div className="text-[10px] font-mono text-[var(--muted-2)] flex items-center justify-between mt-1 pt-1.5 border-t border-[var(--border-1)]">
                  <span>Regra: {sig.rule}</span>
                  <Link
                    href={`/pessoa/${candidate.header.person.id}#sinais`}
                    className="text-[var(--accent-2)] hover:underline"
                  >
                    Ver detalhe →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative border border-[var(--border-1)] bg-[var(--surface)]">
      <span className="card-dot card-dot--tl" />
      <span className="card-dot card-dot--tr" />
      <span className="card-dot card-dot--bl" />
      <span className="card-dot card-dot--br" />

      {/* Header da Seção */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="tag-pill mb-2">
            <span className="tag-pill__square bg-[#1D63FF]" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider">
              Auditoria de Conformidade · Alertas IA
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[var(--fg-1)] tracking-tight">
            Sinais de Risco & Anomalias Forenses
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1">
            Mapeamento cruzado de doações circulares, empresas recém-abertas e fornecedores com vínculos societários.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-1)]">
        {/* Coluna Cand 1 */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-xs text-[#1D63FF] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 bg-[#1D63FF]" />
              ALERTAS: {c1Name.toUpperCase()}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)] font-semibold">
              {c1.signalsCount} {c1.signalsCount === 1 ? "sinal" : "sinais"}
            </span>
          </div>
          {renderSignalList(c1, "blue")}
        </div>

        {/* Coluna Cand 2 */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-xs text-[var(--fg-1)] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 bg-[var(--muted)]" />
              ALERTAS: {c2Name.toUpperCase()}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)] font-semibold">
              {c2.signalsCount} {c2.signalsCount === 1 ? "sinal" : "sinais"}
            </span>
          </div>
          {renderSignalList(c2, "slate")}
        </div>
      </div>
    </div>
  );
}
