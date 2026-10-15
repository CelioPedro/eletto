import Link from "next/link";
import {
  getSupplierPartnerCount,
  getSupplierPartners,
  getSupplierPartnerSummary,
  type SupplierPartnerFilter,
} from "@/lib/queries";
import { formatBRL, formatCnpj } from "@/lib/format";
import { PageHeader } from "@/components/shell/shell-context";
import { PaginationLinks } from "@/components/ui/pagination-links";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 40;
const FILTERS: Array<{ value: SupplierPartnerFilter; label: string }> = [
  { value: "all", label: "todos" },
  { value: "self", label: "pagou a própria empresa" },
  { value: "others", label: "outra campanha pagou" },
];

export default async function SocioFornecedorPage({ searchParams }: PageProps<"/sinais/socio-fornecedor">) {
  const sp = await searchParams;
  const filterParam = typeof sp.filtro === "string" ? sp.filtro : undefined;
  const filter = FILTERS.some((f) => f.value === filterParam)
    ? (filterParam as SupplierPartnerFilter)
    : "all";
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const summary = await getSupplierPartnerSummary();
  const count = await getSupplierPartnerCount({ filter, q });
  const rows = await getSupplierPartners({ filter, q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const hrefFor = (p: Record<string, string | undefined>) => {
    const usp = new URLSearchParams();
    if (p.filtro && p.filtro !== "all") usp.set("filtro", p.filtro);
    if (p.q) usp.set("q", p.q);
    if (p.page && p.page !== "1") usp.set("page", p.page);
    const s = usp.toString();
    return `/sinais/socio-fornecedor${s ? `?${s}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader group="Sinais" current="Sócio de fornecedor" />

      <section>
        <h1 className="text-[26px] leading-tight font-medium tracking-tight">
          Candidato sócio de uma empresa que recebeu dinheiro de campanha
        </h1>
        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
          O candidato declarou <strong style={{ color: "var(--fg-2)" }}>quotas de capital ou participação societária</strong> perante a Justiça Eleitoral (TSE) em empresa que atuou como fornecedora e recebeu recursos de campanhas eleitorais. Casos em que a <strong style={{ color: "var(--red)" }}>própria campanha do candidato</strong> contratou sua empresa são destacados em vermelho como potencial conflito de interesses.
        </p>

        {summary.total === 0 ? null : (
          <div className="mono mt-6 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ fontSize: 11, color: "var(--muted)" }}>
            <span>
              <span style={{ color: "var(--fg-1)" }}>{summary.total.toLocaleString("pt-BR")}</span> vínculos societários identificados
            </span>
            <span>
              <span style={{ color: "var(--red)" }}>{summary.self.toLocaleString("pt-BR")}</span> pagaram a própria empresa
            </span>
            <span>
              <span style={{ color: "var(--accent-2)" }}>{summary.others.toLocaleString("pt-BR")}</span> pagas por outra campanha
            </span>
            <span>
              <span style={{ color: "var(--fg-1)" }}>{formatBRL(summary.totalCents)}</span> movimentados nessas empresas
            </span>
          </div>
        )}

        <form className="mt-5 flex flex-wrap items-center gap-2" action="/sinais/socio-fornecedor">
          {FILTERS.map((f) => (
            <Link key={f.value} href={hrefFor({ filtro: f.value, q })} className={`btn${filter === f.value ? " btn--primary" : ""}`}>
              {f.label}
            </Link>
          ))}
          <div className="input ml-2" style={{ width: 256 }}>
            <input name="q" defaultValue={q} placeholder="buscar candidato ou empresa…" />
          </div>
          {filter !== "all" ? <input type="hidden" name="filtro" value={filter} /> : null}

          <div className="ml-auto flex items-center gap-2">
            <a
              href="/api/export/supplier-partners?filtro=self"
              download
              className="inline-flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1.5 text-[11px] font-semibold transition-all shadow-xs"
              title="Baixar planilha pericial CSV com os 298 casos em que a campanha pagou a própria empresa"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Exportar 298 Autopagamentos (CSV)</span>
            </a>
            <a
              href={`/api/export/supplier-partners?filtro=${filter}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              download
              className="btn text-[11px] py-1.5"
              title="Baixar planilha CSV desta consulta atual"
            >
              Exportar Consulta (CSV)
            </a>
          </div>
        </form>
      </section>

      <section>
        {summary.total === 0 ? (
          <EmptyState
            icon="◌"
            title="nenhum vínculo ainda"
            hint={<span>Nenhum vínculo societário com fornecedor registrado na base oficial para este filtro.</span>}
          />
        ) : rows.length === 0 ? (
          <EmptyState icon="◌" title="nada para esse filtro." />
        ) : (
          <div className="table-wrap">
            <div className="overflow-x-auto">
            <table className="table min-w-[760px]">
              <thead>
                <tr>
                  <th>candidato (sócio)</th>
                  <th>empresa</th>
                  <th>papel · desde</th>
                  <th className="text-right">recebeu de campanhas</th>
                  <th className="text-right">quem pagou</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.personId}-${r.companyCnpj}`}>
                    <td>
                      <Link href={`/politico/${r.personId}`} className="hover:underline">
                        {r.personName ?? "candidato"}
                      </Link>
                    </td>
                    <td className="max-w-[240px]">
                      <Link href={`/cnpj/${r.companyCnpj}`} className="hover:underline">
                        {r.companyName ?? formatCnpj(r.companyCnpj)}
                      </Link>
                      <div className="mono" style={{ fontSize: 9.5, color: "var(--muted-2)" }}>
                        {formatCnpj(r.companyCnpj)}
                      </div>
                    </td>
                    <td style={{ color: "var(--muted)" }}>
                      {r.partnerRole ?? "—"}
                      {r.partnerSince ? <span style={{ color: "var(--muted-2)" }}> · {r.partnerSince}</span> : null}
                    </td>
                    <td className="num" style={{ color: "var(--accent-2)" }}>
                      {formatBRL(r.paymentsTotalCents)}
                      <div style={{ fontSize: 9.5, color: "var(--muted-2)" }}>
                        {r.paymentsCount.toLocaleString("pt-BR")} pagamentos
                      </div>
                    </td>
                    <td className="num">
                      {r.paidBySelf ? (
                        <span style={{ color: "var(--red)" }}>a própria campanha</span>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>{r.payerCandidacies} campanha(s)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {totalPages > 1 ? (
              <div className="table-footer">
                <PaginationLinks
                  page={page}
                  totalPages={totalPages}
                  makeHref={(p) => hrefFor({ filtro: filter, q, page: String(p) })}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
