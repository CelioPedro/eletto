"use client";

import { useState } from "react";
import Link from "next/link";
import { ElettoLogo } from "@/components/eletto-logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  const hubs = [
    {
      country: "Brasília (DF)",
      lines: ["Setor de Autarquias Sul, Qd. 4", "Próximo aos Tribunais Superiores"],
    },
    {
      country: "São Paulo (SP)",
      lines: ["Avenida Paulista, 1374", "Centro de Inteligência de Dados"],
    },
    {
      country: "Rio de Janeiro (RJ)",
      lines: ["Praça XV de Novembro, 20", "Núcleo de Perícias Judiciais"],
    },
    {
      country: "Cobertura Nacional",
      lines: ["TSE, 27 TREs, Receita Federal", "Tribunal de Contas da União (TCU)"],
    },
  ];

  const links = [
    { label: "Sobre nós", href: "/" },
    { label: "Soluções", href: "/comparador" },
    { label: "Grafo de Relações", href: "/grafo" },
    { label: "Sinais de Fraude", href: "/sinais/socio-fornecedor" },
    { label: "Planos & Assinaturas", href: "/planos" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Declaração de Integridade", href: "#" },
  ];

  return (
    <footer className="mt-24 border-t border-[var(--border-1)] bg-[var(--surface)] text-[var(--fg-1)] py-14 px-6 sm:px-12 transition-colors">
      <div className="max-w-[1240px] mx-auto flex flex-col gap-12">
        {/* Linha Superior: Logo + Links de Navegação à Esquerda e Hubs à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Coluna 1 (Logo + Links) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ElettoLogo size="lg" />

            {/* Links Horizontais */}
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--muted)]" aria-label="Links do Rodapé">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="hover:text-[var(--accent)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Coluna 2 (Hubs Institucionais - Estilo Indicium) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-[12px]">
            {hubs.map((h) => (
              <div key={h.country} className="flex flex-col gap-1.5">
                <span className="font-medium text-[var(--fg-1)] tracking-tight">
                  {h.country}
                </span>
                {h.lines.map((line, i) => (
                  <span key={i} className="text-[var(--muted-2)] leading-snug">
                    {line}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Linha Inferior: Redes + Copyright à Esquerda e Newsletter Bar à Direita */}
        <div className="pt-8 border-t border-[var(--border-1)] flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Redes Sociais e Copyright */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3.5 text-[var(--fg-1)]">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-[var(--accent)] transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-[var(--accent)] transition-colors"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9 10 15" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:text-[var(--accent)] transition-colors"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>

            <span className="font-mono text-[11px] text-[var(--muted-2)]">
              © 2026 | Todos os direitos reservados por{" "}
              <Link href="/" className="text-[var(--accent)] hover:underline">
                Eletto AI
              </Link>
            </span>
          </div>

          {/* Barra de Inscrição / Insights (Padrão exato da imagem) */}
          <div className="flex flex-col gap-2 w-full max-w-sm">
            <span className="text-[13px] font-medium text-[var(--fg-1)]">
              Fique por dentro dos últimos insights
            </span>

            <form onSubmit={handleSubmit} className="input-bar-group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email*"
                aria-label="E-mail para insights"
              />
              <button type="submit" className="btn-send">
                {subscribed ? "Enviado!" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
