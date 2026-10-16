import { Metadata } from "next";
import { getComparisonData } from "@/lib/queries";
import { PageHeader } from "@/components/shell/shell-context";
import { ExportProButton } from "@/components/ui/export-pro-button";
import { ComparatorView } from "@/components/comparador/comparator-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Comparador Frente a Frente · Eletto",
  description:
    "Análise comparativa e opposition research: doadores mútuos, fornecedores em comum, patrimônio declarado e riscos eleitorais.",
};

export default async function ComparadorPage({
  searchParams,
}: {
  searchParams: Promise<{ c1?: string; c2?: string }>;
}) {
  const sp = await searchParams;
  const c1Id = sp.c1 ? parseInt(sp.c1, 10) : null;
  const c2Id = sp.c2 ? parseInt(sp.c2, 10) : null;

  const validC1 = c1Id && !isNaN(c1Id) && c1Id > 0 ? c1Id : null;
  const validC2 = c2Id && !isNaN(c2Id) && c2Id > 0 ? c2Id : null;

  let comparisonData = null;
  if (validC1 && validC2) {
    try {
      comparisonData = await getComparisonData(validC1, validC2);
    } catch (err) {
      console.error("Erro ao carregar dados de comparação:", err);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        group="eletto"
        current="Comparador Frente a Frente"
        actions={
          <ExportProButton
            datasetName="Relatório de Opposition Research e Interseção de Campanhas"
            label="Exportar Dossiê Comparativo"
            sampleColumns={[
              "Candidato 1",
              "Candidato 2",
              "Doador / Fornecedor Mútuo",
              "CNPJ / CPF",
              "Valor Candidato 1",
              "Valor Candidato 2",
              "Total Combinado",
              "Hash SHA-256",
            ]}
          />
        }
      />

      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="tag-pill tag-pill--neutral text-[10px] uppercase font-mono tracking-wider">
            <span className="tag-pill__square bg-[#1D63FF]" />
            OPPOSITION RESEARCH · AUDITORIA ELEITORAL
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-[var(--fg-1)]">
              Comparador Frente a Frente
            </h1>
            <p className="mt-1 text-xs text-[var(--muted)] max-w-2xl leading-relaxed">
              Cruzamento pericial e detecção de sobreposição patrimonial, doadores mútuos e fornecedores compartilhados entre campanhas adversárias.
            </p>
          </div>
        </div>
      </section>

      <ComparatorView
        initialData={comparisonData}
        c1Id={validC1}
        c2Id={validC2}
      />
    </div>
  );
}
