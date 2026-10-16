"use client";

export function GraphHeroTopology() {
  return (
    <div className="relative w-full border border-[var(--border-1)] bg-[var(--surface)] p-5 sm:p-7 overflow-hidden">
      {/* Corner dots suíços do container */}
      <span className="card-dot card-dot--tl" />
      <span className="card-dot card-dot--tr" />
      <span className="card-dot card-dot--bl" />
      <span className="card-dot card-dot--br" />

      {/* Grid sutil de coordenadas periciais */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-1)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-1)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />

      {/* Barra de telemetria pericial superior */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-1)] pb-3.5 mb-4 text-[10.5px] font-mono text-[var(--muted)]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D63FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D63FF]" />
          </span>
          <span className="text-[var(--fg-1)] font-semibold tracking-wider uppercase">
            MODELO DE DETECÇÃO RELACIONAL FORENSE
          </span>
          <span className="hidden md:inline px-1.5 py-0.2 bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--muted-2)] text-[9.5px]">
            ALGORITMO BFS / D3 FORCE
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-[var(--muted-2)]">
          <span className="hidden sm:inline">MOTOR: TSE DIVULGACAND ⇄ RFB CNPJ ⇄ TCU</span>
          <span className="px-2 py-0.5 border border-[var(--border-1)] bg-[var(--card-tone)] text-[var(--fg-1)] font-bold">
            MATRIZ ATIVA
          </span>
        </div>
      </div>

      {/* SVG Diagrama Pericial com Quatro Quinas e Triangulação Circular Suave */}
      <div className="relative z-10 w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 880 250"
          className="w-full min-w-[760px] h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            @keyframes flowDash {
              to {
                stroke-dashoffset: -28;
              }
            }
            .flow-line-animated {
              stroke-dasharray: 6 5;
              animation: flowDash 2.4s linear infinite;
            }
            .flow-line-circular {
              stroke-dasharray: 7 5;
              animation: flowDash 1.8s linear infinite reverse;
            }
          `}</style>

          <defs>
            {/* Marcadores de seta de alta precisão */}
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1D63FF" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
            </marker>
            <marker id="arrow-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F43F5E" />
            </marker>
          </defs>

          {/* ============================================================== */}
          {/* DETALHES DAS QUATRO QUINAS FORENSES (VIEWFINDER RETICLES)      */}
          {/* ============================================================== */}
          <path d="M 18 32 L 18 16 L 34 16" stroke="var(--border-2)" strokeWidth="1.5" />
          <path d="M 862 32 L 862 16 L 846 16" stroke="var(--border-2)" strokeWidth="1.5" />
          <path d="M 18 218 L 18 234 L 34 234" stroke="var(--border-2)" strokeWidth="1.5" />
          <path d="M 862 218 L 862 234 L 846 234" stroke="var(--border-2)" strokeWidth="1.5" />

          {/* ============================================================== */}
          {/* CAMADA 1: NÓS E CONEXÕES FANTASMAS (SEM COLISÕES COM TEXTO)   */}
          {/* ============================================================== */}

          {/* Nó Ghost 1: Coligação B (Extremo Superior Esquerdo) */}
          <g opacity="0.45" transform="translate(80, 68)">
            <circle r="16" fill="var(--card-tone)" stroke="var(--border-2)" strokeWidth="1" strokeDasharray="3 3" />
            <g transform="translate(-7, -7) scale(0.58)" stroke="var(--muted-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </g>
            <text y="26" fill="var(--muted-2)" fontSize="8" fontFamily="monospace" textAnchor="middle">
              COLIGAÇÃO B
            </text>
          </g>
          {/* Linha Ghost 1 -> Nó 1 (Ombro superior esquerdo) */}
          <line x1="96" y1="76" x2="152" y2="135" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

          {/* Nó Ghost 2: Fornecedor Satélite (Vale inferior direito) */}
          <g opacity="0.45" transform="translate(570, 218)">
            <rect x="-16" y="-11" width="32" height="22" fill="var(--card-tone)" stroke="var(--border-2)" strokeWidth="1" strokeDasharray="3 3" />
            <g transform="translate(-6.5, -8.5) scale(0.55)" stroke="var(--muted-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <rect width="16" height="20" x="4" y="2" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
              <path d="M12 10h.01" />
              <path d="M12 14h.01" />
            </g>
            <text y="21" fill="var(--muted-2)" fontSize="8" fontFamily="monospace" textAnchor="middle">
              FORNECEDOR SATÉLITE
            </text>
          </g>
          {/* Linha Central -> Nó Ghost 2 */}
          <line x1="469" y1="168" x2="554" y2="210" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

          {/* Nó Ghost 3: Empresa Holding (Extremo Superior Direito) */}
          <g opacity="0.45" transform="translate(800, 68)">
            <circle r="16" fill="var(--card-tone)" stroke="var(--border-2)" strokeWidth="1" strokeDasharray="3 3" />
            <g transform="translate(-7, -7) scale(0.58)" stroke="var(--muted-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            </g>
            <text y="26" fill="var(--muted-2)" fontSize="8" fontFamily="monospace" textAnchor="middle">
              EMPRESA HOLDING
            </text>
          </g>
          {/* Linha Sócio -> Nó Ghost 3 */}
          <line x1="784" y1="76" x2="728" y2="135" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

          {/* ============================================================== */}
          {/* CAMADA 2: TRIANGULAÇÃO CIRCULAR (CURVA SUAVE PARABÓLICA LIMPA) */}
          {/* ============================================================== */}

          {/* Arco Contínuo Suave Nó 3 -> Nó 1 (Sem ganchos nem curvas retas) */}
          <path
            d="M 663 110 C 560 38, 320 38, 217 110"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="1.75"
            className="flow-line-circular"
            markerEnd="url(#arrow-rose)"
          />

          {/* Badge Superior de Alerta de Triangulação Circular (Elegante e Centralizado) */}
          <g transform="translate(305, 12)">
            <rect width="270" height="25" fill="var(--surface)" stroke="#F43F5E" strokeWidth="1.25" rx="0" />
            <rect x="0" y="0" width="4" height="25" fill="#F43F5E" />
            <circle cx="15" cy="12.5" r="3" fill="#F43F5E" className="animate-pulse" />
            <text x="26" y="16" fill="var(--fg-1)" fontSize="9" fontFamily="monospace" fontWeight="bold">
              TRIANGULAÇÃO CIRCULAR DETECTADA
            </text>
            <text x="215" y="16" fill="#F43F5E" fontSize="9" fontFamily="monospace" fontWeight="bold">
              R$ 420.000
            </text>
          </g>

          {/* ============================================================== */}
          {/* CAMADA 3: VETORES HORIZONTAIS E CÁPSULAS DE DADOS              */}
          {/* ============================================================== */}

          {/* Vetor 1: Nó 1 (Candidato) -> Nó 2 (Empresa) */}
          <line
            x1="216"
            y1="155"
            x2="405"
            y2="155"
            stroke="#1D63FF"
            strokeWidth="1.75"
            className="flow-line-animated"
            markerEnd="url(#arrow-blue)"
          />
          {/* Cápsula de Dados do Vetor 1 */}
          <g transform="translate(254, 122)">
            <rect width="116" height="25" fill="var(--surface)" stroke="var(--border-1)" strokeWidth="1" rx="0" />
            <line x1="0" y1="0" x2="3" y2="0" stroke="#1D63FF" strokeWidth="2" />
            <text x="58" y="12" fill="var(--fg-1)" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              R$ 1.850.000
            </text>
            <text x="58" y="21" fill="#1D63FF" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">
              DESPESA ELEITORAL
            </text>
          </g>

          {/* Vetor 2: Nó 3 (Sócio/Doador) -> Nó 2 (Empresa) */}
          <line
            x1="664"
            y1="155"
            x2="475"
            y2="155"
            stroke="#10B981"
            strokeWidth="1.75"
            className="flow-line-animated"
            markerEnd="url(#arrow-green)"
          />
          {/* Cápsula de Dados do Vetor 2 */}
          <g transform="translate(510, 122)">
            <rect width="116" height="25" fill="var(--surface)" stroke="var(--border-1)" strokeWidth="1" rx="0" />
            <line x1="0" y1="0" x2="3" y2="0" stroke="#10B981" strokeWidth="2" />
            <text x="58" y="12" fill="var(--fg-1)" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              45% CAPITAL SOCIAL
            </text>
            <text x="58" y="21" fill="#10B981" fontSize="7.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.05em">
              SÓCIO ADMIN (QSA)
            </text>
          </g>

          {/* ============================================================== */}
          {/* CAMADA 4: OS 3 NÓS CENTRAIS COM ESPAÇAMENTOS EQUILIBRADOS       */}
          {/* ============================================================== */}

          {/* NÓ 1: CANDIDATO ALVO (X: 180, Y: 155) */}
          <g transform="translate(180, 155)" className="cursor-pointer group">
            {/* Anéis de precisão */}
            <circle r="44" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle r="34" fill="var(--surface)" stroke="#1D63FF" strokeWidth="1.75" />
            <circle r="27" fill="var(--card-tone)" stroke="var(--border-1)" strokeWidth="1" />

            {/* Ícone Lucide UserCheck: Perfil de Agente Político Validado */}
            <g transform="translate(-11.5, -11.5) scale(0.96)" stroke="#1D63FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </g>

            {/* Retícula de mira */}
            <line x1="-38" y1="0" x2="-34" y2="0" stroke="#1D63FF" strokeWidth="1.5" />
            <line x1="34" y1="0" x2="38" y2="0" stroke="#1D63FF" strokeWidth="1.5" />
            <line x1="0" y1="-38" x2="0" y2="-34" stroke="#1D63FF" strokeWidth="1.5" />
            <line x1="0" y1="34" x2="0" y2="38" stroke="#1D63FF" strokeWidth="1.5" />

            {/* Micro-chip superior */}
            <g transform="translate(-34, -52)">
              <rect width="68" height="15" fill="var(--surface)" stroke="#1D63FF" strokeWidth="1" rx="0" />
              <text x="34" y="10.5" fill="#1D63FF" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                [ CANDIDATO ]
              </text>
            </g>

            {/* Tipografia de identificação inferior */}
            <text y="50" fill="var(--fg-1)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              CANDIDATO ALVO
            </text>
            <text y="64" fill="var(--muted-2)" fontSize="9" fontFamily="monospace" textAnchor="middle">
              AGENTE POLÍTICO (TSE)
            </text>
          </g>

          {/* NÓ 2: EMPRESA FORNECEDORA (CENTRAL X: 440, Y: 155) */}
          <g transform="translate(440, 155)" className="cursor-pointer group">
            {/* Anel de precisão */}
            <circle r="46" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            
            {/* Moldura técnica quadrada com chanfro suíço */}
            <rect x="-31" y="-31" width="62" height="62" fill="var(--surface)" stroke="var(--border-2)" strokeWidth="1.5" rx="0" />
            <rect x="-24" y="-24" width="48" height="48" fill="var(--card-tone)" stroke="var(--border-1)" strokeWidth="1" />

            {/* Ícone Lucide Building2: Sede Corporativa & Fornecedor de Campanha */}
            <g transform="translate(-11.5, -11.5) scale(0.96)" stroke="var(--fg-1)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
              <path d="M10 6h4" />
              <path d="M10 10h4" />
              <path d="M10 14h4" />
              <path d="M10 18h4" />
            </g>

            {/* Retícula de mira */}
            <line x1="-35" y1="0" x2="-31" y2="0" stroke="var(--border-2)" strokeWidth="1.5" />
            <line x1="31" y1="0" x2="35" y2="0" stroke="var(--border-2)" strokeWidth="1.5" />
            <line x1="0" y1="-35" x2="0" y2="-31" stroke="var(--border-2)" strokeWidth="1.5" />
            <line x1="0" y1="31" x2="0" y2="35" stroke="var(--border-2)" strokeWidth="1.5" />

            {/* Micro-chip superior */}
            <g transform="translate(-44, -52)">
              <rect width="88" height="15" fill="var(--surface)" stroke="var(--border-2)" strokeWidth="1" rx="0" />
              <text x="44" y="10.5" fill="var(--fg-1)" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                [ CNPJ INTERMEDIÁRIO ]
              </text>
            </g>

            {/* Tipografia de identificação inferior */}
            <text y="50" fill="var(--fg-1)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              FORNECEDOR DE CAMPANHA
            </text>
            <text y="64" fill="var(--muted-2)" fontSize="9" fontFamily="monospace" textAnchor="middle">
              EMPRESA CONTRATADA (RFB)
            </text>
          </g>

          {/* NÓ 3: SÓCIO OCULTO / DOADOR (X: 700, Y: 155) */}
          <g transform="translate(700, 155)" className="cursor-pointer group">
            {/* Anéis de precisão */}
            <circle r="44" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle r="34" fill="var(--surface)" stroke="#10B981" strokeWidth="1.75" />
            <circle r="27" fill="var(--card-tone)" stroke="var(--border-1)" strokeWidth="1" />

            {/* Ícone Lucide BriefcaseBusiness: Executivo / Sócio de Capital / Investidor */}
            <g transform="translate(-11.5, -11.5) scale(0.96)" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M12 12h.01" />
              <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <path d="M22 13a18.15 18.15 0 0 1-20 0" />
              <rect width="20" height="14" x="2" y="6" rx="2" />
            </g>

            {/* Retícula de mira */}
            <line x1="-38" y1="0" x2="-34" y2="0" stroke="#10B981" strokeWidth="1.5" />
            <line x1="34" y1="0" x2="38" y2="0" stroke="#10B981" strokeWidth="1.5" />
            <line x1="0" y1="-38" x2="0" y2="-34" stroke="#10B981" strokeWidth="1.5" />
            <line x1="0" y1="34" x2="0" y2="38" stroke="#10B981" strokeWidth="1.5" />

            {/* Micro-chip superior */}
            <g transform="translate(-37, -52)">
              <rect width="74" height="15" fill="var(--surface)" stroke="#10B981" strokeWidth="1" rx="0" />
              <text x="37" y="10.5" fill="#10B981" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                [ SÓCIO / DOADOR ]
              </text>
            </g>

            {/* Tipografia de identificação inferior */}
            <text y="50" fill="var(--fg-1)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              SÓCIO VINCULADO
            </text>
            <text y="64" fill="var(--muted-2)" fontSize="9" fontFamily="monospace" textAnchor="middle">
              QUADRO SOCIETÁRIO (QSA)
            </text>
          </g>
        </svg>
      </div>

      {/* Rodapé técnico do Hero */}
      <div className="relative z-10 mt-3 pt-3 border-t border-[var(--border-1)] flex flex-wrap items-center justify-between gap-3 text-[10.5px] font-mono text-[var(--muted)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#1D63FF]" /> Fluxo de Despesa Direta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#10B981]" /> Vínculo Societário RFB (QSA)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-2 bg-[#F43F5E] animate-pulse" /> Triangulação em Ciclo Fechado
          </span>
        </div>
        <div className="text-[var(--muted-2)] font-mono">
          CONFIDENCIALIDADE: PERÍCIA FORENSE AUDITÁVEL
        </div>
      </div>
    </div>
  );
}
