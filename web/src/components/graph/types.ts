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
  politician: { fill: "rgba(37, 99, 235, 0.20)", stroke: "#3b82f6", text: "#60a5fa" },
  donor: { fill: "rgba(34, 197, 94, 0.20)", stroke: "#22c55e", text: "#4ade80" },
  supplier: { fill: "rgba(6, 182, 212, 0.20)", stroke: "#06b6d4", text: "#38bdf8" },
  sanctioned: { fill: "rgba(244, 63, 94, 0.24)", stroke: "#f43f5e", text: "#fb7185" },
  company: { fill: "rgba(139, 92, 246, 0.20)", stroke: "#8b5cf6", text: "#a78bfa" },
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
