"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useShell } from "./shell-context";
import { CommandPalette, useCommandPaletteShortcut } from "./command-palette";
import { ElettoLogo } from "@/components/eletto-logo";

export function Topbar() {
  const { header, setPaletteOpen } = useShell();
  useCommandPaletteShortcut();

  return (
    <div className="navbar-wrap">
      <div
        className="navbar-blur"
        aria-hidden
        style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      />
      <div className="navbar">
        <ElettoLogo size="sm" className="lg:hidden mr-3" />
        <span className="crumb hidden lg:inline">{header.group}</span>
        {header.current ? (
          <>
            <span className="crumb crumb__sep hidden lg:inline">/</span>
            <span className="crumb__current">{header.current}</span>
          </>
        ) : null}
        <span style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", flex: "none" }}>
          {header.actions}
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-lg text-[var(--muted-2)] hover:text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors cursor-pointer border-0 bg-transparent"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar (Ctrl K)"
            title="Buscar (Ctrl K)"
          >
            <Search className="size-4" />
          </button>
        </span>
        <CommandPaletteMount />
      </div>
    </div>
  );
}

function CommandPaletteMount() {
  const { paletteOpen } = useShell();
  return paletteOpen ? <CommandPalette /> : null;
}
