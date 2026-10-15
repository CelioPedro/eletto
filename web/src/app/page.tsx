import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { TopSuppliers } from "@/components/top-suppliers";
import { PageHeader } from "@/components/shell/shell-context";
import { YearSelect } from "@/components/ui/year-select";
import { CtaSearchButton } from "@/components/cta-search-button";
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
    { label: "pessoas cadastradas", value: stats.people.toLocaleString("pt-BR") },
    { label: "candidaturas oficiais", value: stats.candidacies.toLocaleString("pt-BR") },
    { label: "doações auditadas", value: formatBRL(stats.donationsTotalCents), tone: "green" as const },
    { label: "despesas contratadas", value: formatBRL(stats.expensesTotalCents) },
    { label: year ? "eleição selecionada" : "período coberto", value: stats.years },
  ];

  const officialSources = [
    {
      acronym: "TSE",
      name: "Tribunal Superior Eleitoral",
      desc: "Prestações de contas, doações e candidaturas",
      status: "SINCRONIZADO",
    },
    {
      acronym: "RFB",
      name: "Receita Federal do Brasil",
      desc: "Cadastro CNPJ e Quadro de Sócios (QSA)",
      status: "ATIVO",
    },
    {
      acronym: "CGU",
      name: "Controladoria-Geral da União",
      desc: "CEIS, CNEP e Acordos de Leniência",
      status: "AUDITADO",
    },
    {
      acronym: "TCU",
      name: "Tribunal de Contas da União",
      desc: "Contas julgadas irregulares e inabilitados",
      status: "OFICIAL",
    },
    {
      acronym: "GOV",
      name: "Portal da Transparência",
      desc: "Emendas parlamentares e transferências",
      status: "CONEXÃO DIRETA",
    },
  ];

  const methodologies = [
    {
      title: "Doação Circular",
      desc: "Repasses triangulados onde recursos transitam entre intermediários e laranjas para dissimular a origem real do financiamento.",
    },
    {
      title: "Sócio de Fornecedor",
      desc: "Candidatos com quotas societárias ativas em empresas contratadas pela própria campanha ou por comitês de aliados (potencial autocontratação).",
    },
    {
      title: "Despesa Desproporcional",
      desc: "Concentração volumosa de gastos em empresas recém-abertas, sem capacidade operacional atestada ou fornecedores com sede fantasma.",
    },
    {
      title: "Evolução Patrimonial",
      desc: "Série histórica de 12 anos de bens declarados ao TSE com identificação de saltos atípicos e aquisições incompatíveis com a renda pública.",
    },
    {
      title: "Dossiê com Hash SHA-256",
      desc: "Peça pericial estruturada com árvore de evidências, carimbo de tempo e hash criptográfico imutável para suporte a ações judiciais eleitorais.",
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
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
            <div className="tag-pill border-white/25 bg-white/5 text-white">
              <span className="tag-pill__square bg-[#1D63FF]" />
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

      {/* SEÇÃO 1: Três Colunas Interativas com Inversão no Hover (Referência Screenshot 1) */}
      <section className="animate-in flex flex-col gap-4" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between">
          <div className="tag-pill">
            <span className="tag-pill__square" />
            <span>Capacidades Analíticas & Periciais</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--muted-2)]">
            ELETTO · 01 / 03
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border-1)] divide-y md:divide-y-0 md:divide-x divide-[var(--border-1)] bg-[#030B38]">
          {/* Card 1: Rastreamento em Rede */}
          <Link
            href="/grafo"
            className="card--interactive relative p-8 sm:p-12 flex flex-col justify-between group transition-all"
            style={{ textDecoration: "none" }}
          >
            <span className="card-dot card-dot--tl" />
            <span className="card-dot card-dot--tr" />
            <span className="card-dot card-dot--bl" />
            <span className="card-dot card-dot--br" />

            <div>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="card-icon text-white group-hover:text-[#1D63FF] transition-colors mb-12">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>

              <h3 className="card-title text-2xl font-medium tracking-tight text-white group-hover:text-[#040D42] transition-colors mb-3">
                Rastreie o crescimento
              </h3>

              <p className="card-desc text-[13.5px] leading-relaxed text-[#B4C2E4] group-hover:text-[#3B4C7E] transition-colors">
                Mapeamento topológico de conexões ocultas entre candidatos, doadores, parentes e pessoas jurídicas em múltiplos graus de separação.
              </p>
            </div>

            <div className="mt-12">
              <span className="btn--saiba-mais">
                Saiba mais
              </span>
            </div>
          </Link>

          {/* Card 2: Detecção de Anomalias (Card Ativo Branco como no Screenshot 1) */}
          <Link
            href="/sinais/analise-ia"
            className="card--interactive card--active-white relative p-8 sm:p-12 flex flex-col justify-between group transition-all"
            style={{ textDecoration: "none" }}
          >
            <span className="card-dot card-dot--tl" />
            <span className="card-dot card-dot--tr" />
            <span className="card-dot card-dot--bl" />
            <span className="card-dot card-dot--br" />

            <div>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="card-icon text-[#1D63FF] mb-12">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>

              <h3 className="card-title text-2xl font-medium tracking-tight text-[#040D42] mb-3">
                Reduza riscos
              </h3>

              <p className="card-desc text-[13.5px] leading-relaxed text-[#3B4C7E]">
                Construa auditorias confiáveis sobre bases sólidas, com governança pericial e detecção de doações circulares, despesas atípicas e notas trianguladas.
              </p>
            </div>

            <div className="mt-12">
              <span className="btn--saiba-mais">
                Saiba mais
              </span>
            </div>
          </Link>

          {/* Card 3: Comparador e Otimização */}
          <Link
            href="/comparador"
            className="card--interactive relative p-8 sm:p-12 flex flex-col justify-between group transition-all"
            style={{ textDecoration: "none" }}
          >
            <span className="card-dot card-dot--tl" />
            <span className="card-dot card-dot--tr" />
            <span className="card-dot card-dot--bl" />
            <span className="card-dot card-dot--br" />

            <div>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="card-icon text-white group-hover:text-[#1D63FF] transition-colors mb-12">
                <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8L15 14" />
                <circle cx="18" cy="5" r="3" />
              </svg>

              <h3 className="card-title text-2xl font-medium tracking-tight text-white group-hover:text-[#040D42] transition-colors mb-3">
                Reduza custos
              </h3>

              <p className="card-desc text-[13.5px] leading-relaxed text-[#B4C2E4] group-hover:text-[#3B4C7E] transition-colors">
                Otimize perícias e investigações ao confrontar adversários em minutos, identificando doadores comuns, mesmos prestadores e emitindo laudos probatórios.
              </p>
            </div>

            <div className="mt-12">
              <span className="btn--saiba-mais">
                Saiba mais
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* SEÇÃO 2: Fontes Oficiais & Cruzetas Técnicas (Referência Screenshot 2) */}
      <section className="animate-in flex flex-col items-center text-center gap-4 py-8" style={{ animationDelay: "140ms" }}>
        <div className="tag-pill">
          <span className="tag-pill__square" />
          <span>Com quem trabalhamos</span>
        </div>

        <h2 className="text-[clamp(26px,3.5vw,38px)] font-normal text-[var(--fg-1)] tracking-[-0.03em] leading-tight max-w-2xl text-balance">
          Auditado sobre as bases públicas de maior fé e autoridade
        </h2>

        <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--muted)]">
          Consolidamos e sincronizamos dados dos órgãos superiores da administração pública,
          preservando o carimbo de tempo e a integridade de cada registro oficial.
        </p>

        {/* Grelha Arquitetónica de 5 Células com Cruzetas Técnicas nas Interseções */}
        <div className="w-full mt-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 border border-[var(--border-1)] divide-x divide-y md:divide-y-0 divide-[var(--border-1)] bg-[var(--surface)] relative">
            {/* Cruzetas nos cantos externos */}
            <span className="grid-cross" style={{ top: 0, left: 0 }} />
            <span className="grid-cross" style={{ top: 0, right: 0 }} />
            <span className="grid-cross" style={{ bottom: 0, left: 0 }} />
            <span className="grid-cross" style={{ bottom: 0, right: 0 }} />

            {officialSources.map((s, idx) => (
              <div key={s.acronym} className="grid-cell relative group">
                {/* Cruzeta na divisória direita se não for o último */}
                {idx < officialSources.length - 1 ? (
                  <span className="grid-cross hidden md:block" style={{ top: 0, right: 0 }} />
                ) : null}
                {idx < officialSources.length - 1 ? (
                  <span className="grid-cross hidden md:block" style={{ bottom: 0, right: 0 }} />
                ) : null}

                <span className="font-mono text-2xl font-bold tracking-tight text-[var(--fg-1)] group-hover:text-[var(--accent)] transition-colors">
                  {s.acronym}
                </span>
                <span className="text-[12.5px] font-medium text-[var(--fg-1)] mt-2 leading-tight">
                  {s.name}
                </span>
                <span className="text-[11px] text-[var(--muted)] mt-1.5 leading-snug">
                  {s.desc}
                </span>
                <span className="mt-4 font-mono text-[9px] uppercase tracking-wider text-[var(--accent-2)] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2 py-0.5">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: Editorial em 2 Colunas: Metodologia Forense (Referência Screenshot 4) */}
      <section className="animate-in border border-[var(--border-1)] bg-[#030B38] text-white p-8 sm:p-14" style={{ animationDelay: "160ms" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Coluna Esquerda: Título Editorial com Destaque Ciano */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="mb-6">
              <div className="tag-pill border-white/20 bg-white/5 text-white">
                <span className="tag-pill__square bg-[#1D63FF]" />
                <span>Nossas tipologias forenses</span>
              </div>
            </div>

            <h2 className="text-[clamp(28px,3.8vw,44px)] font-normal text-white tracking-[-0.03em] leading-[1.08] text-balance">
              Expertise aplicada aos desafios da sua{" "}
              <span className="bg-gradient-to-r from-[#1D63FF] via-[#5CE1E6] to-[#5CE1E6] bg-clip-text text-transparent font-medium">
                investigação
              </span>
            </h2>

            <p className="mt-6 text-[14px] sm:text-[15px] leading-relaxed text-[#B4C2E4] font-normal">
              O contexto investigativo muda tudo: da governança e compliance partidário à instrução probatória em tribunais eleitorais. Aplicamos modelos comprovados para que você avance com velocidade e sem margem de erro.
            </p>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
              <span className="font-mono text-xs text-[#5CE1E6]">AUDITORIA CONTÍNUA</span>
              <span className="text-white/30">·</span>
              <span className="font-mono text-xs text-[#B4C2E4]">ELEIÇÕES 2014–2026</span>
            </div>
          </div>

          {/* Coluna Direita: Linhas Técnicas Separadas por Borda de 1px */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/15 border-t lg:border-t-0 border-white/15">
            {methodologies.map((m) => (
              <div key={m.title} className="py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline">
                <div className="sm:col-span-5 font-medium text-[15px] text-white tracking-tight">
                  {m.title}
                </div>
                <div className="sm:col-span-7 text-[13px] sm:text-[13.5px] leading-relaxed text-[#B4C2E4]">
                  {m.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maiores Fornecedores */}
      <div className="animate-in" style={{ animationDelay: "180ms" }}>
        <TopSuppliers years={expenseYears} initialYear={year} />
      </div>

      {/* SEÇÃO 4: CTA Centrado com Dot Matrix (Referência Screenshot 5) */}
      <section className="animate-in relative overflow-hidden border border-[var(--border-1)] bg-[#030B38] text-white p-12 sm:p-24 text-center" style={{ animationDelay: "200ms" }}>
        <span className="card-dot card-dot--tl" />
        <span className="card-dot card-dot--tr" />
        <span className="card-dot card-dot--bl" />
        <span className="card-dot card-dot--br" />

        {/* Matriz de Micropontos */}
        <div className="bg-dot-matrix absolute inset-0 opacity-40 pointer-events-none" aria-hidden />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="mb-6">
            <div className="tag-pill border-white/20 bg-white/5 text-white">
              <span className="tag-pill__square bg-[#1D63FF]" />
              <span>Entre em contato</span>
            </div>
          </div>

          <h2 className="text-[clamp(32px,4.5vw,54px)] font-normal text-white tracking-[-0.03em] leading-[1.08] text-balance">
            Pronto para transformar sua investigação com Dados & IA?
          </h2>

          <p className="mt-6 text-[15px] sm:text-[16px] leading-relaxed text-[#B4C2E4] max-w-xl">
            Vamos conversar sobre como podemos ajudar você a auditar vínculos, rastrear contas de campanha e alcançar conclusões periciais sólidas.
          </p>

          <div className="mt-10">
            <CtaSearchButton text="Iniciar investigação no Eletto" />
          </div>
        </div>
      </section>

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
