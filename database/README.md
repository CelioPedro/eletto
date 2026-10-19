# Estrutura do Banco de Dados PostgreSQL (Eletto)

Este diretório contém os scripts DDL oficiais para criação e indexação das tabelas analíticas e relacionais do **Eletto** em PostgreSQL.

---

## Arquivos Disponíveis

1. **`schema_pg_tables.sql`**:
   - Criação das tabelas centrais: `person`, `candidacy`, `donation`, `expense`, `payment`, `asset`, `company`, `company_partner`, `earmark`, `sanction`, `social_media`, `app_user`, `app_session`.
   - Chaves primárias, chaves estrangeiras e integridade referencial.

2. **`schema_pg_indexes.sql`**:
   - Índices B-Tree e índices parciais para otimização de consultas frequentes (busca por CPF, CNPJ, nome canônico, agregações financeiras e cruzamentos de doações).

---

## Execução em Novo Ambiente (Deploy / Staging)

Para inicializar um banco PostgreSQL virgem (ex.: Supabase, Neon, Railway ou VPS local):

```bash
# 1. Criar as tabelas
psql "sua_connection_string" -f schema_pg_tables.sql

# 2. Criar os índices de alta performance
psql "sua_connection_string" -f schema_pg_indexes.sql
```
