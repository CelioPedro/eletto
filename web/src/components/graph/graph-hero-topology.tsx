"use client";

export function GraphHeroTopology() {
  return (
    <div className="relative w-full border border-[var(--border-1)] bg-[var(--card-tone)]/40 p-4 sm:p-6 overflow-hidden">
      {/* Corner dots suíços */}
      <span className="card-dot card-dot--tl" />
      <span className="card-dot card-dot--tr" />
      <span className="card-dot card-dot--bl" />
      <span className="card-dot card-dot--br" />

      {/* Grid sutil de coordenadas de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(#1D63FF_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top telemetry bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-1)] pb-3 mb-3 text-[10px] font-mono text-[var(--muted-2)]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#1D63FF] animate-ping" />
          <span className="text-[var(--fg-1)] font-semibold tracking-wider uppercase">
            TOPOLOGIA DE REDES PERICIAIS · RELATIONAL FORENSICS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>ALGORITMO: D3 FORCE-DIRECTED</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">CRUZAMENTO: TSE ⇄ RFB ⇄ TCU</span>
          <span className="px-1.5 py-0.5 border border-[var(--border-1)] bg-[var(--surface)] text-[var(--fg-1)] font-bold">
            ONLINE
          </span>
        </div>
      </div>

      {/* SVG Diagrama Pericial em Alta Resolução */}
      <div className="relative z-10 w-full overflow-x-auto py-1">
        <svg
          viewBox="0 0 720 180"
          className="w-full min-w-[620px] h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Marcadores de seta com cores padronizadas */}
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1D63FF" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10B981" />
            </marker>
            <marker id="arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F43F5E" />
            </marker>

            {/* Gradientes sutis */}
            <linearGradient id="grad-node-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1D63FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#040D42" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="grad-node-2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="grad-node-3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Mira de precisão nos 4 cantos */}
          <path d="M 15 25 L 15 15 L 25 15" stroke="var(--border-2)" strokeWidth="1.5" />
          <path d="M 705 25 L 705 15 L 695 15" stroke="var(--border-2)" strokeWidth="1.5" />
          <path d="M 15 155 L 15 165 L 25 165" stroke="var(--border-2)" strokeWidth="1.5" />
          <path d="M 705 155 L 705 165 L 695 165" stroke="var(--border-2)" strokeWidth="1.5" />

          {/* Anéis de radar de fundo para os 3 nós */}
          <circle cx="120" cy="90" r="48" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="360" cy="90" r="54" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="600" cy="90" r="48" stroke="var(--border-1)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Vetor 1: Nó 1 -> Nó 2 (Pagamento / Contrato) */}
          <line
            x1="162"
            y1="90"
            x2="312"
            y2="90"
            stroke="#1D63FF"
            strokeWidth="2"
            markerEnd="url(#arrow-blue)"
          />
          {/* Badge Vetor 1 */}
          <g transform="translate(192, 70)">
            <rect width="90" height="18" fill="var(--surface)" stroke="#1D63FF" strokeWidth="1" rx="0" />
            <text x="45" y="12" fill="#1D63FF" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              DESPESA R$ 1.8M
            </text>
          </g>

          {/* Vetor 2: Nó 3 -> Nó 2 (Quadro Societário QSA) */}
          <line
            x1="558"
            y1="90"
            x2="408"
            y2="90"
            stroke="#10B981"
            strokeWidth="2"
            markerEnd="url(#arrow-green)"
          />
          {/* Badge Vetor 2 */}
          <g transform="translate(438, 70)">
            <rect width="90" height="18" fill="var(--surface)" stroke="#10B981" strokeWidth="1" rx="0" />
            <text x="45" y="12" fill="#10B981" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              SÓCIO QSA 45%
            </text>
          </g>

          {/* Vetor 3: Arco Superior (Triangulação Circular Suspeita Nó 3 -> Nó 1) */}
          <path
            d="M 590 60 C 510 10, 210 10, 130 60"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd="url(#arrow-rose)"
            className="animate-pulse"
          />
          {/* Badge Vetor 3 */}
          <g transform="translate(265, 8)">
            <rect width="190" height="20" fill="var(--surface)" stroke="#F43F5E" strokeWidth="1" rx="0" />
            <text x="95" y="13.5" fill="#F43F5E" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              ⚠ TRIANGULAÇÃO CIRCULAR (R$ 420K)
            </text>
          </g>

          {/* NÓ 1: AGENTE POLÍTICO */}
          <g transform="translate(120, 90)" className="cursor-pointer">
            <circle r="34" fill="url(#grad-node-1)" stroke="#1D63FF" strokeWidth="2" />
            {/* Ícone de Usuário / Político */}
            <path
              d="M -8 8 C -8 3, -4 0, 0 0 C 4 0, 8 3, 8 8 Z M 0 -3 C -3.5 -3, -6 -5.5, -6 -9 C -6 -12.5, -3.5 -15, 0 -15 C 3.5 -15, 6 -12.5, 6 -9 C 6 -5.5, 3.5 -3, 0 -3 Z"
              fill="#FFFFFF"
            />
            {/* Retícula de coordenadas */}
            <line x1="-38" y1="0" x2="-34" y2="0" stroke="#1D63FF" strokeWidth="1.5" />
            <line x1="34" y1="0" x2="38" y2="0" stroke="#1D63FF" strokeWidth="1.5" />
            <line x1="0" y1="-38" x2="0" y2="-34" stroke="#1D63FF" strokeWidth="1.5" />
            <line x1="0" y1="34" x2="0" y2="38" stroke="#1D63FF" strokeWidth="1.5" />

            {/* Labels inferiores */}
            <text y="48" fill="var(--fg-1)" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              CANDIDATO ALVO
            </text>
            <text y="61" fill="var(--muted-2)" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
              AGENTE POLÍTICO (TSE)
            </text>
          </g>

          {/* NÓ 2: EMPRESA FORNECEDORA */}
          <g transform="translate(360, 90)" className="cursor-pointer">
            <rect x="-34" y="-34" width="68" height="68" fill="var(--surface)" stroke="var(--border-2)" strokeWidth="2" rx="0" />
            {/* Retângulo interno */}
            <rect x="-26" y="-26" width="52" height="52" fill="var(--card-tone)" stroke="var(--border-1)" strokeWidth="1" />
            {/* Ícone de Prédio / Empresa */}
            <path
              d="M -10 12 L -10 -12 L 2 -12 L 2 12 Z M 2 12 L 2 -6 L 10 -6 L 10 12 Z M -6 -8 L -2 -8 M -6 -2 L -2 -2 M -6 4 L -2 4 M 5 -2 L 7 -2 M 5 4 L 7 4"
              stroke="#1D63FF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Labels inferiores */}
            <text y="48" fill="var(--fg-1)" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              EMPRESA FORNECEDORA
            </text>
            <text y="61" fill="var(--muted-2)" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
              CNPJ INTERMEDIÁRIO (RFB)
            </text>
          </g>

          {/* NÓ 3: SÓCIO OCULTO / DOADOR */}
          <g transform="translate(600, 90)" className="cursor-pointer">
            <circle r="34" fill="url(#grad-node-2)" stroke="#10B981" strokeWidth="2" />
            {/* Ícone de Maleta / Doador */}
            <path
              d="M -9 6 L 9 6 L 9 -4 L -9 -4 Z M -4 -4 L -4 -8 L 4 -8 L 4 -4 M -9 1 L 9 1"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Retícula de coordenadas */}
            <line x1="-38" y1="0" x2="-34" y2="0" stroke="#10B981" strokeWidth="1.5" />
            <line x1="34" y1="0" x2="38" y2="0" stroke="#10B981" strokeWidth="1.5" />
            <line x1="0" y1="-38" x2="0" y2="-34" stroke="#10B981" strokeWidth="1.5" />
            <line x1="0" y1="34" x2="0" y2="38" stroke="#10B981" strokeWidth="1.5" />

            {/* Labels inferiores */}
            <text y="48" fill="var(--fg-1)" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              SÓCIO / DOADOR
            </text>
            <text y="61" fill="var(--muted-2)" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
              VÍNCULO SOCIETÁRIO (QSA)
            </text>
          </g>
        </svg>
      </div>

      {/* Rodapé técnico do Hero */}
      <div className="relative z-10 mt-3 pt-2.5 border-t border-[var(--border-1)] flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#1D63FF]" /> Despesa Direta
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#10B981]" /> Quadro Societário
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-2 bg-rose-500" /> Triangulação em Ciclo
          </span>
        </div>
        <div className="text-[var(--muted-2)]">
          CARIMBO CRIPTOGRÁFICO: SHA-256 VERIFIED
        </div>
      </div>
    </div>
  );
}
