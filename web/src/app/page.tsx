import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { TopSuppliers } from "@/components/top-suppliers";
import { PageHeader } from "@/components/shell/shell-context";
import { YearSelect } from "@/components/ui/year-select";
import { getHomeStats } from "@/lib/stats";
import { getExpenseYears } from "@/lib/queries";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

const FORENSIC_PILLARS = [
  {
    idx: "01",
    title: "Rastreamento de Rede & Grafos",
    desc: "Mapeamento topológico de conexões ocultas entre candidatos, doadores, parentes e pessoas jurídicas em múltiplos graus de separação.",
    href: "/grafo",
    cta: "Explorar módulo",
    badge: "GRAFO INTERATIVO",
  },
  {
    idx: "02",
    title: "Detecção de Anomalias & IA",
    desc: "Algoritmos auditáveis de doação circular, notas trianguladas, despesas desproporcionais e sócios ocultos com síntese pericial.",
    href: "/sinais/analise-ia",
    cta: "Explorar módulo",
    badge: "MOTOR DE SINAIS",
  },
  {
    idx: "03",
    title: "Comparador & Perícia Judicial",
    desc: "Confronto direto de adversários (Opposition Research), doadores mútuos, mesmas gráficas contratadas e emissão de dossiês SHA-256.",
    href: "/comparador",
    cta: "Explorar módulo",
    badge: "OPPOSITION RESEARCH",
  },
];

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const anoParam = typeof sp.ano === "string" ? Number(sp.ano) : NaN;
  const expenseYears = await getExpenseYears();
  const year = Number.isInteger(anoParam) && expenseYears.includes(anoParam) ? anoParam : undefined;

  const stats = await getHomeStats(year);

  const heroStats = [
    { label: "pessoas cadastradas", value: stats.people.toLocaleString("pt-BR") },
    { label: "candidaturas oficiais", value: stats.candidacies.toLocaleString("pt-BR") },
    { label: "doações auditadas", value: formatBRL(stats.donationsTotalCents), tone: "green" as const },
    { label: "despesas contratadas", value: formatBRL(stats.expensesTotalCents) },
    { label: year ? "eleição selecionada" : "período coberto", value: stats.years },
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        group="eletto"
        current="Início"
        actions={<YearSelect basePath="/" years={expenseYears} value={year} allLabel="todos os anos" />}
      />

      {/* Hero Indicium Cobalt Ultramarine com Cortina de Luz Canelada */}
      <div className="animate-in relative overflow-hidden border border-[var(--border-1)] bg-[#030B38] text-white px-8 py-20 sm:px-16 sm:py-28">
        <span className="card-dot card-dot--tl" />
        <span className="card-dot card-dot--tr" />
        <span className="card-dot card-dot--bl" />
        <span className="card-dot card-dot--br" />
        
        {/* Cortina de refração canelada vertical */}
        <div className="hero-fluted-bg" aria-hidden />

        <div className="relative max-w-3xl z-10">
          <div className="mb-6 flex items-center">
            <div className="pill-tech border-white/25 bg-white/5 text-white">
              <span className="pill-dot pill-dot--cyan" />
              <span className="tracking-widest uppercase font-mono text-[11px]">
                INTELIGÊNCIA & AUDITORIA ELEITORAL
              </span>
              <span className="opacity-40">·</span>
              <span className="text-[var(--accent-2)] font-mono text-[11px]">DADOS OFICIAIS</span>
            </div>
          </div>

          <h1 className="text-[clamp(36px,5vw,60px)] font-normal text-white leading-[1.04] tracking-[-0.03em] text-balance">
            Audite relações, doações e patrimônio de qualquer político brasileiro.
          </h1>

          <p className="mt-6 max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-[#B4C2E4] font-normal">
            Busca unificada por nome, CPF ou CNPJ. Conexões em rede, doações circulares, fornecedores
            e evolução patrimonial de 12 anos cruzados a partir de fontes oficiais.
          </p>

          <div className="mt-10">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Grid de KPIs Arquitetônico */}
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

      {/* Secção de Abordagem / Capacidades Forenses (01 / 02 / 03 Indicium) */}
      <section className="animate-in flex flex-col gap-4" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#1D63FF]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted-2)]">
              Capacidades Analíticas & Periciais
            </span>
          </div>
          <span className="font-mono text-[11px] text-[var(--muted-2)]">
            ELETTO · 01 / 03
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border-1)] divide-y md:divide-y-0 md:divide-x divide-[var(--border-1)] bg-[var(--card-tone)]">
          {FORENSIC_PILLARS.map((p) => (
            <Link
              key={p.idx}
              href={p.href}
              className="card--interactive relative p-8 sm:p-10 flex flex-col justify-between group transition-all"
              style={{ textDecoration: "none" }}
            >
              <span className="card-dot card-dot--tl" />
              <span className="card-dot card-dot--tr" />
              <span className="card-dot card-dot--bl" />
              <span className="card-dot card-dot--br" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs font-semibold text-[var(--accent-2)] tracking-widest">
                    {p.idx}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--muted-2)] border border-[var(--border-1)] px-2 py-0.5">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--fg-1)] leading-tight mb-3">
                  {p.title}
                </h3>

                <p className="text-[13.5px] leading-relaxed text-[var(--muted)]">
                  {p.desc}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-[var(--border-1)] flex items-center justify-between text-xs font-medium">
                <span className="text-[var(--fg-1)] group-hover:text-[#040D42] transition-colors">
                  {p.cta}
                </span>
                <span className="font-mono text-base text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Maiores Fornecedores */}
      <div className="animate-in" style={{ animationDelay: "160ms" }}>
        <TopSuppliers years={expenseYears} initialYear={year} />
      </div>

      {/* Nota de Proveniência Auditável */}
      <div className="card animate-in max-w-3xl relative" style={{ animationDelay: "220ms" }}>
        <span className="card-dot card-dot--tl" />
        <span className="card-dot card-dot--tr" />
        <span className="card-dot card-dot--bl" />
        <span className="card-dot card-dot--br" />
        <div className="label mb-3 flex items-center gap-2">
          <span className="pill-dot pill-dot--purple" />
          <span className="text-[var(--fg-1)] font-medium font-mono tracking-wider uppercase text-xs">
            eletto · proveniência auditável
          </span>
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
