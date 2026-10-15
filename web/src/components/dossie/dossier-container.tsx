"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { ProUpgradeModal } from "@/components/ui/pro-upgrade-modal";
import { LetterheadModal, DEFAULT_LETTERHEAD, type LetterheadConfig } from "./letterhead-modal";

export function DossierContainer({
  personId,
  candidateName,
  protocolId,
  sha256Hash,
  formattedDate,
  children,
}: {
  personId: number;
  candidateName: string;
  protocolId: string;
  sha256Hash: string;
  formattedDate: string;
  children: ReactNode;
}) {
  const { user, openAuthModal, togglePlan } = useAuth();
  const [copied, setCopied] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);
  const [letterheadModalOpen, setLetterheadModalOpen] = useState(false);
  const [letterhead, setLetterhead] = useState<LetterheadConfig>(DEFAULT_LETTERHEAD);

  const isPro = user?.plan === "pro" || user?.plan === "escritorio";

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eletto_letterhead_config");
        if (saved) {
          setLetterhead(JSON.parse(saved));
        }
      } catch {}
    }
  }, []);

  function handlePrint() {
    window.print();
  }

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900 print:bg-white print:text-black">
      {/* Top action toolbar (hidden on print) */}
      <div className="print:hidden sticky top-0 z-50 border-b border-[var(--border-1)] bg-[var(--surface)]/95 backdrop-blur-md shadow-md">
        {/* Banner de status / modo */}
        {!isPro ? (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
              <span>⚠️</span>
              <span>
                <strong>Modo Demonstrativo:</strong> O laudo impresso conterá marca d&apos;água. Para remover e certificar para juntada judicial (PJe), assine o Pro.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlan}
                className="font-mono text-[11px] underline text-amber-700 dark:text-amber-400 hover:opacity-80 cursor-pointer"
                title="Ativar Pro para testar sem custo"
              >
                [⚡ Testar como Pro]
              </button>
              <button
                type="button"
                onClick={() => (user ? setProModalOpen(true) : openAuthModal("register"))}
                className="rounded bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-0.5 text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
              >
                Assinar Pro
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-blue-600/10 border-b border-blue-500/20 px-6 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
              <span>★</span>
              <span>
                <strong>Acesso Pro Ativo:</strong> Laudo pericial com fé pública e validade para instrução judicial. Marca d&apos;água removida.
              </span>
            </div>
            <button
              type="button"
              onClick={togglePlan}
              className="font-mono text-[11px] underline text-blue-600 dark:text-blue-300 hover:opacity-80 cursor-pointer"
              title="Alternar de volta para Free"
            >
              [⚡ Voltar para Free]
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/politico/${personId}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] font-medium text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors"
            >
              ← Voltar ao perfil
            </Link>
            <span className="hidden sm:inline-block h-4 w-[1px] bg-[var(--border-1)]" />
            <span className="hidden sm:inline-block font-mono text-[11px] text-[var(--muted-2)]">
              Dossiê Pericial: <strong className="text-[var(--fg-1)] font-semibold">{candidateName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/politico/${personId}/peca-juridica`}
              className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 text-[12px] font-semibold transition-all shadow-xs"
              title="Redigir Minuta de Notícia-Crime ou Representação com IA com base neste dossiê"
            >
              <span>⚖ Gerar Peça Jurídica</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                if (isPro) {
                  setLetterheadModalOpen(true);
                } else {
                  setProModalOpen(true);
                }
              }}
              className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-[var(--border-2)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] font-medium text-[var(--fg-1)] hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
              title="Personalizar cabeçalho da sua banca de advocacia no documento"
            >
              <span>Personalizar Timbre</span>
              <span className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold ${isPro ? "bg-blue-600 text-white" : "bg-[var(--accent)]/15 text-[var(--accent-2)]"}`}>
                {isPro ? "ATIVO" : "PRO"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-[12px] font-medium text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
              title="Copiar link permanente deste dossiê"
            >
              {copied ? "✓ Link copiado" : "Copiar link"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 text-[12px] font-semibold tracking-wide uppercase transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>{isPro ? "Baixar PDF Oficial" : "Imprimir / PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Document Paper Container */}
      <main className="relative mx-auto my-8 max-w-[210mm] bg-white p-8 sm:p-14 shadow-2xl rounded-sm border border-slate-200 print:my-0 print:border-none print:shadow-none print:p-0">
        
        {/* Marca d'água pericial (renderizada apenas se não for Pro) */}
        {!isPro ? (
          <div className="print-watermark select-none">
            CÓPIA DEMONSTRATIVA · LAUDO OFICIAL NO PLANO PRO
          </div>
        ) : null}

        {/* Cabeçalho Pericial Customizado (se configurado pelo usuário Pro) */}
        {isPro && (letterhead.firmName || letterhead.lawyerName) ? (
          <div className="mb-6 rounded border-2 border-slate-800 bg-slate-50 p-4 text-center">
            <div className="font-serif text-lg font-bold tracking-tight text-slate-900 uppercase">
              {letterhead.firmName || "Assessoria & Perícia Eleitoral"}
            </div>
            {letterhead.lawyerName ? (
              <div className="font-sans text-xs font-semibold text-slate-700 mt-0.5">
                {letterhead.lawyerName} {letterhead.oab ? `· ${letterhead.oab}` : ""}
              </div>
            ) : null}
            <div className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-1">
              Documento Pericial Instruído para Uso Processual
            </div>
          </div>
        ) : null}

        {/* Cabeçalho Oficial Padrão */}
        <header className="border-b-2 border-slate-900 pb-5 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">
                  e
                </span>
                <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
                  eletto
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-700 border border-slate-200">
                  AUDITORIA ELEITORAL
                </span>
                {isPro ? (
                  <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border border-emerald-300">
                    CERTIFICADO PRO
                  </span>
                ) : (
                  <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border border-amber-300">
                    DEMO
                  </span>
                )}
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                Sistema Integrado de Perícia e Conformidade Política
              </p>
            </div>

            <div className="text-right font-mono text-[10px] text-slate-500">
              <div><strong className="text-slate-800">Protocolo:</strong> {protocolId}</div>
              <div><strong className="text-slate-800">Emissão:</strong> {formattedDate} (BRT)</div>
              <div><strong className="text-slate-800">Hash SHA-256:</strong> {sha256Hash.slice(0, 16)}…</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-950 sm:text-2xl">
              {isPro && letterhead.customTitle ? letterhead.customTitle : "Dossiê Pericial de Conformidade Eleitoral"}
            </h1>
            <p className="mt-1 text-xs text-slate-600 max-w-xl mx-auto">
              Relatório pericial estruturado a partir de dados públicos do Tribunal Superior Eleitoral (TSE),
              Receita Federal do Brasil (RFB) e Controladoria-Geral da União (CGU).
            </p>
          </div>
        </header>

        {/* Conteúdo do Dossiê */}
        {children}

        {/* Certidão Final de Fé Pública e Custódia */}
        <section className="mt-10 border-t-2 border-slate-900 pt-5 break-inside-avoid text-xs">
          <div className="rounded border border-slate-300 bg-slate-50 p-4 font-mono text-[10px] text-slate-600 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 font-bold text-slate-800 uppercase">
              <span>Ata de Custódia & Fé Pública dos Registros</span>
              <span className="text-blue-700">SHA-256: {sha256Hash.slice(0, 20)}…</span>
            </div>
            <p>
              Certifico que os dados constantes deste laudo foram extraídos diretamente dos bancos públicos da Justiça Eleitoral e da Receita Federal. O hash SHA-256 abaixo constitui a impressão digital única deste acervo de dados no momento de sua emissão:
            </p>
            <div className="my-2 p-2 rounded bg-slate-100 border border-slate-200 text-center font-mono font-bold text-slate-900 break-all select-all text-[9.5px]">
              {sha256Hash}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] mt-2">
              <div>
                <strong>Responsável pela Geração:</strong> {user ? `${user.name} (${user.email})` : "Acesso Público"}
              </div>
              <div>
                <strong>Status de Homologação:</strong> {isPro ? "HOMOLOGADO - APTO PARA INSTRUIÇÃO PROCESSUAL" : "PRÉVIA DEMONSTRATIVA"}
              </div>
            </div>
            <div className="mt-3 text-center border-t border-slate-200 pt-2 text-slate-500 text-[9px]">
              Para verificação pericial online deste documento, acesse:{" "}
              <span className="text-blue-700 underline">https://eletto.app/politico/{personId}/dossie</span>
            </div>
          </div>
        </section>
      </main>

      <ProUpgradeModal
        open={proModalOpen}
        onClose={() => setProModalOpen(false)}
        featureTitle="Dossiê Pericial Homologado sem Marca d'Água"
        featureDescription="Emita laudos periciais com fé pública, certificação criptográfica SHA-256 completa, personalização de timbre da sua banca e sem qualquer marca d'água."
        samplePreview="[Sua Banca de Advocacia] · Laudo Pericial Eleitoral · Responsável: Dr(a). [Seu Nome] · OAB/UF [Número]"
        benefits={[
          "Remoção integral da marca d'água demonstrativa nos PDFs e impressões",
          "Personalização de cabeçalho com timbre e dados do advogado responsável",
          "Ata de custódia com hash SHA-256 auditável para instrução em PJe",
          "Dossiês e consultas ilimitadas para o seu escritório",
        ]}
      />

      <LetterheadModal
        open={letterheadModalOpen}
        onClose={() => setLetterheadModalOpen(false)}
        onSave={(newConfig) => setLetterhead(newConfig)}
      />
    </div>
  );
}
