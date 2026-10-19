# Arquivo Histórico e Legado (Archive)

Este diretório armazena artefatos, protótipos e relatórios de versões e experimentos prévios do projeto para fins de preservação de histórico, sem interferir na aplicação ativa (**Eletto SaaS** em `/web`).

---

## Estrutura do Diretório

### 1. `prototypes/`
Contém protótipos e experimentos de interface criados nas fases iniciais do projeto:
- `EloSys.dc.html`: Protótipo estático monolítico inicial baseado em D3.js e componentes embrionários.
- `new-design/`: Mockups conceituais estáticos (HTML/CSS/tokens) de outubro de 2026.

### 2. `etl_reports/`
Registros históricos de execução dos crawlers do pipeline Python original (`elosys/cli.py`):
- Relatórios JSON de download e cruzamento (`tse_candidates_report.json`, `tse_accounts_report.json`, `receita_cnpj_report.json`, etc.).

### 3. `legacy_ads/` (Architecture Decision Records)
Registros de decisão arquitetural da fase inicial focada exclusivamente no banco SQLite local (`elosys.db`):
- Decisões de confiabilidade, imutabilidade, proveniência e resolução de identidade.
- *Nota: A arquitetura do sistema em produção agora adota PostgreSQL com Next.js 16 App Router (consulte `docs/` para a documentação técnica atualizada).*
