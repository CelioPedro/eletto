import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { getPool } from "@/lib/db";
import { formatBRL } from "@/lib/format";
import { PageHeader } from "@/components/shell/shell-context";

export const dynamic = "force-dynamic";

export default async function CheckoutSucessoPage({
  searchParams,
}: PageProps<"/checkout/sucesso">) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;

  if (!sessionId) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center">
        <PageHeader group="eletto" current="Checkout" />
        <div className="rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)] p-8">
          <div className="text-3xl mb-3">⚠️</div>
          <h1 className="text-lg font-bold text-[var(--fg-1)]">Identificador de sessão ausente</h1>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Não foi possível verificar a confirmação do pagamento sem o ID de sessão do Stripe.
          </p>
          <div className="mt-6">
            <Link href="/planos" className="btn btn--primary text-xs py-2">
              Voltar aos Planos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("Erro ao recuperar sessão do Stripe:", err);
  }

  if (!session || session.payment_status !== "paid") {
    return (
      <div className="py-12 max-w-xl mx-auto text-center">
        <PageHeader group="eletto" current="Checkout" />
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-8">
          <div className="text-3xl mb-3">⏳</div>
          <h1 className="text-lg font-bold text-[var(--fg-1)]">Aguardando confirmação</h1>
          <p className="mt-2 text-xs text-[var(--muted)]">
            O pagamento ainda está sendo processado pelo emissor do cartão.
          </p>
          <div className="mt-6">
            <Link href="/" className="btn text-xs py-2">
              Ir para o Painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Activate Pro in the database for the user
  const userId = session.metadata?.userId;
  if (userId) {
    try {
      const pool = getPool();
      await pool.query(
        `UPDATE app_user
         SET plan = 'pro', plan_status = 'active', credits = 999, updated_at = NOW()
         WHERE id = $1`,
        [Number(userId)]
      );
    } catch (err) {
      console.error("Erro ao ativar Pro no banco após confirmação Stripe:", err);
    }
  }

  const amountTotal = (session.amount_total ?? 0);

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <PageHeader group="eletto" current="Assinatura Confirmada" />

      <div className="overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-[var(--card-tone)] shadow-2xl">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-8 text-center text-white">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white text-emerald-600 text-2xl font-bold shadow-lg mb-3">
            ✓
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white">
            Pagamento Confirmado via Stripe
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Bem-vindo ao Eletto Pro!
          </h1>
          <p className="mt-1 text-xs text-emerald-100 max-w-md mx-auto">
            Sua conta profissional foi ativada com sucesso. Você agora tem acesso irrestrito à inteligência forense e dossiês oficiais.
          </p>
        </div>

        {/* Receipt Details */}
        <div className="p-8">
          <div className="rounded-xl border border-[var(--border-2)] bg-[var(--surface)] p-5 text-xs space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[var(--border-1)] pb-2.5">
              <span className="text-[var(--muted)]">Status da Transação:</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                PAGO & HOMOLOGADO
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--border-1)] pb-2.5">
              <span className="text-[var(--muted)]">Valor Faturado:</span>
              <span className="font-bold text-base text-[var(--fg-1)]">
                {formatBRL(amountTotal)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--border-1)] pb-2.5">
              <span className="text-[var(--muted)]">E-mail Cadastrado:</span>
              <span className="text-[var(--fg-1)]">{session.customer_email ?? session.metadata?.userEmail}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">ID da Sessão Stripe:</span>
              <span className="text-[10px] text-[var(--muted-2)] truncate max-w-[240px]">
                {sessionId}
              </span>
            </div>
          </div>

          {/* Unlocked Benefits */}
          <div className="mt-6 space-y-2">
            <div className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[var(--muted-2)] mb-2">
              Recursos Pro Liberados na sua Conta:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--fg-1)]">
                <span className="text-emerald-500">✓</span> Dossiês Periciais em PDF sem marca d&apos;água
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-1)]">
                <span className="text-emerald-500">✓</span> Personalização de Timbre com sua OAB
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-1)]">
                <span className="text-emerald-500">✓</span> Grafo profundo de correlação eleitoral
              </div>
              <div className="flex items-center gap-2 text-[var(--fg-1)]">
                <span className="text-emerald-500">✓</span> Exportação irrestrita de dados em CSV
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/politico/9912/dossie"
              className="btn btn--primary w-full sm:w-auto flex-1 justify-center py-2.5 text-xs font-bold shadow-md"
            >
              Ver Dossiê Pericial Oficial (Pro)
            </Link>
            <Link
              href="/grafo"
              className="btn w-full sm:w-auto flex-1 justify-center py-2.5 text-xs font-medium"
            >
              Explorar Grafo de Redes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
