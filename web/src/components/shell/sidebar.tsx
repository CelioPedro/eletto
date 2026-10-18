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
  Minus,
  Plus,
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
  const { sidebarCollapsed, setSidebarCollapsed } = useShell();

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

  // ==========================================
  // RENDER: COMPACT ICON RAIL (Image 1 slim rail)
  // ==========================================
  if (sidebarCollapsed) {
    return (
      <aside className="app-sidebar app-sidebar--collapsed">
        {/* Top: Logo Tile & Expand Toggle */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          <Link
            href="/"
            className="size-10 rounded-xl bg-[var(--hover)] hover:brightness-110 border border-[var(--border-1)] flex items-center justify-center transition-all shadow-sm group"
            title="eletto AI - Início"
          >
            <ElettoLogo size="sm" iconOnly />
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            className="size-10 rounded-xl bg-transparent hover:bg-[var(--hover)] text-[var(--muted-2)] hover:text-[var(--fg-1)] flex items-center justify-center transition-all cursor-pointer"
            title="Expandir barra lateral"
            aria-label="Expandir barra lateral"
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <div className="w-7 h-px bg-[var(--border-1)] my-2" />

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
                    ? "bg-zinc-200 text-black dark:bg-white/15 dark:text-white shadow-sm font-semibold"
                    : "text-[var(--muted-2)] hover:text-[var(--fg-1)] hover:bg-[var(--hover)]"
                }`}
                title={l.label}
              >
                <Icon className="size-[18px]" />
              </Link>
            );
          })}

          <div className="w-5 h-px bg-[var(--border-1)] my-1.5" />

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
                    ? "bg-zinc-200 text-black dark:bg-white/15 dark:text-white shadow-sm font-semibold"
                    : "text-[var(--muted-2)] hover:text-[var(--fg-1)] hover:bg-[var(--hover)]"
                }`}
                title={`${l.label}${l.count ? ` (${l.count.toLocaleString("pt-BR")})` : ""}`}
              >
                <Icon className="size-[18px]" />
                {hasAlert ? (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 animate-pulse ring-2 ring-[var(--sidebar)]" />
                ) : l.count ? (
                  <span className="absolute top-2 right-2 size-1.5 rounded-full bg-white/70" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Theme Toggle Vertical Capsule & Avatar */}
        <div className="flex flex-col items-center gap-3 w-full pt-3 border-t border-[var(--border-1)]">
          <SidebarThemeToggle vertical />
          <SidebarUserProfile collapsed />
        </div>
      </aside>
    );
  }

  // ==========================================
  // RENDER: EXPANDED SIDEBAR (Direct from Logo into Nav)
  // ==========================================
  return (
    <aside className="app-sidebar">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-1)]">
        <ElettoLogo size="default" showTagline />
        <button
          type="button"
          onClick={() => setSidebarCollapsed(true)}
          className="p-1.5 rounded-lg text-[var(--muted-2)] hover:text-[var(--fg-1)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
          title="Recolher barra lateral"
          aria-label="Recolher barra lateral"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      {/* Main Navigation - Starts cleanly right below header */}
      <nav className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar py-3" aria-label="navegação principal">
        {/* Group 1: Auditoria Eleitoral */}
        <div>
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Auditoria Eleitoral
            </span>
            <button
              type="button"
              onClick={() => setAuditOpen(!auditOpen)}
              className="text-[var(--muted-2)] hover:text-[var(--fg-1)] transition-colors p-0.5 cursor-pointer"
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
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              Sinais & Perícia
            </span>
            <button
              type="button"
              onClick={() => setSinaisOpen(!sinaisOpen)}
              className="text-[var(--muted-2)] hover:text-[var(--fg-1)] transition-colors p-0.5 cursor-pointer"
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
                        {hasAlert ? <span className="size-1.5 rounded-full bg-red-500 animate-pulse" /> : null}
                        {l.count.toLocaleString("pt-BR")}
                      </span>
                    ) : l.badge ? (
                      <span className="ml-auto font-mono text-[9px] font-semibold tracking-wider text-[#1D63FF] dark:text-[#8BB4FF] bg-[#1D63FF]/10 dark:bg-[#1D63FF]/20 px-1.5 py-0.5 rounded-[0px] border border-[#1D63FF]/30 dark:border-[#1D63FF]/40">
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
      <div className="mt-auto pt-3 border-t border-[var(--border-1)] flex flex-col gap-2.5">
        {/* Pro Plan Card - Topologia Forense Sofisticada */}
        <div className="relative overflow-hidden rounded-xl border border-[#1D63FF]/35 bg-gradient-to-b from-[#040D42] via-[#051152] to-[#03092C] p-3.5 shadow-lg shadow-[#040D42]/40 transition-all hover:border-[#1D63FF]/55 group">
          {/* Background Network Graph SVG */}
          <svg
            className="absolute -right-4 -top-3 w-44 h-36 pointer-events-none opacity-45 select-none"
            viewBox="0 0 180 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="pro-card-glow" cx="0.75" cy="0.3" r="0.6">
                <stop offset="0%" stopColor="#1D63FF" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#1D63FF" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#1D63FF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient glow */}
            <rect width="180" height="140" fill="url(#pro-card-glow)" />

            {/* Network connection lines */}
            <path
              d="M60 40 L100 25 L145 40 L170 20 M100 25 L120 70 L160 85 M145 40 L120 70 M60 40 L75 85 L120 70 M75 85 L105 125 L150 115 M120 70 L150 115 M160 85 L150 115"
              stroke="#1D63FF"
              strokeWidth="0.8"
              strokeOpacity="0.45"
              strokeDasharray="2 2"
            />
            <path
              d="M100 25 L145 40 M120 70 L160 85 M75 85 L120 70 M120 70 L150 115"
              stroke="#8BB4FF"
              strokeWidth="1"
              strokeOpacity="0.6"
            />

            {/* Nodes */}
            <circle cx="60" cy="40" r="2" fill="#8BB4FF" fillOpacity="0.6" />
            <circle cx="100" cy="25" r="3" fill="#8BB4FF" />
            <circle cx="100" cy="25" r="6" fill="#1D63FF" fillOpacity="0.25" />
            <circle cx="145" cy="40" r="3.5" fill="#FFFFFF" />
            <circle cx="145" cy="40" r="7" fill="#1D63FF" fillOpacity="0.3" />
            <circle cx="170" cy="20" r="2" fill="#8BB4FF" fillOpacity="0.5" />
            <circle cx="120" cy="70" r="4" fill="#8BB4FF" />
            <circle cx="120" cy="70" r="8" fill="#1D63FF" fillOpacity="0.35" />
            <circle cx="75" cy="85" r="2.5" fill="#8BB4FF" fillOpacity="0.7" />
            <circle cx="160" cy="85" r="3" fill="#8BB4FF" />
            <circle cx="150" cy="115" r="3.5" fill="#FFFFFF" />
            <circle cx="150" cy="115" r="7" fill="#1D63FF" fillOpacity="0.25" />
            <circle cx="105" cy="125" r="2" fill="#8BB4FF" fillOpacity="0.6" />
          </svg>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M4 13L9 3" stroke="#8BB4FF" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M8 13L13 3" stroke="#1D63FF" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
              <span className="font-sans text-[13px] font-semibold text-white tracking-tight">Eletto Pro</span>
            </div>
            <span className="rounded-md border border-[#1D63FF]/45 bg-[#1D63FF]/20 px-2 py-0.5 font-mono text-[9px] font-bold text-[#8BB4FF] tracking-wider uppercase backdrop-blur-xs">
              PERICIAL
            </span>
          </div>

          {/* Description */}
          <p className="relative z-10 mt-2 text-[11px] leading-relaxed text-[#B4C2E4] font-sans">
            Dossiês com hash SHA-256 e grafo sem limites.
          </p>

          {/* Button with Cobalt-Azure gradient */}
          <Link
            href="/planos"
            className="group/btn relative z-10 mt-3 flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#1D63FF] via-[#246BFD] to-[#0088FF] hover:from-[#1550D6] hover:to-[#0077E6] text-white shadow-md shadow-[#1D63FF]/25 hover:shadow-[#1D63FF]/40 active:scale-[0.99] transition-all"
            style={{ textDecoration: "none" }}
          >
            <span>Conhecer Planos</span>
            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* User Profile Card */}
        <SidebarUserProfile collapsed={false} />

        {/* Theme Toggle */}
        <SidebarThemeToggle />
      </div>
    </aside>
  );
}
