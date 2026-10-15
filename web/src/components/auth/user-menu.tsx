"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./auth-context";

export function UserMenu() {
  const { user, loading, openAuthModal, logout, togglePlan } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-7 w-16 animate-pulse rounded-md bg-[var(--border-1)] opacity-50" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="btn text-[11px] py-1 px-2.5 font-medium cursor-pointer"
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => openAuthModal("register")}
          className="btn btn--primary text-[11px] py-1 px-2.5 font-semibold cursor-pointer hidden sm:inline-flex"
        >
          Criar Conta
        </button>
      </div>
    );
  }

  const isPro = user.plan === "pro" || user.plan === "escritorio";
  const firstName = user.name.split(" ")[0] ?? "Usuário";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-full border border-[var(--border-2)] bg-[var(--card-tone)] pl-2 pr-3 py-1 text-xs hover:border-[var(--accent)] transition-all cursor-pointer shadow-xs"
        aria-label="Menu do Usuário"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-[var(--surface-2)] font-mono text-[10px] font-bold text-[var(--fg-1)]">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="font-medium text-[var(--fg-1)] max-w-[90px] truncate">
          {firstName}
        </span>
        <span
          className={`rounded px-1.5 py-0.2 font-mono text-[9.5px] font-bold uppercase tracking-wider ${
            isPro
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-[var(--surface-2)] text-[var(--muted)]"
          }`}
        >
          {isPro ? "PRO ★" : "FREE"}
        </span>
      </button>

      {dropdownOpen ? (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--border-2)] bg-[var(--card-tone)] p-3 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95">
          <div className="border-b border-[var(--border-1)] pb-2.5 mb-2.5">
            <div className="font-semibold text-[var(--fg-1)] truncate">{user.name}</div>
            <div className="font-mono text-[10.5px] text-[var(--muted-2)] truncate">{user.email}</div>
            {user.organization ? (
              <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">{user.organization}</div>
            ) : null}
          </div>

          <div className="space-y-1 mb-2.5">
            <div className="flex items-center justify-between py-1 text-[11px]">
              <span className="text-[var(--muted)]">Status do Plano:</span>
              <span className={`font-semibold font-mono ${isPro ? "text-blue-500" : "text-[var(--fg-2)]"}`}>
                {isPro ? "Assinante Pro" : "Conta Gratuita"}
              </span>
            </div>
            {!isPro ? (
              <div className="flex items-center justify-between py-1 text-[11px]">
                <span className="text-[var(--muted)]">Dossiês restantes:</span>
                <span className="font-mono font-bold text-[var(--fg-1)]">{user.credits} / 3</span>
              </div>
            ) : null}
          </div>

          {/* Dev/Demo Quick Switcher */}
          <div className="border-t border-dashed border-[var(--border-1)] pt-2 mb-2">
            <button
              type="button"
              onClick={async () => {
                await togglePlan();
                setDropdownOpen(false);
              }}
              className="w-full text-left rounded-md px-2 py-1.5 text-[11px] font-medium text-[var(--accent-2)] hover:bg-[var(--hover)] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>Alternar Modo (Free ↔ Pro)</span>
              <span className="text-[10px] opacity-70">⚡ Testar</span>
            </button>
          </div>

          {!isPro ? (
            <div className="mb-2">
              <Link
                href="/planos"
                onClick={() => setDropdownOpen(false)}
                className="btn btn--primary w-full justify-center text-[11px] py-1.5 font-bold shadow-xs"
              >
                Fazer Upgrade para Pro
              </Link>
            </div>
          ) : null}

          <div className="border-t border-[var(--border-1)] pt-2">
            <button
              type="button"
              onClick={async () => {
                await logout();
                setDropdownOpen(false);
              }}
              className="w-full text-left rounded-md px-2 py-1.5 text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Sair da conta
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
