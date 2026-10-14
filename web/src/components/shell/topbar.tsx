"use client";

import Link from "next/link";
import { useShell } from "./shell-context";
import { CommandPalette, useCommandPaletteShortcut } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

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
        <Link href="/" className="flex items-center gap-2 lg:hidden mr-2" style={{ textDecoration: "none" }}>
          <span className="navbar__mark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 3a9 9 0 0 1 9 9" />
              <path d="M12 21a9 9 0 0 1-9-9" />
            </svg>
          </span>
          <span className="font-semibold text-[14px] text-[var(--fg-1)]">eletto</span>
        </Link>
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
            className="btn btn--icon"
            onClick={() => setPaletteOpen(true)}
            aria-label="Buscar (Ctrl K)"
            title="Buscar (Ctrl K)"
          >
            <svg className="size-3.5 text-[var(--fg-1)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <ThemeToggle />
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
