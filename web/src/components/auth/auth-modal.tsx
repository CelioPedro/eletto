"use client";

import { useState } from "react";
import { useAuth } from "./auth-context";

export function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, openAuthModal, login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (authMode === "login") {
        const res = await login(email, password);
        if (!res.ok) setError(res.error || "Erro ao entrar.");
      } else {
        const res = await register({ name, email, password, organization, phone });
        if (!res.ok) setError(res.error || "Erro ao cadastrar.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("eletto123");
    setError(null);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal max-w-md p-0 overflow-hidden border border-[var(--border-2)] bg-[var(--card-tone)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[var(--surface)] border-b border-[var(--border-1)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="navbar__mark scale-90">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 3a9 9 0 0 1 9 9" />
                <path d="M12 21a9 9 0 0 1-9-9" />
              </svg>
            </span>
            <span className="font-semibold text-sm tracking-tight text-[var(--fg-1)]">
              {authMode === "login" ? "Acesse sua conta Eletto" : "Criar conta no Eletto"}
            </span>
          </div>

          <button
            type="button"
            onClick={closeAuthModal}
            className="text-[var(--muted-2)] hover:text-[var(--fg-1)] text-sm p-1 cursor-pointer transition-colors"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 border-b border-[var(--border-1)] bg-[var(--surface-2)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              openAuthModal("login");
              setError(null);
            }}
            className={`py-3 text-center border-b-2 transition-all ${
              authMode === "login"
                ? "border-[var(--accent)] text-[var(--accent-2)] bg-[var(--card-tone)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--fg-1)]"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal("register");
              setError(null);
            }}
            className={`py-3 text-center border-b-2 transition-all ${
              authMode === "register"
                ? "border-[var(--accent)] text-[var(--accent-2)] bg-[var(--card-tone)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--fg-1)]"
            }`}
          >
            Criar Nova Conta
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error ? (
            <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}

          {/* Quick Demo Fillers for Testing */}
          {authMode === "login" ? (
            <div className="mb-5 rounded-lg border border-dashed border-[var(--border-2)] bg-[var(--surface)] p-3">
              <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--muted-2)] mb-2">
                Atalhos de Acesso para Testes:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("demo@eletto.app")}
                  className="rounded border border-[var(--border-1)] bg-[var(--card-tone)] px-2.5 py-1 text-[11px] font-medium text-[var(--fg-1)] hover:bg-[var(--hover)] transition-all cursor-pointer"
                >
                  👤 Conta Gratuita (Demo)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("pro@eletto.app")}
                  className="rounded border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer"
                >
                  ⭐ Conta Pro (Assinante)
                </button>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {authMode === "register" ? (
              <>
                <div>
                  <label className="block font-medium text-[var(--fg-2)] mb-1">
                    Nome Completo *
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dra. Roberta Fontes"
                    className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--fg-2)] mb-1">
                    Banca / Escritório / Organização (opcional)
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Fontes Advocacia Eleitoral"
                    className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
                  />
                </div>
              </>
            ) : null}

            <div>
              <label className="block font-medium text-[var(--fg-2)] mb-1">
                Email Profissional *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com.br"
                className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-[var(--fg-2)] mb-1">
                Senha *
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn--primary w-full justify-center py-2.5 font-bold text-xs cursor-pointer shadow-md"
              >
                {submitting ? "Processando..." : authMode === "login" ? "Entrar na Plataforma" : "Concluir Cadastro Gratuito"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
