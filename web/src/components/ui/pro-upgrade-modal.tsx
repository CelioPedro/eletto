"use client";

import Link from "next/link";

export type ProUpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription: string;
  benefits?: string[];
  samplePreview?: string;
};

export function ProUpgradeModal({
  open,
  onClose,
  featureTitle,
  featureDescription,
  benefits = [
    "Dossiês Periciais ilimitados com chancela SHA-256 e ata de custódia",
    "Expansão profunda de grafos de relacionamento em até 5 saltos",
    "Exportação massiva em lote nos formatos CSV, Excel e JSON",
  ],
  samplePreview,
}: ProUpgradeModalProps) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal max-w-lg p-0 overflow-hidden border-2 border-[var(--accent)]/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow & Accent Ribbon */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded bg-white text-blue-600 font-bold text-xs shadow-xs">
                ★
              </span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Recurso Exclusivo Eletto Pro
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <h3 className="mt-3 font-sans text-xl font-bold tracking-tight text-white">
            {featureTitle}
          </h3>
          <p className="mt-1 text-xs text-blue-100 leading-relaxed max-w-md">
            {featureDescription}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-[var(--card-tone)]">
          {samplePreview ? (
            <div className="mb-4 rounded-lg border border-[var(--border-2)] bg-[var(--surface)] p-3 font-mono text-[11px] text-[var(--muted)]">
              <div className="text-[10px] uppercase font-bold text-[var(--muted-2)] mb-1">
                Visualização Prévia:
              </div>
              <div className="text-[var(--fg-1)]">{samplePreview}</div>
            </div>
          ) : null}

          <div className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[var(--muted-2)] mb-2.5">
            O que o Plano Pro entrega:
          </div>

          <ul className="space-y-2 text-xs text-[var(--fg-1)]">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <svg
                  className="size-4 shrink-0 text-emerald-500 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Pricing Highlight Pill */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--accent)]/30 bg-[var(--surface)] p-3.5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)]">
                Assinatura Profissional
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-sans text-lg font-extrabold text-[var(--fg-1)]">
                  R$ 390
                </span>
                <span className="font-mono text-[11px] text-[var(--muted-2)]">
                  /mês no plano anual
                </span>
              </div>
            </div>

            <span className="rounded bg-emerald-500/15 px-2 py-1 font-mono text-[10px] font-bold text-emerald-500">
              Economize 20%
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/planos"
              onClick={onClose}
              className="btn btn--primary flex w-full flex-1 items-center justify-center py-2.5 text-xs font-bold shadow-md shadow-blue-500/20"
              style={{ textDecoration: "none" }}
            >
              Conhecer Planos e Assinar
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="btn w-full sm:w-auto py-2.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--fg-1)]"
            >
              Talvez mais tarde
            </button>
          </div>

          <p className="mt-3 text-center font-mono text-[10px] text-[var(--muted-2)]">
            Sem fidelidade no plano mensal. Emissão de NF contra CNPJ ou CPF.
          </p>
        </div>
      </div>
    </div>
  );
}
