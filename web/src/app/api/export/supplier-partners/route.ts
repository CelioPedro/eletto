import { NextRequest, NextResponse } from "next/server";
import { db, hasTable } from "@/lib/db";
import { formatCpf, formatCnpj } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!(await hasTable("candidate_supplier_partner"))) {
      return new NextResponse("Tabela candidate_supplier_partner não encontrada.", { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filtro") || "all";
    const q = searchParams.get("q")?.trim() || "";

    const clauses: string[] = [];
    const args: unknown[] = [];

    if (filter === "self") {
      clauses.push("csp.paid_by_self = 1");
    } else if (filter === "others") {
      clauses.push("csp.paid_by_self = 0");
    }

    if (q) {
      clauses.push("(p.canonical_name ILIKE ? OR coalesce(cr.legal_name, c.legal_name) ILIKE ?)");
      args.push(`%${q}%`, `%${q}%`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

    const sql = `
      SELECT 
        p.canonical_name AS person_name,
        p.cpf AS person_cpf,
        l.office AS latest_office,
        l.party_abbr AS latest_party,
        l.state AS latest_state,
        c.cnpj AS company_cnpj,
        coalesce(cr.legal_name, c.legal_name) AS company_name,
        csp.partner_role,
        csp.partner_since,
        csp.payments_total_cents,
        csp.payments_count,
        csp.payer_candidacies,
        csp.paid_by_self
      FROM candidate_supplier_partner csp
      JOIN people p ON p.id = csp.person_id
      JOIN companies c ON c.id = csp.company_id
      LEFT JOIN company_registry cr ON cr.company_id = c.id
      LEFT JOIN politician_history l ON l.id = (
        SELECT id FROM politician_history
        WHERE person_id = p.id
        ORDER BY year DESC, round DESC
        LIMIT 1
      )
      ${where}
      ORDER BY csp.paid_by_self DESC, csp.payments_total_cents DESC
    `;

    const rows = (await db().prepare(sql).all(...args)) as Array<Record<string, unknown>>;

    const csvRows: string[] = [];
    // Header with UTF-8 BOM for Microsoft Excel compatibility
    csvRows.push(
      [
        "Nome do Candidato",
        "CPF",
        "Cargo Recente",
        "Partido",
        "UF",
        "CNPJ Fornecedor",
        "Razão Social Fornecedor",
        "Papel Declarado no TSE",
        "Ano da Declaração",
        "Total Recebido de Campanhas (R$)",
        "Qtd de Pagamentos",
        "Qtd de Campanhas Pagadoras",
        "Autopagamento (Pagou a Própria Empresa)",
      ].join(";")
    );

    for (const r of rows) {
      const amountReais = ((Number(r.payments_total_cents) || 0) / 100).toFixed(2).replace(".", ",");
      const paidBySelf = r.paid_by_self ? "SIM (Autofinanciamento)" : "NÃO (Outra Campanha)";
      
      const escapeCsv = (val: unknown) => {
        const str = String(val ?? "").replace(/"/g, '""');
        return `"${str}"`;
      };

      csvRows.push(
        [
          escapeCsv(r.person_name),
          escapeCsv(formatCpf(r.person_cpf as string)),
          escapeCsv(r.latest_office ?? "—"),
          escapeCsv(r.latest_party ?? "—"),
          escapeCsv(r.latest_state ?? "—"),
          escapeCsv(formatCnpj(r.company_cnpj as string)),
          escapeCsv(r.company_name ?? "—"),
          escapeCsv(r.partner_role ?? "Sócio Declarado"),
          escapeCsv(r.partner_since ?? "—"),
          escapeCsv(amountReais),
          escapeCsv(r.payments_count),
          escapeCsv(r.payer_candidacies),
          escapeCsv(paidBySelf),
        ].join(";")
      );
    }

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const filename = filter === "self" 
      ? `eletto_autopagamentos_propria_empresa_${new Date().toISOString().slice(0, 10)}.csv`
      : `eletto_socios_fornecedores_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return new NextResponse(`Erro ao gerar exportação pericial: ${err.message}`, { status: 500 });
  }
}
