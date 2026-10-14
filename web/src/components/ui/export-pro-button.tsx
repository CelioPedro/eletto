"use client";

import { useState } from "react";
import { ProUpgradeModal } from "./pro-upgrade-modal";

export type ExportProButtonProps = {
  label?: string;
  datasetName?: string;
  sampleColumns?: string[];
  className?: string;
  size?: "sm" | "default";
};

export function ExportProButton({
  label = "Exportar CSV / Excel",
  datasetName = "Dados Eleitorais e Financeiros",
  sampleColumns = ["Nome", "CPF/CNPJ", "Valor (R$)", "Ano", "Partido", "Hash de Autenticidade"],
  className = "",
  size = "default",
}: ExportProButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] text-[var(--fg-1)] hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-all cursor-pointer font-sans ${
          size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        } ${className}`}
        title="Exportar dados completos em planilha Excel ou CSV"
      >
        <svg
          className="size-3.5 text-[var(--muted-2)] group-hover:text-[var(--accent-2)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="font-medium">{label}</span>
        <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.2 font-mono text-[9px] font-bold text-[var(--accent-2)]">
          PRO
        </span>
      </button>

      <ProUpgradeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        featureTitle={`Exportação Completa de ${datasetName}`}
        featureDescription="Baixe relatórios brutos enriquecidos com todas as colunas primárias em planilhas estruturadas para auditoria, petições judiciais e cruzamentos no PowerBI / Python."
        samplePreview={`Colunas inclusas: ${sampleColumns.join(", ")} + metadados de fé pública e carimbo temporal.`}
        benefits={[
          "Exportação sem limite de registros em formatos CSV, XLSX e JSON",
          "Cruzamento com situação cadastral da Receita Federal e TSE",
          "Hash de integridade criptográfica SHA-256 anexado aos arquivos",
          "Acesso via API REST e GraphQL no plano Enterprise",
        ]}
      />
    </>
  );
}
