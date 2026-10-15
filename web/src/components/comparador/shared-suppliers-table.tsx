"use client";

import Link from "next/link";
import { formatBRL, formatCpfCnpj, entityHref } from "@/lib/format";
import type { SharedSupplierRow } from "@/lib/queries";

interface SharedSuppliersTableProps {
  sharedSuppliers: SharedSupplierRow[];
  totalCents: number;
  c1Name: string;
  c2Name: string;
}

export function SharedSuppliersTable({
  sharedSuppliers,
  totalCents,
  c1Name,
  c2Name,
}: SharedSuppliersTableProps) {
  return (
    <div className="rounded-xl border border-[var(--border-2)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border-1)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-bold text-base text-[var(--fg-1)]">
              Interseção de Fornecedores (Empresas em Comum)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              {sharedSuppliers.length} em comum
            </span>
          </div>
          <p className="text-xs text-[var(--muted)] mt-1">
            Empresas, gráficas, consultorias e produtoras contratadas por ambos os candidatos
          </p>
        </div>

        {sharedSuppliers.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--card-tone)] border border-[var(--border-1)] self-start sm:self-auto">
            <span className="text-xs text-[var(--muted-2)]">Faturamento Total Cruzado:</span>
            <span className="font-mono font-bold text-xs text-amber-400">
              {formatBRL(totalCents)}
            </span>
          </div>
        )}
      </div>

      {sharedSuppliers.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-xl border border-dashed border-[var(--border-1)] bg-[var(--card-tone)]/50">
          <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border-1)] flex items-center justify-center mx-auto mb-3 text-[var(--muted-2)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h4 className="font-semibold text-sm text-[var(--fg-1)] mb-1">
            Nenhum fornecedor em comum identificado
          </h4>
          <p className="text-xs text-[var(--muted-2)] max-w-md mx-auto">
            As campanhas de {c1Name} e {c2Name} não registraram contratações dos mesmos CNPJs ou prestadores de serviços eleitorais.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-1)] text-[var(--muted-2)] uppercase font-mono tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">Fornecedor / Razão Social</th>
                <th className="py-3 px-3 font-semibold text-right text-blue-400">
                  Pago por {c1Name}
                </th>
                <th className="py-3 px-3 font-semibold text-right text-purple-400">
                  Pago por {c2Name}
                </th>
                <th className="py-3 px-3 font-semibold text-right text-amber-400">
                  Total Recebido
                </th>
                <th className="py-3 px-3 font-semibold text-center w-28">Divisão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-1)]">
              {sharedSuppliers.map((s, idx) => {
                const total = s.amount1Cents + s.amount2Cents;
                const pct1 = total > 0 ? Math.round((s.amount1Cents / total) * 100) : 50;
                const pct2 = 100 - pct1;
                const href = entityHref(s.supplierCpfCnpj);

                return (
                  <tr key={idx} className="hover:bg-[var(--card-tone)] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[var(--fg-1)]">
                        {href ? (
                          <Link href={href} className="hover:text-[var(--accent-2)] transition-colors">
                            {s.supplierName}
                          </Link>
                        ) : (
                          s.supplierName
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--muted-2)] mt-0.5">
                        {formatCpfCnpj(s.supplierCpfCnpj)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-mono font-medium text-[var(--fg-1)]">
                        {formatBRL(s.amount1Cents)}
                      </div>
                      <div className="text-[10px] text-[var(--muted-2)]">
                        {s.count1} despesa{s.count1 === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-mono font-medium text-[var(--fg-1)]">
                        {formatBRL(s.amount2Cents)}
                      </div>
                      <div className="text-[10px] text-[var(--muted-2)]">
                        {s.count2} despesa{s.count2 === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-mono font-bold text-amber-400">
                        {formatBRL(s.totalCents)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1 items-center">
                        <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden flex border border-[var(--border-1)]">
                          <div
                            style={{ width: `${pct1}%` }}
                            className="bg-blue-500 h-full"
                            title={`${c1Name}: ${pct1}%`}
                          />
                          <div
                            style={{ width: `${pct2}%` }}
                            className="bg-purple-500 h-full"
                            title={`${c2Name}: ${pct2}%`}
                          />
                        </div>
                        <div className="flex justify-between w-full text-[9px] font-mono text-[var(--muted-2)]">
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
