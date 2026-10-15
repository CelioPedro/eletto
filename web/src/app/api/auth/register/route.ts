import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { generateSalt, hashPassword, createSession, setSessionCookie, type AppUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, organization, phone } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nome completo é obrigatório." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email válido é obrigatório." }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const pool = getPool();

    // Check if email already registered
    const existing = await pool.query("SELECT id FROM app_user WHERE email = $1", [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Este email já está cadastrado. Faça login." }, { status: 409 });
    }

    const insertRes = await pool.query(
      `INSERT INTO app_user (name, email, password_hash, salt, plan, credits, organization, phone)
       VALUES ($1, $2, $3, $4, 'free', 3, $5, $6)
       RETURNING id, email, name, role, plan, plan_status as "planStatus", credits, organization, phone, created_at as "createdAt"`,
      [cleanName, cleanEmail, passwordHash, salt, organization?.trim() || null, phone?.trim() || null]
    );

    const newUser = insertRes.rows[0] as AppUser;
    const sessionToken = await createSession(newUser.id);
    await setSessionCookie(sessionToken);

    return NextResponse.json({ ok: true, user: newUser });
  } catch (err: unknown) {
    console.error("Erro no cadastro de usuário:", err);
    return NextResponse.json({ error: "Erro interno ao cadastrar usuário." }, { status: 500 });
  }
}
