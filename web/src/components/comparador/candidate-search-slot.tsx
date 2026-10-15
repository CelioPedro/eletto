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

  const badgeColor = slotNumber === 1 ? "bg-blue-500/15 text-blue-400 border-blue-500/30" : "bg-purple-500/15 text-purple-400 border-purple-500/30";

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {label}
        </span>
        {currentPersonId && !isSearching && (
          <button
            type="button"
            onClick={openSearch}
            className="text-xs text-[var(--muted-2)] hover:text-[var(--fg-1)] transition-colors underline cursor-pointer"
          >
            Trocar candidato
          </button>
        )}
      </div>

      {/* Se já há um candidato selecionado e não estamos no modo busca */}
      {currentPersonId && !isSearching ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-2)] bg-[var(--card-tone)] shadow-sm">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-none border border-[var(--border-2)] bg-[var(--surface)] flex items-center justify-center">
              {currentPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentPhotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-[var(--muted)]">
                  {currentName?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-[var(--fg-1)] truncate">
                {currentName}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted)] flex-wrap">
                {currentParty && (
                  <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] font-mono font-medium text-[var(--accent-2)]">
                    {currentParty}
                  </span>
                )}
                {currentOffice && <span>{currentOffice}</span>}
                {currentState && <span>· {currentState}</span>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            title="Remover seleção"
            className="p-1.5 rounded-lg text-[var(--muted-2)] hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2 cursor-pointer flex-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        /* Modo de busca / Selecionar candidato */
        <div className="relative">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--border-2)] bg-[var(--surface)] focus-within:border-[var(--accent)] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--muted-2)] flex-none">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setIsSearching(true)}
              placeholder={`Digite o nome do candidato ${slotNumber}...`}
              className="w-full bg-transparent border-none text-sm text-[var(--fg-1)] placeholder-[var(--muted-2)] focus:outline-none"
            />
            {loading && (
              <span className="text-xs text-[var(--muted-2)] animate-pulse flex-none">
                Buscando...
              </span>
            )}
            {isSearching && currentPersonId && (
              <button
                type="button"
                onClick={() => setIsSearching(false)}
                className="text-xs text-[var(--muted-2)] hover:text-[var(--fg-1)] flex-none"
              >
                Cancelar
              </button>
            )}
          </div>

          {/* Dropdown com resultados */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto rounded-xl border border-[var(--border-2)] bg-[var(--surface)] shadow-2xl p-1.5 flex flex-col gap-1">
              {trimmed.length < 2 ? (
                <div className="py-4 text-center text-xs text-[var(--muted-2)]">
                  Digite pelo menos 2 caracteres para buscar
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="py-4 text-center text-xs text-[var(--muted-2)]">
                  Nenhum candidato encontrado para &quot;{q}&quot;
                </div>
              ) : (
                results.map((r) => {
                  if (r.kind !== "candidato") {
                    return (
                      <div
                        key={`pf-${r.cpf}`}
                        className="px-3 py-2 text-xs text-[var(--muted-2)]"
                      >
                        {r.canonicalName} ({formatCpfCnpj(r.cpf)}) - Sem histórico político
                      </div>
                    );
                  }
                  return (
                    <button
                      key={r.personId}
                      type="button"
                      onClick={() => handleSelectCandidate(r.personId)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-[var(--hover)] transition-colors cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-none border border-[var(--border-1)] bg-[var(--card-tone)] flex items-center justify-center">
                        <SearchAvatar photoUrl={r.photoUrl} name={r.canonicalName} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-[var(--fg-1)] group-hover:text-[var(--accent-2)] truncate">
                          {r.canonicalName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[var(--muted)]">
                          {r.latestPartyAbbr && (
                            <span className="font-mono font-medium text-[var(--accent-2)]">
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
