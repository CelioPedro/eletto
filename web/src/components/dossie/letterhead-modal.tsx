"use client";

import { useState, useEffect } from "react";

export type LetterheadConfig = {
  lawyerName: string;
  oab: string;
  firmName: string;
  customTitle: string;
};

export const DEFAULT_LETTERHEAD: LetterheadConfig = {
  lawyerName: "",
  oab: "",
  firmName: "",
  customTitle: "Dossiê Pericial de Conformidade Eleitoral",
};

export function LetterheadModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (config: LetterheadConfig) => void;
}) {
  const [config, setConfig] = useState<LetterheadConfig>(DEFAULT_LETTERHEAD);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eletto_letterhead_config");
        if (saved) {
          setConfig(JSON.parse(saved));
        }
      } catch {}
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("eletto_letterhead_config", JSON.stringify(config));
    }
    onSave(config);
    onClose();
  };

  const handleClear = () => {
    setConfig(DEFAULT_LETTERHEAD);
    if (typeof window !== "undefined") {
      localStorage.removeItem("eletto_letterhead_config");
    }
    onSave(DEFAULT_LETTERHEAD);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal max-w-lg p-0 overflow-hidden border-2 border-blue-500/40 bg-[var(--card-tone)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <span className="rounded-full bg-white/20 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider text-white">
              Recurso Exclusivo Pro
            </span>
            <h3 className="font-sans text-base font-bold text-white mt-1">
              Personalização de Timbre & Cabeçalho Pericial
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-[var(--muted)] leading-relaxed">
            Configure os dados da sua banca ou assessoria para que constem no cabeçalho impresso do relatório oficial, pronto para instrução de ações judiciais e pareceres.
          </p>

          <div>
            <label className="block font-medium text-[var(--fg-2)] mb-1">
              Nome da Banca / Escritório / Instituto
            </label>
            <input
              type="text"
              value={config.firmName}
              onChange={(e) => setConfig({ ...config, firmName: e.target.value })}
              placeholder="Ex: Silva & Associados Advocacia Eleitoral"
              className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[var(--fg-2)] mb-1">
                Advogado / Perito Responsável
              </label>
              <input
                type="text"
                value={config.lawyerName}
                onChange={(e) => setConfig({ ...config, lawyerName: e.target.value })}
                placeholder="Ex: Dra. Mariana Silva"
                className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-[var(--fg-2)] mb-1">
                Registro Profissional / OAB
              </label>
              <input
                type="text"
                value={config.oab}
                onChange={(e) => setConfig({ ...config, oab: e.target.value })}
                placeholder="Ex: OAB/SP 123.456"
                className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[var(--fg-2)] mb-1">
              Título Personalizado da Peça / Relatório
            </label>
            <input
              type="text"
              value={config.customTitle}
              onChange={(e) => setConfig({ ...config, customTitle: e.target.value })}
              placeholder="Ex: Dossiê Pericial de Conformidade Eleitoral"
              className="w-full rounded border border-[var(--border-1)] bg-[var(--surface)] px-3 py-2 text-[var(--fg-1)] outline-none focus:border-[var(--accent)] text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--border-1)]">
            <button
              type="button"
              onClick={handleClear}
              className="btn text-xs py-2 text-[var(--muted)]"
            >
              Restaurar Padrão
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn text-xs py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn--primary text-xs py-2 font-bold shadow-xs"
              >
                Salvar Timbre
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
