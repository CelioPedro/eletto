import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Faça login primeiro." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const nextPlan = body.plan ?? (user.plan === "pro" ? "free" : "pro");

    const nextCredits = nextPlan === "pro" ? 999 : 3;

    const pool = getPool();
    const res = await pool.query(
      `UPDATE app_user
       SET plan = $1::varchar, credits = $2::int, updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, name, role, plan, plan_status as "planStatus", credits, organization, phone, created_at as "createdAt"`,
      [nextPlan, nextCredits, user.id]
    );

    return NextResponse.json({ ok: true, user: res.rows[0] });
  } catch (err: unknown) {
    console.error("Erro ao alternar plano:", err);
    return NextResponse.json({ error: "Erro interno ao atualizar plano." }, { status: 500 });
  }
}
