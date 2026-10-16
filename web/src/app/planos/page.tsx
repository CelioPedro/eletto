import { PageHeader } from "@/components/shell/shell-context";
import { PricingTable } from "@/components/planos/pricing-table";

export const metadata = {
  title: "Planos & Preços | eletto - Inteligência e Perícia Eleitoral",
  description:
    "Assine o Eletto Pro para dossiês periciais em PDF ilimitados, análise de doações circulares em grafo profundo e cruzamentos com emendas parlamentares.",
};

export default function PlanosPage() {
  return (
    <div className="flex flex-col gap-10 py-4 max-w-6xl mx-auto">
      <PageHeader group="eletto" current="Planos & Preços" />

      {/* Hero Header */}
      <section className="text-center relative pt-4 pb-2">
        <div className="tag-pill mb-4">
          <span className="tag-pill__square" />
          <span>Monetização & Inteligência Forense</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--fg-1)] max-w-3xl mx-auto leading-tight">
          Inteligência pericial para auditorias e litígios eleitorais
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--muted)] max-w-2xl mx-auto">
          De pesquisas públicas pontuais a dossiês periciais completos autenticados com hash SHA-256 para subsidiar ações judiciais, defesas e auditorias de conformidade.
        </p>
      </section>

      {/* Interactive Pricing and Comparison Component */}
      <section>
        <PricingTable />
      </section>
    </div>
  );
}
