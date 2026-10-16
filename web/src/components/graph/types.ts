import type { GraphEdgeKind, GraphNodeKind } from "@/lib/queries";

export type GraphEdgeData = {
  amountCents: number;
  kind: GraphEdgeKind;
  circular: boolean;
  showLabel: boolean;
};

export type GraphNodeData = {
  cpfCnpj: string;
  type: "person" | "company";
  kind: GraphNodeKind;
  label: string;
  sanctioned: boolean;
  registryStatus: string | null;
  radius: number;
  loading: boolean;
  circular?: boolean;
  photoUrl?: string | null;
};

export const NODE_COLOR: Record<GraphNodeKind, { fill: string; stroke: string; text: string }> = {
  self: { fill: "rgba(245, 158, 11, 0.20)", stroke: "#f59e0b", text: "#fbbf24" },
  politician: { fill: "rgba(29, 99, 255, 0.20)", stroke: "#1D63FF", text: "#60a5fa" },
  donor: { fill: "rgba(16, 185, 129, 0.20)", stroke: "#10b981", text: "#34d399" },
  supplier: { fill: "rgba(2, 132, 199, 0.20)", stroke: "#0284c7", text: "#38bdf8" },
  sanctioned: { fill: "rgba(244, 63, 94, 0.24)", stroke: "#f43f5e", text: "#fb7185" },
  company: { fill: "rgba(71, 85, 105, 0.25)", stroke: "#64748b", text: "#94a3b8" },
  person: { fill: "rgba(148, 163, 184, 0.16)", stroke: "#64748b", text: "#cbd5e1" },
};

export const NODE_KIND_LABEL: Record<GraphNodeKind, string> = {
  self: "este candidato",
  politician: "político",
  donor: "doador",
  supplier: "fornecedor",
  sanctioned: "sancionado",
  company: "empresa",
  person: "pessoa física",
};
