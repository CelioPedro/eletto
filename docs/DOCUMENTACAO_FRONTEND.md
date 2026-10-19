# Documentação Completa do Front-End · Eletto (Inteligência & Auditoria Eleitoral)

Este documento reúne a especificação integral da camada de front-end do **Eletto**, servindo como base técnica de referência para o projeto de **reestilização visual completa do sistema**.

---

## 1. Árvore de Arquivos do Front-End (`web/src/`)

```text
web/src/
├── app/
│   ├── favicon.ico
│   ├── icon.svg
│   ├── globals.css                       <-- CSS Global, Design Tokens e Tailwind v4 Theme
│   ├── layout.tsx                        <-- Layout raiz (fontes Inter e JetBrains Mono, AppShell, init tema)
│   ├── loading.tsx                       <-- Fallback de carregamento raiz
│   ├── page.tsx                          <-- Página principal (Landing Page / Dashboard de Busca)
│   ├── checkout/
│   │   └── sucesso/
│   │       └── page.tsx                  <-- Confirmação de pagamento e upgrade Stripe
│   ├── comparador/
│   │   └── page.tsx                      <-- Módulo Comparador "Frente a Frente" (Opposition Research)
│   ├── planos/
│   │   └── page.tsx                      <-- Tabela de planos e assinatura Stripe Checkout
│   ├── ranking/
│   │   ├── loading.tsx
│   │   └── page.tsx                      <-- Ranking nacional de bens declarados
│   ├── emendas/
│   │   └── page.tsx                      <-- Emendas parlamentares para empresas privadas
│   ├── grafo/
│   │   ├── loading.tsx
│   │   └── page.tsx                      <-- Visualizador de grafo de relações e rede política
│   ├── cpf/
│   │   └── [cpf]/
│   │       ├── loading.tsx
│   │       └── page.tsx                  <-- Perfil e histórico de doador pessoa física
│   ├── cnpj/
│   │   └── [cnpj]/
│   │       ├── loading.tsx
│   │       └── page.tsx                  <-- Raio-X de empresa, sócios e contratos de campanha
│   ├── politico/
│   │   └── [id]/
│   │       ├── loading.tsx
│   │       ├── page.tsx                  <-- Perfil detalhado do político (patrimônio, receitas, gastos)
│   │       ├── dossie/
│   │       │   └── page.tsx              <-- Dossiê pericial formal com hash SHA-256 e papel timbrado
│   │       └── peca-juridica/
│   │           └── page.tsx              <-- Bancada de minutas jurídicas eleitorais assistidas por IA
│   ├── sinais/
│   │   ├── analise-ia/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx                  <-- Alertas gerados por inteligência artificial
│   │   ├── despesa-desproporcional/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx                  <-- Desvio padrão contra média de pares
│   │   ├── discurso/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx                  <-- Monitoramento de narrativas em redes sociais
│   │   ├── doacao-circular/
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx                  <-- Detecção de ciclos de financiamento suspeitos
│   │   └── socio-fornecedor/
│   │       ├── loading.tsx
│   │       └── page.tsx                  <-- Conflito de interesses (candidato sócio de fornecedor)
│   └── api/                              <-- Rotas backend consumidas pelo front-end
│       ├── ai/
│       │   ├── dossier-summary/route.ts
│       │   └── legal-draft/route.ts
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── me/route.ts
│       │   ├── register/route.ts
│       │   └── toggle-plan/route.ts
│       ├── checkout/
│       │   └── create-session/route.ts   <-- Criação de sessão Stripe Checkout
│       ├── despesa-desproporcional-detalhe/route.ts
│       ├── export/
│       │   └── supplier-partners/route.ts
│       ├── finance/route.ts
│       ├── graph-expand/route.ts
│       ├── graph-node/route.ts
│       ├── graph-paths/route.ts
│       ├── graph-search/route.ts
│       ├── search/route.ts               <-- API de busca global por nome ou CPF
│       └── top-suppliers/route.ts
│
├── components/
│   ├── assets-curve-chart-lazy.tsx       <-- Carregador sob demanda do gráfico Recharts
│   ├── assets-curve-chart.tsx            <-- Curva temporal de evolução patrimonial
│   ├── assets-year-cards.tsx             <-- Cards de bens declarados por ano
│   ├── category-expense-row.tsx          <-- Linha de categoria de despesa com modal detalhado
│   ├── entity-loading-skeleton.tsx       <-- Esqueleto de carregamento de entidade
│   ├── entity-profile-view.tsx           <-- Visão consolidada de perfil
│   ├── finance-table.tsx                 <-- Tabela financeira com paginação
│   ├── graph-canvas.tsx                  <-- Renderizador de grafo interativo em Canvas
│   ├── politician-network.tsx            <-- Componente de rede do político
│   ├── profile-photo.tsx                 <-- Foto oficial do candidato com tratamento de erro
│   ├── search-avatar.tsx                 <-- Avatar circular com fallback de inicial
│   ├── search-box.tsx                    <-- Botão de busca da home que aciona a Command Palette
│   ├── sinais-loading-skeleton.tsx       <-- Esqueleto de sinais
│   ├── skeleton.tsx                      <-- Componente base de skeleton
│   ├── social-card.tsx                   <-- Card de rede social
│   ├── source-zone.tsx                   <-- Marcador de auditoria de proveniência com laser animado
│   ├── top-suppliers.tsx                 <-- Maiores fornecedores por ano com seletor
│   ├── tweet-card.tsx                    <-- Card de post de rede social auditado
│   │
│   ├── auth/
│   │   ├── auth-context.tsx              <-- Contexto React de autenticação e plano ativo
│   │   ├── auth-modal.tsx                <-- Modal de login e cadastro
│   │   └── sidebar-user-profile.tsx      <-- Popover de perfil no rodapé da sidebar
│   │
│   ├── comparador/
│   │   ├── candidate-search-slot.tsx     <-- Slot de busca e seleção de candidatos
│   │   ├── comparator-scoreboard.tsx     <-- Placar geral frente a frente com barras proporcionais
│   │   ├── comparator-view.tsx           <-- Controlador principal, duelos prévios e swap
│   │   ├── shared-donors-table.tsx       <-- Tabela de doadores em comum
│   │   ├── shared-suppliers-table.tsx    <-- Tabela de fornecedores compartilhados
│   │   └── signals-comparison.tsx        <-- Comparação de sinais de risco lado a lado
│   │
│   ├── dossie/
│   │   ├── dossie-actions.tsx            <-- Botões de impressão e configuração
│   │   ├── dossier-ai-summary.tsx        <-- Síntese executiva com Inteligência Artificial
│   │   ├── dossier-container.tsx         <-- Container estruturado da peça pericial
│   │   └── letterhead-modal.tsx          <-- Modal de papel timbrado institucional
│   │
│   ├── graph/
│   │   ├── cycle-graph.tsx               <-- Grafo de ciclo de doações
│   │   ├── entity-node.tsx               <-- Nó customizado do grafo
│   │   ├── floating-edge.tsx             <-- Aresta animada
│   │   └── types.ts                      <-- Tipos de nós e conexões
│   │
│   ├── juridico/
│   │   └── legal-draft-workbench.tsx     <-- Bancada de redação de peças processuais com IA
│   │
│   ├── planos/
│   │   └── pricing-table.tsx             <-- Tabela de preços e disparo do Stripe Checkout
│   │
│   ├── shell/
│   │   ├── app-shell.tsx                 <-- Shell geral (Sidebar + Topbar + Conteúdo)
│   │   ├── command-palette.tsx           <-- Paleta de comando global (Ctrl + K)
│   │   ├── shell-context.tsx             <-- Contexto de breadcrumbs e estado da barra lateral
│   │   ├── sidebar.tsx                   <-- Barra lateral de navegação
│   │   ├── theme-toggle.tsx              <-- Alternador de modo escuro/claro com efeito radial
│   │   └── topbar.tsx                    <-- Barra superior translúcida com migalhas de pão
│   │
│   └── ui/                               <-- Componentes atômicos e primitivos de interface
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── date-range-picker.tsx
│       ├── empty-state.tsx
│       ├── expense-category-select.tsx
│       ├── export-pro-button.tsx
│       ├── input.tsx
│       ├── modal.tsx
│       ├── pagination-links.tsx
│       ├── pagination-shared.ts
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── pro-upgrade-modal.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       └── year-select.tsx
│
└── lib/
    ├── auth.ts                           <-- Manipulação de sessão e usuário
    ├── db.ts                             <-- Pool PostgreSQL e transpilador SQL
    ├── format.ts                         <-- formatBRL, formatCpfCnpj, entityHref
    ├── gemini.ts                         <-- Integração com modelos Gemini para sínteses
    ├── graph-cycles.ts                   <-- Algoritmos de busca de ciclos em grafo
    ├── normalize.ts                      <-- Normalização fonética e remoção de acentos
    ├── queries.ts                        <-- Central de consultas tipadas ao banco de dados
    ├── stats.ts                          <-- Agregadores de métricas da home e contadores da sidebar
    ├── stripe.ts                         <-- Cliente do Stripe Node SDK
    ├── use-color-mode.ts                 <-- Hook de controle de tema
    └── utils.ts                          <-- Helper cn (clsx + twMerge)
```

---

## 2. Conteúdo Completo do `package.json` (`web/package.json`)

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@base-ui/react": "^1.8.0",
    "@xyflow/react": "^12.11.6",
    "class-variance-authority": "^0.7.1",
    "cn": "^0.2.5",
    "d3-force": "^3.0.0",
    "date-fns": "^4.4.0",
    "lucide-react": "^1.41.0",
    "next": "16.3.4",
    "pg": "^8.23.1",
    "react": "19.2.8",
    "react-day-picker": "^10.0.1",
    "react-dom": "19.2.8",
    "react-icons": "^5.7.0",
    "recharts": "^3.10.1",
    "shadcn": "^4.21.0",
    "stripe": "^23.0.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/d3-force": "^3.0.10",
    "@types/node": "^20",
    "@types/pg": "^8.23.1",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 3. Arquivo de Configuração do Tailwind & CSS Global (`web/src/app/globals.css`)

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
  --font-heading: var(--font-sans);
  --color-elo-amber: var(--accent-2);
  --color-elo-amber-bright: var(--accent-2);
  --color-elo-green: var(--green);
  --color-elo-red: var(--red);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted-surface);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: var(--r-sm);
  --radius-md: var(--r-md);
  --radius-lg: var(--r-lg);
  --radius-xl: var(--r-page);
}

/* eletto corporate high-contrast design system */
:root {
  --bg: #070913;
  --surface: #0d1226;
  --card-tone: #121933;
  --sidebar: #0a0e20;
  --hover: #192245;
  --active: #232f5f;

  --border-1: rgba(255, 255, 255, 0.12);
  --border-2: rgba(255, 255, 255, 0.24);

  --fg-1: #ffffff;
  --fg-2: #f1f5f9;
  --muted: #cbd5e1;
  --muted-2: #94a3b8;

  --accent: #2563eb;
  --accent-2: #93c5fd;
  --accent-vibrant: #6366f1;
  --accent-ice: #38bdf8;
  --accent-rgb: 37, 99, 235;
  --accent-2-rgb: 147, 197, 253;
  --accent-tint: rgba(37, 99, 235, 0.18);
  --accent-hover: #1d4ed8;
  --accent-foreground: #ffffff;

  --green: #22c55e;
  --green-tint: rgba(34, 197, 94, 0.35);
  --red: #f43f5e;
  --red-tint: rgba(244, 63, 94, 0.25);
  --red-row: rgba(244, 63, 94, 0.1);
  --gold: #f59e0b;
  --gold-tint: rgba(245, 158, 11, 0.35);
  --skeleton-shine: #1e293b;

  --link-primary: #60a5fa;
  --link-primary-hover: #ffffff;
  --link-primary-rgb: 96, 165, 250;

  --r-page: 8px;
  --r-lg: 8px;
  --r-md: 6px;
  --r-sm: 4px;

  --shadow-modal: 0 24px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  --shadow-card-hover: 0 8px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.14);

  --navbar-h: 52px;
  --navbar-gap: 12px;
  --navbar-offset: calc(var(--navbar-h) + var(--navbar-gap) * 2);

  --page-max-w: 920px;

  --background: var(--bg);
  --foreground: var(--fg-1);
  --card: var(--card-tone);
  --card-foreground: var(--fg-1);
  --popover: var(--card-tone);
  --popover-foreground: var(--fg-1);
  --primary: var(--accent);
  --primary-foreground: var(--accent-foreground);
  --secondary: var(--hover);
  --secondary-foreground: var(--fg-1);
  --muted-surface: var(--card-tone);
  --muted-foreground: var(--muted-2);
  --destructive: var(--red);
  --border: var(--border-1);
  --input: var(--border-1);
  --ring: var(--accent);
  --chart-1: var(--accent);
  --chart-2: var(--green);
  --chart-3: var(--red);
  --chart-4: var(--muted);
  --chart-5: var(--accent-2);
  --sidebar-foreground: var(--fg-1);
  --sidebar-primary: var(--accent);
  --sidebar-primary-foreground: var(--accent-foreground);
  --sidebar-accent: var(--active);
  --sidebar-accent-foreground: var(--fg-1);
  --sidebar-border: var(--border-1);
  --sidebar-ring: var(--accent);
}

:root[data-theme="light"] {
  --bg: #f8fafc;
  --surface: #ffffff;
  --card-tone: #ffffff;
  --sidebar: #ffffff;
  --hover: #f1f5f9;
  --active: #e2e8f0;

  --border-1: #e2e8f0;
  --border-2: #94a3b8;

  --fg-1: #090d16;
  --fg-2: #1e293b;
  --muted: #334155;
  --muted-2: #475569;

  --accent: #1d4ed8;
  --accent-2: #2563eb;
  --accent-vibrant: #4338ca;
  --accent-ice: #0284c7;
  --accent-rgb: 29, 78, 216;
  --accent-2-rgb: 37, 99, 235;
  --accent-tint: rgba(29, 78, 216, 0.08);
  --accent-hover: #1e40af;
  --skeleton-shine: #f1f5f9;

  --link-primary: #1d4ed8;
  --link-primary-hover: #090d16;
  --link-primary-rgb: 29, 78, 216;

  --shadow-modal: 0 24px 80px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08);
  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.04);
  --shadow-card-hover: 0 4px 20px rgba(15, 23, 42, 0.1);

  --background: var(--bg);
  --foreground: var(--fg-1);
  --card: var(--card-tone);
  --card-foreground: var(--fg-1);
  --popover: var(--card-tone);
  --popover-foreground: var(--fg-1);
  --sidebar-foreground: var(--fg-1);
}

* { box-sizing: border-box; }

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
  a { color: var(--accent-2); text-decoration: none; }
  a:hover { color: var(--accent-hover); }
  ::selection { background: rgba(var(--accent-rgb), 0.3); }
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  ::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }
  ::-webkit-scrollbar-track {
    background: var(--background);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--border-2);
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--muted-2);
  }
}

@layer utilities {
  .mono-label {
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1;
    color: var(--muted-2);
  }
}

@layer components {

.num, .mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.label {
  font-size: 11px;
  font-weight: 500;
  color: var(--muted-2);
}

.section-title {
  font-family: var(--font-sans);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--fg-1);
}

.card {
  background: var(--card-tone);
  border: 1px solid var(--border-1);
  border-radius: var(--r-lg);
  padding: 22px 24px;
  box-shadow: var(--shadow-card);
  position: relative;
  transition: border-color .15s ease, background-color .15s ease, transform .2s cubic-bezier(.16,1,.3,1),
    box-shadow .2s ease;
}
a.card:hover, button.card:hover {
  border-color: var(--border-2);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.card-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background-color: var(--accent-2);
  pointer-events: none;
  z-index: 5;
}
.card-dot--tl { top: -1px; left: -1px; transform: translate(-50%, -50%); }
.card-dot--tr { top: -1px; right: -1px; transform: translate(50%, -50%); }
.card-dot--bl { bottom: -1px; left: -1px; transform: translate(-50%, 50%); }
.card-dot--br { bottom: -1px; right: -1px; transform: translate(50%, 50%); }

.pill-tech {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--border-1);
  background: var(--card-tone);
  color: var(--fg-1);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: -0.01em;
}
.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 1.5px;
  background-color: var(--accent);
}
.pill-dot--purple { background-color: var(--accent-vibrant); }
.pill-dot--cyan { background-color: var(--accent-ice); }
.pill-dot--green { background-color: var(--green); }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fade-in-up .55s cubic-bezier(.16,1,.3,1) both;
}
@media (prefers-reduced-motion: reduce) {
  .animate-in { animation: none; }
}

.hero-glow {
  position: absolute;
  inset: -20% -5% auto -5%;
  height: 65%;
  min-height: 280px;
  background:
    radial-gradient(640px 320px at 20% 25%, rgba(61, 40, 217, 0.35), transparent 70%),
    radial-gradient(520px 280px at 80% 70%, rgba(36, 91, 243, 0.25), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
  animation: hero-glow-breathe 9s ease-in-out infinite;
}
@keyframes hero-glow-breathe {
  0%, 100% { opacity: 0.75; transform: translateY(0) scale(1); }
  50% { opacity: 1; transform: translateY(8px) scale(1.03); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-glow { animation: none; }
}

.signal {
  background: var(--card-tone);
  border: 1px solid var(--border-1);
  border-left: 2px solid var(--muted-2);
  border-radius: var(--r-md);
  padding: 13px 16px;
  box-shadow: var(--shadow-card);
}
.signal--high   { border-left-color: var(--red); }
.signal--medium { border-left-color: var(--accent); }
.signal--low    { border-left-color: var(--muted-2); }

.signal__note {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 14px;
  padding: 9px 12px;
  border: 1px dashed var(--red-tint);
  border-radius: var(--r-sm);
  font-size: 13px;
  color: var(--fg-2);
}
.signal__note--soft { border-color: rgba(var(--accent-rgb), 0.4); }

.cycle-card {
  position: relative;
  height: 320px;
  overflow: hidden;
  border-radius: var(--r-md);
  border: 1px solid var(--border-1);
  background: var(--card-tone);
  box-shadow: var(--shadow-card);
}
.cycle-card__scrim {
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 5;
  padding: 12px 14px 22px;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--card-tone) 0%, var(--card-tone) 35%, transparent 100%);
}
.cycle-card__scrim > * { pointer-events: auto; }
.cycle-card__ai {
  margin-top: 8px;
  max-width: 34rem;
  font-size: 11.5px;
  line-height: 1.4;
  color: var(--muted);
}
.cycle-card__cta {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 5;
  font-size: 11px;
  padding: 6px 10px;
  background: var(--surface);
}

.search-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--border-1);
}
.search-avatar--fallback {
  background: var(--active);
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.social-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
  padding: 10px 14px;
  background: var(--card-tone);
  border: 1px solid var(--border-1);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-card);
  transition: border-color .15s ease, background-color .15s ease, transform .2s cubic-bezier(.16,1,.3,1);
}
.social-card:hover { border-color: var(--border-2); background: var(--hover); transform: translateY(-2px); }
.social-card__icon { flex: none; }
.social-card__label {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--fg-1);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.social-card__year {
  margin-top: 1px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--muted-2);
}

.tweet-card {
  display: flex;
  gap: 12px;
  background: var(--card-tone);
  border: 1px solid var(--border-1);
  border-radius: var(--r-md);
  padding: 14px;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: border-color .15s ease, background-color .15s ease, transform .2s cubic-bezier(.16,1,.3,1);
}
.tweet-card:hover { border-color: var(--border-2); background: var(--hover); transform: translateY(-2px); }
.tweet-card__avatar {
  display: flex; align-items: center; justify-content: center;
  flex: none;
  width: 40px; height: 40px;
  border-radius: 999px;
  background: var(--accent-tint);
  color: var(--accent-2);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
}
.tweet-card__main { min-width: 0; flex: 1; }
.tweet-card__head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  font-size: 14px;
}
.tweet-card__name { font-weight: 700; color: var(--fg-1); }
.tweet-card__handle, .tweet-card__dot, .tweet-card__date { color: var(--muted-2); font-size: 13.5px; }
.tweet-card__reply { margin-top: 2px; font-size: 12px; color: var(--muted-2); }
.tweet-card__text {
  margin-top: 3px;
  font-size: 15px;
  line-height: 1.4;
  color: var(--fg-1);
  white-space: pre-wrap;
}
.tweet-card__tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.tweet-card__actions {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 380px;
  margin-top: 10px;
  color: var(--muted-2);
  font-size: 13px;
}

.badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 2px 7px;
  border: 1px solid var(--border-2);
  border-radius: var(--r-sm);
  color: var(--muted);
  background: transparent;
}
.badge--red    { color: var(--red);    border-color: var(--red-tint); }
.badge--green  { color: var(--green);  border-color: var(--green-tint); }
.badge--accent { color: var(--accent-2); border-color: rgba(var(--accent-rgb), 0.4); }
.badge--flag {
  gap: 4px;
  padding: 3px 8px;
  font-weight: 700;
  color: #fff;
  background: var(--red);
  border-color: var(--red);
}

.source-zone {
  position: relative;
  isolation: isolate;
  cursor: pointer;
  border-radius: var(--r-sm);
  background: rgba(34, 197, 94, .12);
  box-shadow: inset 0 0 0 1.5px rgba(34, 197, 94, .55);
  transition: box-shadow .15s, background-color .15s, transform .15s;
}
.source-zone a, .source-zone button, .source-zone [role="button"] {
  pointer-events: none;
}
.source-zone--hover {
  z-index: 5;
  background: rgba(34, 197, 94, 0.24);
  transform: scale(1.02);
  box-shadow: inset 0 0 0 1.5px rgba(34, 197, 94, .9), 0 0 16px rgba(34, 197, 94, .35);
}
.source-zone--hover::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: conic-gradient(from var(--laser-angle, 0deg),
    transparent 0deg, transparent 260deg, #bbf7d0 300deg, #22c55e 330deg, #4ade80 345deg, transparent 360deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: source-zone-laser 1.6s linear infinite;
  pointer-events: none;
}
@property --laser-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes source-zone-laser {
  to { --laser-angle: 360deg; }
}
@media (prefers-reduced-motion: reduce) {
  .source-zone--hover::before { animation: none; }
}

tr.source-zone {
  position: static;
  isolation: auto;
  background: none;
  box-shadow: none;
}
tr.source-zone--hover {
  z-index: auto;
  transform: none;
  background: none;
  box-shadow: none;
}
tr.source-zone--hover::before {
  content: none;
}
.table tr.source-zone--hover > td {
  background: rgba(34, 197, 94, 0.22) !important;
  box-shadow: inset 0 1.5px 0 0 rgba(34, 197, 94, .8), inset 0 -1.5px 0 0 rgba(34, 197, 94, .8);
}
.table tr.source-zone--hover > td:first-child {
  box-shadow: inset 0 1.5px 0 0 rgba(34, 197, 94, .8), inset 0 -1.5px 0 0 rgba(34, 197, 94, .8),
    inset 1.5px 0 0 0 rgba(34, 197, 94, .8);
}
.table tr.source-zone--hover > td:last-child {
  box-shadow: inset 0 1.5px 0 0 rgba(34, 197, 94, .8), inset 0 -1.5px 0 0 rgba(34, 197, 94, .8),
    inset -1.5px 0 0 0 rgba(34, 197, 94, .8);
}

.seal__body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 9px 18px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.5;
}
.seal__body dt, .seal__k { color: var(--muted-2); }
.seal__body dd, .seal__v { margin: 0; color: var(--fg-1); word-break: break-all; }

.modal-backdrop {
  position: fixed; inset: 0; z-index: 40;
  background: rgba(3, 4, 28, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: modal-backdrop-in .18s ease-out both;
}
.modal {
  width: 520px; max-width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--card-tone);
  border: 1px solid var(--border-2);
  border-radius: var(--r-lg);
  box-shadow: 0 24px 80px rgba(0, 2, 20, 0.95), 0 0 32px rgba(61, 40, 217, 0.22);
  animation: modal-in .22s cubic-bezier(.16,1,.3,1) both;
  position: relative;
}
@keyframes modal-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes modal-in {
  from { opacity: 0; transform: scale(.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .modal-backdrop, .modal { animation: none; }
}
.modal__header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-1);
  position: sticky; top: 0;
  z-index: 10;
  background: var(--card-tone);
}
.modal__close {
  background: transparent; border: 0;
  font-size: 18px; line-height: 1;
  color: var(--muted); cursor: pointer;
}
.modal__close:hover { color: var(--fg-1); }
.modal__body { padding: 16px; }

.table {
  width: 100%;
  border: 1px solid var(--border-1);
  border-radius: var(--r-md);
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}
.table thead th {
  background: var(--card-tone);
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-1);
}
.table thead th[aria-sort] { color: var(--accent-2); }
.table td {
  padding: 13px 16px;
  font-size: 14px;
  color: var(--fg-1);
  border-bottom: 1px solid var(--border-1);
}
.table tbody tr:last-child td { border-bottom: 0; }
.table tbody tr:hover td { background: var(--hover); }
.table .num { font-size: 13px; text-align: right; white-space: nowrap; }
.table tr.is-flagged td { background: var(--red-row); }

.link-primary { color: var(--link-primary); }
.link-primary:hover { color: var(--link-primary-hover); text-decoration: underline; }

.table-wrap {
  border: 1px solid var(--border-1);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.table-wrap .table { border: 0; border-radius: 0; width: 100%; }
.table-footer {
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  background: var(--card-tone);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 20px;
  text-align: center;
  border: 1px dashed var(--border-1);
  border-radius: var(--r-md);
}
.empty-state__icon { font-size: 26px; color: var(--muted-2); opacity: .6; }
.empty-state__title { font-size: 13px; color: var(--muted); max-width: 32rem; }
.empty-state__hint {
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted-2);
}
.empty-state--compact {
  padding: 22px 14px;
  gap: 4px;
}
.empty-state--compact .empty-state__icon { font-size: 18px; }

.kpis {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 1px;
  background: var(--border-1);
  border: 1px solid var(--border-1);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.kpi {
  background: var(--surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 14px 18px;
}
.kpi__label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-2);
}
.kpi__value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 20px;
  font-weight: 700;
  margin-top: 6px;
  color: var(--fg-1);
}
.kpi__value--green { color: var(--green); }
.kpi__value--red { color: var(--red); }
.kpi__sub { font-family: var(--font-mono); font-size: 12px; color: var(--muted-2); margin-top: 6px; }

.navbar-wrap {
  position: sticky; top: 0; z-index: 20;
  height: var(--navbar-offset);
}
.navbar-blur {
  position: absolute; inset: 0;
  mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}
.navbar {
  position: absolute; top: var(--navbar-gap); left: 28px; right: 28px;
  max-width: calc(var(--page-max-w) - 56px);
  margin: 0 auto;
  height: var(--navbar-h);
  display: flex; align-items: center; gap: 14px;
  padding: 0 16px;
  border: 1px solid var(--border-1);
  border-radius: var(--r-page);
  background: var(--surface);
  box-shadow: var(--shadow-card);
  z-index: 2;
}
.navbar__logo { display: flex; align-items: center; gap: 8px; flex: none; }
.navbar__mark {
  width: 24px; height: 24px; border-radius: 4px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #ffffff;
  box-shadow: 0 0 16px rgba(37, 99, 235, 0.4);
}
.navbar__name { font-size: 14px; font-weight: 600; letter-spacing: -0.02em; }

.crumb { font-size: 13px; color: var(--muted-2); }
.crumb__sep { color: var(--border-2); }
.crumb__current {
  font-size: 14px; font-weight: 500; color: var(--fg-1);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
}

.content__inner { padding: 0 28px 28px; max-width: var(--page-max-w); margin: 0 auto; }

.shell-layout { display: flex; min-height: 100vh; }
.shell-main { flex: 1 1 auto; min-width: 0; }

.app-sidebar {
  flex: none;
  width: 252px;
  position: sticky;
  top: 8px;
  height: calc(100vh - 16px);
  margin: 8px 0 8px 8px;
  overflow-y: auto;
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 20px 14px 16px;
  border: 1px solid var(--border-1);
  border-radius: var(--r-lg);
  background: var(--sidebar);
  box-shadow: var(--shadow-card);
}
@media (min-width: 1024px) {
  .app-sidebar { display: flex; }
}
.app-sidebar__top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 6px 18px;
}
.app-sidebar__logo {
  display: flex; align-items: center; gap: 8px;
  color: var(--fg-1);
}
.app-sidebar__nav { display: flex; flex-direction: column; gap: 10px; }
.app-sidebar__group { padding: 6px 0; }
.app-sidebar__group .label {
  padding: 8px 12px 4px;
  display: block;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted-2);
}
.navmenu__items { padding: 0; display: flex; flex-direction: column; gap: 2px; }

.navitem {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 12px;
  border-radius: var(--r-md);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--fg-2);
  cursor: pointer;
  background: transparent;
  border: 0;
  width: 100%;
  text-align: left;
  transition: all .15s ease;
}
.navitem:hover { background: var(--hover); color: var(--fg-1); }
.navitem.is-active {
  background: var(--active);
  color: var(--fg-1);
  font-weight: 600;
}
.navitem__count {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--active);
  color: var(--fg-1);
}
.navitem__count--alert {
  background: var(--red-tint);
  color: var(--red);
  font-weight: 700;
}

.btn--icon { padding: 7px 9px; font-size: 14px; line-height: 1; }

.btn {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--font-sans);
  font-size: 13px; font-weight: 500;
  padding: 7px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--border-1);
  background: var(--card-tone);
  color: var(--fg-1);
  cursor: pointer;
  transition: all .15s ease;
}
.btn:hover { border-color: var(--border-2); color: var(--fg-1); background: var(--hover); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn--primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 18px rgba(37, 99, 235, 0.35);
}
.btn--primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  color: #ffffff;
  box-shadow: 0 6px 26px rgba(37, 99, 235, 0.55);
  transform: translateY(-1px);
}

.btn--fonte-active {
  background: linear-gradient(135deg, rgba(34, 197, 94, .24), rgba(34, 197, 94, .08));
  border-color: rgba(34, 197, 94, .65);
  color: #4ade80;
  animation: fonte-pulse 2.2s ease-in-out infinite;
}
.btn--fonte-active:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, .32), rgba(34, 197, 94, .12));
  border-color: #22c55e;
  color: #4ade80;
}
@keyframes fonte-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, .3); }
  50% { box-shadow: 0 0 10px 2px rgba(34, 197, 94, .3); }
}
@media (prefers-reduced-motion: reduce) {
  .btn--fonte-active { animation: none; }
}

.pagination {
  display: flex; align-items: center; gap: 4px;
  font-family: var(--font-mono);
}
.pagination__btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 32px; height: 32px;
  padding: 0 6px;
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}
.pagination__btn:hover:not(:disabled) { background: var(--hover); color: var(--fg-1); }
.pagination__btn:disabled, .pagination__btn[aria-disabled] { opacity: .35; cursor: not-allowed; }
.pagination__btn.is-active {
  background: var(--card-tone);
  border-color: var(--border-2);
  color: var(--fg-1);
}
.pagination__ellipsis {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 32px; height: 32px;
  color: var(--muted-2);
}

.input {
  display: flex; align-items: center; gap: 8px;
  background: var(--card-tone);
  border: 1px solid var(--border-1);
  border-radius: var(--r-md);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--fg-1);
}
.input:hover { border-color: var(--border-2); }
.input input {
  background: transparent;
  border: 0;
  outline: 0;
  flex: 1;
  min-width: 0;
  color: var(--fg-1);
  font-size: 13px;
}
.input input::placeholder { color: var(--muted-2); }
.input__kbd {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--muted-2);
  border: 1px solid var(--border-1);
  border-radius: 4px;
  padding: 1px 5px;
}

.palette__backdrop {
  position: fixed; inset: 0; z-index: 20;
  background: rgba(9, 9, 11, 0.7);
  display: flex; justify-content: center;
  padding-top: 14vh;
}
.palette {
  width: 620px; max-width: 90vw;
  height: fit-content;
  max-height: 70vh;
  background: var(--card-tone);
  border: 1px solid var(--border-2);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-modal);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.palette__input {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-1);
}
.palette__input input {
  flex: 1; min-width: 0;
  background: transparent; border: 0; outline: 0;
  color: var(--fg-1); font-size: 14px;
}
.palette__input input::placeholder { color: var(--muted-2); }
.palette__list { overflow-y: auto; }
.palette__row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px; cursor: pointer;
  border: 0; background: transparent; width: 100%; text-align: left;
  color: var(--fg-2); font-size: 13px;
}
.palette__row:hover, .palette__row.is-active { background: var(--hover); }
.palette__group { margin-left: auto; font-size: 12px; color: var(--muted-2); }
.palette__empty { padding: 18px 16px; font-size: 13px; color: var(--muted-2); }

@keyframes shimmer { 0% { background-position: -320px 0; } 100% { background-position: 320px 0; } }
.skeleton {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--hover) 0%, var(--skeleton-shine) 50%, var(--hover) 100%);
  background-size: 320px 100%;
  animation: shimmer 1.4s linear infinite;
}

@keyframes dash { to { stroke-dashoffset: -40; } }
.edge          { stroke: var(--muted); stroke-width: 1.6; opacity: .55; }
.edge--in      { stroke: var(--green); }
.edge--cycle   { stroke: var(--red); stroke-width: 2.4; stroke-dasharray: 8 6; animation: dash 1.2s linear infinite; }
.node          { fill: var(--card-tone); stroke: #52525b; }
.node--focus   { stroke: var(--accent); stroke-width: 2; }
.node--flagged { stroke: var(--red); stroke-width: 1.8; }

}

@media print {
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 14mm 14mm;
  }

  *, *::before, *::after {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  body {
    background: #ffffff !important;
    color: #0f172a !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .print\:hidden {
    display: none !important;
  }

  .print\:border-none {
    border: none !important;
  }

  .print\:shadow-none {
    box-shadow: none !important;
  }

  .print\:p-0 {
    padding: 0 !important;
  }

  .print\:my-0 {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .print\:bg-white {
    background: #ffffff !important;
  }

  .print\:text-black {
    color: #000000 !important;
  }

  .print\:break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  .print\:break-before-page {
    break-before: page !important;
    page-break-before: always !important;
  }

  table {
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }

  .print-watermark {
    position: fixed;
    top: 40%;
    left: -15%;
    width: 130%;
    text-align: center;
    transform: rotate(-30deg);
    font-size: 34px;
    font-weight: 800;
    color: rgba(225, 29, 72, 0.16) !important;
    text-transform: uppercase;
    letter-spacing: 5px;
    pointer-events: none;
    z-index: 99999;
    border: 3px dashed rgba(225, 29, 72, 0.22);
    padding: 12px 0;
  }
}
```

---

## 4. Código Completo da Página Principal (`web/src/app/page.tsx`)

```tsx
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
```

---

## 5. Documentação Analítica do Front-End

### 5.1 Arquitetura de Renderização (Next.js 16 App Router)
- **Hibridismo RSC (React Server Components) + Ilhas Interativas**:
  - As páginas (`page.tsx`) atuam prioritariamente como **Server Components**, consultando o banco de dados diretamente via consultas SQL tipadas do `queries.ts`.
  - Componentes de alta reatividade são isolados com a diretiva `"use client"` (ex: `command-palette.tsx`, `candidate-search-slot.tsx`, `graph-canvas.tsx`).
- **Zero Flash de Tema**: No `layout.tsx`, um script síncrono injetado no `<head>` lê o `localStorage("theme")` e define o atributo `data-theme` antes mesmo da hidratação do React, evitando qualquer flicker visual em telas OLED/dark mode.

### 5.2 Sistema de Design & Identidade Visual
- **Tipografia**:
  - `Inter` (sans-serif) para leitura textual fluida e títulos com kerning negativo (`tracking-tight`).
  - `JetBrains Mono` para dados periciais, números com alinhamento tabular (`tabular-nums`), CNPJs, CPFs e hashes criptográficos.
- **Paleta de Cores Primária (Modo Escuro Padrão)**:
  - Fundo principal: `--bg: #070913` (azul escuro profundo/noturno, mais legível e corporativo que preto puro).
  - Superfícies e Cards: `--surface: #0d1226`, `--card-tone: #121933`.
  - Destaque/Acentos: `--accent: #2563eb` (azul royal elétrico), `--accent-2: #93c5fd` (azul glacial).
  - Alertas Semânticos: `--green: #22c55e` (doações lícitas e conformidade), `--red: #f43f5e` (anomalias, doações circulares), `--gold: #f59e0b` (fornecedores em comum).
- **Assinaturas Visuais Exclusivas**:
  - `card-dot`: 4 marcadores geométricos nos vértices dos cards que conferem aspecto de terminal de inteligência/auditoria.
  - `pill-tech`: indicador técnico de procedência com ponto colorido pulsante.
  - `source-zone`: modo de auditoria com laser rotativo em CSS (`@property --laser-angle`) que destaca o dado oficial de origem ao passar o mouse.

### 5.3 Shell de Navegação
- **Sidebar Fixa com Perfil no Rodapé**:
  - Largura de 252px, exibindo logotipo oficial, links rápidos (`Início`, `Comparador`, `Grafo`, `Bens`, `Emendas`) e bloco de `Sinais`.
  - No rodapé da barra lateral, o card **Eletto Pro** convida ao upgrade, e o componente `SidebarUserProfile` abre um popover elegante para cima com controle de conta e alternador de plano de desenvolvimento.
- **Topbar Translúcida**:
  - Barra flutuante com desfoque de fundo (`backdrop-filter: blur(12px)`), migalhas de pão dinâmicas (`PageHeader`) e alternador de tema claro/escuro.
- **Paleta de Comandos (`Ctrl + K`)**:
  - Modal instantâneo acionado pelo teclado que permite buscar qualquer político no banco ou navegar imediatamente entre as páginas do sistema.
