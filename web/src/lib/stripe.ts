import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia" as any,
});

export const PLANS_CONFIG = {
  pro_monthly: {
    name: "Eletto Perito & Jurídico Pro (Mensal)",
    description: "Auditoria eleitoral completa com dossiês periciais em PDF ilimitados e análise de redes.",
    amountCents: 49000, // R$ 490,00
    interval: "month",
  },
  pro_annual: {
    name: "Eletto Perito & Jurídico Pro (Anual - 20% OFF)",
    description: "Assinatura anual completa do Eletto Pro faturada anualmente com 2 meses gratuitos.",
    amountCents: 468000, // R$ 4.680,00 (R$ 390/mês)
    interval: "year",
  },
  dossier_single: {
    name: "Dossiê Pericial Avulso Oficial",
    description: "Emissão única de laudo pericial com certificação SHA-256 e ata de custódia auditável.",
    amountCents: 7900, // R$ 79,00
  },
};
