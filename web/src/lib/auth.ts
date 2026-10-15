import crypto from "crypto";
import { cookies } from "next/headers";
import { getPool } from "./db";

export type AppUser = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  plan: "free" | "pro" | "escritorio";
  planStatus: "active" | "canceled" | "past_due";
  credits: number;
  organization: string | null;
  phone: string | null;
  createdAt: string;
};

export const SESSION_COOKIE_NAME = "eletto_session";

export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

export async function createSession(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const pool = getPool();

  await pool.query(
    "INSERT INTO app_session (id, user_id, expires_at) VALUES ($1, $2, $3)",
    [token, userId, expiresAt]
  );

  return token;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUser(): Promise<AppUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const pool = getPool();
    const res = await pool.query(
      `SELECT u.id, u.email, u.name, u.role, u.plan, u.plan_status as "planStatus",
              u.credits, u.organization, u.phone, u.created_at as "createdAt"
       FROM app_session s
       JOIN app_user u ON u.id = s.user_id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0] as AppUser;
  } catch (err) {
    console.error("Erro ao obter usuário da sessão:", err);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const pool = getPool();
      await pool.query("DELETE FROM app_session WHERE id = $1", [token]);
    }
  } catch (err) {
    console.error("Erro ao destruir sessão:", err);
  } finally {
    await clearSessionCookie();
  }
}
