"use client";

import { useState } from "react";
import Link from "next/link";
import { ProUpgradeModal } from "@/components/ui/pro-upgrade-modal";

export function DossieActions({ personId, candidateName }: { personId: number; candidateName: string }) {
  const [copied, setCopied] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);

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
    <>
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
          <Link
            href={`/politico/${personId}/peca-juridica`}
            className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 text-[12px] font-semibold transition-all shadow-xs"
            title="Redigir Minuta de Notícia-Crime ou Representação com IA com base neste dossiê"
          >
            <span>⚖ Gerar Peça Jurídica</span>
          </Link>

          <button
            type="button"
            onClick={() => setProModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-[var(--border-2)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] font-medium text-[var(--fg-1)] hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
            title="Inserir logotipo de sua banca e dados periciais oficiais"
          >
            <span>Personalizar Timbre</span>
            <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[var(--accent-2)]">
              PRO
            </span>
          </button>

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

      <ProUpgradeModal
        open={proModalOpen}
        onClose={() => setProModalOpen(false)}
        featureTitle="Personalização de Timbre & Dados Periciais"
        featureDescription="Substitua o cabeçalho padrão pela identidade visual de sua banca de advocacia, partido ou instituto de auditoria, incluindo número de OAB, assinatura pericial e carimbo personalizado."
        samplePreview="[Sua Logomarca] · Auditoria Eleitoral Independente · Perito Responsável: Dr(a). [Seu Nome] · OAB/UF [Número]"
        benefits={[
          "Exportação de dossiês com a marca d'água e timbre do seu escritório",
          "Remoção de referências institucionais genéricas mantendo a fé pública da prova",
          "Assinatura digital e dados do responsável técnico pelo parecer",
          "Dossiês ilimitados com chancela SHA-256 e ata de custódia",
        ]}
      />
    </>
  );
}
