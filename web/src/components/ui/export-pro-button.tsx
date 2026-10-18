"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { ProUpgradeModal } from "./pro-upgrade-modal";

export type ExportProButtonProps = {
  label?: string;
  datasetName?: string;
  sampleColumns?: string[];
  className?: string;
  size?: "sm" | "default";
};

export function ExportProButton({
  label = "Exportar Planilha",
  datasetName = "Dados Eleitorais e Financeiros",
  sampleColumns = ["Nome", "CPF/CNPJ", "Valor (R$)", "Ano", "Partido", "Hash de Autenticidade"],
  className = "",
}: ExportProButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] text-[var(--fg-1)] hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-all cursor-pointer font-sans text-xs font-medium shadow-xs ${className}`}
        title="Exportar dados completos em planilha Excel ou CSV"
      >
        <Download className="size-3.5 text-[var(--muted-2)] shrink-0" />
        <span>{label}</span>
        <span className="rounded-[3px] bg-[var(--accent)]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#1D63FF] dark:text-[#8BB4FF] leading-none shrink-0">
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
