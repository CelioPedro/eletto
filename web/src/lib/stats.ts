import { db } from "./db";
import {
  getCircularDonationSummary,
  getSupplierPartnerSummary,
  getAiReviewSummary,
  getDiscourseSummary,
  getDisproportionateExpenseCount,
} from "./queries";

export type HomeStats = {
  people: number;
  candidacies: number;
  campaignOrgs: number;
  socialMedia: number;
  donationsTotalCents: number;
  expensesTotalCents: number;
  years: string;
};

const cache = new Map<number, HomeStats>();

export async function getHomeStats(year?: number): Promise<HomeStats> {
  const key = year ?? 0;
  const hit = cache.get(key);
  if (hit) return hit;

  try {
    const yearFilter = year != null ? " WHERE year = ?" : "";
    const args = year != null ? [year] : [];
    const c = async (sql: string) =>
      Number(((await db().prepare(sql).get(...args)) as { n: number } | null)?.n ?? 0);
    const sum = async (sql: string) =>
      Number(((await db().prepare(sql).get(...args)) as { n: number } | null)?.n ?? 0);

    const yearsRow = ((await db()
      .prepare("SELECT min(year) lo, max(year) hi FROM politician_history")
      .get()) as { lo: number; hi: number } | null) ?? { lo: 0, hi: 0 };

    const [
      people,
      candidacies,
      campaignOrgs,
      socialMedia,
      donationsTotalCents,
      expensesTotalCents,
    ] = await Promise.all([
      year != null
        ? c("SELECT count(DISTINCT person_id) n FROM politician_history WHERE year = ?")
        : c("SELECT count(*) n FROM people"),
      c(`SELECT count(*) n FROM politician_history${yearFilter}`),
      c(`SELECT count(*) n FROM campaign_org${yearFilter}`),
      c(`SELECT count(*) n FROM social_media${yearFilter}`),
      sum(`SELECT coalesce(sum(amount_cents), 0) n FROM campaign_donation${yearFilter}`),
      sum(`SELECT coalesce(sum(amount_cents), 0) n FROM campaign_expense${yearFilter}`),
    ]);

    const result: HomeStats = {
      people,
      candidacies,
      campaignOrgs,
      socialMedia,
      donationsTotalCents,
      expensesTotalCents,
      years:
        year != null
          ? String(year)
          : yearsRow.lo && yearsRow.hi
            ? `${yearsRow.lo}–${yearsRow.hi}`
            : "—",
    };
    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn("getHomeStats fallback used (database unreachable or query failed):", err);
    return {
      people: 0,
      candidacies: 0,
      campaignOrgs: 0,
      socialMedia: 0,
      donationsTotalCents: 0,
      expensesTotalCents: 0,
      years: "—",
    };
  }
}

export type SidebarCounts = {
  circularDonations: number;
  supplierPartner: number;
  aiReview: number;
  discourse: number;
  disproportionateExpense: number;
};

let cachedCounts: SidebarCounts | null = null;
let cachedCountsAt = 0;
const CACHE_TTL_MS = 15_000;

export async function getSidebarCounts(): Promise<SidebarCounts> {
  const now = Date.now();
  if (cachedCounts && now - cachedCountsAt < CACHE_TTL_MS) return cachedCounts;
  try {
    const [circular, supplier, ai, disc, disp] = await Promise.all([
      getCircularDonationSummary(),
      getSupplierPartnerSummary(),
      getAiReviewSummary(),
      getDiscourseSummary(),
      getDisproportionateExpenseCount(),
    ]);

    cachedCounts = {
      circularDonations: circular?.total ?? 0,
      supplierPartner: supplier?.total ?? 0,
      aiReview: ai?.total ?? 0,
      discourse: disc?.total ?? 0,
      disproportionateExpense: disp ?? 0,
    };
    cachedCountsAt = now;
    return cachedCounts;

  } catch (err) {
    console.warn("getSidebarCounts fallback used (database unreachable or query failed):", err);
    return {
      circularDonations: 0,
      supplierPartner: 0,
      aiReview: 0,
      discourse: 0,
      disproportionateExpense: 0,
    };
  }
}
