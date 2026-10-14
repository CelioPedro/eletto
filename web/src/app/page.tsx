import { SearchBox } from "@/components/search-box";
import { TopSuppliers } from "@/components/top-suppliers";
import { PageHeader } from "@/components/shell/shell-context";
import { YearSelect } from "@/components/ui/year-select";
import { getHomeStats } from "@/lib/stats";
import { getExpenseYears } from "@/lib/queries";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const anoParam = typeof sp.ano === "string" ? Number(sp.ano) : NaN;
  const expenseYears = await getExpenseYears();
  const year = Number.isInteger(anoParam) && expenseYears.includes(anoParam) ? anoParam : undefined;

  const stats = await getHomeStats(year);

  const heroStats = [
    { label: "pessoas", value: stats.people.toLocaleString("pt-BR") },
    { label: "candidaturas", value: stats.candidacies.toLocaleString("pt-BR") },
    { label: "doações recebidas", value: formatBRL(stats.donationsTotalCents), tone: "green" as const },
    { label: "despesas contratadas", value: formatBRL(stats.expensesTotalCents) },
    { label: year ? "eleição" : "período coberto", value: stats.years },
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        group="eletto"
        current="Início"
        actions={<YearSelect basePath="/" years={expenseYears} value={year} allLabel="todos os anos" />}
      />

      <div
        className="animate-in relative overflow-hidden rounded-[var(--r-page)] border border-[var(--border-1)] bg-[var(--surface)]/40 px-6 py-16 sm:px-12 sm:py-20 backdrop-blur-md"
      >
        <span className="card-dot card-dot--tl" />
        <span className="card-dot card-dot--tr" />
        <span className="card-dot card-dot--bl" />
        <span className="card-dot card-dot--br" />
        <div className="hero-glow" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(187,186,251,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(187,186,251,.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(900px 420px at 22% 30%, #000, transparent 75%)",
          }}
        />
        <div className="relative max-w-2xl">
          <div className="mb-5 flex items-center">
            <div className="pill-tech">
              <span className="pill-dot pill-dot--purple" />
              <span>INTELIGÊNCIA & AUDITORIA ELEITORAL</span>
              <span className="opacity-40">·</span>
              <span className="text-[var(--accent)] font-semibold">DADOS OFICIAIS</span>
            </div>
          </div>
          <h1 className="text-[clamp(32px,5.5vw,52px)] leading-[1.02] font-bold tracking-[-0.035em] text-balance text-[var(--fg-1)]">
            Audite relações, doações e patrimônio de{" "}
            <span className="text-[var(--accent)]">qualquer político</span> brasileiro
            <span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
            Busca unificada por nome, CPF ou CNPJ. Conexões em rede, doações circulares, fornecedores
            e evolução patrimonial de 12 anos cruzados a partir de fontes oficiais.
          </p>
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </div>

      <section className="animate-in flex flex-col gap-4" style={{ animationDelay: "80ms" }}>
        <div className="kpis">
          {heroStats.map((s) => (
            <div key={s.label} className="kpi">
              <div className="kpi__label">{s.label}</div>
              <div className={`kpi__value${s.tone === "green" ? " kpi__value--green" : ""}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="animate-in" style={{ animationDelay: "150ms" }}>
        <TopSuppliers years={expenseYears} initialYear={year} />
      </div>

      <div className="card animate-in max-w-2xl relative" style={{ animationDelay: "220ms" }}>
        <span className="card-dot card-dot--tl" />
        <span className="card-dot card-dot--tr" />
        <span className="card-dot card-dot--bl" />
        <span className="card-dot card-dot--br" />
        <div className="label mb-3 flex items-center gap-2">
          <span className="pill-dot pill-dot--purple" />
          <span className="text-[var(--fg-1)] font-semibold font-mono tracking-wide">eletto · proveniência auditável</span>
        </div>
        <p className="text-[13.5px] leading-relaxed text-[var(--muted)]">
          O eletto consolida dados que já são públicos por lei (registro de candidatura do TSE,
          prestações de contas eleitorais, quadro societário da Receita Federal e sanções da CGU)
          e os organiza por agente político. Todo dado preserva a fonte oficial e o hash criptográfico
          de origem, servindo como suporte técnico e pericial para investigações aprofundadas.
        </p>
      </div>
    </div>
  );
}
