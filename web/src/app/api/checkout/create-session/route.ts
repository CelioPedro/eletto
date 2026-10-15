import { NextResponse } from "next/server";
import { stripe, PLANS_CONFIG } from "@/lib/stripe";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Faça login ou crie sua conta para assinar." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const planType = body.planType === "annual" ? "pro_annual" : body.planType === "dossier" ? "dossier_single" : "pro_monthly";
    const plan = PLANS_CONFIG[planType];

    const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: user.email,
      client_reference_id: user.id.toString(),
      metadata: {
        userId: user.id.toString(),
        planType: planType,
        userEmail: user.email,
      },
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/planos`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err: unknown) {
    console.error("Erro ao criar sessão de checkout no Stripe:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Erro interno ao iniciar pagamento no Stripe." },
      { status: 500 }
    );
  }
}
