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
      {/* Caso ambos estejam selecionados e tenhamos dados */}
      {initialData && c1 && c2 ? (
        <div className="flex flex-col gap-6">
          {/* Bancada Unificada de Confronto Frontal (Zero caixas duplicadas) */}
          <div className="relative border border-[var(--border-1)] bg-[var(--surface)]">
            <span className="card-dot card-dot--tl" />
            <span className="card-dot card-dot--tr" />
            <span className="card-dot card-dot--bl" />
            <span className="card-dot card-dot--br" />

            {/* Sub-header do Confronto */}
            <div className="px-5 sm:px-6 py-3 border-b border-[var(--border-1)] flex flex-wrap items-center justify-between gap-3 bg-[var(--card-tone)]/40">
              <div className="tag-pill">
                <span className="tag-pill__square bg-[#1D63FF]" />
                <span className="font-mono text-[10.5px] uppercase tracking-wider">
                  Bancada de Opposition Research · Confronto Direto
                </span>
              </div>
              <Link
                href="/grafo"
                className="btn btn--outline text-xs px-3 py-1 flex items-center gap-1.5"
                style={{ textDecoration: "none" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
                </svg>
                <span>Ver no Grafo de Rede →</span>
              </Link>
            </div>

            {/* Layout dos Dois Candidatos Frente a Frente */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[var(--border-1)] items-stretch">
              {/* Cand 1 */}
              <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="tag-pill">
                      <span className="tag-pill__square bg-[#1D63FF]" />
                      <span className="font-mono text-[10.5px] font-semibold text-[#1D63FF] uppercase tracking-wider">
                        Candidato 01
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearC1}
                      className="text-[11px] font-mono text-[var(--muted-2)] hover:text-[#1D63FF] transition-colors cursor-pointer"
                    >
                      [ alterar ]
                    </button>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-13 h-13 rounded-[0px] overflow-hidden flex-none border border-[var(--border-1)] bg-[var(--card-tone)] flex items-center justify-center">
                      {c1.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c1.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold font-mono text-[var(--fg-1)]">
                          {c1.header.person.canonicalName?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)]">
                          {c1.header.latestCandidacy?.partyAbbr || "S/ Partido"}
                        </span>
                        {c1.header.latestCandidacy?.state && (
                          <span className="text-[11px] font-mono text-[var(--muted-2)]">
                            {c1.header.latestCandidacy.state}
                          </span>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-[var(--fg-1)] truncate mt-1">
                        <Link href={`/politico/${c1.header.person.id}`} className="hover:text-[#1D63FF] transition-colors">
                          {c1.header.person.canonicalName}
                        </Link>
                      </h2>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">{c1.header.latestCandidacy?.office || "Candidato"}</span>
                        <span>·</span>
                        <span className="flex-none font-mono text-[11px]">{c1.header.candidacyCount} eleição(ões)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nexo Central VS & Inverter */}
              <div className="md:col-span-2 p-4 flex flex-col items-center justify-center gap-2 bg-[var(--hover)]/10">
                <div className="font-mono text-xs font-black px-2.5 py-1 bg-[var(--surface)] border border-[var(--border-1)] text-[var(--fg-1)] tracking-widest shadow-xs">
                  VS
                </div>
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Inverter posições dos candidatos"
                  className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[var(--muted-2)] hover:text-[#1D63FF] transition-colors cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
                  </svg>
                  <span>inverter</span>
                </button>
              </div>

              {/* Cand 2 */}
              <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="tag-pill">
                      <span className="tag-pill__square bg-[var(--muted)]" />
                      <span className="font-mono text-[10.5px] font-semibold text-[var(--fg-1)] uppercase tracking-wider">
                        Candidato 02
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearC2}
                      className="text-[11px] font-mono text-[var(--muted-2)] hover:text-[#1D63FF] transition-colors cursor-pointer"
                    >
                      [ alterar ]
                    </button>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-13 h-13 rounded-[0px] overflow-hidden flex-none border border-[var(--border-1)] bg-[var(--card-tone)] flex items-center justify-center">
                      {c2.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c2.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold font-mono text-[var(--fg-1)]">
                          {c2.header.person.canonicalName?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)]">
                          {c2.header.latestCandidacy?.partyAbbr || "S/ Partido"}
                        </span>
                        {c2.header.latestCandidacy?.state && (
                          <span className="text-[11px] font-mono text-[var(--muted-2)]">
                            {c2.header.latestCandidacy.state}
                          </span>
                        )}
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-[var(--fg-1)] truncate mt-1">
                        <Link href={`/politico/${c2.header.person.id}`} className="hover:text-[#1D63FF] transition-colors">
                          {c2.header.person.canonicalName}
                        </Link>
                      </h2>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">{c2.header.latestCandidacy?.office || "Candidato"}</span>
                        <span>·</span>
                        <span className="flex-none font-mono text-[11px]">{c2.header.candidacyCount} eleição(ões)</span>
                      </div>
                    </div>
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
        /* Modo Inicial: Seleção dos 2 Candidatos ou Duelos Sugeridos */
        <div className="flex flex-col gap-6">
          {/* Bancada de Seleção Inicial */}
          <div className="relative border border-[var(--border-1)] bg-[var(--surface)] p-5 sm:p-6">
            <span className="card-dot card-dot--tl" />
            <span className="card-dot card-dot--tr" />
            <span className="card-dot card-dot--bl" />
            <span className="card-dot card-dot--br" />

            <div className="mb-5">
              <div className="tag-pill mb-2">
                <span className="tag-pill__square bg-[#1D63FF]" />
                <span className="font-mono text-[10.5px] uppercase tracking-wider">
                  Bancada de Seleção · Opposition Research
                </span>
              </div>
              <h3 className="text-base font-medium text-[var(--fg-1)]">
                Selecione os dois candidatos para cruzar vínculos, doadores comuns e evolução patrimonial
              </h3>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4">
              <CandidateSearchSlot
                label="Candidato 01"
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
                  className="p-2.5 rounded-[0px] border border-[var(--border-1)] bg-[var(--card-tone)] text-[var(--muted-2)] hover:text-[#1D63FF] hover:border-[#1D63FF] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4" />
                  </svg>
                </button>
              </div>

              <CandidateSearchSlot
                label="Candidato 02"
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

          {/* Duelos Sugeridos em Swiss Grid */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="tag-pill">
                <span className="tag-pill__square bg-[#1D63FF]" />
                <span>Duelos & Confrontos Eleitorais Sugeridos</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--muted-2)]">
                HISTÓRICO OFICIAL · TSE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_DUELS.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(d.c1, d.c2)}
                  className="card--interactive relative p-5 sm:p-6 border border-[var(--border-1)] bg-[var(--surface)] transition-all cursor-pointer group"
                >
                  <span className="card-dot card-dot--tl" />
                  <span className="card-dot card-dot--tr" />
                  <span className="card-dot card-dot--bl" />
                  <span className="card-dot card-dot--br" />

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="card-title font-medium text-base text-[var(--fg-1)] group-hover:text-[#040D42] transition-colors">
                      {d.title}
                    </h4>
                    <span className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 border border-[var(--border-1)] bg-[var(--card-tone)] text-[var(--muted-2)] group-hover:bg-[#EDF2FA] group-hover:text-[#040D42] flex-none">
                      1-clique
                    </span>
                  </div>

                  <p className="card-desc text-xs text-[var(--muted)] mb-4 leading-relaxed group-hover:text-[#3B4C7E] transition-colors">
                    {d.desc}
                  </p>

                  <div className="pt-3 border-t border-[var(--border-1)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-mono text-[11.5px]">
                      <span className="font-semibold text-[#1D63FF]">{d.c1Name} ({d.c1Party})</span>
                      <span className="text-[var(--muted-2)] font-mono">vs</span>
                      <span className="font-semibold text-[var(--fg-1)] group-hover:text-[#040D42]">{d.c2Name} ({d.c2Party})</span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--muted)] group-hover:text-[#3B4C7E]">
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
