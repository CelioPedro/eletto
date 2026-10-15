"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./auth-context";

export function SidebarUserProfile() {
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
      <div className="mt-3 pt-3 border-t border-[var(--border-1)]">
        <div className="h-12 w-full animate-pulse bg-[var(--surface-2)] opacity-60" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-3 pt-3 border-t border-[var(--border-1)]">
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="w-full flex items-center justify-between gap-2.5 border border-[var(--border-1)] bg-[var(--card-tone)] p-2.5 hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 items-center justify-center bg-[var(--surface-2)] text-[var(--muted)] text-sm group-hover:text-[var(--fg-1)] transition-colors flex-none">
              👤
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[var(--fg-1)]">Acessar Conta</span>
              <span className="text-[10px] text-[var(--muted-2)] font-mono leading-tight">Fazer login ou cadastro</span>
            </div>
          </div>
          <span className="text-xs text-[var(--muted-2)] group-hover:text-[var(--accent)] transition-colors">
            →
          </span>
        </button>
      </div>
    );
  }

  const isPro = user.plan === "pro" || user.plan === "escritorio";

  return (
    <div className="relative mt-3 pt-3 border-t border-[var(--border-1)]" ref={containerRef}>
      {/* Profile Toggle Card */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full flex items-center justify-between gap-2 border border-[var(--border-1)] bg-[var(--card-tone)] p-2.5 hover:border-[var(--accent)] hover:bg-[var(--hover)] transition-all cursor-pointer text-left"
        aria-label="Menu do Perfil"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 items-center justify-center bg-blue-600/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex-none border border-blue-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[var(--fg-1)] truncate leading-snug">
              {user.name}
            </span>
            <span className="text-[10px] text-[var(--muted-2)] font-mono truncate leading-none mt-0.5">
              {user.organization || user.email}
            </span>
          </div>
        </div>

        <span
          className={`flex-none px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
            isPro
              ? "bg-[#1D63FF] text-white border-[#1D63FF]"
              : "bg-transparent text-[var(--muted)] border-[var(--border-1)]"
          }`}
        >
          {isPro ? "PRO ★" : "FREE"}
        </span>
      </button>

      {/* Upward Popover Menu */}
      {dropdownOpen ? (
        <div className="absolute bottom-full left-0 mb-2 w-full border border-[var(--border-2)] bg-[var(--card-tone)] p-3.5 z-50 text-xs animate-in fade-in zoom-in-95 backdrop-blur-md">
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
              <span className={`font-semibold font-mono ${isPro ? "text-blue-500" : "text-[var(--fg-2)]"}`}>
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
