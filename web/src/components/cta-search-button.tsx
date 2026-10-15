"use client";

import { useShell } from "./shell/shell-context";

export function CtaSearchButton({ text = "Buscar candidato ou empresa" }: { text?: string }) {
  const { setPaletteOpen } = useShell();

  return (
    <button
      type="button"
      onClick={() => setPaletteOpen(true)}
      className="btn--saiba-mais text-sm sm:text-base px-6 sm:px-8 py-3.5 font-sans font-medium"
      style={{ fontSize: 14 }}
    >
      <span>{text}</span>
      <span className="font-mono text-xs opacity-70">→</span>
    </button>
  );
}
