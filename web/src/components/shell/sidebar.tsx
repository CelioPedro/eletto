"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Share2,
  TrendingUp,
  Landmark,
  Repeat,
  AlertTriangle,
  Briefcase,
  Sparkles,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Search,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import type { SidebarCounts } from "@/lib/stats";
import { SidebarUserProfile } from "@/components/auth/sidebar-user-profile";
import { SidebarThemeToggle } from "@/components/shell/theme-toggle";
import { ElettoLogo } from "@/components/eletto-logo";
import { useShell } from "@/components/shell/shell-context";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  alert?: boolean;
  badge?: string;
};

export function Sidebar({ counts }: { counts: SidebarCounts }) {
  const pathname = usePathname();
  const { setPaletteOpen, sidebarCollapsed, setSidebarCollapsed } = useShell();

  // Section collapse states (Image 1 inspired +/- headers)
  const [auditOpen, setAuditOpen] = useState(true);
  const [sinaisOpen, setSinaisOpen] = useState(true);

  const top: NavLink[] = [
    { href: "/", label: "Início", icon: LayoutDashboard },
    { href: "/comparador", label: "Comparador", icon: Layers },
    { href: "/grafo", label: "Grafo de conexões", icon: Share2 },
    { href: "/ranking", label: "Bens declarados", icon: TrendingUp },
    { href: "/emendas", label: "Emendas parlamentares", icon: Landmark },
  ];

  const sinais: NavLink[] = [
    {
      href: "/sinais/doacao-circular",
      label: "Doação circular",
      icon: Repeat,
      count: counts.circularDonations,
      alert: true,
    },
    {
      href: "/sinais/despesa-desproporcional",
      label: "Despesa atípica",
      icon: AlertTriangle,
      count: counts.disproportionateExpense,
    },
    {
      href: "/sinais/socio-fornecedor",
      label: "Sócio fornecedor",
      icon: Briefcase,
      count: counts.supplierPartner > 0 ? counts.supplierPartner : undefined,
      badge: counts.supplierPartner === 0 ? "BETA" : undefined,
      alert: counts.supplierPartner > 0,
    },
    {
      href: "/sinais/analise-ia",
      label: "Análise de IA",
      icon: Sparkles,
      count: counts.aiReview,
    },
    {
      href: "/sinais/discurso",
      label: "Discurso em redes",
      icon: MessageSquare,
      count: counts.discourse > 0 ? counts.discourse : undefined,
      badge: counts.discourse === 0 ? "BETA" : undefined,
      alert: counts.discourse > 0,
    },
  ];

  const isInvestigacao =
    pathname.startsWith("/sinais") ||
    pathname.startsWith("/grafo") ||
    pathname.startsWith("/comparador");

  // ==========================================
  // RENDER: COMPACT ICON RAIL (Image 1 & 2 left side)
  // ==========================================
  if (sidebarCollapsed) {
    return (
      <aside className="app-sidebar app-sidebar--collapsed">
        {/* Top: Logo Tile & Actions */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          <Link
            href="/"
            className="size-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center transition-all shadow-sm group"
            title="eletto AI - Início"
          >
            <ElettoLogo size="sm" iconOnly />
          </Link>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="size-10 rounded-xl bg-white/[0.06] hover:bg-white/12 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
            title="Buscar (Ctrl K)"
            aria-label="Buscar"
          >
            <Search className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            className="size-10 rounded-xl bg-transparent hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
            title="Expandir barra lateral"
            aria-label="Expandir barra lateral"
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <div className="w-7 h-px bg-white/10 my-2" />

        {/* Center: Navigation icons stack */}
        <nav className="flex-1 flex flex-col items-center gap-1.5 w-full overflow-y-auto no-scrollbar py-1">
          {top.map((l) => {
            const Icon = l.icon;
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative size-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm font-semibold"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }`}
                title={l.label}
              >
                <Icon className="size-[18px]" />
              </Link>
            );
          })}

          <div className="w-5 h-px bg-white/10 my-1.5" />

          {sinais.map((l) => {
            const Icon = l.icon;
            const isActive = pathname === l.href;
            const hasAlert = l.alert && l.count && l.count > 0;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative size-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm font-semibold"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }`}
                title={`${l.label}${l.count ? ` (${l.count.toLocaleString("pt-BR")})` : ""}`}
              >
                <Icon className="size-[18px]" />
                {hasAlert ? (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 animate-pulse ring-2 ring-[var(--sidebar)]" />
                ) : l.count ? (
                  <span className="absolute top-2 right-2 size-1.5 rounded-full bg-cyan-400" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Theme Toggle Vertical Capsule & Avatar */}
        <div className="flex flex-col items-center gap-3 w-full pt-3 border-t border-white/10">
          <SidebarThemeToggle vertical />
          <SidebarUserProfile collapsed />
        </div>
      </aside>
    );
  }

  // ==========================================
  // RENDER: EXPANDED SIDEBAR (Image 1 & 2 full layout)
  // ==========================================
  return (
    <aside className="app-sidebar">
      {/* Top Header */}
      <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <ElettoLogo size="default" showTagline />
          <button
            type="button"
            onClick={() => setSidebarCollapsed(true)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Recolher barra lateral"
            aria-label="Recolher barra lateral"
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>

        {/* Search trigger bar (Image 2 style) */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs rounded-xl border border-white/12 bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/25 text-white/70 hover:text-white transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5 text-white/60 group-hover:text-white transition-colors" />
            <span className="truncate">Buscar agente, CPF, CNPJ...</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/15">
            Ctrl K
          </kbd>
        </button>

        {/* Segmented Mode Capsule (Image 2 Personal / Business style) */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.06] border border-white/10 text-[11px] font-medium select-none">
          <Link
            href="/"
            className={`flex-1 text-center py-1 rounded-lg transition-all ${
              !isInvestigacao
                ? "bg-[#1D63FF] text-white shadow-sm font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Auditoria
          </Link>
          <Link
            href="/sinais/doacao-circular"
            className={`flex-1 text-center py-1 rounded-lg transition-all ${
              isInvestigacao
                ? "bg-[#1D63FF] text-white shadow-sm font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Perícia & IA
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar py-3" aria-label="navegação principal">
        {/* Group 1: Auditoria Eleitoral */}
        <div>
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Auditoria Eleitoral
            </span>
            <button
              type="button"
              onClick={() => setAuditOpen(!auditOpen)}
              className="text-white/40 hover:text-white transition-colors p-0.5 cursor-pointer"
              aria-label={auditOpen ? "Recolher seção" : "Expandir seção"}
            >
              {auditOpen ? <Minus className="size-3" /> : <Plus className="size-3" />}
            </button>
          </div>
          {auditOpen ? (
            <div className="mt-1 flex flex-col gap-1">
              {top.map((l) => {
                const Icon = l.icon;
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`navitem${isActive ? " is-active" : ""}`}
                  >
                    <Icon className="size-[17px] shrink-0" />
                    <span className="truncate">{l.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Group 2: Sinais & Anomalias */}
        <div>
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Sinais & Perícia
            </span>
            <button
              type="button"
              onClick={() => setSinaisOpen(!sinaisOpen)}
              className="text-white/40 hover:text-white transition-colors p-0.5 cursor-pointer"
              aria-label={sinaisOpen ? "Recolher seção" : "Expandir seção"}
            >
              {sinaisOpen ? <Minus className="size-3" /> : <Plus className="size-3" />}
            </button>
          </div>
          {sinaisOpen ? (
            <div className="mt-1 flex flex-col gap-1">
              {sinais.map((l) => {
                const Icon = l.icon;
                const isActive = pathname === l.href;
                const hasAlert = l.alert && l.count && l.count > 0;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`navitem${isActive ? " is-active" : ""}`}
                  >
                    <Icon className="size-[17px] shrink-0" />
                    <span className="truncate">{l.label}</span>
                    {l.count != null ? (
                      <span className={`navitem__count${hasAlert ? " navitem__count--alert" : ""}`}>
                        {hasAlert ? <span className="size-1.5 rounded-full bg-red-400 animate-pulse" /> : null}
                        {l.count.toLocaleString("pt-BR")}
                      </span>
                    ) : l.badge ? (
                      <span className="ml-auto font-mono text-[9px] font-semibold tracking-wider text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        {l.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </nav>

      {/* Bottom Footer Section */}
      <div className="mt-auto pt-3 border-t border-white/10 flex flex-col gap-2.5">
        {/* Pro Plan Card (Image 1 & 2 inspired) */}
        <div className="rounded-xl border border-white/12 bg-white/[0.05] p-3 hover:border-[#1D63FF]/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-[#1D63FF]" />
              <span className="font-sans text-xs font-semibold text-white">Eletto Pro</span>
            </div>
            <span className="font-mono text-[9px] font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 rounded">
              PERICIAL
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--muted)]">
            Dossiês com hash SHA-256 e grafo sem limites.
          </p>
          <Link
            href="/planos"
            className="mt-2.5 flex items-center justify-center w-full py-1.5 text-xs font-semibold rounded-lg bg-[#1D63FF] hover:bg-[#1550D6] text-white transition-colors shadow-sm"
            style={{ textDecoration: "none" }}
          >
            Conhecer Planos →
          </Link>
        </div>

        {/* User Profile Card (Image 1 & 2 standard) */}
        <SidebarUserProfile collapsed={false} />

        {/* Theme Toggle (Segmented Claro / Escuro capsule) */}
        <SidebarThemeToggle />
      </div>
    </aside>
  );
}
