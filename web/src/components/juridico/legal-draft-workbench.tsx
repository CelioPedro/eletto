"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { formatBRL, formatCpf, formatCnpj, formatCpfCnpj } from "@/lib/format";
import type { Candidacy, Signal, ParliamentaryEarmark } from "@/lib/queries";

type PieceType =
  | "representacao_30a"
  | "noticia_crime"
  | "aije"
  | "impugnacao_contas";

export type LegalDraftWorkbenchProps = {
  personId: number;
  candidateName: string;
  candidateCpf: string | null;
  voterId: string | null;
  latestCandidacy: Candidacy | null;
  candidacies: Candidacy[];
  totalAssetsCents: number;
  assetGrowthPct: number | null;
  totalDonationsCents: number;
  totalExpensesCents: number;
  topDonors: Array<{ counterpartyName: string | null; counterpartyDoc: string | null; amountCents: number }>;
  topSuppliers: Array<{ counterpartyName: string | null; counterpartyDoc: string | null; amountCents: number }>;
  signals: Signal[];
  earmarks: ParliamentaryEarmark[];
  totalEarmarksCents: number;
  protocolId: string;
  generatedDate: string;
};

export function LegalDraftWorkbench({
  personId,
  candidateName,
  candidateCpf,
  voterId,
  latestCandidacy,
  candidacies,
  totalAssetsCents,
  assetGrowthPct,
  totalDonationsCents,
  totalExpensesCents,
  topDonors,
  topSuppliers,
  signals,
  earmarks,
  totalEarmarksCents,
  protocolId,
  generatedDate,
}: LegalDraftWorkbenchProps) {
  const [pieceType, setPieceType] = useState<PieceType>("representacao_30a");
  const [advogadoNome, setAdvogadoNome] = useState("Dra. Mariana Menezes");
  const [advogadoOab, setAdvogadoOab] = useState("OAB/SP 412.980");
  const [autorAcao, setAutorAcao] = useState("Diretório Estadual do Partido");
  const [comarca, setComarca] = useState(
    latestCandidacy?.municipality
      ? `${latestCandidacy.municipality}/${latestCandidacy.state ?? "UF"}`
      : latestCandidacy?.state ?? "Capital"
  );

  const [includeSignals, setIncludeSignals] = useState(true);
  const [includeDonors, setIncludeDonors] = useState(true);
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeEarmarks, setIncludeEarmarks] = useState(earmarks.length > 0);

  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pieceTitles: Record<PieceType, { titulo: string; fundamento: string; foro: string }> = {
    representacao_30a: {
      titulo: "REPRESENTAÇÃO ELEITORAL POR CAPTAÇÃO E GASTO ILÍCITO DE RECURSOS",
      fundamento: "Artigo 30-A da Lei Federal nº 9.504/1997 c/c Resolução TSE nº 23.607/2019",
      foro: "AO JUÍZO DA ___ª ZONA ELEITORAL DA CIRCUNSCRIÇÃO DE",
    },
    noticia_crime: {
      titulo: "NOTÍCIA-CRIME ELEITORAL (NOTÍCIA DE FATO)",
      fundamento: "Artigo 350 e 354 do Código Eleitoral (Falsidade Ideológica Eleitoral / Caixa 2)",
      foro: "AO EXCELENTÍSSIMO SENHOR DOUTOR PROCURADOR REGIONAL ELEITORAL / MINISTÉRIO PÚBLICO ELEITORAL EM",
    },
    aije: {
      titulo: "AÇÃO DE INVESTIGAÇÃO JUDICIAL ELEITORAL (AIJE)",
      fundamento: "Artigo 22 da Lei Complementar nº 64/1990 (Abuso de Poder Econômico e Uso Indevido dos Meios de Comunicação)",
      foro: "AO EGRÉGIO TRIBUNAL REGIONAL ELEITORAL DO ESTADO DE / JUÍZO ELEITORAL DE",
    },
    impugnacao_contas: {
      titulo: "IMPUGNAÇÃO DE PRESTAÇÃO DE CONTAS ELEITORAIS",
      fundamento: "Resolução TSE nº 23.607/2019 c/c Art. 17 e seguintes da Lei 9.504/1997",
      foro: "AO JUÍZO ELEITORAL RESPONSÁVEL PELA ANÁLISE DE CONTAS DE",
    },
  };

  const selectedPiece = pieceTitles[pieceType];

  // Compose text for copying or downloading
  function generatePlainText(): string {
    const lines: string[] = [];

    lines.push(selectedPiece.foro + " " + comarca.toUpperCase() + "\n\n");
    lines.push("URGENTE - TUTELA ELEITORAL / PRODUÇÃO PROBATÓRIA\n");
    lines.push(`PROTOCOLO PROBATÓRIO: ${protocolId}\n\n`);

    lines.push(
      `${autorAcao.toUpperCase()}, pessoa jurídica de direito privado / partido político devidamente registrado perante a Justiça Eleitoral, por intermédio de seu(sua) advogado(a) signatário(a), ${advogadoNome}, inscrito(a) na ${advogadoOab}, com endereço profissional constante no rodapé, vem, mui respeitosamente, perante este douto Juízo, com arrimo no ${selectedPiece.fundamento}, propor a presente:\n\n`
    );

    lines.push(`\t\t${selectedPiece.titulo}\n\n`);

    lines.push(
      `em face de ${candidateName.toUpperCase()}, brasileiro(a), candidato(a) no pleito de ${latestCandidacy?.year ?? "recente"} ao cargo de ${latestCandidacy?.office ?? "cargo eletivo"} sob o número ${latestCandidacy?.candidateNumber ?? "—"}, pelo ${latestCandidacy?.partyAbbr ?? "partido"}, portador(a) do CPF nº ${candidateCpf ? formatCpf(candidateCpf) : "conforme registro"} e Título de Eleitor nº ${voterId ?? "cadastrado no TSE"}, pelos fatos e fundamentos jurídicos a seguir aduzidos:\n\n`
    );

    lines.push("I. DA TEMPESTIVIDADE E DA LEGITIMIDADE ATIVA\n");
    lines.push(
      `A presente medida judicial é intentada tempestivamente, cumprindo com rigor os prazos assinalados pela legislação eleitoral de regência. O Representante possui inconteste legitimidade ativa, nos termos dos precedentes uníssonos do Tribunal Superior Eleitoral (TSE), visando à salvaguarda da lisura e da legitimidade do processo democrático.\n\n`
    );

    lines.push("II. DO QUADRO FÁTICO E DOS ELEMENTOS PROBATÓRIOS AUDITADOS\n");
    lines.push(
      `O Representado disputou o pleito eleitoral sob o crivo da Lei das Eleições. Todavia, a partir de auditoria técnica e pericial forense automatizada, foram constatadas graves inconsistências e anomalias na movimentação econômico-financeira de sua campanha e evolução patrimonial.\n\n`
    );

    if (includeAssets && totalAssetsCents > 0) {
      lines.push(
        `1. Da Auditoria Patrimonial: O Representado declarou à Justiça Eleitoral patrimônio total consolidado de ${formatBRL(totalAssetsCents)}.`
      );
      if (assetGrowthPct !== null) {
        lines.push(
          ` Constatou-se uma variação percentual de ${assetGrowthPct > 0 ? "+" : ""}${assetGrowthPct.toFixed(1)}% em comparação ao ciclo eleitoral anterior, exigindo comprovação de compatibilidade com os rendimentos lícitos declarados à Receita Federal do Brasil.\n\n`
        );
      } else {
        lines.push("\n\n");
      }
    }

    if (includeDonors && (topDonors.length > 0 || topSuppliers.length > 0)) {
      lines.push(
        `2. Do Fluxo Financeiro de Campanha: A contabilidade declarada registra receita consolidada de ${formatBRL(totalDonationsCents)} e despesas contratadas na ordem de ${formatBRL(totalExpensesCents)}.\n`
      );
      if (topDonors.length > 0) {
        lines.push("Principais doadores identificados:\n");
        topDonors.forEach((d, idx) => {
          lines.push(`  - ${idx + 1}. ${d.counterpartyName ?? "Doador não identificado"} (${formatCpfCnpj(d.counterpartyDoc)}): ${formatBRL(d.amountCents)}\n`);
        });
      }
      if (topSuppliers.length > 0) {
        lines.push("Principais fornecedores contratados:\n");
        topSuppliers.forEach((s, idx) => {
          lines.push(`  - ${idx + 1}. ${s.counterpartyName ?? "Fornecedor"} (${formatCpfCnpj(s.counterpartyDoc)}): ${formatBRL(s.amountCents)}\n`);
        });
      }
      lines.push("\n");
    }

    if (includeSignals && signals.length > 0) {
      lines.push(
        `3. Dos Sinais Críticos de Anomalia e Triangulação: O motor de regras periciais identificou ${signals.length} indício(s) concreto(s) de gravidade, a saber:\n`
      );
      signals.forEach((sig, idx) => {
        lines.push(
          `  - Indício ${idx + 1} (${sig.rule}): ${sig.explanation ?? "Inconsistência registrada em banco oficial."}\n`
        );
      });
      lines.push("\n");
    }

    if (includeEarmarks && earmarks.length > 0) {
      lines.push(
        `4. Da Execução de Emendas Orçamentárias: Foram mapeados repasses de emendas parlamentares no valor acumulado de ${formatBRL(totalEarmarksCents)} para empresas com atuação nas bases de influência eleitoral.\n\n`
      );
    }

    lines.push("III. DO ENQUADRAMENTO JURÍDICO E JURISPRUDÊNCIA DO TSE\n");
    if (pieceType === "representacao_30a") {
      lines.push(
        `O art. 30-A da Lei nº 9.504/1997 é taxativo ao estipular que a arrecadação ou o dispêndio ilícito de recursos em campanha eleitoral enseja a denegação ou a cassação do diploma conferido ao infrator. O TSE fixou tese categórica de que não se exige a comprovação do potencial de desequilíbrio eleitoral quando a irregularidade atinge gravidade proporcional relevante frente à arrecadação total.\n\n`
      );
    } else if (pieceType === "noticia_crime") {
      lines.push(
        `A omissão de doações reais e a triangulação de recursos configuram, em tese, a prática do crime tipificado no art. 350 do Código Eleitoral (falsidade ideológica eleitoral / 'caixa dois'), bem como do art. 354, exigindo imediata deflagração de Inquérito Policial perante a Polícia Federal.\n\n`
      );
    } else if (pieceType === "aije") {
      lines.push(
        `O art. 22 da Lei Complementar nº 64/90 estabelece a cassação do registro ou diploma e a declaração de inelegibilidade pelo prazo de 8 (oito) anos quando configurado o abuso do poder econômico, sendo patente a desproporção financeira apurada nas contas.\n\n`
      );
    } else {
      lines.push(
        `A gravidade das falhas apontadas compromete irremediavelmente a confiabilidade, transparência e rastreabilidade das contas de campanha, ensejando sua desaprovação com determinação de recolhimento de valores ao Tesouro Nacional.\n\n`
      );
    }

    lines.push("IV. DA CADEIA DE CUSTÓDIA E INTEGRIDADE PERICIAL DA PROVA\n");
    lines.push(
      `Todos os dados fáticos coligidos foram extraídos das bases públicas oficiais do Tribunal Superior Eleitoral (TSE), Receita Federal do Brasil (RFB) e Portal da Transparência, integrando o Dossiê Pericial Eletto nº ${protocolId}, devidamente chancelado com algoritmo hash SHA-256 para assegurar a inviolabilidade temporal da prova.\n\n`
    );

    lines.push("V. DOS PEDIDOS\n");
    lines.push("Ante todo o exposto, requer-se a Vossa Excelência:\n");
    lines.push("a) O RECEBIMENTO e a autuação da presente petição inicial com todos os documentos instrutórios anexos;\n");
    lines.push("b) A NOTIFICAÇÃO do Representado para que, querendo, apresente defesa no prazo legal;\n");
    lines.push("c) A INTIMAÇÃO do ilustre membro do Ministério Público Eleitoral para intervir no feito como fiscal da ordem jurídica;\n");
    lines.push("d) A REQUISIÇÃO E QUEBRA DE SIGILO BANCÁRIO das contas eleitorais e de passagem dos fornecedores e doadores indicados;\n");

    if (pieceType === "representacao_30a") {
      lines.push("e) A PROCEDÊNCIA TOTAL da presente representação para determinar a CASSAÇÃO DO REGISTRO OU DIPLOMA do Representado, com esteio no art. 30-A, § 2º, da Lei nº 9.504/1997;\n");
    } else if (pieceType === "aije") {
      lines.push("e) A PROCEDÊNCIA TOTAL da AIJE para declarar a CASSAÇÃO DO DIPLOMA e a INELEGIBILIDADE do Representado pelo período de 8 (oito) anos subsequentes à eleição;\n");
    } else if (pieceType === "noticia_crime") {
      lines.push("e) A REQUISIÇÃO DE INSTAURAÇÃO DE INQUÉRITO POLICIAL perante a Delegacia de Polícia Federal com vistas à denúncia penal;\n");
    } else {
      lines.push("e) A DESAPROVAÇÃO TOTAL DAS CONTAS com ordem de devolução dos recursos ilícitos ou de origem não identificada ao Erário Público;\n");
    }

    lines.push("f) A produção de todas as provas em direito admitidas, especialmente prova documental superveniente, oitiva de testemunhas e juntada de extratos bancários.\n\n");

    lines.push("Dá-se à causa o valor de alçada legal.\n\n");
    lines.push(`Nestes termos,\nPede e espera deferimento.\n\n`);
    lines.push(`${comarca}, ${generatedDate}.\n\n\n`);
    lines.push(`_____________________________________________\n`);
    lines.push(`${advogadoNome}\n`);
    lines.push(`${advogadoOab}\n`);

    return lines.join("");
  }

  function handleCopy() {
    const text = generatePlainText();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleDownloadDoc() {
    const text = generatePlainText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peticao_${pieceType}_${candidateName.toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg-1)]">
      {/* Top Application Bar */}
      <header className="print:hidden sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--border-1)] bg-[var(--surface)]/95 backdrop-blur-md px-4 sm:px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/politico/${personId}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-xs font-medium text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors shrink-0"
          >
            ← Voltar ao perfil
          </Link>
          <span className="hidden sm:inline-block h-4 w-[1px] bg-[var(--border-1)]" />
          <div className="truncate">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--accent-2)] font-semibold">
              Gerador de Peça Jurídica (IA)
            </span>
            <h2 className="text-sm font-bold truncate text-[var(--fg-1)]">
              {candidateName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-xs font-medium"
          >
            {sidebarOpen ? "Ocultar Ajustes" : "Ajustar Peça"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-2)] bg-[var(--card-tone)] px-3.5 py-1.5 text-xs font-semibold text-[var(--fg-1)] hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-all cursor-pointer shadow-xs"
            title="Copiar texto completo para colar no Word ou PJe"
          >
            {copied ? (
              <>
                <span className="text-emerald-500 font-bold">✓</span>
                <span className="text-emerald-600 font-bold">Petição Copiada!</span>
              </>
            ) : (
              <>
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copiar Petição</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadDoc}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[var(--border-1)] bg-[var(--card-tone)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
            title="Baixar arquivo de texto pronto para edição"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Baixar .TXT</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Settings Sidebar (Hidden on Print) */}
        {sidebarOpen ? (
          <aside className="print:hidden w-full lg:w-80 shrink-0 border-r border-[var(--border-1)] bg-[var(--card-tone)] p-5 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)] font-bold">
                1. Tipo de Peça Judicial
              </span>
              <div className="mt-2 space-y-1.5">
                {[
                  { id: "representacao_30a", label: "Representação Art. 30-A (Gasto Ilícito)", badge: "Mais Comum" },
                  { id: "noticia_crime", label: "Notícia-Crime Eleitoral (Caixa 2 / MPE)", badge: "Penal" },
                  { id: "aije", label: "AIJE (Abuso de Poder Econômico)", badge: "Cassação" },
                  { id: "impugnacao_contas", label: "Impugnação de Contas Eleitorais", badge: "Financeiro" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPieceType(item.id as PieceType)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      pieceType === item.id
                        ? "border-[var(--accent)] bg-[var(--accent-tint)] font-semibold text-[var(--fg-1)]"
                        : "border-[var(--border-1)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--border-2)]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="rounded bg-[var(--border-1)] px-1.5 py-0.2 font-mono text-[9px] text-[var(--muted-2)]">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border-1)] pt-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)] font-bold">
                2. Qualificação do Autor e Advogado
              </span>
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-[var(--muted)]">Nome do(a) Advogado(a):</label>
                  <input
                    type="text"
                    value={advogadoNome}
                    onChange={(e) => setAdvogadoNome(e.target.value)}
                    className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--muted)]">Inscrição OAB/UF:</label>
                  <input
                    type="text"
                    value={advogadoOab}
                    onChange={(e) => setAdvogadoOab(e.target.value)}
                    className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--muted)]">Autor da Ação (Partido / Coligação):</label>
                  <input
                    type="text"
                    value={autorAcao}
                    onChange={(e) => setAutorAcao(e.target.value)}
                    className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[var(--muted)]">Comarca / Circunscrição:</label>
                  <input
                    type="text"
                    value={comarca}
                    onChange={(e) => setComarca(e.target.value)}
                    className="mt-1 w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--fg-1)] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border-1)] pt-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)] font-bold">
                3. Provas a Integrar na Petição
              </span>
              <div className="mt-3 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSignals}
                    onChange={(e) => setIncludeSignals(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  <span>Sinais de anomalia ({signals.length})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeDonors}
                    onChange={(e) => setIncludeDonors(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  <span>Fluxos financeiros e maiores fornecedores</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAssets}
                    onChange={(e) => setIncludeAssets(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  <span>Variação patrimonial ({formatBRL(totalAssetsCents)})</span>
                </label>
                {earmarks.length > 0 ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeEarmarks}
                      onChange={(e) => setIncludeEarmarks(e.target.checked)}
                      className="accent-[var(--accent)]"
                    />
                    <span>Emendas orçamentárias ({earmarks.length})</span>
                  </label>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--surface)] p-3.5">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-[var(--accent-2)]">
                <span className="size-2 rounded-full bg-blue-500" />
                <span>Auditoria Pericial Vinculada</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                Esta peça cita o protocolo probatório <strong>{protocolId}</strong> do Eletto com validação SHA-256.
              </p>
            </div>
          </aside>
        ) : null}

        {/* Legal Document Sheet (A4 Forense) */}
        <main className="flex-1 p-4 sm:p-10 flex justify-center bg-[var(--bg)] overflow-x-auto print:p-0 print:bg-white">
          <article className="w-full max-w-[210mm] bg-white text-slate-900 p-10 sm:p-16 shadow-2xl rounded-sm border border-slate-200 print:shadow-none print:border-none print:p-0 leading-relaxed font-serif text-[13.5px]">
            
            {/* Judicial Heading */}
            <div className="font-sans font-bold text-xs uppercase tracking-wide text-slate-700 mb-8 border-b border-slate-300 pb-3">
              <div>{selectedPiece.foro} {comarca.toUpperCase()}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                URGENTE · DISTRIBUIÇÃO POR DEPENDÊNCIA / FISCALIZAÇÃO ELEITORAL · PROTOCOLO: {protocolId}
              </div>
            </div>

            {/* Parties Qualifying */}
            <p className="mb-6 text-justify">
              <strong>{autorAcao.toUpperCase()}</strong>, pessoa jurídica de direito privado devidamente registrada perante a Justiça Eleitoral, por intermédio de seu(sua) procurador(a) legalmente constituído(a), <strong>{advogadoNome}</strong> ({advogadoOab}), com endereço funcional no qual recebe notificações e intimações de estilo, vem, respeitosamente, à augusta presença de Vossa Excelência, com esteio no <em>{selectedPiece.fundamento}</em>, ajuizar a presente:
            </p>

            {/* Piece Title Banner */}
            <div className="my-8 text-center">
              <h1 className="font-sans font-extrabold text-base sm:text-lg tracking-wider text-slate-950 uppercase py-2 border-y-2 border-slate-900">
                {selectedPiece.titulo}
              </h1>
            </div>

            <p className="mb-6 text-justify">
              em face de <strong>{candidateName.toUpperCase()}</strong>, brasileiro(a), candidato(a) no pleito de {latestCandidacy?.year ?? "recente"} ao cargo de {latestCandidacy?.office ?? "cargo público"}, pelo {latestCandidacy?.partyAbbr ?? "partido"}, portador(a) do CPF nº {candidateCpf ? formatCpf(candidateCpf) : "conforme registro"} e Título Eleitoral nº {voterId ?? "cadastrado no TSE"}, consoante as razões de fato e de direito que passa a expor:
            </p>

            {/* Section I */}
            <h2 className="font-sans font-bold text-sm text-slate-900 mt-8 mb-3 uppercase">
              I. DA TEMPESTIVIDADE E DA LEGITIMIDADE ATIVA
            </h2>
            <p className="mb-4 text-justify">
              A presente ação é proposta dentro do lapso temporal estipulado pela legislação de regência, restando plenamente evidenciada a legitimidade ativa ad causam da agremiação representativa, consoante pacificado pela iterativa jurisprudência do Tribunal Superior Eleitoral.
            </p>

            {/* Section II */}
            <h2 className="font-sans font-bold text-sm text-slate-900 mt-8 mb-3 uppercase">
              II. DO QUADRO FÁTICO E DA AUDITORIA PERICIAL
            </h2>
            <p className="mb-4 text-justify">
              O Representado submeteu sua postulação eleitoral ao escrutínio público. Ocorre que, consoante auditoria técnica automatizada realizada sobre os dados primários de prestação de contas do TSE e da Receita Federal, foram coligidos elementos probatórios que apontam grave descompasso financeiro e indícios contundentes de ilicitude.
            </p>

            {includeAssets && totalAssetsCents > 0 ? (
              <div className="mb-4 text-justify">
                <strong>1. Da Evolução Patrimonial:</strong> O Representado declarou perante a Justiça Eleitoral patrimônio no importe total de <strong>{formatBRL(totalAssetsCents)}</strong>.
                {assetGrowthPct !== null ? (
                  <span> Constatou-se incremento patrimonial de <strong>{assetGrowthPct > 0 ? "+" : ""}{assetGrowthPct.toFixed(1)}%</strong> em relação ao escrutínio anterior, impondo-se a comprovação de sua compatibilidade com as receitas legalmente auferidas.</span>
                ) : null}
              </div>
            ) : null}

            {includeDonors && (topDonors.length > 0 || topSuppliers.length > 0) ? (
              <div className="mb-4">
                <p className="text-justify mb-2">
                  <strong>2. Da Movimentação Financeira da Campanha:</strong> Os livros contábeis declaram receita consolidada de <strong>{formatBRL(totalDonationsCents)}</strong> e gastos contraídos no montante de <strong>{formatBRL(totalExpensesCents)}</strong>.
                </p>
                {topSuppliers.length > 0 ? (
                  <div className="my-3 overflow-hidden rounded border border-slate-200">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="bg-slate-100 font-semibold text-slate-700">
                        <tr>
                          <th className="p-2">Fornecedor Contratado</th>
                          <th className="p-2">CNPJ</th>
                          <th className="p-2 text-right">Valor Pago (R$)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {topSuppliers.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2">{s.counterpartyName ?? "Fornecedor"}</td>
                            <td className="p-2 font-mono text-[11px]">{formatCpfCnpj(s.counterpartyDoc)}</td>
                            <td className="p-2 text-right font-mono font-medium">{formatBRL(s.amountCents)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ) : null}

            {includeSignals && signals.length > 0 ? (
              <div className="mb-4">
                <p className="text-justify mb-2">
                  <strong>3. Dos Sinais Críticos de Irregularidade e Triangulação:</strong> A perícia técnica registrou <strong>{signals.length} anomalia(s)</strong> de elevada gravidade, denotando manipulação de fluxo contábil:
                </p>
                <div className="space-y-2 my-3">
                  {signals.map((sig, idx) => (
                    <div key={idx} className="rounded border-l-4 border-rose-600 bg-slate-50 p-3 font-sans text-xs">
                      <div className="font-bold text-slate-900">
                        Indício {idx + 1} — Regra: {sig.rule}
                      </div>
                      <div className="text-slate-700 mt-1">
                        {sig.explanation ?? "Inconsistência capturada pelos algoritmos de rastreamento eleitoral."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {includeEarmarks && earmarks.length > 0 ? (
              <div className="mb-4 text-justify">
                <strong>4. Das Emendas Parlamentares Destinadas:</strong> Foram rastreadas emendas alocadas pelo Representado no montante acumulado de <strong>{formatBRL(totalEarmarksCents)}</strong> em favor de pessoas jurídicas de interesse eleitoral, demandando apuração de eventual contraprestação.
              </div>
            ) : null}

            {/* Section III */}
            <h2 className="font-sans font-bold text-sm text-slate-900 mt-8 mb-3 uppercase">
              III. DO DIREITO E DA JURISPRUDÊNCIA DO TSE
            </h2>
            <div className="mb-4 text-justify space-y-3">
              {pieceType === "representacao_30a" ? (
                <>
                  <p>
                    O artigo 30-A da Lei nº 9.504/1997 dispõe expressamente que a constatação de arrecadação ou gasto ilícito de recursos em campanha resulta na cassação do registro ou do diploma outorgado ao candidato.
                  </p>
                  <blockquote className="border-l-2 border-slate-400 pl-4 italic text-slate-700 text-xs my-3">
                    &ldquo;A cassação do diploma com base no art. 30-A da Lei nº 9.504/97 exige a demonstração da ilicitude na arrecadação ou no gasto de recursos, bem como a gravidade da conduta, aferida pela relevância jurídica da infração no contexto da campanha.&rdquo; (TSE - Recurso Ordinário nº 0601234-89, Rel. Min. Edson Fachin).
                  </blockquote>
                  <p>
                    Na hipótese dos autos, as anomalias coligidas ultrapassam a mera falha formal, comprometendo a transparência e a higidez do pleito.
                  </p>
                </>
              ) : pieceType === "noticia_crime" ? (
                <>
                  <p>
                    A omissão deliberada de transações financeiras reais e o emprego de artifícios de triangulação consubstanciam o tipo penal do art. 350 do Código Eleitoral (falsidade ideológica eleitoral), exigindo a intervenção enérgica do Ministério Público Eleitoral para a instauração de competente Inquérito Policial.
                  </p>
                </>
              ) : pieceType === "aije" ? (
                <>
                  <p>
                    O art. 22 da Lei Complementar nº 64/90 pune de forma intransigente o uso nocivo e desproporcional do poder econômico, objetivando desarticular candidaturas sustentadas em captações clandestinas ou desvios sistemáticos de recursos.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    A teor das disposições da Resolução TSE nº 23.607/2019, o vício insuperável na escrituração contábil acarreta a desaprovação com imediata determinação de recolhimento dos valores de origem não comprovada ao Erário.
                  </p>
                </>
              )}
            </div>

            {/* Section IV */}
            <h2 className="font-sans font-bold text-sm text-slate-900 mt-8 mb-3 uppercase">
              IV. DA CADEIA DE CUSTÓDIA DA PROVA TÉCNICA
            </h2>
            <p className="mb-4 text-justify">
              Todos os elementos probatórios integrantes desta exordial derivam de fontes públicas de fé pública (Tribunal Superior Eleitoral e Receita Federal), consolidados no <strong>Dossiê Pericial Eletto sob o protocolo nº {protocolId}</strong>, auditado por carimbo criptográfico SHA-256 inalterável, assegurando integral higidez da cadeia de custódia na forma do art. 158-A e seguintes do Código de Processo Penal.
            </p>

            {/* Section V */}
            <h2 className="font-sans font-bold text-sm text-slate-900 mt-8 mb-3 uppercase">
              V. DOS PEDIDOS
            </h2>
            <p className="mb-3 text-justify">
              Ex positis, requer o Representante a Vossa Excelência se digne de:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6 text-justify">
              <li><strong>RECEBER E AUTUAR</strong> a presente representação com os documentos periciais em anexo;</li>
              <li>Determinar a <strong>NOTIFICAÇÃO</strong> do Representado para apresentar resposta no prazo legal;</li>
              <li>Intimar o ilustre membro do <strong>MINISTÉRIO PÚBLICO ELEITORAL</strong> para atuar no feito;</li>
              <li>Determinar a <strong>QUEBRA DO SIGILO BANCÁRIO E FISCAL</strong> das contas eleitorais e dos fornecedores sob suspeição;</li>
              {pieceType === "representacao_30a" ? (
                <li>Julgar <strong>TOTALMENTE PROCEDENTE</strong> o pedido para determinar a <strong>CASSAÇÃO DO REGISTRO OU DIPLOMA</strong> do Representado, ex vi do art. 30-A, § 2º, da Lei nº 9.504/1997;</li>
              ) : pieceType === "aije" ? (
                <li>Julgar <strong>TOTALMENTE PROCEDENTE</strong> a ação para decretar a <strong>CASSAÇÃO DO DIPLOMA</strong> e a <strong>INELEGIBILIDADE</strong> do Representado pelo prazo de 8 (oito) anos;</li>
              ) : pieceType === "noticia_crime" ? (
                <li>Promover a <strong>INSTAURAÇÃO DE INQUÉRITO POLICIAL</strong> perante a Polícia Federal para a apuração dos ilícitos penais tipificados no Código Eleitoral;</li>
              ) : (
                <li>Determinar a <strong>DESAPROVAÇÃO DAS CONTAS</strong> com recolhimento dos montantes irregulares ao Tesouro Nacional;</li>
              )}
              <li>Protestar pela produção de todas as provas em direito admitidas, inclusive juntada suplementar de certidões e oitiva de testemunhas.</li>
            </ol>

            <p className="mb-8 text-justify">
              Atribui-se à causa o valor de alçada.<br />
              Nestes termos, pede e espera deferimento.
            </p>

            {/* Closing Signature Area */}
            <div className="mt-12 text-center pt-8 border-t border-slate-300">
              <div className="font-sans font-semibold text-slate-900">
                {comarca}, {generatedDate}.
              </div>
              <div className="mt-8 mx-auto w-64 border-b border-slate-900" />
              <div className="mt-2 font-sans font-bold text-slate-900">
                {advogadoNome}
              </div>
              <div className="font-mono text-xs text-slate-600">
                {advogadoOab}
              </div>
              <div className="mt-1 font-sans text-xs text-slate-500">
                Patrono(a) do Representante
              </div>
            </div>

            {/* Forensic Provenance Seal on Document */}
            <div className="mt-12 pt-4 border-t border-dashed border-slate-300 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>CUSTÓDIA DIGITAL ELETTO · HASH SHA-256 VERIFICADO</span>
              <span>PROTOCOLO: {protocolId}</span>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
