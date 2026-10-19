-- Elosys SQLite schema.


-- PROVENANCE: source -> collection -> collection_file -> parse -> record

CREATE TABLE IF NOT EXISTS source (
    id BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL,          -- 'TSE - consulta_cand'
    agency      TEXT NOT NULL,          -- 'Tribunal Superior Eleitoral'
    type        TEXT NOT NULL,          -- 'csv' | 'api' | 'scraping'
    base_url    TEXT NOT NULL,
    legal_basis TEXT,                   -- rule/decision that makes the data public
    notes       TEXT,
    created_at  TEXT NOT NULL,
    UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS collection (
    id BIGSERIAL PRIMARY KEY,
    source_id        BIGINT NOT NULL REFERENCES source(id),
    url              TEXT NOT NULL,      -- full URL accessed
    http_status      BIGINT,
    accessed_at      TEXT NOT NULL,      -- when WE accessed it (UTC)
    payload_sha256   TEXT NOT NULL,      -- hash of the file as downloaded (the .zip)
    size_bytes       BIGINT NOT NULL,
    content_type     TEXT,
    collector_commit TEXT,               -- git SHA of the collecting code
    notes            TEXT
);

CREATE TABLE IF NOT EXISTS collection_file (
    id BIGSERIAL PRIMARY KEY,
    collection_id BIGINT NOT NULL REFERENCES collection(id),
    filename      TEXT NOT NULL,         -- 'consulta_cand_2022_BRASIL.csv'
    sha256        TEXT NOT NULL,
    size_bytes    BIGINT NOT NULL,
    UNIQUE (collection_id, filename)
);

CREATE TABLE IF NOT EXISTS parse (
    id BIGSERIAL PRIMARY KEY,
    collection_id      BIGINT NOT NULL REFERENCES collection(id),
    collection_file_id BIGINT REFERENCES collection_file(id),  -- NULL = the whole collection
    parser_name        TEXT NOT NULL,    -- 'tse.candidates'
    parser_commit      TEXT,
    parser_version     TEXT NOT NULL,
    rows_extracted     BIGINT NOT NULL DEFAULT 0,
    rows_rejected      BIGINT NOT NULL DEFAULT 0,
    run_at             TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS record_sources (
    table_name TEXT NOT NULL,
    record_id  BIGINT NOT NULL,
    field      TEXT,                     -- NULL = the whole row
    parse_id   BIGINT NOT NULL REFERENCES parse(id),
    -- Composite PK replaced by unique index below
);

-- IDENTITY (see ADs/identidade.md)

CREATE TABLE IF NOT EXISTS people (
    id BIGSERIAL PRIMARY KEY,
    cpf            TEXT,                  -- 11 digits;

CREATE TABLE IF NOT EXISTS rejected_cpf (
    cpf                TEXT PRIMARY KEY,
    reason             TEXT NOT NULL,   -- 'multiple_voter_ids' | 'voter_id_multiple_cpf'
    distinct_voter_ids BIGINT,
    distinct_names     BIGINT,
    recorded_at        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    cnpj       TEXT NOT NULL UNIQUE,     -- 14 digits
    legal_name TEXT,
    kind       TEXT,                     -- 'campaign' (natureza jurídica 409-4) | ...
    created_at TEXT NOT NULL
);

-- DATA: campaign finance - prestação de contas eleitorais

CREATE TABLE IF NOT EXISTS campaign_org (
    id BIGSERIAL PRIMARY KEY,
    company_id       BIGINT NOT NULL REFERENCES companies(id),
    person_id        BIGINT REFERENCES people(id),
    cnpj             TEXT NOT NULL,          -- NR_CNPJ_PRESTADOR_CONTA
    tse_candidacy_id TEXT,                   -- SQ_CANDIDATO -> politician_history
    accountant_id    TEXT,                   -- SQ_PRESTADOR_CONTAS
    year             BIGINT NOT NULL,
    candidate_cpf    TEXT,
    candidate_name   TEXT,
    normalized_name  TEXT,
    office           TEXT,
    party_abbr       TEXT,
    state            TEXT,
    provenance_id    BIGINT NOT NULL REFERENCES parse(id),
    collected_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS campaign_donation (
    id BIGSERIAL PRIMARY KEY,
    campaign_org_id        BIGINT REFERENCES campaign_org(id),  -- backfilled after campaign_org;

CREATE TABLE IF NOT EXISTS campaign_expense (
    id BIGSERIAL PRIMARY KEY,
    campaign_org_id           BIGINT REFERENCES campaign_org(id),
    cnpj                      TEXT NOT NULL,     -- NR_CNPJ_PRESTADOR_CONTA (paying campaign)
    tse_candidacy_id          TEXT,              -- SQ_CANDIDATO (who spent it)
    year                      BIGINT NOT NULL,
    tse_expense_id            TEXT,              -- SQ_DESPESA
    document_type             TEXT,              -- DS_TIPO_DOCUMENTO (nota fiscal, fatura...)
    document_number           TEXT,              -- NR_DOCUMENTO
    expense_date              TEXT,              -- DT_DESPESA, ISO
    amount_cents              BIGINT,           -- VR_DESPESA_CONTRATADA
    origin                    TEXT,              -- DS_ORIGEM_DESPESA (categoria do gasto)
    description                TEXT,             -- DS_DESPESA
    supplier_cpf_cnpj          TEXT,             -- NR_CPF_CNPJ_FORNECEDOR, raw digits (11 or 14)
    supplier_name               TEXT,            -- NM_FORNECEDOR, as declared
    supplier_name_rfb            TEXT,           -- NM_FORNECEDOR_RFB, per Receita registry
    supplier_type                 TEXT,          -- DS_TIPO_FORNECEDOR (pessoa física/jurídica)
    supplier_cnae                  TEXT,         -- DS_CNAE_FORNECEDOR
    supplier_state                  TEXT,        -- SG_UF_FORNECEDOR
    supplier_municipality             TEXT,      -- NM_MUNICIPIO_FORNECEDOR
    supplier_tse_candidacy_id         TEXT,      -- SQ_CANDIDATO_FORNECEDOR, when supplier is a candidate
    supplier_party_abbr               TEXT,      -- SG_PARTIDO_FORNECEDOR
    supplier_person_id        BIGINT REFERENCES people(id),     -- only when supplier is a known candidate
    supplier_company_id       BIGINT REFERENCES companies(id),  -- only when supplier_cpf_cnpj has 14 digits
    provenance_id              BIGINT NOT NULL REFERENCES parse(id),
    collected_at                TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pessoa_fisica_search (
    cpf TEXT,
    name TEXT
);

CREATE TABLE IF NOT EXISTS campaign_expense_payment (
    id BIGSERIAL PRIMARY KEY,
    campaign_expense_id   BIGINT REFERENCES campaign_expense(id),  -- backfilled via SQ_DESPESA
    tse_expense_id        TEXT,              -- SQ_DESPESA (-> campaign_expense)
    tse_installment_id    TEXT,              -- SQ_PARCELAMENTO_DESPESA
    accountant_id         TEXT,              -- SQ_PRESTADOR_CONTAS
    year                  BIGINT NOT NULL,
    state                 TEXT,              -- SG_UF
    document_type         TEXT,              -- DS_TIPO_DOCUMENTO
    document_number       TEXT,              -- NR_DOCUMENTO
    payment_date          TEXT,              -- DT_PAGTO_DESPESA, ISO
    amount_cents          BIGINT,           -- VR_PAGTO_DESPESA
    source                TEXT,              -- DS_FONTE_DESPESA
    origin                TEXT,              -- DS_ORIGEM_DESPESA
    nature                TEXT,              -- DS_NATUREZA_DESPESA
    species               TEXT,              -- DS_ESPECIE_RECURSO
    description           TEXT,              -- DS_DESPESA
    provenance_id         BIGINT NOT NULL REFERENCES parse(id),
    collected_at          TEXT NOT NULL
);

-- DATA: declared social media - rede_social_candidato

CREATE TABLE IF NOT EXISTS social_media (
    id BIGSERIAL PRIMARY KEY,
    person_id        BIGINT REFERENCES people(id),
    tse_candidacy_id TEXT NOT NULL,          -- SQ_CANDIDATO -> politician_history
    year             BIGINT NOT NULL,
    state            TEXT,                   -- SG_UF
    platform         TEXT NOT NULL,          -- 'facebook' | 'instagram' | 'x' | 'youtube' | 'tiktok' | 'website' | 'other'
    url              TEXT NOT NULL,          -- DS_URL, as declared
    order_in_source  BIGINT,                -- NR_ORDEM_REDE_SOCIAL
    provenance_id    BIGINT NOT NULL REFERENCES parse(id),
    collected_at     TEXT NOT NULL
);

-- DATA: politician history (see ADs/politician.md)

CREATE TABLE IF NOT EXISTS politician_history (
    id BIGSERIAL PRIMARY KEY,
    person_id        BIGINT NOT NULL REFERENCES people(id),

    cpf              TEXT,               -- NULL when masked (2024) or dropped as ambiguous
    cpf_trusted      BIGINT NOT NULL,
    voter_id         TEXT,               -- NR_TITULO_ELEITORAL_CANDIDATO
    ballot_name      TEXT,               -- NM_URNA_CANDIDATO
    full_name        TEXT,
    normalized_name  TEXT,

    tse_candidacy_id TEXT,               -- SQ_CANDIDATO (unique per election/round)

    year             BIGINT NOT NULL,
    election_type    TEXT,
    round            BIGINT,
    office           TEXT,               -- DS_CARGO
    candidate_number TEXT,
    party_abbr       TEXT,
    party_name       TEXT,
    party_number     TEXT,
    state            TEXT,               -- SG_UF
    electoral_unit   TEXT,               -- SG_UE
    municipality     TEXT,               -- NM_UE (municipal offices)
    candidacy_status TEXT,               -- DS_SITUACAO_CANDIDATURA
    candidacy_status_detail TEXT,        -- DS_DETALHE_SITUACAO_CAND
    result           TEXT,               -- DS_SIT_TOT_TURNO (elected / not elected / ...)

    birth_date       TEXT,
    gender           TEXT,
    education        TEXT,
    marital_status   TEXT,
    race             TEXT,
    occupation       TEXT,

    provenance_id    BIGINT NOT NULL REFERENCES parse(id),
    collected_at     TEXT NOT NULL
);

-- DERIVED DATA: detection rules (see ADs/dados_derivados.md)

CREATE TABLE IF NOT EXISTS rule_run (
    id BIGSERIAL PRIMARY KEY,
    rule           TEXT NOT NULL,          -- 'disproportionate_expense'
    rule_version   TEXT NOT NULL,          -- '1.0'
    code_commit    TEXT,                   -- git SHA of the code that ran
    params         TEXT,                   -- JSON: thresholds/keywords used
    run_at         TEXT NOT NULL,
    rows_generated BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS signal (
    id BIGSERIAL PRIMARY KEY,
    rule_run_id  BIGINT NOT NULL REFERENCES rule_run(id),
    type         TEXT NOT NULL,             -- 'cheap_item_high_value'
    severity     TEXT NOT NULL,             -- 'low' | 'medium' | 'high'
    explanation  TEXT NOT NULL,             -- human-readable, in the same signal row
    amount_cents BIGINT,                   -- optional: money the signal is about, for sorting -- meaning is rule-specific (a single expense, a total cycle, ...);

CREATE TABLE IF NOT EXISTS signal_actor (
    signal_id BIGINT NOT NULL REFERENCES signal(id),
    type      TEXT NOT NULL,               -- 'person' | 'company'
    actor_id  BIGINT NOT NULL,            -- people.id or companies.id
    role      TEXT NOT NULL,               -- 'candidate' | 'supplier' | 'donor' | ...
    PRIMARY KEY (signal_id, type, actor_id, role)
);

CREATE TABLE IF NOT EXISTS signal_evidence (
    signal_id  BIGINT NOT NULL REFERENCES signal(id),
    table_name TEXT NOT NULL,              -- 'campaign_expense'
    record_id  BIGINT NOT NULL,
    PRIMARY KEY (signal_id, table_name, record_id)
);

CREATE TABLE IF NOT EXISTS signal_ai_review (
    id BIGSERIAL PRIMARY KEY,
    signal_id         BIGINT NOT NULL REFERENCES signal(id),
    model             TEXT NOT NULL,        -- 'deepseek-chat'
    reviewed_at       TEXT NOT NULL,
    verdict           TEXT NOT NULL,        -- 'bizarro' | 'plausivel' | 'inconclusivo'
    confidence        TEXT,                 -- 'baixa' | 'media' | 'alta'
    explanation       TEXT NOT NULL,        -- the model's reasoning, pt-BR
    facts             TEXT,                 -- JSON array: the concrete points the model cited
    prompt            TEXT NOT NULL,        -- the exact user prompt sent, for audit
    raw_response      TEXT NOT NULL,        -- full model completion
    tokens_prompt     BIGINT,
    tokens_completion BIGINT
);

-- DATA: federal sanctions registry - CEIS + CNEP

CREATE TABLE IF NOT EXISTS sanction (
    id BIGSERIAL PRIMARY KEY,
    registry              TEXT NOT NULL,      -- 'CEIS' | 'CNEP'
    sanction_code         TEXT NOT NULL,      -- CODIGO DA SANCAO
    person_type           TEXT,               -- 'F' | 'J'
    cpf_cnpj              TEXT NOT NULL,      -- digits only (11 or 14)
    sanctioned_name       TEXT,               -- NOME DO SANCIONADO
    sanctioned_name_reported TEXT,            -- NOME INFORMADO PELO ORGAO SANCIONADOR
    legal_name            TEXT,               -- RAZAO SOCIAL - CADASTRO RECEITA
    trade_name            TEXT,               -- NOME FANTASIA - CADASTRO RECEITA
    process_number        TEXT,
    category              TEXT,               -- CATEGORIA DA SANCAO
    fine_amount_cents      BIGINT,           -- VALOR DA MULTA (CNEP only)
    start_date              TEXT,             -- DATA INICIO SANCAO, ISO
    end_date                  TEXT,           -- DATA FINAL SANCAO, ISO
    publication_date            TEXT,         -- ISO
    publication                   TEXT,
    publication_detail              TEXT,
    final_judgment_date               TEXT,   -- DATA DO TRANSITO EM JULGADO, ISO
    scope                               TEXT, -- ABRANGENCIA DA SANCAO
    sanctioning_agency                   TEXT,
    agency_state                          TEXT,
    agency_sphere                          TEXT,  -- FEDERAL | ESTADUAL | MUNICIPAL
    legal_basis                             TEXT, -- long free text, kept as-is
    source_data_date                         TEXT,
    source_origin                             TEXT,
    notes                                      TEXT,
    company_id            BIGINT REFERENCES companies(id),  -- only when cpf_cnpj has 14 digits
    person_id             BIGINT REFERENCES people(id),     -- only when CPF already in `people`
    provenance_id          BIGINT NOT NULL REFERENCES parse(id),
    collected_at             TEXT NOT NULL
);

-- DATA: parliamentary earmarks (emendas parlamentares) - Portal da Transparência

CREATE TABLE IF NOT EXISTS parliamentary_earmark (
    id BIGSERIAL PRIMARY KEY,
    earmark_code       TEXT NOT NULL,        -- Código da Emenda
    year               BIGINT NOT NULL,     -- Ano da Emenda
    earmark_type       TEXT,                 -- Tipo de Emenda
    author_code        TEXT,                 -- Código do Autor da Emenda (source's own id, not ours)
    author_name        TEXT,                 -- Nome do Autor da Emenda, as published
    author_person_id   BIGINT REFERENCES people(id),  -- name match only;

CREATE TABLE IF NOT EXISTS parliamentary_earmark_beneficiary (
    id BIGSERIAL PRIMARY KEY,
    earmark_code          TEXT NOT NULL,     -- Código da Emenda (joins parliamentary_earmark.earmark_code)
    author_code           TEXT,              -- Código do Autor da Emenda, kept for convenience
    year_month            TEXT,              -- Ano/Mês, as published ('202609')
    beneficiary_doc       TEXT NOT NULL,     -- Código do Favorecido, digits only (11 CPF or 14 CNPJ)
    beneficiary_name      TEXT,
    beneficiary_type      TEXT,              -- Tipo Favorecido ('Pessoa Física' | 'Pessoa Jurídica')
    beneficiary_company_id BIGINT REFERENCES companies(id),  -- deterministic CNPJ match
    state                 TEXT,              -- UF Favorecido
    municipality          TEXT,              -- Município Favorecido
    amount_cents          BIGINT NOT NULL,  -- Valor Recebido
    provenance_id         BIGINT NOT NULL REFERENCES parse(id),
    collected_at          TEXT NOT NULL
);

-- DATA: declared assets - bem_candidato (see ADs/politician.md §3)

CREATE TABLE IF NOT EXISTS declared_assets (
    id BIGSERIAL PRIMARY KEY,
    person_id         BIGINT REFERENCES people(id),             -- via tse_candidacy_id;

-- DATA: candidate photo URLs (see ADs/politician.md §5)

CREATE TABLE IF NOT EXISTS candidate_photo (
    id BIGSERIAL PRIMARY KEY,
    person_id         BIGINT REFERENCES people(id),             -- via tse_candidacy_id;

-- DATA: CNPJ registry enrichment - Receita Federal, via BrasilAPI

CREATE TABLE IF NOT EXISTS company_registry (
    id BIGSERIAL PRIMARY KEY,
    company_id           BIGINT NOT NULL REFERENCES companies(id),
    cnpj                 TEXT NOT NULL,
    legal_name           TEXT,          -- razao_social
    trade_name           TEXT,          -- nome_fantasia
    opened_at            TEXT,          -- data_inicio_atividade, ISO
    registry_status      TEXT,          -- descricao_situacao_cadastral (ATIVA, BAIXADA...)
    registry_status_date TEXT,          -- data_situacao_cadastral, ISO
    legal_nature         TEXT,          -- natureza_juridica
    primary_cnae         TEXT,          -- cnae_fiscal_descricao
    share_capital_cents  BIGINT,       -- capital_social
    size                 TEXT,          -- porte
    city                 TEXT,          -- municipio
    state                TEXT,          -- uf
    provenance_id        BIGINT NOT NULL REFERENCES parse(id),
    collected_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS company_partner (
    id BIGSERIAL PRIMARY KEY,
    company_id        BIGINT NOT NULL REFERENCES companies(id),
    cnpj              TEXT NOT NULL,
    partner_name      TEXT NOT NULL,
    partner_doc_masked TEXT,           -- cnpj_cpf_do_socio, as masked by the source
    role              TEXT,            -- qualificacao_socio
    entry_date        TEXT,            -- data_entrada_sociedade, ISO
    provenance_id     BIGINT NOT NULL REFERENCES parse(id),
    collected_at      TEXT NOT NULL,
    UNIQUE (company_id, partner_name, entry_date)
);

CREATE TABLE IF NOT EXISTS candidate_supplier_partner (
    id BIGSERIAL PRIMARY KEY,
    person_id            BIGINT NOT NULL REFERENCES people(id),
    company_id           BIGINT NOT NULL REFERENCES companies(id),
    company_partner_id   BIGINT NOT NULL REFERENCES company_partner(id),  -- the exact qsa row (its own provenance)
    match_basis          TEXT NOT NULL,   -- 'nome_e_6_digitos'
    partner_role         TEXT,            -- Administrador / Sócio / ...
    partner_since        TEXT,            -- entry_date, ISO
    payments_total_cents BIGINT NOT NULL DEFAULT 0,   -- everything this company got from ANY campaign
    payments_count       BIGINT NOT NULL DEFAULT 0,
    payer_candidacies    BIGINT NOT NULL DEFAULT 0,   -- distinct campaigns that paid it
    paid_by_self         BIGINT NOT NULL DEFAULT 0,   -- 1 if the partner-candidate's OWN campaign is one of them
    computed_at          TEXT NOT NULL
);

-- DISCURSO PÚBLICO EM REDES SOCIAIS (conteúdo efêmero)

CREATE TABLE IF NOT EXISTS social_account (
    id BIGSERIAL PRIMARY KEY,
    person_id               BIGINT REFERENCES people(id),
    network                 TEXT NOT NULL,          -- 'x'
    handle                  TEXT NOT NULL,          -- normalizado: minúsculo, sem @, sem querystring
    handle_declared         TEXT,                   -- a URL/handle exatamente como declarada ao TSE
    external_id             TEXT,                   -- id numérico da conta na plataforma, se resolvido
    declared_provenance_id  BIGINT REFERENCES parse(id),  -- a linha de parse do social_media/TSE
    source_id               BIGINT REFERENCES source(id),
    status                  TEXT,                   -- active | not_found | suspended | protected | error | pending
    first_seen_at           TEXT NOT NULL,
    last_crawled_at         TEXT,
    UNIQUE (network, handle)
);

CREATE TABLE IF NOT EXISTS social_post (
    id BIGSERIAL PRIMARY KEY,
    social_account_id     BIGINT NOT NULL REFERENCES social_account(id),
    external_id           TEXT NOT NULL,            -- id do tweet
    kind                  TEXT NOT NULL,            -- 'post' | 'reply' | 'quote'
    lang                  TEXT,
    text                  TEXT NOT NULL,            -- só texto;

CREATE TABLE IF NOT EXISTS social_post_review (
    id BIGSERIAL PRIMARY KEY,
    social_post_id     BIGINT NOT NULL REFERENCES social_post(id),
    model              TEXT NOT NULL,
    reviewed_at        TEXT NOT NULL,
    categories         TEXT,        -- JSON: categorias que o modelo apontou (lgbtfobia, racismo, ...)
    severity           TEXT,        -- low | medium | high — nunca "confirmado"
    is_offensive       BIGINT,     -- 0/1: a conclusão do modelo
    quote              TEXT,        -- o trecho EXATO que o modelo está apontando
    explanation        TEXT,
    prompt             TEXT,
    raw_response       TEXT,
    tokens_prompt      BIGINT,
    tokens_completion  BIGINT,
    UNIQUE (social_post_id, model)
);