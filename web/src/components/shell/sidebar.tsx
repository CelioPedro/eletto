"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarCounts } from "@/lib/stats";
import { SidebarUserProfile } from "@/components/auth/sidebar-user-profile";

import { ElettoLogo } from "@/components/eletto-logo";

type NavLink = { href: string; label: string; count?: number; alert?: boolean; badge?: string };

export function Sidebar({ counts }: { counts: SidebarCounts }) {
  const pathname = usePathname();

  const top: NavLink[] = [
    { href: "/", label: "Início" },
    { href: "/comparador", label: "Comparador" },
    { href: "/grafo", label: "Grafo de correlações" },
    { href: "/ranking", label: "Bens declarados" },
    { href: "/emendas", label: "Emendas parlamentares" },
  ];
  const sinais: NavLink[] = [
    { href: "/sinais/doacao-circular", label: "Doação circular", count: counts.circularDonations, alert: true },
    { href: "/sinais/despesa-desproporcional", label: "Despesa desproporcional", count: counts.disproportionateExpense },
    { 
      href: "/sinais/socio-fornecedor", 
      label: "Sócio de fornecedor", 
      count: counts.supplierPartner > 0 ? counts.supplierPartner : undefined,
      badge: counts.supplierPartner === 0 ? "BETA" : undefined,
      alert: counts.supplierPartner > 0
    },
    { href: "/sinais/analise-ia", label: "Análise de IA", count: counts.aiReview },
    { 
      href: "/sinais/discurso", 
      label: "Discurso em rede social", 
      count: counts.discourse > 0 ? counts.discourse : undefined,
      badge: counts.discourse === 0 ? "BETA" : undefined,
      alert: counts.discourse > 0 
    },
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__top">
        <ElettoLogo size="default" showTagline />
      </div>

      <nav className="app-sidebar__nav" aria-label="navegação principal">
        <div className="navmenu__items">
          {top.map((l) => (
            <Link key={l.href} href={l.href} className={`navitem${pathname === l.href ? " is-active" : ""}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <NavGroup title="Sinais" links={sinais} pathname={pathname} />

        <div className="mt-auto pt-4 border-t border-[var(--border-1)] flex flex-col gap-2">
          <div className="border border-[var(--border-1)] bg-[var(--card-tone)] p-3.5 hover:border-[var(--accent)] transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-2)]">
                Eletto Pro
              </span>
              <span className="bg-[var(--accent)]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[var(--accent-2)] border border-[var(--accent)]/30">
                PLANOS
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-[var(--muted)]">
              Dossiês periciais oficiais com hash SHA-256 e grafo profundo.
            </p>
            <Link
              href="/planos"
              className="mt-3 btn btn--primary flex w-full items-center justify-center py-2 text-xs font-medium"
              style={{ textDecoration: "none" }}
            >
              Conhecer Planos
            </Link>
          </div>

          <SidebarUserProfile />
        </div>
      </nav>
    </aside>
  );
}

function NavGroup({ title, links, pathname }: { title: string; links: NavLink[]; pathname: string }) {
  return (
    <div className="app-sidebar__group">
      <div className="label">{title}</div>
      <div className="navmenu__items">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`navitem${pathname === l.href ? " is-active" : ""}`}>
            {l.label}
            {l.count != null ? (
              <span className={`navitem__count${l.alert && l.count > 0 ? " navitem__count--alert" : ""}`}>
                {l.count.toLocaleString("pt-BR")}
              </span>
            ) : l.badge ? (
              <span className="ml-auto font-mono text-[9px] font-semibold tracking-wider text-[var(--accent-2)] bg-[var(--accent)]/10 px-1.5 py-0.5 border border-[var(--accent)]/30">
                {l.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
