import { Metadata } from "next";
import { Suspense } from "react";
import { GraphCanvas } from "@/components/graph-canvas";
import { PageHeader } from "@/components/shell/shell-context";
import { ExportProButton } from "@/components/ui/export-pro-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Grafo de Correlações e Redes Societárias · Eletto",
  description:
    "Investigação pericial de vínculos em grafo: rastreamento de doações de campanha, quadro de sócios (QSA) e detecção de triangulações financeiras.",
};

export default function GrafoPage() {
  return (
    <main className="flex h-full flex-col">
      <PageHeader
        group="eletto"
        current="Grafo de Correlações & Vínculos"
        actions={
          <ExportProButton
            datasetName="Matriz de Adjacência e Grafo Relacional Forense"
            label="Exportar Rede PRO"
            sampleColumns={[
              "Origem (CPF/CNPJ)",
              "Destino (CPF/CNPJ)",
              "Tipo de Vínculo",
              "Valor (R$)",
              "Ciclo / Ano",
              "Triangulação Circular",
              "Hash SHA-256",
            ]}
          />
        }
      />
      {/* useSearchParams in GraphCanvas requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <GraphCanvas />
      </Suspense>
    </main>
  );
}
