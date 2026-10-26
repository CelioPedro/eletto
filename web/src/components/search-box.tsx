"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { SearchResult } from "@/lib/queries";
import { formatCpfCnpj } from "@/lib/format";
import { SearchAvatar } from "@/components/search-avatar";

const QUICK_SHORTCUTS = [
  { href: "/comparador", label: "Comparador · Perícia Frente a Frente", category: "módulo" },
  { href: "/grafo", label: "Grafo de correlações e vínculos", category: "redes" },
  { href: "/ranking", label: "Ranking de bens declarados", category: "patrimônio" },
  { href: "/emendas", label: "Emendas parlamentares auditadas", category: "orçamento" },
  { href: "/sinais/doacao-circular", label: "Doação circular (triangulação)", category: "alerta" },
  { href: "/sinais/socio-fornecedor", label: "Sócio de fornecedor de campanha", category: "alerta" },
  { href: "/sinais/despesa-desproporcional", label: "Despesa eleitoral atípica", category: "alerta" },
  { href: "/sinais/analise-ia", label: "Análise forense com Inteligência Artificial", category: "perícia" },
  { href: "/sinais/discurso", label: "Discurso e polarização em redes", category: "monitoramento" },
];

export function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global shortcut: Ctrl+K / Cmd+K focuses this input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const trimmed = q.trim();

  // Debounced search query
  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d: { results: SearchResult[] }) => {
          setResults(d.results || []);
          setSelectedIndex(-1);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  const filteredShortcuts = QUICK_SHORTCUTS.filter((s) =>
    s.label.toLowerCase().includes(trimmed.toLowerCase())
  );

  const hasQuery = trimmed.length >= 2;
  const totalItems = hasQuery ? results.length : filteredShortcuts.length;

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!open) {
      setOpen(true);
      inputRef.current?.focus();
      return;
    }

    const digits = trimmed.replace(/\D/g, "");
    if (digits.length === 11) {
      handleSelect(`/cpf/${digits}`);
      return;
    }
    if (digits.length === 14) {
      handleSelect(`/cnpj/${digits}`);
      return;
    }

    if (selectedIndex >= 0 && selectedIndex < totalItems) {
      if (hasQuery) {
        const item = results[selectedIndex];
        if (item.kind === "candidato") {
          handleSelect(`/politico/${item.personId}`);
        } else {
          handleSelect(`/cpf/${item.cpf}`);
        }
      } else {
        handleSelect(filteredShortcuts[selectedIndex].href);
      }
      return;
    }

    if (hasQuery && results.length > 0) {
      const first = results[0];
      if (first.kind === "candidato") {
        handleSelect(`/politico/${first.personId}`);
      } else {
        handleSelect(`/cpf/${first.cpf}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setSelectedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input Bar (Identical in both idle and active states) */}
      <form
        onSubmit={handleSubmit}
        className={`group flex w-full items-stretch border transition-all rounded-[0px] overflow-hidden ${
          open ? "border-[#1D63FF] bg-[var(--search-bg)] shadow-2xl ring-2 ring-[#1D63FF]/30" : "border-white/28 bg-[var(--search-bg)] hover:border-white/50 backdrop-blur-md"
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4">
          <Search className="size-4 sm:size-4.5 text-[#8BB4FF] shrink-0 transition-transform group-hover:scale-105" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="buscar por nome, CPF ou CNPJ…"
            className="w-full bg-transparent border-0 outline-none text-white text-sm sm:text-[15px] font-normal placeholder:text-white/70"
            autoComplete="off"
            spellCheck={false}
          />

          <span
            onClick={() => {
              if (open) setOpen(false);
              else inputRef.current?.focus();
            }}
            className="font-mono text-[10.5px] uppercase tracking-wider text-white/70 border border-white/20 bg-white/5 px-2 py-0.5 select-none rounded-[0px] cursor-pointer hover:bg-white/10 shrink-0"
            title={open ? "Fechar (Esc)" : "Atalho (Ctrl K)"}
          >
            {open ? "ESC" : "CTRL K"}
          </span>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center px-6 sm:px-8 bg-[#1D63FF] hover:bg-[#1550D6] text-white font-medium text-sm transition-colors border-0 cursor-pointer flex-none tracking-tight font-sans select-none"
        >
          Pesquisar
        </button>
      </form>

      {/* Seamless Integrated Dropdown Results (Positioned directly attached to the bottom) */}
      {open ? (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-[0px] border border-white/20 bg-[var(--search-dropdown-bg)] backdrop-blur-2xl shadow-2xl overflow-hidden max-h-[380px] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
          {!hasQuery ? (
            // Default Shortcuts View
            <div className="p-2">
              <div className="px-3 py-1.5 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#7E92C4]">
                Módulos & Ações Rápidas
              </div>
              <div className="flex flex-col gap-0.5">
                {filteredShortcuts.map((s, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={s.href}
                      type="button"
                      onClick={() => handleSelect(s.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-[0px] transition-colors cursor-pointer text-xs sm:text-[13px] ${
                        isSelected
                          ? "bg-[#1D63FF]/25 text-white font-medium border border-[#1D63FF]/40"
                          : "text-[#E2E8F8] hover:bg-white/10"
                      }`}
                    >
                      <span className="truncate">{s.label}</span>
                      <span className="font-mono text-[10px] uppercase text-[#1D63FF] dark:text-[#E2E8F8] bg-[#1D63FF]/20 px-1.5 py-0.5 border border-[#1D63FF]/35 shrink-0 ml-2">
                        {s.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : loading ? (
            // Loading State
            <div className="flex items-center justify-center gap-2.5 py-8 text-xs text-[#B4C2E4] font-mono">
              <div className="size-4 border-2 border-[#1D63FF] border-t-transparent rounded-full animate-spin" />
              <span>Buscando no banco oficial TSE e Receita Federal…</span>
            </div>
          ) : results.length === 0 ? (
            // Empty State
            <div className="py-8 px-4 text-center">
              <p className="text-sm text-white font-medium">Nenhum registro encontrado para &ldquo;{trimmed}&rdquo;</p>
              <p className="mt-1 text-xs text-[#7E92C4]">
                Tente buscar pelo nome completo, apenas os 11 dígitos do CPF ou os 14 dígitos do CNPJ.
              </p>
            </div>
          ) : (
            // Search Results List
            <div className="p-2 flex flex-col gap-1">
              <div className="px-3 py-1.5 text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#7E92C4] flex items-center justify-between">
                <span>Resultados Encontrados ({results.length})</span>
                <span className="text-[10px] opacity-70">Use ↑↓ e Enter para navegar</span>
              </div>
              {results.map((r, idx) => {
                const isSelected = selectedIndex === idx;
                const isCandidate = r.kind === "candidato";
                const targetHref = isCandidate ? `/politico/${r.personId}` : `/cpf/${r.cpf}`;
                const photoUrl = isCandidate ? r.photoUrl : null;
                const key = isCandidate ? `c-${r.personId}-${idx}` : `p-${r.cpf}-${idx}`;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(targetHref)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-[0px] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1D63FF]/30 border border-[#1D63FF]/50 text-white"
                        : "text-[#E2E8F8] hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    <SearchAvatar photoUrl={photoUrl} name={r.canonicalName} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs sm:text-[13.5px] text-white truncate">
                          {r.canonicalName}
                        </span>
                        {r.cpf ? (
                          <span className="font-mono text-[10.5px] text-[#8BB4FF] shrink-0">
                            {formatCpfCnpj(r.cpf)}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#B4C2E4] font-mono">
                        {isCandidate ? (
                          <span>
                            {r.latestOffice ?? "Candidato"} · {r.latestYear}
                          </span>
                        ) : (
                          <span>Pessoa Física / Doador</span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-[#8BB4FF] shrink-0 font-mono">
                      ir →
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
