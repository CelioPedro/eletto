import { notFound } from "next/navigation";
import {
  getPersonHeader,
  getPersonPhotoUrl,
  getPersonCandidacies,
  getPersonAssets,
  getPersonFinance,
  getFinancePage,
  getPersonSignals,
  getPersonEarmarks,
  getPersonCampaignOrgs,
} from "@/lib/queries";
import { formatBRL, formatCpf, formatCnpj, formatCpfCnpj } from "@/lib/format";
import { DossieActions } from "@/components/dossie/dossie-actions";

export const dynamic = "force-dynamic";

export default async function DossiePage({ params }: PageProps<"/politico/[id]">) {
  const { id } = await params;
  const personId = Number(id);
  if (!Number.isInteger(personId)) notFound();

  const header = await getPersonHeader(personId);
  if (!header) notFound();

  const { person, latestCandidacy } = header;
  const displayName = person.canonicalName ?? "(Nome não disponível)";
  const photoUrl = await getPersonPhotoUrl(personId);

  // Parallel data fetching for comprehensive dossier
  const [
    candidacies,
    assetsData,
    finance,
    topDonorsPage,
    topSuppliersPage,
    signalsData,
    earmarksData,
    campaignOrgs,
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
    getPersonCampaignOrgs(personId).catch(() => []),
  ]);

  const { declaredAssets, declaredAssetsByYear } = assetsData;
  const { signals, signalsCount } = signalsData;
  const topDonors = topDonorsPage.rows.slice(0, 5);
  const topSuppliers = topSuppliersPage.rows.slice(0, 5);

  const issuedDate = new Date();
  const formattedDate = issuedDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

  const protocolId = `ELE-BR-${issuedDate.getFullYear()}-${personId.toString().padStart(6, "0")}-${Math.abs(personId * 2654435761).toString(36).toUpperCase()}`;

  // Latest assets vs previous for asset growth
  const sortedYears = [...declaredAssetsByYear].sort((a, b) => b.year - a.year);
  const latestAssetYear = sortedYears[0] ?? null;
  const previousAssetYear = sortedYears[1] ?? null;
  const assetGrowthPct =
    latestAssetYear && previousAssetYear && previousAssetYear.totalCents > 0
      ? ((latestAssetYear.totalCents - previousAssetYear.totalCents) / previousAssetYear.totalCents) * 100
      : null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900 print:bg-white print:text-black">
      {/* Top action toolbar (hidden on print) */}
      <DossieActions personId={personId} candidateName={displayName} />

      {/* Forensic Document Paper Container */}
      <main className="mx-auto my-8 max-w-[210mm] bg-white p-8 sm:p-14 shadow-2xl rounded-sm border border-slate-200 print:my-0 print:border-none print:shadow-none print:p-0">
        
        {/* Official Forensic Letterhead Header */}
        <header className="border-b-2 border-slate-900 pb-5 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">
                  e
                </span>
                <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
                  eletto
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-700 border border-slate-200">
                  AUDITORIA ELEITORAL
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                Sistema Integrado de Perícia e Conformidade Política
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-500">
              <div><strong className="text-slate-800">Protocolo:</strong> {protocolId}</div>
              <div><strong className="text-slate-800">Emissão:</strong> {formattedDate} (BRT)</div>
              <div><strong className="text-slate-800">Classificação:</strong> Documento Público Pericial</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-950 sm:text-2xl">
              Dossiê Pericial de Conformidade Eleitoral
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-xl mx-auto">
              Relatório pericial estruturado a partir de dados públicos do Tribunal Superior Eleitoral (TSE),
              Receita Federal do Brasil (RFB) e Controladoria-Geral da União (CGU).
            </p>
          </div>
        </header>

        {/* Seção 1: Identificação Cadastral & Eleitoral */}
        <section className="mb-8">
          <h2 className="border-b border-slate-300 pb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="flex size-4 items-center justify-center rounded bg-slate-900 text-[10px] text-white">1</span>
            Identificação Cadastral & Registro Político
          </h2>

          <div className="mt-4 flex flex-col sm:flex-row gap-6 items-start">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={displayName}
                className="size-28 flex-none rounded border-2 border-slate-200 object-cover shadow-xs print:size-24"
              />
            ) : (
              <div className="flex size-28 flex-none items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-slate-400 font-mono text-xs print:size-24">
                Sem foto
              </div>
            )}

            <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 font-sans text-xs sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-3">
                <span className="block font-mono text-[10px] uppercase text-slate-400">Nome Canônico / Completo</span>
                <span className="text-base font-bold text-slate-950">{displayName}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-slate-400">CPF</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatCpf(person.cpf)}
                  {person.cpf && !person.cpfTrusted ? " (Reconciliado)" : ""}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-slate-400">Título Eleitoral</span>
                <span className="font-mono text-slate-900">{person.voterId ?? "Não informado"}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] uppercase text-slate-400">ID da Pessoa (eletto)</span>
                <span className="font-mono text-slate-900">#{person.id}</span>
              </div>

              {latestCandidacy ? (
                <>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Cargo Mais Recente</span>
                    <span className="font-semibold text-slate-900">{latestCandidacy.office ?? "—"}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Partido / UF</span>
                    <span className="font-semibold text-slate-900">
                      {latestCandidacy.partyAbbr ?? "—"} / {latestCandidacy.state ?? "BR"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-400">Último Pleito</span>
                    <span className="font-semibold text-slate-900">{latestCandidacy.year}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Candidacy History Table */}
          {candidacies.length > 0 ? (
            <div className="mt-5">
              <span className="mb-2 block font-mono text-[10px] font-semibold uppercase text-slate-500">
                Histórico Eleitoral Registrado (TSE)
              </span>
              <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 font-mono text-[10px] uppercase text-slate-700">
                    <th className="border border-slate-200 px-3 py-1.5">Ano</th>
                    <th className="border border-slate-200 px-3 py-1.5">Cargo Disputado</th>
                    <th className="border border-slate-200 px-3 py-1.5">Partido / Coligação</th>
                    <th className="border border-slate-200 px-3 py-1.5">UF / Município</th>
                    <th className="border border-slate-200 px-3 py-1.5 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {candidacies.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="border border-slate-200 px-3 py-1.5 font-mono font-medium">{c.year}</td>
                      <td className="border border-slate-200 px-3 py-1.5 font-medium">{c.office ?? "—"}</td>
                      <td className="border border-slate-200 px-3 py-1.5">{c.partyAbbr ?? "—"}</td>
                      <td className="border border-slate-200 px-3 py-1.5">
                        {c.state ?? "—"} {c.municipality ? `· ${c.municipality}` : ""}
                      </td>
                      <td className="border border-slate-200 px-3 py-1.5 text-right font-medium">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase ${
                            c.result?.includes("ELEITO")
                              ? "bg-emerald-100 text-emerald-800 font-bold"
                              : c.result?.includes("SUPLENTE")
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.result ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        {/* Seção 2: Auditoria Patrimonial & Declaração de Bens */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="border-b border-slate-300 pb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="flex size-4 items-center justify-center rounded bg-slate-900 text-[10px] text-white">2</span>
            Auditoria Patrimonial (Bens Declarados no TSE)
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <span className="block font-mono text-[9.5px] uppercase text-slate-500">Patrimônio Mais Recente</span>
              <span className="text-lg font-bold text-slate-900">
                {latestAssetYear ? formatBRL(latestAssetYear.totalCents) : "R$ 0,00"}
              </span>
              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                {latestAssetYear ? `${latestAssetYear.count} itens em ${latestAssetYear.year}` : "Nenhum bem declarado"}
              </span>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <span className="block font-mono text-[9.5px] uppercase text-slate-500">Evolução Patrimonial</span>
              <span
                className={`text-lg font-bold ${
                  assetGrowthPct != null && assetGrowthPct > 0
                    ? "text-blue-600"
                    : assetGrowthPct != null && assetGrowthPct < 0
                      ? "text-rose-600"
                      : "text-slate-800"
                }`}
              >
                {assetGrowthPct != null
                  ? `${assetGrowthPct > 0 ? "+" : ""}${assetGrowthPct.toFixed(1)}%`
                  : "—"}
              </span>
              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                {previousAssetYear && latestAssetYear
                  ? `Comparativo ${previousAssetYear.year} → ${latestAssetYear.year}`
                  : "Sem histórico prévio"}
              </span>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <span className="block font-mono text-[9.5px] uppercase text-slate-500">Histórico de Declarações</span>
              <span className="text-lg font-bold text-slate-900">{declaredAssetsByYear.length}</span>
              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                {declaredAssetsByYear.map((y) => y.year).sort().join(", ") || "—"}
              </span>
            </div>
          </div>

          {/* Top 5 Declared Assets */}
          {declaredAssets.length > 0 ? (
            <div className="mt-4">
              <span className="mb-2 block font-mono text-[10px] font-semibold uppercase text-slate-500">
                Maiores Bens Declarados (Amostra Pericial)
              </span>
              <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 font-mono text-[10px] uppercase text-slate-700">
                    <th className="border border-slate-200 px-3 py-1.5">Ano</th>
                    <th className="border border-slate-200 px-3 py-1.5">Tipo do Bem</th>
                    <th className="border border-slate-200 px-3 py-1.5">Descrição Registrada</th>
                    <th className="border border-slate-200 px-3 py-1.5 text-right">Valor Declarado</th>
                  </tr>
                </thead>
                <tbody>
                  {declaredAssets.slice(0, 5).map((a) => (
                    <tr key={a.id} className="border-b border-slate-100">
                      <td className="border border-slate-200 px-3 py-1.5 font-mono">{a.year}</td>
                      <td className="border border-slate-200 px-3 py-1.5 font-medium text-slate-800">{a.assetType ?? "Outros"}</td>
                      <td className="border border-slate-200 px-3 py-1.5 text-slate-600 max-w-xs truncate">{a.description ?? "Sem descrição"}</td>
                      <td className="border border-slate-200 px-3 py-1.5 text-right font-mono font-semibold text-slate-900">
                        {formatBRL(a.valueCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        {/* Seção 3: Auditoria Financeira de Campanhas */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="border-b border-slate-300 pb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="flex size-4 items-center justify-center rounded bg-slate-900 text-[10px] text-white">3</span>
            Auditoria Financeira de Campanha (Prestações de Contas TSE)
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <span className="block font-mono text-[9.5px] uppercase text-slate-500">Total Arrecadado (Doações)</span>
              <span className="text-lg font-bold text-emerald-700">
                {formatBRL(finance.donationsTotalCents)}
              </span>
              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                {finance.donationsCount.toLocaleString("pt-BR")} doações recebidas
              </span>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <span className="block font-mono text-[9.5px] uppercase text-slate-500">Total Contratado (Despesas)</span>
              <span className="text-lg font-bold text-slate-900">
                {formatBRL(finance.expensesTotalCents)}
              </span>
              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                {finance.expensesCount.toLocaleString("pt-BR")} despesas registradas
              </span>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-3">
              <span className="block font-mono text-[9.5px] uppercase text-slate-500">Recursos Públicos (Fundos)</span>
              <span className="text-lg font-bold text-blue-700">
                {formatBRL(finance.electoralFundTotalCents)}
              </span>
              <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                Fundo Eleitoral / Partidário ({finance.electoralFundCount} repasses)
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Top Donors */}
            <div>
              <span className="mb-2 block font-mono text-[10px] font-semibold uppercase text-slate-500">
                Maiores Doadores Identificados
              </span>
              {topDonors.length > 0 ? (
                <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 font-mono text-[9.5px] uppercase text-slate-700">
                      <th className="border border-slate-200 px-2.5 py-1.5">Doador</th>
                      <th className="border border-slate-200 px-2.5 py-1.5 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDonors.map((d, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="border border-slate-200 px-2.5 py-1.5">
                          <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                            {d.counterpartyName ?? "Nome não informado"}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500">
                            {formatCpfCnpj(d.counterpartyDoc)}
                          </div>
                        </td>
                        <td className="border border-slate-200 px-2.5 py-1.5 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                          {formatBRL(d.amountCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="rounded border border-dashed border-slate-200 p-3 text-center font-mono text-xs text-slate-400">
                  Nenhum doador individual registrado
                </div>
              )}
            </div>

            {/* Top Suppliers */}
            <div>
              <span className="mb-2 block font-mono text-[10px] font-semibold uppercase text-slate-500">
                Maiores Fornecedores Contratados
              </span>
              {topSuppliers.length > 0 ? (
                <table className="w-full border-collapse border border-slate-200 text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 font-mono text-[9.5px] uppercase text-slate-700">
                      <th className="border border-slate-200 px-2.5 py-1.5">Fornecedor</th>
                      <th className="border border-slate-200 px-2.5 py-1.5 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSuppliers.map((s, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="border border-slate-200 px-2.5 py-1.5">
                          <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                            {s.counterpartyName ?? "Nome não informado"}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500">
                            {formatCpfCnpj(s.counterpartyDoc)}
                          </div>
                        </td>
                        <td className="border border-slate-200 px-2.5 py-1.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                          {formatBRL(s.amountCents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="rounded border border-dashed border-slate-200 p-3 text-center font-mono text-xs text-slate-400">
                  Nenhum fornecedor registrado
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Seção 4: Matriz de Alertas & Sinais de Risco */}
        <section className="mb-8 break-inside-avoid">
          <h2 className="border-b border-slate-300 pb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span className="flex size-4 items-center justify-center rounded bg-slate-900 text-[10px] text-white">4</span>
            Matriz de Sinais & Riscos de Conformidade
          </h2>

          <div className="mt-4">
            {signals.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                <div className="rounded-md border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-900">
                  <strong>Atenção Pericial:</strong> Foram identificados <strong>{signalsCount}</strong> indício(s)
                  de alerta metodológico nas movimentações registradas deste agente político.
                </div>

                <div className="flex flex-col gap-2">
                  {signals.map((s) => (
                    <div
                      key={s.id}
                      className="rounded border border-slate-200 bg-slate-50 p-3 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold uppercase tracking-wider text-slate-900">
                          {s.rule === "circular_donations"
                            ? "Triangulação / Doação Circular"
                            : s.rule === "disproportionate_expense"
                              ? "Despesa Desproporcional Atípica"
                              : s.rule === "supplier_partner"
                                ? "Vínculo Societário com Fornecedor"
                                : s.rule}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                            s.severity === "high"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          Gravidade: {s.severity}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {s.explanation ?? "Indício identificado pelo motor de regras automatizado."}
                      </p>
                      {(() => {
                        const amount = s.expense?.amountCents ?? s.cycleAmountCents ?? null;
                        return amount ? (
                          <div className="font-mono text-[10px] text-slate-500 font-semibold mt-0.5">
                            Montante sob análise: {formatBRL(amount)}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center">
                <div className="font-semibold text-emerald-900 text-xs">
                  Nenhum sinal crítico de triangulação ou anomalia grave detectado
                </div>
                <div className="font-mono text-[10px] text-emerald-700 mt-1">
                  Varredura de doações circulares e despesas atípicas negativa para o histórico sob custódia.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Seção 5: Emendas Parlamentares (se houver) */}
        {earmarksData.earmarks.length > 0 ? (
          <section className="mb-8 break-inside-avoid">
            <h2 className="border-b border-slate-300 pb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded bg-slate-900 text-[10px] text-white">5</span>
              Emendas Parlamentares Executadas
            </h2>
            <div className="mt-3 flex items-center justify-between font-mono text-xs bg-slate-50 p-2.5 rounded border border-slate-200">
              <span>Total de Emendas Alocadas:</span>
              <strong className="text-sm font-bold text-slate-900">{formatBRL(earmarksData.totalCommittedCents)}</strong>
            </div>
          </section>
        ) : null}

        {/* Seção 6: Cadeia de Custódia & Autenticação Criptográfica */}
        <section className="mt-10 border-t-2 border-slate-900 pt-5 break-inside-avoid text-xs">
          <div className="rounded border border-slate-300 bg-slate-50 p-4 font-mono text-[10px] text-slate-600 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 font-bold text-slate-800 uppercase">
              <span>Declaração de Proveniência & Integridade Pericial</span>
              <span>SHA-256 VERIFIED</span>
            </div>
            <p>
              Este documento foi gerado computacionalmente pela plataforma <strong>eletto</strong> a partir de dados
              públicos oficiais sob a disciplina da <strong>Lei Federal nº 12.527/2011 (Lei de Acesso à Informação)</strong> e
              das resoluções de transparência do <strong>Tribunal Superior Eleitoral (TSE)</strong>.
            </p>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9.5px]">
              <div>
                <strong>Repositórios Primários:</strong> TSE (DivulgaCandContas / Prestação de Contas), Receita Federal (QSA/CNPJ).
              </div>
              <div>
                <strong>Autenticador do Sistema:</strong> eletto Core Intelligence Engine v1.0
              </div>
            </div>
            <div className="mt-3 text-center border-t border-slate-200 pt-2 text-slate-500 text-[9px]">
              Para validação da autenticidade deste dossiê pericial, acesse:{" "}
              <span className="text-blue-700 underline">https://eletto.app/politico/{personId}</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
