"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchResult } from "@/lib/queries";
import { formatCpfCnpj } from "@/lib/format";
import { SearchAvatar } from "@/components/search-avatar";

interface CandidateSearchSlotProps {
  label: string;
  slotNumber: 1 | 2;
  currentPersonId?: number | null;
  currentName?: string | null;
  currentOffice?: string | null;
  currentParty?: string | null;
  currentState?: string | null;
  currentPhotoUrl?: string | null;
  onSelect: (personId: number) => void;
  onClear: () => void;
}

export function CandidateSearchSlot({
  label,
  slotNumber,
  currentPersonId,
  currentName,
  currentOffice,
  currentParty,
  currentState,
  currentPhotoUrl,
  onSelect,
  onClear,
}: CandidateSearchSlotProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = q.trim();
  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d: { results: SearchResult[] }) => {
          // Filtrar preferencialmente candidatos ou pessoas com histórico
          setResults(d.results || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 180);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [trimmed]);

  const openSearch = () => {
    setIsSearching(true);
    setQ("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelectCandidate = (personId: number) => {
    setIsSearching(false);
    setQ("");
    onSelect(personId);
  };

  const isSlot1 = slotNumber === 1;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      {/* Top Header Label */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="tag-pill">
          <span className={`tag-pill__square ${isSlot1 ? "bg-[#1D63FF]" : "bg-[var(--muted)]"}`} />
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
            {label}
          </span>
        </div>

        {currentPersonId && !isSearching && (
          <button
            type="button"
            onClick={openSearch}
            className="text-[11.5px] font-mono text-[var(--muted-2)] hover:text-[#1D63FF] transition-colors cursor-pointer"
          >
            [ alterar ]
          </button>
        )}
      </div>

      {/* Candidato Selecionado */}
      {currentPersonId && !isSearching ? (
        <div className="flex items-center justify-between p-3.5 border border-[var(--border-1)] bg-[var(--card-tone)] rounded-[0px] transition-colors hover:border-[var(--border-2)]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Foto Geométrica de 1px */}
            <div className="w-11 h-11 rounded-[0px] overflow-hidden flex-none border border-[var(--border-1)] bg-[var(--surface)] flex items-center justify-center">
              {currentPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentPhotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-base font-bold text-[var(--muted)] font-mono">
                  {currentName?.charAt(0) || "?"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="font-semibold text-[13.5px] text-[var(--fg-1)] truncate tracking-tight">
                {currentName}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-[11.5px] text-[var(--muted)] flex-wrap">
                {currentParty && (
                  <span className="px-1.5 py-0.2 rounded-[0px] bg-[var(--surface)] border border-[var(--border-1)] font-mono text-[10.5px] font-semibold text-[var(--fg-1)]">
                    {currentParty}
                  </span>
                )}
                {currentOffice && <span className="truncate">{currentOffice}</span>}
                {currentState && <span className="font-mono text-[11px] text-[var(--muted-2)]">· {currentState}</span>}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            title="Remover seleção deste candidato"
            className="p-1.5 rounded-[0px] text-[var(--muted-2)] hover:text-red-500 hover:bg-red-500/10 transition-colors ml-2 cursor-pointer flex-none"
            aria-label="Remover candidato"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        /* Modo de Busca Arquitetônico */
        <div className="relative">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-[var(--border-1)] bg-[var(--card-tone)] rounded-[0px] focus-within:border-[#1D63FF] focus-within:ring-1 focus-within:ring-[#1D63FF]/30 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--muted-2)] flex-none">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setIsSearching(true)}
              placeholder={`Digite o nome do candidato ${slotNumber} (ex: Lula, Bolsonaro, Tarcísio)…`}
              className="w-full bg-transparent border-none text-[13px] text-[var(--fg-1)] placeholder:text-[var(--muted-2)] focus:outline-none"
            />
            {loading && (
              <span className="text-[11px] font-mono text-[var(--muted-2)] animate-pulse flex-none">
                buscando…
              </span>
            )}
            {isSearching && currentPersonId && (
              <button
                type="button"
                onClick={() => setIsSearching(false)}
                className="text-[11px] font-mono text-[var(--muted-2)] hover:text-[var(--fg-1)] flex-none cursor-pointer"
              >
                cancelar
              </button>
            )}
          </div>

          {/* Dropdown com Resultados */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto rounded-[0px] border border-[var(--border-2)] bg-[var(--surface)] shadow-2xl p-1 flex flex-col gap-0.5 animate-in fade-in duration-100">
              {trimmed.length < 2 ? (
                <div className="py-4 text-center text-[11.5px] font-mono text-[var(--muted-2)]">
                  Digite pelo menos 2 caracteres para pesquisar
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="py-4 text-center text-[11.5px] font-mono text-[var(--muted-2)]">
                  Nenhum candidato localizado para &quot;{q}&quot;
                </div>
              ) : (
                results.map((r) => {
                  if (r.kind !== "candidato") {
                    return (
                      <div
                        key={`pf-${r.cpf}`}
                        className="px-3 py-2 text-[11.5px] font-mono text-[var(--muted-2)]"
                      >
                        {r.canonicalName} ({formatCpfCnpj(r.cpf)}) - Sem histórico político oficial
                      </div>
                    );
                  }
                  return (
                    <button
                      key={r.personId}
                      type="button"
                      onClick={() => handleSelectCandidate(r.personId)}
                      className="w-full flex items-center gap-3 p-2 rounded-[0px] text-left hover:bg-[var(--hover)] transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-[0px] overflow-hidden flex-none border border-[var(--border-1)] bg-[var(--card-tone)] flex items-center justify-center">
                        <SearchAvatar photoUrl={r.photoUrl} name={r.canonicalName} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs text-[var(--fg-1)] group-hover:text-[#1D63FF] truncate">
                          {r.canonicalName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-[var(--muted)] font-mono">
                          {r.latestPartyAbbr && (
                            <span className="font-semibold text-[var(--fg-1)]">
                              {r.latestPartyAbbr}
                            </span>
                          )}
                          {r.latestOffice && <span>· {r.latestOffice}</span>}
                          {r.latestState && <span>({r.latestState})</span>}
                          {r.latestYear && <span>· {r.latestYear}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
