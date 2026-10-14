"use client";

import { useState } from "react";
import Link from "next/link";

export function DossieActions({ personId, candidateName }: { personId: number; candidateName: string }) {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    window.print();
  }

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="print:hidden sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-[var(--border-1)] bg-[var(--surface)]/95 backdrop-blur-md px-6 py-3.5 shadow-md">
      <div className="flex items-center gap-3">
        <Link
          href={`/politico/${personId}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] font-medium text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors"
        >
          ← Voltar ao perfil
        </Link>
        <span className="hidden sm:inline-block h-4 w-[1px] bg-[var(--border-1)]" />
        <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--muted-2)]">
          Dossiê Pericial: <strong className="text-[var(--fg-1)] font-semibold">{candidateName}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] font-medium text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
          title="Copiar link permanente deste dossiê"
        >
          {copied ? "✓ Link copiado" : "Copiar link"}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 text-[12px] font-semibold tracking-wide uppercase transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Salvar em PDF / Imprimir
        </button>
      </div>
    </div>
  );
}
