CREATE INDEX IF NOT EXISTS ix_collection_dedup ON collection (url, payload_sha256);

CREATE INDEX IF NOT EXISTS ix_people_cpf      ON people (cpf) WHERE cpf IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_people_voter_id ON people (voter_id) WHERE voter_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_people_canonical_name ON people (canonical_name);

CREATE UNIQUE INDEX IF NOT EXISTS ux_campaign_org ON campaign_org (year, tse_candidacy_id, cnpj);

CREATE INDEX IF NOT EXISTS ix_campaign_org_person ON campaign_org (person_id);

CREATE INDEX IF NOT EXISTS ix_campaign_org_cnpj   ON campaign_org (cnpj);

CREATE UNIQUE INDEX IF NOT EXISTS ux_campaign_donation ON campaign_donation (year, tse_receipt_id);

CREATE INDEX IF NOT EXISTS ix_campaign_donation_org        ON campaign_donation (campaign_org_id);

CREATE INDEX IF NOT EXISTS ix_campaign_donation_candidacy  ON campaign_donation (year, tse_candidacy_id);

CREATE INDEX IF NOT EXISTS ix_campaign_donation_donor_doc  ON campaign_donation (donor_cpf_cnpj);

CREATE INDEX IF NOT EXISTS ix_campaign_donation_donor_person ON campaign_donation (donor_person_id) WHERE donor_person_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_campaign_donation_donor_company ON campaign_donation (donor_company_id) WHERE donor_company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_campaign_donation_donor_name ON campaign_donation (donor_name) WHERE donor_company_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_campaign_expense ON campaign_expense (year, tse_expense_id);

CREATE INDEX IF NOT EXISTS ix_campaign_expense_org        ON campaign_expense (campaign_org_id);

CREATE INDEX IF NOT EXISTS ix_campaign_expense_candidacy  ON campaign_expense (year, tse_candidacy_id);

CREATE INDEX IF NOT EXISTS ix_campaign_expense_supplier_doc ON campaign_expense (supplier_cpf_cnpj);

CREATE INDEX IF NOT EXISTS ix_campaign_expense_supplier_person ON campaign_expense (supplier_person_id) WHERE supplier_person_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_campaign_expense_supplier_company ON campaign_expense (supplier_company_id) WHERE supplier_company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_campaign_expense_supplier_name ON campaign_expense (supplier_name) WHERE supplier_company_id IS NULL;

CREATE INDEX IF NOT EXISTS ix_campaign_expense_supplier_rank
    ON campaign_expense (supplier_cpf_cnpj) WHERE supplier_company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_campaign_expense_supplier_rank_year
    ON campaign_expense (year, supplier_cpf_cnpj) WHERE supplier_company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_pessoa_fisica_search_name ON pessoa_fisica_search (name);

CREATE INDEX IF NOT EXISTS ix_pessoa_fisica_search_cpf ON pessoa_fisica_search (cpf);

CREATE UNIQUE INDEX IF NOT EXISTS ux_campaign_expense_payment
    ON campaign_expense_payment (year, tse_expense_id, tse_installment_id);

CREATE INDEX IF NOT EXISTS ix_campaign_expense_payment_expense
    ON campaign_expense_payment (campaign_expense_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_social_media ON social_media (year, tse_candidacy_id, url);

CREATE INDEX IF NOT EXISTS ix_social_media_person ON social_media (person_id);

CREATE INDEX IF NOT EXISTS ix_ph_person      ON politician_history (person_id);

CREATE INDEX IF NOT EXISTS ix_ph_year_office ON politician_history (year, office, state);

CREATE INDEX IF NOT EXISTS ix_ph_voter_id    ON politician_history (voter_id) WHERE voter_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_ph_candidacy
    ON politician_history (year, tse_candidacy_id, round)
    WHERE tse_candidacy_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_rule_run_rule ON rule_run (rule);

CREATE INDEX IF NOT EXISTS ix_signal_rule_run ON signal (rule_run_id);

CREATE INDEX IF NOT EXISTS ix_signal_actor_actor ON signal_actor (type, actor_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_signal_ai_review ON signal_ai_review (signal_id, model);

CREATE INDEX IF NOT EXISTS ix_signal_ai_review_verdict ON signal_ai_review (verdict);

CREATE UNIQUE INDEX IF NOT EXISTS ux_sanction ON sanction (registry, sanction_code);

CREATE INDEX IF NOT EXISTS ix_sanction_cpf_cnpj ON sanction (cpf_cnpj);

CREATE INDEX IF NOT EXISTS ix_sanction_company ON sanction (company_id) WHERE company_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_sanction_person ON sanction (person_id) WHERE person_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_parliamentary_earmark ON parliamentary_earmark (earmark_code, year, locality);

CREATE INDEX IF NOT EXISTS ix_parliamentary_earmark_author
    ON parliamentary_earmark (author_person_id) WHERE author_person_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_earmark_beneficiary_code ON parliamentary_earmark_beneficiary (earmark_code);

CREATE INDEX IF NOT EXISTS ix_earmark_beneficiary_company
    ON parliamentary_earmark_beneficiary (beneficiary_company_id) WHERE beneficiary_company_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_declared_assets
    ON declared_assets (year, tse_candidacy_id, asset_order);

CREATE INDEX IF NOT EXISTS ix_declared_assets_person  ON declared_assets (person_id) WHERE person_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_declared_assets_history ON declared_assets (history_id) WHERE history_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_candidate_photo ON candidate_photo (year, tse_candidacy_id);

CREATE INDEX IF NOT EXISTS ix_candidate_photo_person ON candidate_photo (person_id) WHERE person_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_company_registry ON company_registry (company_id);

CREATE INDEX IF NOT EXISTS ix_company_partner_company ON company_partner (company_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_csp ON candidate_supplier_partner (person_id, company_id);

CREATE INDEX IF NOT EXISTS ix_csp_person ON candidate_supplier_partner (person_id);

CREATE INDEX IF NOT EXISTS ix_csp_amount ON candidate_supplier_partner (payments_total_cents);

CREATE INDEX IF NOT EXISTS ix_social_account_person ON social_account (person_id);

CREATE INDEX IF NOT EXISTS ix_social_post_account ON social_post (social_account_id);

CREATE INDEX IF NOT EXISTS ix_social_post_review_sev ON social_post_review (severity);

CREATE UNIQUE INDEX IF NOT EXISTS ux_record_sources ON record_sources (table_name, record_id, coalesce(field, ''), parse_id);