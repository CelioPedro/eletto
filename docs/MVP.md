# Documento de Produto Mínimo Viável (MVP) · Eletto

---

## 1. Visão Geral e Propósito do MVP

O **Eletto** é uma plataforma SaaS de alta precisão que transforma dados públicos dispersos da Justiça Eleitoral e da Receita Federal em **inteligência investigativa, compliance e provas periciais auditáveis** com fé pública.

### 1.1 O Problema Real
Advogados eleitoralistas, consultorias políticas e comitês de campanha perdem dezenas de horas baixando arquivos massivos de prestações de contas do TSE, cruzando planilhas despadronizadas e conferindo CNPJs na Receita Federal para instruir ações judiciais ou fazer inteligência competitiva (*Opposition Research*). Quando precisam juntar esses dados a um processo, enfrentam contestação por falta de carimbo de autenticidade ou rastreabilidade da fonte.

### 1.2 A Solução Entregue pelo MVP
Uma interface rápida, institucional e segura onde qualquer agente político, doador ou fornecedor é consultado em milissegundos, com visualização de anomalias financeiras e geração instantânea de **Dossiês Periciais com hash criptográfico SHA-256** e **Minutas Jurídicas redigidas por IA**.

---

## 2. Personas Atendidas no MVP

| Persona | Perfil | Principal Dor | Solução Eletto Utilizada |
|---|---|---|---|
| **Advogado Eleitoralista** | Sócio ou associado de banca eleitoral / parecerista | Demora para instruir petições e provar triangulações financeiras | Dossiê Pericial com SHA-256 e Minuta Jurídica com IA |
| **Coordenador de Campanha** | Estrategista de campanha majoritária ou proporcional | Falta de inteligência rápida sobre vulnerabilidades do adversário | Comparador Frente a Frente e Módulo de Grafo de Conexões |
| **Jornalista Investigativo** | Repórter de política ou redação de dados | Triangulação complexa do Fundo Eleitoral com empresas de fachada | Sinais de Alerta (Sócio-Fornecedor e Doação Circular) |
| **Oficial de Compliance / RelGov** | Jurídico e compliance de médias/grandes empresas | Risco de doações ilegais, sanções CEIS/CNEP e relacionamentos expostos | Consulta de CPF/CNPJ e Sanções Federais unificadas |

---

## 3. Matriz de Funcionalidades Ativas no MVP (Escopo Entregue)

### 3.1 Camada de Inteligência e Consulta
- [x] **Busca Universal Instantânea:** Pesquisa em milissegundos por nome civil, nome de urna, CPF ou CNPJ.
- [x] **Perfil 360º do Político (`/politico/[id]`):** Histórico de candidaturas (2014–2024), bens declarados, receitas, despesas contratadas, principais fornecedores e doadores.
- [x] **Reconciliação e Prova de Proveniência:** Cada número e gráfico exibe metadados de fé pública, origem do arquivo oficial do TSE e data/hora do cruzamento.
- [x] **Raio-X de Empresas (`/cnpj/[cnpj]`):** Quadro Societário (QSA), contratos de campanha, doações realizadas e alertas de sanções federais (CEIS/CNEP).
- [x] **Histórico de Doadores PF (`/cpf/[cpf]`):** Volume histórico de repasses e cruzamento com limites legais de doação eleitoral.

### 3.2 Módulos Investigativos Especializados
- [x] **Comparador de Candidatos (`/comparador`):** Confronto frente a frente de dois adversários políticos (evolução patrimonial, despesas e doações).
- [x] **Grafo de Redes e Relações (`/grafo`):** Visualização interativa da teia de doadores, fornecedores e conexões compartilhadas.
- [x] **Sinais de Alerta Forense (`/sinais/*`):**
  - *Sócio-Fornecedor:* Candidatos contratando empresas de seus próprios sócios ou parentes.
  - *Doação Circular:* Dinheiro circulando entre contas de campanha e pessoas ligadas.
  - *Despesa Desproporcional:* Concentração atípica de gastos em fornecedores únicos ou de fachada.
  - *Análise de Discurso e IA:* Triagem de inconsistências comportamentais e declarações públicas.

### 3.3 A "Killer Feature": Dossiê Pericial & Minutas IA
- [x] **Dossiê Pericial em PDF (`/politico/[id]/dossie`):** Relatório completo formatado para impressão A4, com protocolo, hash criptográfico SHA-256 e metodologia pericial.
- [x] **White-Label / Timbre Personalizado (Recurso PRO):** Advogados e peritos podem carregar o logotipo de sua banca e dados do perito responsável diretamente no cabeçalho do dossiê.
- [x] **Bancada de Minuta Jurídica com IA (`/politico/[id]/peca-juridica`):** Geração assistida por IA (Google Gemini) de Notícias-Crime, Representações Eleitorais e AIJEs com fatos já preenchidos.

### 3.4 Infraestrutura de SaaS & Monetização
- [x] **Autenticação Segura:** Cadastro, login, hashing `scryptSync` com salt e proteção contra timing attack via cookies `httpOnly`.
- [x] **Paywall Suave & Modelos de Assinatura:**
  - Plano Gratuito: Consultas básicas e visão preliminar de alertas.
  - Plano Pro (Mensal / Anual) & Dossiê Avulso: Integração completa com **Stripe Checkout**.
  - Modal de Upgrade integrado aos botões de exportação e personalização.

---

## 4. O que Ficou Fora do MVP (Limites Deliberados)

Para viabilizar o lançamento ágil com foco em tração imediata, os seguintes itens foram conscientemente postergados para a V2:
1. *Aplicativo nativo para iOS/Android* (a aplicação web é 100% responsiva para uso no smartphone/tablet).
2. *Scraping automatizado de redes sociais em tempo real* (utilizamos apenas os dados oficiais declarados ao TSE).
3. *Robô de monitoramento de Diários Oficiais estaduais* (planejado para a Fase de Retenção B2B).
4. *API Enterprise com documentação pública Swagger* (será comercializada sob demanda no modelo customizado).

---

## 5. Métricas de Sucesso e Validação do MVP

- **North Star Metric (Métrica Norte):** *Dossiês Periciais Gerados e Exportados*.
  - Indica que o usuário encontrou valor real e está utilizando o documento para tomada de decisão ou processo judicial.
- **Métrica de Conversão Primária:** % de visitantes que buscam um político e clicam em "Dossiê Pericial" ou "Exportar Planilha".
- **Métrica de Monetização:** Vendas de Dossiês Avulsos e Assinaturas Pro confirmadas no Stripe.
- **Validação de Retenção:** Advogados que retornam para gerar dossiês de múltiplos alvos na mesma semana.
