"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarCounts } from "@/lib/stats";

type NavLink = { href: string; label: string; count?: number; alert?: boolean };

export function Sidebar({ counts }: { counts: SidebarCounts }) {
  const pathname = usePathname();

  const top: NavLink[] = [
    { href: "/", label: "Início" },
    { href: "/grafo", label: "Grafo de correlações" },
    { href: "/ranking", label: "Bens declarados" },
    { href: "/emendas", label: "Emendas parlamentares" },
  ];
  const sinais: NavLink[] = [
    { href: "/sinais/doacao-circular", label: "Doação circular", count: counts.circularDonations, alert: true },
    { href: "/sinais/despesa-desproporcional", label: "Despesa desproporcional", count: counts.disproportionateExpense },
    { href: "/sinais/socio-fornecedor", label: "Sócio de fornecedor", count: counts.supplierPartner },
    { href: "/sinais/analise-ia", label: "Análise de IA", count: counts.aiReview },
    { href: "/sinais/discurso", label: "Discurso em rede social", count: counts.discourse, alert: true },
  ];

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__top">
        <Link href="/" className="app-sidebar__logo group" style={{ textDecoration: "none" }}>
          <span className="navbar__mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 3a9 9 0 0 1 9 9" />
              <path d="M12 21a9 9 0 0 1-9-9" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="navbar__name text-[16.5px] font-bold tracking-tight text-[var(--fg-1)]">eletto</span>
            <span className="text-[10px] text-[var(--muted-2)] font-mono font-medium leading-tight">inteligência eleitoral</span>
          </div>
        </Link>
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
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
