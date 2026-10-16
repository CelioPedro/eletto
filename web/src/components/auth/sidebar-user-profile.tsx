"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./auth-context";

export function SidebarUserProfile({ collapsed = false }: { collapsed?: boolean }) {
  const { user, loading, openAuthModal, logout, togglePlan } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        {collapsed ? (
          <div className="size-10 rounded-xl animate-pulse bg-white/10" />
        ) : (
          <div className="h-12 w-full rounded-xl animate-pulse bg-white/10" />
        )}
      </div>
    );
  }

  if (!user) {
    if (collapsed) {
      return (
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="size-10 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer"
          title="Acessar conta (Login / Cadastro)"
          aria-label="Acessar conta"
        >
          <span className="text-sm">👤</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => openAuthModal("login")}
        className="w-full flex items-center justify-between gap-2.5 rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)] hover:border-[var(--accent)] hover:bg-[var(--hover)] p-2.5 transition-all cursor-pointer text-left group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--hover)] text-[var(--fg-1)] text-xs group-hover:scale-105 transition-transform flex-none border border-[var(--border-1)]">
            👤
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[var(--fg-1)]">Acessar Conta</span>
            <span className="text-[10.5px] text-[var(--muted-2)] font-mono leading-tight">Fazer login ou cadastro</span>
          </div>
        </div>
        <span className="text-xs text-[var(--muted-2)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all">
          →
        </span>
      </button>
    );
  }

  const isPro = user.plan === "pro" || user.plan === "escritorio";

  if (collapsed) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="size-10 rounded-xl flex items-center justify-center bg-[#1D63FF] text-white font-mono text-sm font-bold shadow-md hover:brightness-110 border border-white/20 transition-all cursor-pointer"
          title={`${user.name} (${isPro ? "Pro" : "Free"})`}
          aria-label="Menu do Perfil"
        >
          {user.name.charAt(0).toUpperCase()}
        </button>

        {dropdownOpen ? (
          <div className="absolute bottom-0 left-full ml-3 w-64 rounded-xl border border-[var(--border-2)] bg-[var(--card-tone)] p-3.5 z-50 text-xs shadow-2xl backdrop-blur-md">
            <div className="border-b border-[var(--border-1)] pb-2.5 mb-2.5">
              <div className="font-semibold text-[var(--fg-1)] truncate text-xs">{user.name}</div>
              <div className="font-mono text-[10.5px] text-[var(--muted-2)] truncate mt-0.5">{user.email}</div>
              {user.organization ? (
                <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">{user.organization}</div>
              ) : null}
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--muted)]">Status do Plano:</span>
                <span className={`font-semibold font-mono ${isPro ? "text-[var(--fg-1)]" : "text-[var(--fg-2)]"}`}>
                  {isPro ? "Assinante Pro" : "Conta Gratuita"}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-[var(--border-1)] pt-2 mb-2.5">
              <button
                type="button"
                onClick={async () => {
                  await togglePlan();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-2 py-1.5 text-[11px] font-medium text-[var(--accent-2)] hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer flex items-center justify-between"
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
                  className="btn btn--primary w-full justify-center text-[11px] py-1.5 font-bold rounded-lg"
                  style={{ textDecoration: "none" }}
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
                className="w-full text-left px-2 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              >
                Sair da conta
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Profile Toggle Card - Image 1 & 2 inspired */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full flex items-center justify-between gap-2 rounded-xl border border-[var(--border-1)] bg-[var(--card-tone)] hover:border-[var(--accent)] hover:bg-[var(--hover)] p-2.5 transition-all cursor-pointer text-left"
        aria-label="Menu do Perfil"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 items-center justify-center rounded-[0px] bg-[#1D63FF] text-white font-mono text-xs font-bold flex-none shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[var(--fg-1)] truncate leading-snug">
              {user.name}
            </span>
            <span className="text-[10.5px] text-[var(--muted-2)] font-mono truncate leading-none mt-0.5">
              {user.organization || user.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-none">
          <span
            className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider rounded-[0px] border ${
              isPro
                ? "bg-[#1D63FF] text-white border-[#1D63FF]"
                : "bg-[var(--hover)] text-[var(--muted)] border-[var(--border-1)]"
            }`}
          >
            {isPro ? "PRO" : "FREE"}
          </span>
          <span className="text-[11px] text-[var(--muted-2)]">↕</span>
        </div>
      </button>

      {/* Upward Popover Menu */}
      {dropdownOpen ? (
        <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-[var(--border-2)] bg-[var(--card-tone)] p-3.5 z-50 text-xs shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="border-b border-[var(--border-1)] pb-2.5 mb-2.5">
            <div className="font-semibold text-[var(--fg-1)] truncate text-xs">{user.name}</div>
            <div className="font-mono text-[10.5px] text-[var(--muted-2)] truncate mt-0.5">{user.email}</div>
            {user.organization ? (
              <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">{user.organization}</div>
            ) : null}
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--muted)]">Status do Plano:</span>
              <span className={`font-semibold font-mono ${isPro ? "text-[#1D63FF]" : "text-[var(--fg-2)]"}`}>
                {isPro ? "Assinante Pro" : "Conta Gratuita"}
              </span>
            </div>
            {!isPro ? (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--muted)]">Dossiês restantes:</span>
                <span className="font-mono font-bold text-[var(--fg-1)]">{user.credits} / 3</span>
              </div>
            ) : null}
          </div>

          {/* Dev/Demo Quick Switcher */}
          <div className="border-t border-dashed border-[var(--border-1)] pt-2 mb-2.5">
            <button
              type="button"
              onClick={async () => {
                await togglePlan();
                setDropdownOpen(false);
              }}
              className="w-full text-left px-2 py-1.5 text-[11px] font-medium text-[var(--accent-2)] hover:bg-[var(--hover)] transition-colors cursor-pointer flex items-center justify-between"
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
                className="btn btn--primary w-full justify-center text-[11px] py-1.5 font-bold"
                style={{ textDecoration: "none" }}
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
              className="w-full text-left px-2 py-1.5 text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Sair da conta
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
