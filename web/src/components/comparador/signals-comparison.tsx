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
        <div className="py-8 px-4 text-center rounded-xl border border-dashed border-[var(--border-1)] bg-[var(--card-tone)]/40 text-xs text-[var(--muted-2)]">
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
              className="p-3.5 rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)] hover:border-[var(--border-2)] transition-colors flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
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
    <div className="rounded-xl border border-[var(--border-2)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-1)]">
        <div>
          <h3 className="font-bold text-base text-[var(--fg-1)] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Sinais de Risco & Alertas de Conformidade
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Compara anomalias detectadas (doações circulares, empresas novas, fornecedores com sócios)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-bold text-xs text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Alertas de {c1Name}
            </span>
            <span className="text-xs font-mono text-[var(--muted-2)]">
              {c1.signalsCount} alerta{c1.signalsCount === 1 ? "" : "s"}
            </span>
          </div>
          {renderSignalList(c1, "blue")}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-bold text-xs text-purple-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Alertas de {c2Name}
            </span>
            <span className="text-xs font-mono text-[var(--muted-2)]">
              {c2.signalsCount} alerta{c2.signalsCount === 1 ? "" : "s"}
            </span>
          </div>
          {renderSignalList(c2, "purple")}
        </div>
      </div>
    </div>
  );
}
