import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user });
  } catch (err: unknown) {
    console.error("Erro na rota /api/auth/me:", err);
    return NextResponse.json({ user: null });
  }
}
