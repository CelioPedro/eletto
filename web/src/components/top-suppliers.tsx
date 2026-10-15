"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TopSupplier } from "@/lib/queries";
import { formatBRL, formatCnpj } from "@/lib/format";
import { Skeleton } from "./skeleton";

export function TopSuppliers({ years, initialYear }: { years: number[]; initialYear?: number }) {
  // Default to the latest year: the all-time ranking takes several seconds.
  const [year, setYear] = useState<string>(
    initialYear ? String(initialYear) : years[0] ? String(years[0]) : "all"
  );
  const [suppliers, setSuppliers] = useState<TopSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/top-suppliers?year=${year}`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setSuppliers(data.suppliers ?? []);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [year]);

  const max = suppliers.length > 0 ? suppliers[0].totalCents : 1;

  return (
    <section className="card relative">
      <span className="card-dot card-dot--tl" />
      <span className="card-dot card-dot--tr" />
      <span className="card-dot card-dot--bl" />
      <span className="card-dot card-dot--br" />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tag-pill mb-2">
            <span className="tag-pill__square" />
            <span>Despesas com Fornecedores</span>
            <span className="opacity-40">·</span>
            <span className="text-[var(--accent-2)]">RANKING OFICIAL</span>
          </div>
          <h2 className="mt-2 text-[22px] font-medium tracking-tight text-[var(--fg-1)]">
            Empresas que mais faturaram com campanhas eleitorais
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="tag-pill text-[10px] py-1">
            Ano
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mono rounded-[2px] border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] text-[var(--fg-1)] outline-none focus:border-[var(--border-2)]"
          >
            <option value="all">todas as eleições</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border-b border-[var(--border-1)] py-3.5 last:border-0">
              <div className="flex items-baseline gap-3">
                <span className="w-6 flex-none font-mono text-[11px] text-[var(--muted-2)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Skeleton className="h-3.5 flex-1" />
                <Skeleton className="h-3.5 w-24 flex-none" />
              </div>
              <div className="mt-2 pl-9">
                <Skeleton className="h-[3px] w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="py-10 text-center font-mono text-[11px] text-[var(--muted-2)]">
          sem despesas contratadas para esse filtro.
        </div>
      ) : (
        <div className="flex flex-col">
          {suppliers.map((s, i) => (
            <div key={s.cnpj} className="border-b border-[var(--border-1)] py-3.5 last:border-0">
              <div className="flex items-baseline gap-3">
                <span className="w-6 flex-none font-mono text-[11px] text-[var(--muted-2)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/cnpj/${s.cnpj}`}
                  className="min-w-0 flex-1 truncate text-[14px] hover:text-elo-amber hover:underline"
                >
                  {s.name}
                </Link>
                <span className="flex-none font-mono text-[13px] text-elo-amber">
                  {formatBRL(s.totalCents)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 pl-9">
                <div className="h-[3px] flex-1 bg-[var(--hover)]">
                  <div
                    className="h-[3px] bg-elo-amber"
                    style={{ width: `${Math.max(2, (s.totalCents / max) * 100)}%` }}
                  />
                </div>
                <span className="flex-none font-mono text-[9.5px] text-[var(--muted-2)]">
                  {formatCnpj(s.cnpj)} · {s.paymentCount.toLocaleString("pt-BR")} pagamentos ·{" "}
                  {s.candidacyCount.toLocaleString("pt-BR")} candidaturas
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
