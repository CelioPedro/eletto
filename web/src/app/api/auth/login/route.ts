import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie, type AppUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const pool = getPool();

    const res = await pool.query(
      `SELECT id, email, name, password_hash, salt, role, plan, plan_status as "planStatus",
              credits, organization, phone, created_at as "createdAt"
       FROM app_user
       WHERE email = $1`,
      [cleanEmail]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Email ou senha inválidos." }, { status: 401 });
    }

    const row = res.rows[0];
    const isValid = verifyPassword(String(password), row.password_hash, row.salt);
    if (!isValid) {
      return NextResponse.json({ error: "Email ou senha inválidos." }, { status: 401 });
    }

    const user: AppUser = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      plan: row.plan,
      planStatus: row.planStatus,
      credits: row.credits,
      organization: row.organization,
      phone: row.phone,
      createdAt: row.createdAt,
    };

    const sessionToken = await createSession(user.id);
    await setSessionCookie(sessionToken);

    return NextResponse.json({ ok: true, user });
  } catch (err: unknown) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Erro interno no servidor de autenticação." }, { status: 500 });
  }
}
