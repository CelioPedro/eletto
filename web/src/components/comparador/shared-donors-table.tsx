"use client";

import Link from "next/link";
import { formatBRL, formatCpfCnpj, entityHref } from "@/lib/format";
import type { SharedDonorRow } from "@/lib/queries";

interface SharedDonorsTableProps {
  sharedDonors: SharedDonorRow[];
  totalCents: number;
  c1Name: string;
  c2Name: string;
}

export function SharedDonorsTable({
  sharedDonors,
  totalCents,
  c1Name,
  c2Name,
}: SharedDonorsTableProps) {
  return (
    <div className="relative border border-[var(--border-1)] bg-[var(--surface)]">
      <span className="card-dot card-dot--tl" />
      <span className="card-dot card-dot--tr" />
      <span className="card-dot card-dot--bl" />
      <span className="card-dot card-dot--br" />

      {/* Header da Tabela */}
      <div className="p-5 sm:p-6 border-b border-[var(--border-1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="tag-pill mb-2">
            <span className="tag-pill__square bg-[#1D63FF]" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider">
              Financiamento Mútuo · TSE
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[var(--fg-1)] tracking-tight">
            Interseção de Doadores (Financiadores em Comum)
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1">
            Pessoas físicas e jurídicas que aportaram recursos simultaneamente em ambas as campanhas.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-2.5 py-1 font-mono text-xs font-semibold bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)]">
            {sharedDonors.length} {sharedDonors.length === 1 ? "doador comum" : "doadores em comum"}
          </span>
          {sharedDonors.length > 0 && (
            <div className="px-3 py-1 font-mono text-xs font-bold bg-[#1D63FF]/10 border border-[#1D63FF]/30 text-[#1D63FF]">
              {formatBRL(totalCents)}
            </div>
          )}
        </div>
      </div>

      {sharedDonors.length === 0 ? (
        <div className="py-14 px-4 text-center">
          <h4 className="font-medium text-sm text-[var(--fg-1)] mb-1">
            Nenhum doador em comum identificado
          </h4>
          <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
            Não constam doadores (pessoas físicas ou jurídicas) com repasses simultâneos para as campanhas de {c1Name} e {c2Name} na base oficial do TSE.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-1)] text-[var(--muted-2)] uppercase font-mono tracking-wider text-[10px] bg-[var(--hover)]/20">
                <th className="py-3 px-4 font-semibold">Doador / Financiador</th>
                <th className="py-3 px-4 font-semibold text-right text-[#1D63FF]">
                  Doado a {c1Name}
                </th>
                <th className="py-3 px-4 font-semibold text-right text-[var(--fg-1)]">
                  Doado a {c2Name}
                </th>
                <th className="py-3 px-4 font-semibold text-right text-[var(--fg-1)]">
                  Total Combinado
                </th>
                <th className="py-3 px-4 font-semibold text-center w-32">Divisão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-1)]">
              {sharedDonors.map((d, idx) => {
                const total = d.amount1Cents + d.amount2Cents;
                const pct1 = total > 0 ? Math.round((d.amount1Cents / total) * 100) : 50;
                const pct2 = 100 - pct1;
                const href = entityHref(d.donorCpfCnpj);

                return (
                  <tr key={idx} className="hover:bg-[var(--hover)]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[var(--fg-1)]">
                        {href ? (
                          <Link href={href} className="hover:text-[#1D63FF] transition-colors">
                            {d.donorName}
                          </Link>
                        ) : (
                          d.donorName
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--muted-2)] mt-0.5">
                        {formatCpfCnpj(d.donorCpfCnpj)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[#1D63FF]">
                        {formatBRL(d.amount1Cents)}
                      </div>
                      <div className="text-[10.5px] font-mono text-[var(--muted-2)]">
                        {d.count1} {d.count1 === 1 ? "doação" : "doações"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[var(--fg-1)]">
                        {formatBRL(d.amount2Cents)}
                      </div>
                      <div className="text-[10.5px] font-mono text-[var(--muted-2)]">
                        {d.count2} {d.count2 === 1 ? "doação" : "doações"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[var(--fg-1)]">
                        {formatBRL(d.totalCents)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-center">
                        <div className="h-[3px] w-full bg-[var(--hover)] overflow-hidden flex">
                          <div
                            style={{ width: `${pct1}%` }}
                            className="bg-[#1D63FF] h-full"
                            title={`${c1Name}: ${pct1}%`}
                          />
                          <div
                            style={{ width: `${pct2}%` }}
                            className="bg-[var(--muted-2)] h-full"
                            title={`${c2Name}: ${pct2}%`}
                          />
                        </div>
                        <div className="flex justify-between w-full text-[9.5px] font-mono text-[var(--muted-2)]">
                          <span>{pct1}%</span>
                          <span>{pct2}%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
