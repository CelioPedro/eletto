"use client";

import { GraphHeroTopology } from "./graph-hero-topology";
import type { GraphSearchResult } from "@/lib/queries";

interface TargetPreset {
  name: string;
  party: string;
  office: string;
  state: string;
  cpfCnpj?: string;
  type: "person" | "company";
  searchQuery: string;
}

const PRESET_TARGETS: TargetPreset[] = [
  {
    name: "Luiz Inácio Lula da Silva",
    party: "PT",
    office: "Presidente da República",
    state: "BR",
    cpfCnpj: "07068093868",
    type: "person",
    searchQuery: "Lula",
  },
  {
    name: "Jair Messias Bolsonaro",
    party: "PL",
    office: "Ex-Presidente da República",
    state: "BR",
    cpfCnpj: "45317828791",
    type: "person",
    searchQuery: "Bolsonaro",
  },
  {
    name: "Tarcísio Gomes de Freitas",
    party: "REPUBLICANOS",
    office: "Governador do Estado",
    state: "SP",
    cpfCnpj: "18077783805",
    type: "person",
    searchQuery: "Tarcisio",
  },
  {
    name: "Guilherme Castro Boulos",
    party: "PSOL",
    office: "Deputado Federal",
    state: "SP",
    cpfCnpj: "22732996807",
    type: "person",
    searchQuery: "Boulos",
  },
  {
    name: "Ricardo Luis Reis Nunes",
    party: "MDB",
    office: "Prefeito de São Paulo",
    state: "SP",
    type: "person",
    searchQuery: "Ricardo Nunes",
  },
  {
    name: "Tabata Claudia Amaral",
    party: "PSB",
    office: "Deputada Federal",
    state: "SP",
    type: "person",
    searchQuery: "Tabata Amaral",
  },
];

interface GraphCommandCenterProps {
  onAddNode: (result: GraphSearchResult) => void;
  onQueryChange: (query: string) => void;
}

export function GraphCommandCenter({ onAddNode, onQueryChange }: GraphCommandCenterProps) {
  const handleSelectTarget = (target: TargetPreset) => {
    if (target.cpfCnpj) {
      onAddNode({
        type: target.type,
        cpfCnpj: target.cpfCnpj,
        label: target.name,
        sublabel: `${target.party} · ${target.office}`,
      });
    } else {
      onQueryChange(target.searchQuery);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 py-6 px-4 sm:px-6">
      {/* Cabeçalho Editorial Suíço */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[var(--border-1)] pb-5">
        <div>
          <div className="tag-pill mb-2">
            <span className="tag-pill__square bg-[#1D63FF]" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider">
              MOTOR DE INTELIGÊNCIA PERICIAL · VÍNCULOS D3 FORCE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg-1)]">
            Investigação de Vínculos, Doações e Redes Societárias
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)] max-w-3xl leading-relaxed">
            Mapeie triangulações financeiras entre campanhas, descubra sócios ocultos (QSA) em empresas contratadas
            pelo poder público e rastreie o caminho mais curto entre quaisquer duas entidades no Brasil.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px] text-[var(--muted-2)]">
          <span className="w-2 h-2 bg-[#10B981]" />
          <span>MOTOR PERICIAL ATIVO</span>
        </div>
      </div>

      {/* Mídia / Diagrama de Topologia de Rede em Destaque */}
      <GraphHeroTopology />

      {/* Grade Principal com 2 Colunas: Alvos Pré-Configurados & Modos de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Alvos Oficiais (7 Colunas) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="tag-pill">
              <span className="tag-pill__square bg-[#1D63FF]" />
              <span className="font-mono text-[11px] font-semibold text-[var(--fg-1)] uppercase">
                Alvos Oficiais para Investigação Imediata
              </span>
            </div>
            <span className="font-mono text-[10.5px] text-[var(--muted-2)]">
              [ 1-CLIQUE PARA CARREGAR ]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_TARGETS.map((t) => (
              <div
                key={t.name}
                onClick={() => handleSelectTarget(t)}
                className="card--interactive relative p-3.5 border border-[var(--border-1)] bg-[var(--surface)] hover:border-[#1D63FF] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <span className="card-dot card-dot--tl" />
                <span className="card-dot card-dot--tr" />
                <span className="card-dot card-dot--bl" />
                <span className="card-dot card-dot--br" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.2 bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)]">
                      {t.party}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--muted-2)]">
                      {t.state}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[13px] text-[var(--fg-1)] group-hover:text-[#1D63FF] transition-colors truncate">
                    {t.name}
                  </h3>
                  <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                    {t.office}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--border-1)] flex items-center justify-between font-mono text-[10.5px]">
                  <span className="text-[var(--muted-2)] group-hover:text-[#1D63FF] transition-colors">
                    Rastrear Grafo →
                  </span>
                  <span className="text-[9px] uppercase px-1 bg-[var(--card-tone)] text-[var(--muted-2)]">
                    TSE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Metodologias & Modos Forenses (5 Colunas) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="tag-pill">
            <span className="tag-pill__square bg-[var(--muted)]" />
            <span className="font-mono text-[11px] font-semibold text-[var(--fg-1)] uppercase">
              Vetores & Capacidades Forenses
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Vetor 1 */}
            <div className="relative p-3.5 border border-[var(--border-1)] bg-[var(--surface)]">
              <span className="card-dot card-dot--tl" />
              <span className="card-dot card-dot--tr" />
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 mt-1.5 bg-[#F43F5E] flex-none" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--fg-1)]">
                    Triangulação Circular de Doações
                  </h4>
                  <p className="text-[11.5px] text-[var(--muted)] mt-0.5 leading-relaxed">
                    Identifica repasses em ciclo fechado onde verbas de campanha saem para uma empresa fornecedora e retornam a candidatos coligados.
                  </p>
                </div>
              </div>
            </div>

            {/* Vetor 2 */}
            <div className="relative p-3.5 border border-[var(--border-1)] bg-[var(--surface)]">
              <span className="card-dot card-dot--tl" />
              <span className="card-dot card-dot--tr" />
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 mt-1.5 bg-[#10B981] flex-none" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--fg-1)]">
                    Quadro Societário & Parentesco (QSA)
                  </h4>
                  <p className="text-[11.5px] text-[var(--muted)] mt-0.5 leading-relaxed">
                    Cruza dados da Receita Federal para encontrar sócios ocultos, procuradores e empresas satélites operadas por parentes de agentes públicos.
                  </p>
                </div>
              </div>
            </div>

            {/* Vetor 3 */}
            <div className="relative p-3.5 border border-[var(--border-1)] bg-[var(--surface)]">
              <span className="card-dot card-dot--tl" />
              <span className="card-dot card-dot--tr" />
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 mt-1.5 bg-[#1D63FF] flex-none" />
                <div>
                  <h4 className="text-xs font-semibold text-[var(--fg-1)]">
                    Caminho Mais Curto (Relational Paths)
                  </h4>
                  <p className="text-[11.5px] text-[var(--muted)] mt-0.5 leading-relaxed">
                    Algoritmo de varredura bidirecional que calcula a menor distância de relacionamento financeiro ou societário entre duas entidades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dica Operacional e Orientação Pericial */}
      <div className="border border-[var(--border-1)] bg-[var(--card-tone)]/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--muted)] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#1D63FF] font-bold">INFO:</span>
          <span>
            Você também pode digitar qualquer nome, CPF ou CNPJ de 14 dígitos diretamente na barra de busca superior.
          </span>
        </div>
        <div className="text-[var(--muted-2)] text-[11px] flex-none">
          BASE DADOS OFICIAIS TSE · RFB · TCU
        </div>
      </div>
    </div>
  );
}
