# Documentação Estratégica do EloSys SaaS

Bem-vindo à documentação completa de planejamento, estruturação comercial e arquitetura técnica para a transformação do **EloSys** em uma plataforma SaaS comercial de auditoria e inteligência eleitoral.

---

## 📚 Índice de Documentos

1. [**01_VISAO_E_NEGOCIOS.md**](file:///c:/Users/celio/politics/elosys/docs/01_VISAO_E_NEGOCIOS.md)
   - O Problema de Mercado e Proposta de Valor
   - Análise de ICPs (Campanhas, Escritórios de Advocacia, Compliance e Imprensa)
   - Tabela de Precificação e Modelos de Assinatura
   - Pacotes Sazonais de Campanha Eleitoral (Ticket Alto)
   - Estratégia de Go-to-Market e Aquisição de Clientes

2. [**02_ARQUITETURA_TECNICA_E_INFRA.md**](file:///c:/Users/celio/politics/elosys/docs/02_ARQUITETURA_TECNICA_E_INFRA.md)
   - Arquitetura de Nuvem (Next.js 15, PostgreSQL 18, Redis, BullMQ)
   - Estratégia de Multi-Tenancy (Schema Analítico Read-Only + Schema SaaS Operacional)
   - Autenticação e Gestão de Usuários (Clerk / Auth.js)
   - Integração com Gateways de Pagamento (Asaas / Stripe / PIX)
   - Dimensionamento de Infraestrutura e Custos Reais (~R$ 150/mês)

3. [**03_ROADMAP_PRODUTO_E_FEATURES.md**](file:///c:/Users/celio/politics/elosys/docs/03_ROADMAP_PRODUTO_E_FEATURES.md)
   - Fase 1: MVP Comercializável (Paywall, Checkout PIX, Deploy em Nuvem)
   - Fase 2: A "Killer Feature" (Dossiê Pericial em PDF e Landing Page)
   - Fase 3: Retenção B2B (Comparador de Candidatos e Alertas/Watchlist)
   - Fase 4: Inteligência Avançada e API Enterprise de Compliance
   - Matriz de Priorização (Esforço vs. Impacto)

4. [**04_JURIDICO_LGPD_E_COMPLIANCE.md**](file:///c:/Users/celio/politics/elosys/docs/04_JURIDICO_LGPD_E_COMPLIANCE.md)
   - Enquadramento Legal na LGPD (Bases legais e dados manifestamente públicos)
   - Lei de Acesso à Informação (LAI) e Lei das Eleições
   - Minimização de Danos e Mascaramento de CPF
   - Cláusulas Obrigatórias de Isenção de Responsabilidade ("Indício não é prova")

---

## 🚀 Próximo Passo Prático Recomendado

Para colocar a estratégia em prática rapidamente sem dispersar esforços:
1. **Fase 1 (Sprints 1 e 2):** Implementar o schema `saas` no PostgreSQL e a tela de autenticação/bloqueio suave de paywall.
2. **Feature Imediata de Alto Valor:** Criar a rota de geração do **Dossiê em PDF** (que viabiliza tanto a venda avulsa via PIX por R$ 79 quanto a atração de assinantes Pro).
