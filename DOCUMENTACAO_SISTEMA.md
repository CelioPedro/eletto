# Documentação Completa do Sistema Eletto (Inteligência Eleitoral & Compliance)

---

## 1. Visão Geral e Posicionamento de Mercado

O **Eletto** é uma plataforma SaaS de alta precisão desenhada para transformar dados públicos dispersos em **inteligência estratégica acionável**, **compliance rigoroso** e **provas jurídicas eleitorais**.

### 1.1 Público-Alvo
- **Escritórios de Advocacia Eleitoral**: instrução rápida de Ações de Investigação Judicial Eleitoral (AIJE), Ações de Impugnação de Mandato Eletivo (AIME), representações por excesso de doação e defesas em prestações de contas.
- **Coordenações de Campanha & Estrategistas**: módulo de *Opposition Research* para desmascarar conexões ocultas de adversários, fornecedores compartilhados e financiamento duplo.
- **Jornalismo Investigativo**: auditoria de desvios, triangulação de recursos públicos (Fundão Eleitoral) e detecção de empresas de fachada.
- **Departamentos de Compliance e Relações Governamentais (RelGov)**: prevenção de riscos regulatórios, monitoramento de doadores e relacionamento de agentes públicos com fornecedores privados.

---

## 2. Arquitetura Técnica & Stack de Engenharia

```mermaid
flowchart TD
    subgraph Frontend["Frontend & Client Layer (Next.js 16 + Turbopack)"]
        UI["Design System Dark Corporate (Tailwind + shadcn)"]
        Components["Componentes Modulares & Reativos"]
        Shell["Sidebar + Topbar + Command Palette (Ctrl+K)"]
    end

    subgraph AppRouter["Next.js App Router (Server & Client Islands)"]
        R_Politico["/politico/[id] (Perfil Completo)"]
        R_Dossie["/politico/[id]/dossie (Dossiê SHA-256)"]
        R_Peca["/politico/[id]/peca-juridica (Minutas IA)"]
        R_Comparador["/comparador (Opposition Research)"]
        R_Sinais["/sinais/* (Detecção de Anomalias)"]
        R_Grafo["/grafo (Grafo de Rede)"]
        R_Planos["/planos & /checkout/sucesso (Stripe)"]
    end

    subgraph BackendAPI["Rotas de API & Processamento"]
        API_Search["/api/search (Busca Rápida)"]
        API_Checkout["/api/checkout/create-session (Stripe)"]
        API_Auth["/api/auth/* (Controle de Sessão e Planos)"]
        API_Graph["/api/graph-* (Cálculo de Rede)"]
    end

    subgraph DatabaseLayer["Camada de Dados & Persistência"]
        PG["PostgreSQL 16+ (Local / Supabase / AWS RDS)"]
        Pool["Pool Customizado (pg) com Type Parsers"]
        LRU["Cache em Memória (LRU Cache)"]
    end

    Frontend --> AppRouter
    AppRouter --> BackendAPI
    BackendAPI --> DatabaseLayer
    AppRouter --> DatabaseLayer
```

### 2.1 Especificações da Stack
- **Framework Web**: [Next.js 16](https://nextjs.org) (App Router com renderização híbrida SSR/Server Components e Turbopack).
- **Linguagem**: TypeScript com checagem estrita de tipos (`tsc --noEmit`).
- **Banco de Dados**: PostgreSQL com conector nativo `pg`, pool configurado para alta concorrência e parsers estritos para dados numéricos (`bigint` -> integer, `numeric` -> float).
- **Motor de Transpilação de SQL**: Abstração no arquivo [`web/src/lib/db.ts`](file:///c:/Users/celio/politics/elosys/web/src/lib/db.ts) que converte marcadores `?` em parâmetros indexados do Postgres (`$1, $2, ...`), possibilitando queries legíveis e seguras contra injeção de SQL.
- **Camada Visual**: Tailwind CSS v4, custom variants para modo escuro de alto contraste corporativo (`--bg: #070913`, `--card-tone: #121933`, `--accent: #2563eb`), ícones SVG em linha e microinterações de transição suave.
- **Gateway de Pagamento**: Stripe API (versão 2026), processando Stripe Checkout Sessions e upgrades automatizados.

---

## 3. Inventário Detalhado dos Módulos Implementados

### 3.1 Perfil Político Completo & Auditoria Financeira (`/politico/[id]`)
- **Cabeçalho Oficial**: Foto em alta resolução sincronizada com o CDN do TSE, cargo atual/pretendido, partido, número de urna, estado e resumo das últimas candidaturas.
- **Evolução Patrimonial Declarada**: Histórico de declarações de bens ao TSE com gráfico de curva patrimonial ano a ano e relação item a item (imóveis, veículos, contas bancárias, participações societárias).
- **Raio-X de Arrecadação e Despesas**:
  - Total de receitas discriminadas por tipo: doações de pessoas físicas, recursos próprios, transferências partidárias e Fundo Especial (FEFC).
  - Tabela detalhada de despesas contratadas, com agrupamento por categorias chave (publicidade, combustíveis, eventos, consultorias) e ranking de maiores fornecedores com CNPJ vinculado.
- **Emendas Parlamentares Vinculadas**: Identificação de emendas propostas pelo agente político, órgãos executores e empresas privadas beneficiárias.

### 3.2 Motor de Detecção de Sinais & Anomalias Eleitorais (`/sinais/*`)
O motor proprietário do Eletto analisa a base de dados através de regras analíticas pré-computadas e em tempo real:
1. **Doação Circular (`/sinais/doacao-circular`)**:
   - Detecta ciclos fechados de financiamento onde recursos saem de uma campanha para uma pessoa/empresa e retornam para outro agente interligado.
   - Renderização gráfica do ciclo interativo mostrando nós e setas de fluxo de caixa.
2. **Despesa Desproporcional (`/sinais/despesa-desproporcional`)**:
   - Algoritmo de desvio padrão em relação aos concorrentes do mesmo cargo e estado.
   - Identifica candidatos que gastaram porcentagens atípicas em itens como canetas, combustível ou serviços gráficos em comparação com seus pares.
3. **Sócio de Fornecedor (`/sinais/socio-fornecedor`)**:
   - Cruzamento entre a base de despesas de campanha e o Quadro de Sócios e Administradores (QSA) da Receita Federal.
   - Aponta contratos fechados com empresas onde o próprio candidato, familiares ou assessores diretos figuram no quadro societário.
4. **Análise de IA & Discurso (`/sinais/analise-ia` e `/sinais/discurso`)**:
   - Pareceres automatizados com pontuação de severidade (baixa, média, alta).
   - Monitoramento de narrativas e posicionamento em redes sociais.

### 3.3 Grafo Interativo de Correlações (`/grafo`)
- Visualização em rede conectando candidatos, partidos, doadores e fornecedores.
- Expansão dinâmica de nós com 1 clique (para investigar ramificações societárias e familiares).
- Filtros por intensidade de relação, ano e categoria de conexão.

### 3.4 Dossiê Pericial com Autenticidade Criptográfica SHA-256 (`/politico/[id]/dossie`)
- **Formatação Jurídico-Pericial**: Documento estruturado para instruir ações judiciais perante Tribunais Regionais Eleitorais (TREs) e TSE.
- **Hash Criptográfico de Integridade (SHA-256)**: Geração de hash SHA-256 calculado sobre os dados processados e registros de proveniência das fontes oficiais (data, hora, URL de extração e parser utilizado).
- **Papel Timbrado Customizável**:
  - Upload em tempo real de logotipo de escritório de advocacia ou comitê.
  - Dados institucionais (Nome do escritório, OAB do titular, CNPJ, endereço completo e telefone).
  - Rodapé pericial com aviso de responsabilidade probatória.
- **Síntese Executiva com IA**: Resumo condensado destacando em 3 parágrafos os pontos de maior vulnerabilidade jurídica do alvo.
- **Visualização de Impressão (Print-Ready)**: Layout otimizado para salvar em PDF sem elementos de navegação indesejados.

### 3.5 Bancada de Minutas Jurídicas com IA (`/politico/[id]/peca-juridica`)
- Assistente gerador de peças processuais eleitorais em conformidade com o CPC e a Lei 9.504/1997:
  - Representação por Doação Eleitoral Acima do Limite Legal (art. 23 da Lei das Eleições).
  - Ação de Investigação Judicial Eleitoral (AIJE) por Abuso de Poder Econômico (art. 22 da LC 64/90).
  - Ação de Impugnação de Mandato Eletivo (AIME) por Corrupção ou Fraude (art. 14, § 10 da CF/88).
  - Notícia de Fato / Notícia-Crime perante o Ministério Público Eleitoral (MPE).
- Editor interativo lado a lado com citação automática das provas colhidas na base do Eletto.

### 3.6 Módulo Comparador "Frente a Frente" (Opposition Research) (`/comparador`)
- **Seleção Dinâmica de Oponentes**:
  - Componente de busca reativa com *debounce* ([`CandidateSearchSlot`](file:///c:/Users/celio/politics/elosys/web/src/components/comparador/candidate-search-slot.tsx)), exibindo foto oficial do TSE, partido, cargo e estado.
  - Suporte total a parâmetros de URL compartilháveis (`/comparador?c1=...&c2=...`).
- **Interseção de Doadores (Quem financia os dois lados?)**:
  - Consulta SQL otimizada cruzando doadores pessoa física e jurídica comuns às campanhas de ambos os concorrentes.
  - Tabela com valores aportados para cada lado e barra proporcional de distribuição.
- **Interseção de Fornecedores (Empresas em comum)**:
  - Identificação de gráficas, produtoras de vídeo, agências de marketing e consultorias prestando serviço simultaneamente a adversários políticos declarados.
  - Links diretos para auditoria completa do CNPJ do fornecedor.
- **Placar Geral (Scorecard Proporcional)**:
  - Confronto direto de Patrimônio Declarado, Arrecadação Total, Despesas Contratadas, Fundo Eleitoral recebido e Alertas de Conformidade.
  - Barras visuais de proporção percentual e cálculo de discrepâncias absolutas.
- **Duelos Pré-configurados**:
  - Acesso com 1 clique a clássicos eleitorais com dados reais carregados no banco (ex: *Lula vs Bolsonaro*, *Guilherme Boulos vs Pablo Marçal*, *Tarcísio de Freitas vs Lula*).

### 3.7 Monetização, Planos e Checkout Stripe (`/planos` e `/checkout/sucesso`)
- **Tabela Comparativa de Planos**:
  - **Plano Gratuito**: Acesso a consultas básicas e limites padrão de busca.
  - **Plano Pro (R$ 397/mês)**: Dossiês periciais com SHA-256, comparador irrestrito, exportação em planilha e sem limites de busca.
  - **Plano Escritório / Campanha (R$ 1.890/mês)**: Multi-usuários, papel timbrado ilimitado e bancada de minutas jurídicas com IA.
- **Fluxo de Checkout**: Integração direta com o Stripe Checkout via rota de API [`/api/checkout/create-session`](file:///c:/Users/celio/politics/elosys/web/src/app/api/checkout/create-session/route.ts), com redirect seguro para a página oficial do Stripe e retorno automático para `/checkout/sucesso`, com atualização do plano do usuário no banco.
- **Gerenciador de Perfil no Rodapé da Barra Lateral**:
  - Componente [`SidebarUserProfile`](file:///c:/Users/celio/politics/elosys/web/src/components/auth/sidebar-user-profile.tsx) posicionado no rodapé da sidebar com popover expansivo para cima, exibindo nome, e-mail, badge do plano atual e alternador rápido para testes em ambiente de desenvolvimento.
- **Limpeza do Topbar**: Remoção de botões redundantes e correção definitiva de transbordamento horizontal.

---

## 4. Necessárias Futuras Implementações (Próximos Passos Obrigatórios)

As seguintes implementações são essenciais para garantir maturidade operacional, segurança jurídica e prontidão comercial completa do SaaS:

| # | Funcionalidade | Descrição Técnica & Objetivo | Prioridade |
|---|----------------|------------------------------|------------|
| 1 | **Motor Nativo de Exportação PDF Pericial** | Implementar geração de PDF no servidor (via `puppeteer`, `@react-pdf/renderer` ou `playwright`) para baixar dossiês e relatórios de comparação com paginação fixa, cabeçalho/rodapé e carimbo temporal criptográfico sem depender do diálogo `window.print()`. | **Crítica** |
| 2 | **Webhooks Assíncronos do Stripe (`/api/webhooks/stripe`)** | Criar endpoint de webhook com verificação de assinatura criptográfica (`stripe.webhooks.constructEvent`) para processar eventos em tempo real (`customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`), garantindo cancelamentos automáticos e gestão de inadimplência mesmo que o usuário feche o navegador no checkout. | **Crítica** |
| 3 | **Exportação Real de Planilhas (XLSX / CSV)** | Ativar o download efetivo das planilhas vinculadas ao componente `ExportProButton`. Usar a biblioteca `exceljs` para gerar planilhas estilizadas com múltiplas abas: *1. Resumo*, *2. Doadores Mútuos*, *3. Fornecedores*, *4. Alertas de Compliance*, com metadados e data de extração. | **Alta** |
| 4 | **Autenticação Persistente & Recuperação de Senha** | Adicionar fluxo formal de recuperação de senha por e-mail (usando Resend ou Postmark) e verificação de e-mail de novos usuários, substituindo o login dev simplificado. | **Alta** |
| 5 | **Exportação do Relatório do Comparador Frente a Frente** | Criar botão e template de exportação de um "Caderno de Opposition Research" consolidando os dados da tela `/comparador` para entrega a candidatos e debatedores antes de entrevistas e debates eleitorais. | **Média** |

---

## 5. Possíveis Implementações de Melhoria (Roadmap de Alto Valor)

Para elevar o Eletto à liderança indiscutível de inteligência política no Brasil, as seguintes melhorias estratégicas devem ser consideradas no roadmap:

### 5.1 Radar de Monitoramento Eleitoral & Alertas em Tempo Real
- **Conceito**: O usuário "segue" candidatos, partidos ou CNPJs de interesse.
- **Mecanismo**: Um cron job diário ou pipeline de ingestão verifica retificações de prestação de contas no TSE ou novas publicações de emendas. Se houver novidades, o sistema envia alerta imediato via **WhatsApp** (Twilio / Z-API) e **E-mail**.

### 5.2 Algoritmo de "Caminhos Mínimos" no Comparador (Pontes Ocultas)
- **Conceito**: No módulo `/comparador`, além de cruzar doadores e fornecedores diretos (1 grau), executar um algoritmo de busca em largura (BFS) ou Dijkstra no grafo para encontrar pontes indiretas em até 3 graus.
- **Exemplo de Revelação**: *"O Candidato A contratou a Agência X, cujo sócio é casado com a contadora que gerencia a gráfica contratada pelo Candidato B."*

### 5.3 Agrupamento por Grupo Econômico (Raiz do CNPJ)
- **Conceito**: Muitas empresas dividem notas entre filiais ou empresas coligadas para driblar tetos ou investigações de despesas desproporcionais.
- **Implementação**: Agrupar fornecedores pelos primeiros 8 dígitos do CNPJ (CNPJ Raiz). Assim, se um candidato contratou 5 filiais da mesma empresa, o sistema apresenta o faturamento consolidado do grupo econômico.

### 5.4 Módulo de Confronto Discurso vs. Votações / Emendas
- **Conceito**: Utilizar embeddings vetoriais (OpenAI / Gemini / pgvector) para comparar o posicionamento retórico do político nas redes sociais com a destinação real do seu dinheiro.
- **Exemplo**: Identificar discursos de defesa da saúde básica concomitantemente com destinação massiva de emendas para obras de pavimentação em bases eleitorais de empreiteiras doadoras.

### 5.5 Multi-tenancy & Gestão de Bancadas / Comitês
- **Conceito**: No Plano Escritório/Campanha, permitir que o administrador crie uma organização e convide advogados, assessores de imprensa e pesquisadores com níveis de permissão granulares (*Admin*, *Analista*, *Visualizador*).
- **Recurso adicional**: Caderno de anotações compartilhadas e tags privadas em cada dossiê (ex: *"Possível testemunha no caso X"*).

### 5.6 PWA Mobile Pericial ("Eletto Pocket")
- **Conceito**: Transformar a aplicação em Progressive Web App (PWA) instalável em smartphones e tablets iOS/Android, com cache offline de dossiês gerados.
- **Utilidade**: Permitir que assessores de palco em debates de televisão consultem dados de oponentes em segundos sem travar a navegação.

---

## 6. Guia de Manutenção e Comandos Operacionais

### 6.1 Rodar a Aplicação Localmente
```bash
# Entrar no diretório do Next.js
cd web

# Instalar dependências
npm install

# Compilar para produção
npm run build

# Iniciar servidor em porta personalizada
npm run start -- -p 3000
```

### 6.2 Variáveis de Ambiente Necessárias (`web/.env`)
```env
# Conexão com o banco PostgreSQL
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/elosys"

# Chaves oficiais do Stripe (modo de teste ou produção)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# URL base da aplicação
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Chaves de IA (Google Gemini ou OpenAI) para dossiês e minutas
GEMINI_API_KEY="..."
```

---

*Documentação gerada e atualizada em Outubro de 2026. Versão da plataforma: Eletto v2.4.*
