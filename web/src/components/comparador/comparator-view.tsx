"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ComparisonResult } from "@/lib/queries";
import { CandidateSearchSlot } from "./candidate-search-slot";
import { ComparatorScoreboard } from "./comparator-scoreboard";
import { SharedDonorsTable } from "./shared-donors-table";
import { SharedSuppliersTable } from "./shared-suppliers-table";
import { SignalsComparison } from "./signals-comparison";

interface ComparatorViewProps {
  initialData: ComparisonResult | null;
  c1Id: number | null;
  c2Id: number | null;
}

const PRESET_DUELS = [
  {
    title: "Lula vs Bolsonaro",
    desc: "Eleição Presidencial 2022 / Confronto Nacional",
    c1: 522047,
    c2: 24156,
    c1Name: "Lula",
    c1Party: "PT",
    c2Name: "Jair Bolsonaro",
    c2Party: "PL",
    highlight: "1 Doador em Comum · 9 Fornecedores em Comum",
  },
  {
    title: "Guilherme Boulos vs Pablo Marçal",
    desc: "Prefeitura de São Paulo 2024 / Disputa Capital",
    c1: 530111,
    c2: 909821,
    c1Name: "Guilherme Boulos",
    c1Party: "PSOL",
    c2Name: "Pablo Marçal",
    c2Party: "PRTB",
    highlight: "9 Fornecedores e Gráficas em Comum",
  },
  {
    title: "Tarcísio de Freitas vs Lula",
    desc: "Governador SP vs Presidente da República",
    c1: 909223,
    c2: 522047,
    c1Name: "Tarcísio de Freitas",
    c1Party: "REP",
    c2Name: "Lula",
    c2Party: "PT",
    highlight: "Análise Cruzada Executivo Federal e Estadual",
  },
  {
    title: "Eduardo Paes vs Wilson Lima",
    desc: "Prefeitura Rio de Janeiro vs Governo Amazonas",
    c1: 515294,
    c2: 521871,
    c1Name: "Eduardo Paes",
    c1Party: "PSD",
    c2Name: "Wilson Lima",
    c2Party: "UNIÃO",
    highlight: "Comparações Interestaduais e Fornecedores",
  },
];

export function ComparatorView({ initialData, c1Id, c2Id }: ComparatorViewProps) {
  const router = useRouter();

  const handleSelectC1 = (id: number) => {
    const params = new URLSearchParams();
    params.set("c1", String(id));
    if (c2Id) params.set("c2", String(c2Id));
    router.push(`/comparador?${params.toString()}`);
  };

  const handleSelectC2 = (id: number) => {
    const params = new URLSearchParams();
    if (c1Id) params.set("c1", String(c1Id));
    params.set("c2", String(id));
    router.push(`/comparador?${params.toString()}`);
  };

  const handleClearC1 = () => {
    const params = new URLSearchParams();
    if (c2Id) params.set("c2", String(c2Id));
    router.push(`/comparador?${params.toString()}`);
  };

  const handleClearC2 = () => {
    const params = new URLSearchParams();
    if (c1Id) params.set("c1", String(c1Id));
    router.push(`/comparador?${params.toString()}`);
  };

  const handleSwap = () => {
    if (c1Id && c2Id) {
      router.push(`/comparador?c1=${c2Id}&c2=${c1Id}`);
    }
  };

  const handleApplyPreset = (p1: number, p2: number) => {
    router.push(`/comparador?c1=${p1}&c2=${p2}`);
  };

  const c1 = initialData?.candidate1;
  const c2 = initialData?.candidate2;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Selector Bar */}
      <div className="rounded-xl border border-[var(--border-2)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <CandidateSearchSlot
            label="Candidato A"
            slotNumber={1}
            currentPersonId={c1?.header.person.id ?? c1Id}
            currentName={c1?.header.person.canonicalName}
            currentOffice={c1?.header.latestCandidacy?.office}
            currentParty={c1?.header.latestCandidacy?.partyAbbr}
            currentState={c1?.header.latestCandidacy?.state}
            currentPhotoUrl={c1?.photoUrl}
            onSelect={handleSelectC1}
            onClear={handleClearC1}
          />

          {/* Botão de Inverter */}
          <div className="flex items-center justify-center flex-none">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!c1Id || !c2Id}
              title="Inverter posições dos candidatos"
              className="p-2.5 rounded-full border border-[var(--border-2)] bg-[var(--card-tone)] text-[var(--muted-2)] hover:text-[var(--accent-2)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
              </svg>
            </button>
          </div>

          <CandidateSearchSlot
            label="Candidato B"
            slotNumber={2}
            currentPersonId={c2?.header.person.id ?? c2Id}
            currentName={c2?.header.person.canonicalName}
            currentOffice={c2?.header.latestCandidacy?.office}
            currentParty={c2?.header.latestCandidacy?.partyAbbr}
            currentState={c2?.header.latestCandidacy?.state}
            currentPhotoUrl={c2?.photoUrl}
            onSelect={handleSelectC2}
            onClear={handleClearC2}
          />
        </div>
      </div>

      {/* Caso ambos estejam selecionados e tenhamos dados */}
      {initialData && c1 && c2 ? (
        <div className="flex flex-col gap-6">
          {/* Header VS Card */}
          <div className="rounded-xl border border-[var(--border-2)] bg-gradient-to-r from-blue-950/20 via-[var(--surface)] to-purple-950/20 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Cand 1 Card */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-none border-2 border-blue-500/50 shadow-lg bg-[var(--surface)] flex items-center justify-center">
                  {c1.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c1.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-blue-400">
                      {c1.header.person.canonicalName?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold">
                      {c1.header.latestCandidacy?.partyAbbr || "S/ Partido"}
                    </span>
                    {c1.header.latestCandidacy?.state && (
                      <span className="text-xs text-[var(--muted-2)] font-mono">
                        {c1.header.latestCandidacy.state}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[var(--fg-1)] truncate mt-1">
                    <Link href={`/pessoa/${c1.header.person.id}`} className="hover:text-blue-400 transition-colors">
                      {c1.header.person.canonicalName}
                    </Link>
                  </h2>
                  <div className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5">
                    <span>{c1.header.latestCandidacy?.office || "Candidato"}</span>
                    <span>· {c1.header.candidacyCount} candidaturas</span>
                  </div>
                </div>
              </div>

              {/* VS Badge & Quick Action */}
              <div className="flex flex-col items-center justify-center gap-2 flex-none px-4">
                <div className="w-12 h-12 rounded-full border border-[var(--border-2)] bg-[var(--card-tone)] flex items-center justify-center font-black font-mono text-base text-[var(--accent-2)] shadow-md">
                  VS
                </div>
                <Link
                  href={`/grafo`}
                  className="btn btn--outline text-xs px-3 py-1 flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="18" r="3" />
                    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
                  </svg>
                  Grafo de Rede
                </Link>
              </div>

              {/* Cand 2 Card */}
              <div className="flex items-center gap-4 flex-1 min-w-0 flex-row-reverse md:flex-row text-right md:text-left">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-none border-2 border-purple-500/50 shadow-lg bg-[var(--surface)] flex items-center justify-center">
                  {c2.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c2.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-purple-400">
                      {c2.header.person.canonicalName?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 justify-end md:justify-start">
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold">
                      {c2.header.latestCandidacy?.partyAbbr || "S/ Partido"}
                    </span>
                    {c2.header.latestCandidacy?.state && (
                      <span className="text-xs text-[var(--muted-2)] font-mono">
                        {c2.header.latestCandidacy.state}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[var(--fg-1)] truncate mt-1">
                    <Link href={`/pessoa/${c2.header.person.id}`} className="hover:text-purple-400 transition-colors">
                      {c2.header.person.canonicalName}
                    </Link>
                  </h2>
                  <div className="text-xs text-[var(--muted)] flex items-center gap-2 mt-0.5 justify-end md:justify-start">
                    <span>{c2.header.latestCandidacy?.office || "Candidato"}</span>
                    <span>· {c2.header.candidacyCount} candidaturas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placar Geral */}
          <ComparatorScoreboard c1={c1} c2={c2} />

          {/* Interseção de Doadores */}
          <SharedDonorsTable
            sharedDonors={initialData.sharedDonors}
            totalCents={initialData.sharedDonorsTotalCents}
            c1Name={c1.header.person.canonicalName?.split(" ")[0] || "Candidato 1"}
            c2Name={c2.header.person.canonicalName?.split(" ")[0] || "Candidato 2"}
          />

          {/* Interseção de Fornecedores */}
          <SharedSuppliersTable
            sharedSuppliers={initialData.sharedSuppliers}
            totalCents={initialData.sharedSuppliersTotalCents}
            c1Name={c1.header.person.canonicalName?.split(" ")[0] || "Candidato 1"}
            c2Name={c2.header.person.canonicalName?.split(" ")[0] || "Candidato 2"}
          />

          {/* Sinais de Risco Lado a Lado */}
          <SignalsComparison c1={c1} c2={c2} />
        </div>
      ) : (
        /* Empty State / Duelos Clássicos */
        <div className="flex flex-col gap-6 py-6">
          <div className="p-8 rounded-xl border border-[var(--border-2)] bg-[var(--surface)] text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[var(--card-tone)] border border-[var(--border-2)] flex items-center justify-center mx-auto mb-4 text-[var(--accent-2)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-[var(--fg-1)]">
              Módulo de Inteligência &quot;Frente a Frente&quot;
            </h3>
            <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
              Cruze instantaneamente prestações de contas, doadores em comum, fornecedores compartilhados e patrimônio entre dois adversários políticos.
            </p>
            <div className="mt-4 text-xs font-mono text-[var(--accent-2)]">
              Selecione os dois candidatos acima ou escolha um dos duelos sugeridos abaixo:
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--fg-1)] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              Duelos & Rivais Eleitorais Sugeridos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_DUELS.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(d.c1, d.c2)}
                  className="p-5 rounded-xl border border-[var(--border-2)] bg-[var(--surface)] hover:bg-[var(--card-tone)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[var(--fg-1)] group-hover:text-[var(--accent-2)] transition-colors">
                      {d.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[var(--surface)] text-[var(--muted-2)] border border-[var(--border-1)]">
                      1-clique
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-4">
                    {d.desc}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-1)] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-400 font-medium">{d.c1Name} ({d.c1Party})</span>
                      <span className="text-[var(--muted-2)] font-mono">vs</span>
                      <span className="font-mono text-purple-400 font-medium">{d.c2Name} ({d.c2Party})</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {d.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
