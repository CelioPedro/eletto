"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

type BillingCycle = "monthly" | "annual";

export function PricingTable() {
  const { user, openAuthModal, togglePlan } = useAuth();
  const [cycle, setCycle] = useState<BillingCycle>("annual");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [checkoutModal, setCheckoutModal] = useState<{
    open: boolean;
    planName: string;
    price: string;
  }>({
    open: false,
    planName: "",
    price: "",
  });

  const isAnnual = cycle === "annual";
  const isPro = user?.plan === "pro" || user?.plan === "escritorio";

  const handleOpenCheckout = (planName: string, price: string) => {
    if (!user) {
      openAuthModal("register");
      return;
    }
    setCheckoutModal({ open: true, planName, price });
  };

  const closeCheckout = () => {
    setCheckoutModal({ open: false, planName: "", price: "" });
  };

  const faqs = [
    {
      q: "Os Dossiês Periciais do Eletto possuem validade jurídica em peças processuais?",
      a: "Sim. Nossos relatórios são gerados com assinatura criptográfica SHA-256 e ata técnica de custódia referenciando as fontes oficiais de fé pública (TSE, Receita Federal, Portal da Transparência do Governo Federal). Isso garante rastreabilidade temporal e integridade forense para subsidiar AIGEs, AIJEs, representações no Ministério Público Eleitoral (MPE) ou auditorias de conformidade corporativa.",
    },
    {
      q: "Com qual frequência os dados eleitorais e de fornecedores são atualizados?",
      a: "Os dados de candidaturas e prestação de contas são sincronizados continuamente com os repositórios oficiais abertos. Durante o período de prestação de contas parcial e final das eleições, as rotinas de ingestão executam a cada 6 horas.",
    },
    {
      q: "O que é a detecção de 'Doação Circular' e 'Sócio Fornecedor'?",
      a: "São algoritmos periciais de grafos que detectam padrões anômalos de fluxo financeiro. A doação circular identifica recursos que saem de uma campanha e retornam por terceiros (triangulação). O sócio fornecedor mapeia quando empresas contratadas por candidatos possuem sócios em comum com a própria chapa ou com partidos coligados.",
    },
    {
      q: "Existe fidelidade ou carência na assinatura?",
      a: "No plano Mensal você pode cancelar a qualquer momento sem qualquer multa ou taxa de cancelamento. No plano Anual, você garante 20% de economia (equivalente a 2 meses gratuitos) e o acesso é assegurado pelo ciclo de 12 meses.",
    },
    {
      q: "Como é feita a emissão de Nota Fiscal e pagamento?",
      a: "Emitimos Nota Fiscal de prestação de serviços com emissão automática contra o CNPJ de seu escritório ou CPF. Aceitamos Cartão de Crédito, PIX e Boleto Bancário (faturamento para órgãos públicos e escritórios).",
    },
  ];

  return (
    <div className="w-full">
      {/* Billing Switcher */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="inline-flex items-center rounded-full border border-[var(--border-2)] bg-[var(--card-tone)] p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`rounded-full px-5 py-2 font-sans text-xs font-semibold transition-all ${
              !isAnnual
                ? "bg-[var(--accent)] text-white shadow-md"
                : "text-[var(--muted)] hover:text-[var(--fg-1)]"
            }`}
          >
            Faturamento Mensal
          </button>
          <button
            type="button"
            onClick={() => setCycle("annual")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-semibold transition-all ${
              isAnnual
                ? "bg-[var(--accent)] text-white shadow-md"
                : "text-[var(--muted)] hover:text-[var(--fg-1)]"
            }`}
          >
            <span className="whitespace-nowrap">Faturamento Anual</span>
            <span className="whitespace-nowrap rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
              Economize 20%
            </span>
          </button>
        </div>
        <p className="font-mono text-[11px] text-[var(--muted-2)]">
          Preços em Reais (BRL). Sem taxas ocultas.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Tier 1: Comunidade */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-[var(--border-1)] bg-[var(--card-tone)] p-8 shadow-sm transition-all hover:border-[var(--border-2)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                Básico
              </span>
              <span className="rounded bg-[var(--border-1)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                Comunidade
              </span>
            </div>
            <h3 className="mt-3 font-sans text-2xl font-bold text-[var(--fg-1)]">
              Gratuito
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Para cidadãos, estudantes e pesquisadores que necessitam de consultas públicas pontuais.
            </p>

            <div className="my-6 border-t border-[var(--border-1)] pt-6">
              <div className="flex items-baseline gap-1">
                <span className="font-sans text-4xl font-extrabold text-[var(--fg-1)]">
                  R$ 0
                </span>
                <span className="font-mono text-xs text-[var(--muted-2)]">/mês</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-[var(--muted-2)]">
                Acesso livre sem cartão de crédito
              </p>
            </div>

            <ul className="space-y-3 text-xs text-[var(--fg-2)]">
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Busca nominal de candidatos e doadores</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Visualização de evolução patrimonial declarada</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Consulta a receitas e despesas de campanha</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Grafo de correlação simplificado (até 1 salto)</span>
              </li>
              <li className="flex items-start gap-2.5 text-[var(--muted-2)]">
                <CrossIcon />
                <span className="line-through">Dossiê Pericial em PDF oficial com hash SHA-256</span>
              </li>
              <li className="flex items-start gap-2.5 text-[var(--muted-2)]">
                <CrossIcon />
                <span className="line-through">Detecção de nós ocultos e doação circular profunda</span>
              </li>
              <li className="flex items-start gap-2.5 text-[var(--muted-2)]">
                <CrossIcon />
                <span className="line-through">Exportação de dados tabulares (CSV/Excel)</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-1)]">
            {user && !isPro ? (
              <div className="flex w-full items-center justify-center py-2 text-xs font-semibold text-[var(--muted)] border border-[var(--border-1)] rounded-lg">
                ✓ Seu Plano Atual (3 créditos)
              </div>
            ) : (
              <Link
                href="/"
                className="btn flex w-full items-center justify-center py-2.5 text-xs font-semibold"
              >
                Usar Versão Gratuita
              </Link>
            )}
          </div>
        </div>

        {/* Tier 2: Perito Pro (Featured) */}
        <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[var(--accent)] bg-[var(--card-tone)] p-8 pt-9 shadow-xl shadow-[var(--accent)]/10 ring-1 ring-[var(--accent)]/30">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[var(--accent)] px-3.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-white shadow-md">
              Mais Escolhido por Advogados
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-2)]">
                Perícia Forense
              </span>
              <span className="rounded bg-[var(--accent)]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--accent-2)]">
                PRO
              </span>
            </div>
            <h3 className="mt-3 font-sans text-2xl font-bold text-[var(--fg-1)]">
              Perito & Jurídico Pro
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Auditoria eleitoral completa para advogados eleitoralistas, analistas de risco e conformidade.
            </p>

            <div className="my-6 border-t border-[var(--border-1)] pt-6">
              <div className="flex items-baseline gap-1">
                <span className="font-sans text-4xl font-extrabold text-[var(--fg-1)]">
                  {isAnnual ? "R$ 390" : "R$ 490"}
                </span>
                <span className="font-mono text-xs text-[var(--muted-2)]">/mês</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-[var(--accent-2)]">
                {isAnnual
                  ? "Faturado anualmente (R$ 4.680/ano — Economia de R$ 1.200)"
                  : "Cobrado mensalmente. Cancele quando quiser."}
              </p>
            </div>

            <ul className="space-y-3 text-xs text-[var(--fg-1)]">
              <li className="flex items-start gap-2.5 font-medium">
                <CheckIcon active />
                <span>
                  <strong>Dossiês Periciais ilimitados</strong> com chancela SHA-256 e ata de integridade
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon active />
                <span>
                  <strong>Grafo de correlação profundo</strong> (até 5 saltos com busca de rota mínima)
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon active />
                <span>
                  Motor de detecção de <strong>Doações Circulares</strong> e <strong>Sócios Fornecedores</strong>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon active />
                <span>Monitor e cruzamento de <strong>Emendas Parlamentares Federais</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon active />
                <span>Análises sintéticas com IA jurídica sobre anomalias de contas</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon active />
                <span>Exportação completa de dados em CSV / Excel</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon active />
                <span>Até 3 assentos simultâneos por escritório</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-1)]">
            {isPro ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>★ Seu Plano Atual (Ativo)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleOpenCheckout(
                    "Perito & Jurídico Pro",
                    isAnnual ? "R$ 390/mês (anual)" : "R$ 490/mês"
                  )
                }
                className="btn btn--primary flex w-full items-center justify-center py-2.5 text-xs font-bold cursor-pointer"
              >
                {user ? "Fazer Upgrade para Pro" : "Criar Conta & Assinar Pro"}
              </button>
            )}
          </div>
        </div>

        {/* Tier 3: Enterprise / Institucional */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-[var(--border-1)] bg-[var(--card-tone)] p-8 shadow-sm transition-all hover:border-[var(--border-2)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                Grandes Operações
              </span>
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-400">
                INSTITUCIONAL
              </span>
            </div>
            <h3 className="mt-3 font-sans text-2xl font-bold text-[var(--fg-1)]">
              Enterprise & API
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              Para partidos nacionais, órgãos de controle, tribunais, bancos e redações investigativas.
            </p>

            <div className="my-6 border-t border-[var(--border-1)] pt-6">
              <div className="flex items-baseline gap-1">
                <span className="font-sans text-4xl font-extrabold text-[var(--fg-1)]">
                  {isAnnual ? "R$ 1.590" : "R$ 1.990"}
                </span>
                <span className="font-mono text-xs text-[var(--muted-2)]">/mês</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-[var(--muted-2)]">
                Planos multi-usuários com onboarding assistido
              </p>
            </div>

            <ul className="space-y-3 text-xs text-[var(--fg-2)]">
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>
                  <strong>Acesso à API REST & GraphQL</strong> com chave corporativa de alta vazão
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Enriquecimento e cruzamento de <strong>lotes massivos</strong> (batch CPFs/CNPJs)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Usuários ilimitados com controle de permissões por perfil (RBAC)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Webhooks para alertas de alteração patrimonial e novas doações</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>SLA contratual de 99,9% e atendimento prioritário em 2 horas</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckIcon />
                <span>Ata notarial e suporte pericial assistido para litígios</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-1)]">
            <button
              type="button"
              onClick={() =>
                handleOpenCheckout(
                  "Enterprise & Institucional",
                  isAnnual ? "R$ 1.590/mês (anual)" : "R$ 1.990/mês"
                )
              }
              className="btn flex w-full items-center justify-center py-2.5 text-xs font-semibold"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="mt-20">
        <div className="text-center">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-[var(--fg-1)]">
            Matriz Comparativa de Recursos
          </h2>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Compare minuciosamente cada capacidade técnica de cada modalidade do Eletto.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-1)] bg-[var(--surface)] font-mono text-[11px] text-[var(--muted-2)]">
                <tr>
                  <th className="p-4 font-semibold">Funcionalidade / Capacidade</th>
                  <th className="p-4 text-center font-semibold">Gratuito</th>
                  <th className="p-4 text-center font-semibold text-[var(--accent-2)]">Perito Pro</th>
                  <th className="p-4 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-1)]">
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Consultas Nominais e Candidaturas</td>
                  <td className="p-4 text-center text-[var(--muted)]">Ilimitadas</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Ilimitadas</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Ilimitadas</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Gerador de Dossiê Pericial em PDF</td>
                  <td className="p-4 text-center text-[var(--muted-2)]">Não incluso</td>
                  <td className="p-4 text-center font-bold text-emerald-500">Ilimitado (SHA-256)</td>
                  <td className="p-4 text-center font-bold text-emerald-500">Ilimitado + Marca d&apos;água Custom</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Profundidade do Grafo de Relações</td>
                  <td className="p-4 text-center text-[var(--muted)]">1 salto direto</td>
                  <td className="p-4 text-center font-semibold text-[var(--accent-2)]">Até 5 saltos</td>
                  <td className="p-4 text-center font-semibold text-[var(--accent-2)]">Ilimitado (Global)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Detecção de Doações Circulares</td>
                  <td className="p-4 text-center text-[var(--muted-2)]">Apenas alertas gerais</td>
                  <td className="p-4 text-center font-semibold text-emerald-500">Caminho do ciclo detalhado</td>
                  <td className="p-4 text-center font-semibold text-emerald-500">Caminho + Exportação para processo</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Auditoria de Sócios Fornecedores</td>
                  <td className="p-4 text-center text-[var(--muted-2)]">Resumo</td>
                  <td className="p-4 text-center font-semibold text-emerald-500">Completo com QSA da Receita</td>
                  <td className="p-4 text-center font-semibold text-emerald-500">Completo + Histórico de alterações</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Monitor de Emendas Orçamentárias</td>
                  <td className="p-4 text-center text-[var(--muted)]">Acesso simples</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Cruzamento com favorecidos</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Cruzamento em tempo real</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Exportação em Massa (CSV / Excel)</td>
                  <td className="p-4 text-center text-[var(--muted-2)]">Não incluso</td>
                  <td className="p-4 text-center font-semibold text-emerald-500">Sim</td>
                  <td className="p-4 text-center font-semibold text-emerald-500">Sim + JSON/Parquet</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Acesso via API</td>
                  <td className="p-4 text-center text-[var(--muted-2)]">Não incluso</td>
                  <td className="p-4 text-center text-[var(--muted-2)]">Não incluso</td>
                  <td className="p-4 text-center font-bold text-emerald-500">REST & GraphQL dedicado</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Assentos Simultâneos</td>
                  <td className="p-4 text-center text-[var(--muted)]">1 usuário</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Até 3 usuários</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Customizado / Ilimitado</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--fg-1)]">Suporte Técnico</td>
                  <td className="p-4 text-center text-[var(--muted)]">Comunidade</td>
                  <td className="p-4 text-center font-semibold text-[var(--fg-1)]">Email prioritário (24h)</td>
                  <td className="p-4 text-center font-bold text-[var(--accent-2)]">WhatsApp / Slack direto (SLA 2h)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust & Legal Integrity Shield */}
      <div className="mt-20 rounded-2xl border border-[var(--border-2)] bg-[var(--surface)] p-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h4 className="font-sans text-base font-bold text-[var(--fg-1)]">
                Segurança Criptográfica & Conformidade Rigorosa com a LGPD
              </h4>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Todos os dados são coletados exclusivamente de bases públicas sob a Lei de Acesso à Informação (Lei 12.527/11) e tratados sob o Art. 7º da LGPD. Nenhuma informação é adulterada ou mascarada.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="pill-tech">
              <span className="pill-dot pill-dot--green" />
              SHA-256 Validated
            </span>
            <span className="pill-tech">
              <span className="pill-dot" />
              TSE / RFB Sync
            </span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="mt-20">
        <div className="text-center">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-[var(--fg-1)]">
            Perguntas Frequentes
          </h2>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Tire suas dúvidas técnicas, operacionais e contratuais sobre a plataforma Eletto.
          </p>
        </div>

        <div className="mt-8 space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-xs font-semibold text-[var(--fg-1)] hover:bg-[var(--hover)]"
                >
                  <span className="text-sm">{faq.q}</span>
                  <span className="ml-4 flex size-5 shrink-0 items-center justify-center font-mono text-sm text-[var(--muted)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <div className="border-t border-[var(--border-1)] p-5 text-xs leading-relaxed text-[var(--muted)] bg-[var(--surface)]">
                    {faq.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout / Contact Modal Simulation */}
      {checkoutModal.open ? (
        <div className="modal-backdrop" onClick={closeCheckout}>
          <div
            className="modal max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-1)] pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-2)]">
                  Solicitação de Acesso
                </span>
                <h3 className="font-sans text-lg font-bold text-[var(--fg-1)]">
                  {checkoutModal.planName}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCheckout}
                className="modal__close"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!isPro) {
                  await togglePlan();
                }
                alert(
                  `Parabéns ${user?.name || ""}! Sua assinatura do ${checkoutModal.planName} foi ativada com sucesso. Você agora tem acesso Pro com dossiês oficiais ilimitados.`
                );
                closeCheckout();
              }}
              className="mt-5 space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-[var(--muted-2)]">
                  Valor Selecionado:
                </label>
                <div className="mt-1 font-mono text-base font-bold text-[var(--fg-1)]">
                  {checkoutModal.price}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--fg-2)]">
                  Seu Nome Completo:
                </label>
                <input
                  required
                  type="text"
                  defaultValue={user?.name || ""}
                  placeholder="Dra. Mariana Silva"
                  className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--fg-2)]">
                  Email Institucional / Profissional:
                </label>
                <input
                  required
                  type="email"
                  defaultValue={user?.email || ""}
                  placeholder="mariana@advocacia.com.br"
                  className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--fg-2)]">
                  WhatsApp / Telefone para ativação:
                </label>
                <input
                  required
                  type="tel"
                  defaultValue={user?.phone || ""}
                  placeholder="(11) 98765-4321"
                  className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--fg-2)]">
                  Escritório / Organização (opcional):
                </label>
                <input
                  type="text"
                  defaultValue={user?.organization || ""}
                  placeholder="Silva & Associados Eleitoral"
                  className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn--primary w-full justify-center py-2.5 font-bold cursor-pointer"
                >
                  Confirmar e Ativar Acesso Pro Imediato
                </button>
              </div>

              <p className="text-center font-mono text-[10px] text-[var(--muted-2)]">
                Emissão de Nota Fiscal contra CNPJ ou CPF disponível no faturamento.
              </p>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CheckIcon({ active }: { active?: boolean }) {
  return (
    <svg
      className={`size-4 shrink-0 ${active ? "text-emerald-500" : "text-emerald-500"}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-slate-400 opacity-60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
