# Eletto · Inteligência Eleitoral & Auditoria Forense

Plataforma SaaS de alta precisão que transforma dados públicos dispersos da Justiça Eleitoral e da Receita Federal em **inteligência investigativa, compliance e provas periciais auditáveis** com fé pública.

---

## ⚡ Visão Geral

O **Eletto** cruza registros oficiais do Tribunal Superior Eleitoral (TSE), Receita Federal (QSA/CNPJ) e Portal da Transparência (Emendas e Sanções CEIS/CNEP), organizando o histórico completo de candidaturas, evolução patrimonial, fornecedores e doadores em um painel institucional de alta performance.

> **Aviso Legal:** As informações geradas pelo Eletto constituem indícios e elementos de convicção técnica com base em fontes públicas oficiais, destinadas à instrução pericial, jornalística e jurídica por profissionais habilitados. Cada dado exibe sua cadeia de proveniência pública e carimbo de data/hora.

---

## ✨ Principais Funcionalidades

- **📄 Dossiê Pericial com Fé Pública (PDF):** Laudo completo para impressão em formato A4, com hash criptográfico SHA-256 de autenticidade, protocolo único e suporte a **Timbre White-Label** para bancas de advocacia.
- **⚖️ Minuta Jurídica com IA:** Geração automática assistida por Inteligência Artificial (Google Gemini) de Notícias-Crime, Representações Eleitorais e petições de AIJE com fatos e tabelas financeiras já preenchidas.
- **👥 Comparador "Frente a Frente":** Módulo de *Opposition Research* para confronto direto de receitas, despesas, doadores e patrimônio entre dois adversários políticos.
- **🕸️ Grafo de Conexões & Redes:** Visualizador vetorial de topologia de relações entre candidatos, doadores e fornecedores em comum.
- **🚨 Sinais de Alerta Forense:** Detecção de doações circulares, empresas contratadas pertencentes a sócios de campanha e concentração atípica de gastos.
- **💳 Monetização Eletto Pro:** Gestão de planos com integração completa ao **Stripe Checkout** (Dossiê Avulso, Plano Mensal, Anual e Escritório).

---

## 🛠️ Stack Tecnológica

- **Frontend & App Router:** [Next.js 16](https://nextjs.org/) (com motor Turbopack e React 19).
- **Estilização & Design System:** Tailwind CSS v4, componentes suíços/institucionais de alta densidade informativa, Dark Mode nativo e ícones [Lucide](https://lucide.dev/).
- **Banco de Dados:** PostgreSQL com índices otimizados para busca textual rápida e agregações financeiras.
- **Inteligência Artificial:** Google Gemini (IA generativa para elaboração de minutas e sínteses forenses).
- **Pagamentos & Billing:** Stripe API (Sessões de Checkout com validação de status de pagamento).
- **Pipeline de Ingestão de Dados:** Python (módulos em `elosys/` para coleta e tratamento de dados brutos do TSE/Receita).

---

## 📁 Estrutura do Repositório

```text
├── web/                  # Aplicação web principal Next.js 16 (App Router, UI, APIs e Stripe)
├── database/             # Scripts SQL de criação de tabelas e índices PostgreSQL
├── elosys/               # Módulos Python de ETL, crawlers e detecção de regras
├── docs/                 # Documentação oficial de negócio, produto e engenharia
│   ├── MVP.md            # Especificação de Produto Mínimo Viável
│   ├── MDV.md            # Mínima Distribuição Viável (Go-To-Market Lean)
│   ├── COMERCIAL_E_ESCALA.md # Modelos de precificação, Unit Economics e escala
│   ├── DOCUMENTACAO_SISTEMA.md # Diagrama e arquitetura sistêmica
│   └── DOCUMENTACAO_FRONTEND.md # Design system e mapeamento de componentes
├── archive/              # Histórico isolado de protótipos antigos e relatórios de execução
├── manifest.json         # Manifesto criptográfico de proveniência das fontes de dados
└── pyproject.toml        # Configuração do ambiente e dependências Python
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 20+ e npm
- PostgreSQL 15+ com as tabelas criadas (scripts em `database/`)

### 2. Configurar a Aplicação Web
Navegue até o diretório `web/` e instale as dependências:

```bash
cd web
npm install
```

Configure as variáveis de ambiente no arquivo `web/.env`:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/elosys
GEMINI_API_KEY=sua_chave_gemini_aqui
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Iniciar o Servidor
Para ambiente de desenvolvimento:
```bash
npm run dev
```

Para compilação e execução de produção local:
```bash
npm run build
npm run start -- -p 3000
```

Acesse em seu navegador: **`http://localhost:3000`**.

---

## 📖 Documentação Estratégica Completa

Para aprofundar na estratégia do projeto, consulte a pasta [`docs/`](file:///c:/Users/celio/politics/elosys/docs):
- [**Produto (MVP)**](file:///c:/Users/celio/politics/elosys/docs/MVP.md): Escopo detalhado da versão lançada e personas.
- [**Distribuição (MDV)**](file:///c:/Users/celio/politics/elosys/docs/MDV.md): Estratégia de tração orgânica inicial e abordagem B2B.
- [**Comercial e Escala**](file:///c:/Users/celio/politics/elosys/docs/COMERCIAL_E_ESCALA.md): Precificação, Unit Economics e crescimento.
