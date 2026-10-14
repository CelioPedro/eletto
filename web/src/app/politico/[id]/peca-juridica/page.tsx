import { notFound } from "next/navigation";
import {
  getPersonHeader,
  getPersonCandidacies,
  getPersonAssets,
  getPersonFinance,
  getFinancePage,
  getPersonSignals,
  getPersonEarmarks,
} from "@/lib/queries";
import { LegalDraftWorkbench } from "@/components/juridico/legal-draft-workbench";

export const dynamic = "force-dynamic";

export default async function PecaJuridicaPage({ params }: PageProps<"/politico/[id]">) {
  const { id } = await params;
  const personId = Number(id);
  if (!Number.isInteger(personId)) notFound();

  const header = await getPersonHeader(personId);
  if (!header) notFound();

  const { person, latestCandidacy } = header;
  const displayName = person.canonicalName ?? "(Nome não disponível)";

  // Parallel data fetching for comprehensive legal draft
  const [
    candidacies,
    assetsData,
    finance,
    topDonorsPage,
    topSuppliersPage,
    signalsData,
    earmarksData,
  ] = await Promise.all([
    getPersonCandidacies(personId),
    getPersonAssets(personId),
    getPersonFinance(personId),
    getFinancePage({
      scope: "candidate",
      dir: "received",
      id: String(personId),
      page: 1,
      sort: "amount",
      order: "desc",
    }).catch(() => ({ rows: [], total: 0, pageSize: 25 })),
    getFinancePage({
      scope: "candidate",
      dir: "spent",
      id: String(personId),
      page: 1,
      sort: "amount",
      order: "desc",
    }).catch(() => ({ rows: [], total: 0, pageSize: 25 })),
    getPersonSignals(personId).catch(() => ({ signals: [], signalsCount: 0 })),
    getPersonEarmarks(personId).catch(() => ({ earmarks: [], totalCommittedCents: 0, totalPaidCents: 0 })),
  ]);

  const { declaredAssets, declaredAssetsByYear } = assetsData;
  const { signals } = signalsData;
  const topDonors = topDonorsPage.rows.slice(0, 5);
  const topSuppliers = topSuppliersPage.rows.slice(0, 5);

  const issuedDate = new Date();
  const formattedDate = issuedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });

  const protocolId = `JUD-BR-${issuedDate.getFullYear()}-${personId.toString().padStart(6, "0")}-${Math.abs(personId * 3141592653).toString(36).toUpperCase()}`;

  // Assets growth calculation
  const sortedYears = [...declaredAssetsByYear].sort((a, b) => b.year - a.year);
  const latestAssetYear = sortedYears[0] ?? null;
  const previousAssetYear = sortedYears[1] ?? null;
  const assetGrowthPct =
    latestAssetYear && previousAssetYear && previousAssetYear.totalCents > 0
      ? ((latestAssetYear.totalCents - previousAssetYear.totalCents) / previousAssetYear.totalCents) * 100
      : null;

  const currentCandidacy =
    candidacies.find((c) => c.year === latestCandidacy?.year) ?? candidacies[0] ?? null;

  return (
    <LegalDraftWorkbench
      personId={personId}
      candidateName={displayName}
      candidateCpf={person.cpf}
      voterId={person.voterId}
      latestCandidacy={currentCandidacy}
      candidacies={candidacies}
      totalAssetsCents={latestAssetYear?.totalCents ?? 0}
      assetGrowthPct={assetGrowthPct}
      totalDonationsCents={finance.donationsTotalCents}
      totalExpensesCents={finance.expensesTotalCents}
      topDonors={topDonors}
      topSuppliers={topSuppliers}
      signals={signals}
      earmarks={earmarksData.earmarks}
      totalEarmarksCents={earmarksData.totalCommittedCents}
      protocolId={protocolId}
      generatedDate={formattedDate}
    />
  );
}
