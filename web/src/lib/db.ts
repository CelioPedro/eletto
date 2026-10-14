import { Pool, types } from "pg";

// Parse INT8 (bigint, e.g. COUNT(*)) and NUMERIC (e.g. SUM(*)) as numbers, matching SQLite behavior
types.setTypeParser(20, (val) => parseInt(val, 10));
types.setTypeParser(1700, (val) => (val === null ? 0 : parseFloat(val)));

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:senha@localhost:5432/elosys";

const globalForDb = globalThis as unknown as {
  _pgPool?: Pool;
  _pgTables?: Set<string>;
  _pgTablesPromise?: Promise<Set<string>>;
};

export function getPool(): Pool {
  if (!globalForDb._pgPool) {
    globalForDb._pgPool = new Pool({
      connectionString,
      max: 50,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
    });
  }
  return globalForDb._pgPool;
}

let _tables: Set<string> | null = globalForDb._pgTables ?? null;
let _tablesPromise: Promise<Set<string>> | null = globalForDb._pgTablesPromise ?? null;

export async function loadTables(): Promise<Set<string>> {
  if (_tables) return _tables;
  if (!_tablesPromise) {
    _tablesPromise = (async () => {
      try {
        const pool = getPool();
        const res = await pool.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
        _tables = new Set(res.rows.map((r: { table_name: string }) => r.table_name));
        globalForDb._pgTables = _tables;
        return _tables;
      } catch (err) {
        console.error("Failed to load tables from PostgreSQL:", err);
        return new Set<string>();
      }
    })();
    globalForDb._pgTablesPromise = _tablesPromise;
  }
  return _tablesPromise;
}

export async function hasTable(name: string): Promise<boolean> {
  const tables = await loadTables();
  return tables.has(name);
}

export function transformSql(rawSql: string): string {
  // Cast parameter in (? IS NULL) to TEXT so PostgreSQL can determine parameter type
  let sql = rawSql.replace(/\?\s+IS\s+NULL/gi, '?::TEXT IS NULL');

  // Convert ? to $1, $2, $3...
  let paramIdx = 1;
  sql = sql.replace(/\?/g, () => `$${paramIdx++}`);

  return sql;
}

const ALIAS_MAP = new Map<string, string>([
  ["amountcents", "amountCents"],
  ["anchorissource", "anchorIsSource"],
  ["personid", "personId"],
  ["candidateid", "candidateId"],
  ["tsecandidacyid", "tseCandidacyId"],
  ["companycnpj", "companyCnpj"],
  ["companyname", "companyName"],
  ["authorname", "authorName"],
  ["authorpersonid", "authorPersonId"],
  ["authorphotourl", "authorPhotoUrl"],
  ["earmarkcode", "earmarkCode"],
  ["earmarktype", "earmarkType"],
  ["legalname", "legalName"],
  ["photourl", "photoUrl"],
  ["totalcents", "totalCents"],
  ["valuecents", "valueCents"],
  ["paidcents", "paidCents"],
  ["partyabbr", "partyAbbr"],
  ["partyname", "partyName"],
  ["electiontype", "electionType"],
  ["electoralunit", "electoralUnit"],
  ["candidacystatus", "candidacyStatus"],
  ["candidacystatusdetail", "candidacyStatusDetail"],
  ["candidatenumber", "candidateNumber"],
  ["ballotname", "ballotName"],
  ["fullname", "fullName"],
  ["birthdate", "birthDate"],
  ["maritalstatus", "maritalStatus"],
  ["registrystatus", "registryStatus"],
  ["postid", "postId"],
  ["ruleversion", "ruleVersion"],
  ["signalid", "signalId"],
  ["signalamountcents", "signalAmountCents"],
  ["firstcents", "firstCents"],
  ["lastcents", "lastCents"],
  ["growthcents", "growthCents"],
  ["firstyear", "firstYear"],
  ["lastyear", "lastYear"],
  ["startdate", "startDate"],
  ["enddate", "endDate"],
  ["fineamountcents", "fineAmountCents"],
  ["counterpartyname", "counterpartyName"],
  ["counterpartydoc", "counterpartyDoc"],
  ["counterpartypersonid", "counterpartyPersonId"],
  ["counterpartyopenedat", "counterpartyOpenedAt"],
  ["counterpartyispoliticianowned", "counterpartyIsPoliticianOwned"],
  ["suppliername", "supplierName"],
  ["revenuecents", "revenueCents"],
  ["paymentcount", "paymentCount"],
  ["candidacycount", "candidacyCount"],
  ["assetcount", "assetCount"],
  ["assettotalcents", "assetTotalCents"],
  ["assettype", "assetType"],
  ["sourceupdatedat", "sourceUpdatedAt"],
  ["totalcommittedcents", "totalCommittedCents"],
  ["totalpaidcents", "totalPaidCents"],
]);

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function normalizeRow<T extends Record<string, unknown>>(row: T): T {
  for (const [k, v] of Object.entries(row)) {
    const alias = ALIAS_MAP.get(k.toLowerCase());
    if (alias && !(alias in row)) {
      (row as Record<string, unknown>)[alias] = v;
    }
    if (k.includes("_")) {
      const camel = snakeToCamel(k);
      if (!(camel in row)) {
        (row as Record<string, unknown>)[camel] = v;
      }
    }
  }
  return createRowProxy(row);
}

function createRowProxy<T extends Record<string, unknown>>(row: T): T {
  const lowerMap = new Map<string, unknown>();
  for (const [k, v] of Object.entries(row)) {
    lowerMap.set(k.toLowerCase(), v);
  }

  return new Proxy(row, {
    get(target, prop, receiver) {
      if (typeof prop === "string") {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        const lowerProp = prop.toLowerCase();
        if (lowerMap.has(lowerProp)) {
          return lowerMap.get(lowerProp);
        }
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

export async function queryAll<T = Record<string, unknown>>(
  sql: string,
  ...args: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const transformed = transformSql(sql);
  const sanitizedArgs = args.map((a) => (a === undefined ? null : a));
  const res = await pool.query(transformed, sanitizedArgs);
  return res.rows.map((r) => normalizeRow(r as Record<string, unknown>) as T);
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  ...args: unknown[]
): Promise<T | null> {
  const pool = getPool();
  const transformed = transformSql(sql);
  const sanitizedArgs = args.map((a) => (a === undefined ? null : a));
  const res = await pool.query(transformed, sanitizedArgs);
  if (!res.rows || res.rows.length === 0) return null;
  return normalizeRow(res.rows[0] as Record<string, unknown>) as T;
}

export function db() {
  return {
    prepare(sql: string) {
      return {
        all(...args: unknown[]) {
          return queryAll(sql, ...args);
        },
        get(...args: unknown[]) {
          return queryOne(sql, ...args);
        },
      };
    },
  };
}
