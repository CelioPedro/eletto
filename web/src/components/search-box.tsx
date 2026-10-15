"use client";

import { useShell } from "./shell/shell-context";

export function SearchBox({ className = "" }: { className?: string }) {
  const { setPaletteOpen } = useShell();

  return (
    <div
      onClick={() => setPaletteOpen(true)}
      className={`group flex w-full max-w-2xl items-stretch border border-white/28 bg-[#040D42]/80 backdrop-blur-md transition-all hover:border-white/50 cursor-pointer rounded-[3px] overflow-hidden ${className}`}
    >
      <div className="flex flex-1 items-center gap-3.5 px-5 py-4 text-left">
        <span className="font-mono text-base text-[#5CE1E6] group-hover:scale-110 transition-transform">
          ⌕
        </span>
        <span className="text-sm sm:text-[15px] text-white/90 font-normal select-none">
          buscar por nome, CPF ou CNPJ…
        </span>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-white/80 border border-white/30 bg-white/5 px-2.5 py-0.5 select-none rounded-[2px]">
          Ctrl K
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setPaletteOpen(true);
        }}
        className="flex items-center justify-center px-6 sm:px-8 bg-[#1D63FF] hover:bg-[#1550D6] text-white font-medium text-sm transition-colors border-0 cursor-pointer flex-none tracking-tight font-sans"
      >
        Pesquisar
      </button>
    </div>
  );
}
