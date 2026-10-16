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
              Contratações Cruzadas · TSE
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-[var(--fg-1)] tracking-tight">
            Interseção de Fornecedores (Empresas em Comum)
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1">
            Empresas, gráficas, produtoras e consultorias contratadas simultaneamente por ambos os candidatos.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="px-2.5 py-1 font-mono text-xs font-semibold bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)]">
            {sharedSuppliers.length} em comum
          </span>
          {sharedSuppliers.length > 0 && (
            <div className="px-3 py-1 font-mono text-xs font-bold bg-[#1D63FF]/10 border border-[#1D63FF]/30 text-[#1D63FF]">
              {formatBRL(totalCents)}
            </div>
          )}
        </div>
      </div>

      {sharedSuppliers.length === 0 ? (
        <div className="py-14 px-4 text-center">
          <h4 className="font-medium text-sm text-[var(--fg-1)] mb-1">
            Nenhum fornecedor em comum identificado
          </h4>
          <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
            As campanhas de {c1Name} e {c2Name} não registraram contratações dos mesmos CNPJs ou prestadores na base oficial do TSE.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-1)] text-[var(--muted-2)] uppercase font-mono tracking-wider text-[10px] bg-[var(--hover)]/20">
                <th className="py-3 px-4 font-semibold">Fornecedor / Razão Social</th>
                <th className="py-3 px-4 font-semibold text-right text-[#1D63FF]">
                  Pago por {c1Name}
                </th>
                <th className="py-3 px-4 font-semibold text-right text-[var(--fg-1)]">
                  Pago por {c2Name}
                </th>
                <th className="py-3 px-4 font-semibold text-right text-[var(--fg-1)]">
                  Total Recebido
                </th>
                <th className="py-3 px-4 font-semibold text-center w-32">Divisão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-1)]">
              {sharedSuppliers.map((s, idx) => {
                const total = s.amount1Cents + s.amount2Cents;
                const pct1 = total > 0 ? Math.round((s.amount1Cents / total) * 100) : 50;
                const pct2 = 100 - pct1;
                const href = entityHref(s.supplierCpfCnpj);

                return (
                  <tr key={idx} className="hover:bg-[var(--hover)]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[var(--fg-1)]">
                        {href ? (
                          <Link href={href} className="hover:text-[#1D63FF] transition-colors">
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[#1D63FF]">
                        {formatBRL(s.amount1Cents)}
                      </div>
                      <div className="text-[10.5px] font-mono text-[var(--muted-2)]">
                        {s.count1} {s.count1 === 1 ? "despesa" : "despesas"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[var(--fg-1)]">
                        {formatBRL(s.amount2Cents)}
                      </div>
                      <div className="text-[10.5px] font-mono text-[var(--muted-2)]">
                        {s.count2} {s.count2 === 1 ? "despesa" : "despesas"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-[var(--fg-1)]">
                        {formatBRL(s.totalCents)}
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
