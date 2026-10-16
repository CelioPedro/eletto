"use client";

import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  MarkerType,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX } from "d3-force";
import type { GraphEdgeKind, GraphNodeInfo, GraphSearchResult } from "@/lib/queries";
import { findCircularEdgeKeys } from "@/lib/graph-cycles";
import { formatBRL } from "@/lib/format";
import { EntityNode } from "./graph/entity-node";
import { FloatingEdge } from "./graph/floating-edge";
import { NODE_COLOR, NODE_KIND_LABEL, type GraphEdgeData, type GraphNodeData } from "./graph/types";
import { Skeleton } from "./skeleton";
import { useColorMode } from "@/lib/use-color-mode";
import { ProUpgradeModal } from "./ui/pro-upgrade-modal";
import { GraphCommandCenter } from "./graph/graph-command-center";

const WIDTH = 1100;
const HEIGHT = 700;
const MAX_CONNECTORS = 12;

const nodeTypes = { entity: EntityNode };
const edgeTypes = { floating: FloatingEdge };

type FlowNode = Node<GraphNodeData, "entity">;
type FlowEdge = Edge<GraphEdgeData, "floating">;

function radiusFor(type: "person" | "company"): number {
  return type === "person" ? 27 : 21;
}

async function safeFetchJson<T = Record<string, unknown>>(
  url: string, body: unknown
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

type GraphEdgeRow = { source: string; target: string; kind: GraphEdgeKind; amountCents: number };
type GraphQueryResponse = { nodes?: GraphNodeInfo[]; edges?: GraphEdgeRow[] };

function edgeId(source: string, target: string, kind: string): string {
  return `${source}|${target}|${kind}`;
}

function toFlowNode(n: GraphNodeInfo, x: number, y: number, loading = false): FlowNode {
  return {
    id: n.cpfCnpj,
    type: "entity",
    position: { x, y },
    data: { ...n, radius: radiusFor(n.type), loading },
  };
}

function GraphCanvasInner() {
  const router = useRouter();
  const colorMode = useColorMode();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GraphSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [minReais, setMinReais] = useState("");
  const [maxReais, setMaxReais] = useState("");
  const [roots, setRoots] = useState<Set<string>>(new Set());
  const boxRef = useRef<HTMLDivElement>(null);

  const [expandFull, setExpandFull] = useState(false);
  const [truncatedNotice, setTruncatedNotice] = useState<string | null>(null);
  const [proModal, setProModal] = useState<{ open: boolean; title: string; description: string } | null>(null);

  const [searching, setSearching] = useState(false);
  const searchAbort = useRef<AbortController | null>(null);
  const onQueryChange = useCallback((value: string) => {
    setQ(value);
    searchAbort.current?.abort();
    if (value.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    searchAbort.current = controller;
    setSearching(true);
    setOpen(true);
    setTimeout(() => {
      if (controller.signal.aborted) return;
      fetch(`/api/graph-search?q=${encodeURIComponent(value)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => {
          setResults(data.results ?? []);
          setOpen(true);
        })
        .catch(() => {})
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false);
        });
    }, 220);
  }, []);

  function applyCircularStyling(edgeList: FlowEdge[], nodeIds: string[]): FlowEdge[] {
    const circular = findCircularEdgeKeys(
      nodeIds,
      edgeList.map((e) => ({ source: e.source, target: e.target }))
    );
    return edgeList.map((e) => {
      const isCircular = circular.has(`${e.source}|${e.target}`);
      const kind = e.data!.kind;
      const color = isCircular
        ? "var(--red)"
        : kind === "ownership"
          ? "#e11d48"
          : kind === "donation"
            ? "var(--green)"
            : "var(--accent-2)";
      return {
        ...e,
        data: { ...e.data!, circular: isCircular },
        style: {
          stroke: color,
          strokeWidth: Math.min(2.8, 0.8 + Math.log10(Math.max(1, e.data!.amountCents) / 100) * 0.4),
          strokeDasharray: kind === "ownership" ? "5,3" : undefined,
          opacity: isCircular ? 0.95 : kind === "ownership" ? 0.9 : 0.55,
        },
        animated: isCircular,
        zIndex: isCircular ? 10 : kind === "ownership" ? 5 : 0,
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      };
    });
  }

  const runLayout = useCallback(
    (
      currentNodes: FlowNode[],
      newInfos: GraphNodeInfo[],
      allEdgesForLayout: Array<{ source: string; target: string; kind?: GraphEdgeKind }>
    ) => {
      const existingIds = new Set(currentNodes.map((n) => n.id));
      const brandNew = newInfos.filter((n) => !existingIds.has(n.cpfCnpj));
      const infoById = new Map(newInfos.map((n) => [n.cpfCnpj, n]));

      const patched = currentNodes.map((n) => {
        const info = infoById.get(n.id);
        if (!info) return n;
        return { ...n, data: { ...n.data, ...info, radius: n.data.radius, loading: n.data.loading } };
      });
      if (brandNew.length === 0) return patched;

      // Use infoById kind, not the stale one on currentNodes (node added and expanded in one click).
      const politicianX = new Map<string, number>();
      for (const n of currentNodes) {
        const kind = infoById.get(n.id)?.kind ?? n.data.kind;
        if (kind === "politician") politicianX.set(n.id, n.position.x);
      }
      for (const n of brandNew) {
        if (n.kind === "politician") politicianX.set(n.cpfCnpj, WIDTH / 2);
      }
      const SIDE_OFFSET = 260;
      const anchorX = new Map<string, number>();
      for (const e of allEdgesForLayout) {
        if (e.kind === "donation" && politicianX.has(e.target) && !politicianX.has(e.source)) {
          const px = politicianX.get(e.target)!;
          const prev = anchorX.get(e.source);
          anchorX.set(e.source, prev == null ? px - SIDE_OFFSET : (prev + (px - SIDE_OFFSET)) / 2);
        } else if (e.kind === "payment" && politicianX.has(e.source) && !politicianX.has(e.target)) {
          const px = politicianX.get(e.source)!;
          const prev = anchorX.get(e.target);
          anchorX.set(e.target, prev == null ? px + SIDE_OFFSET : (prev + (px + SIDE_OFFSET)) / 2);
        }
      }

      type SimNode = { id: string; x: number; y: number; fx?: number; fy?: number; r: number };
      const simNodes: SimNode[] = [
        ...currentNodes.map((n): SimNode => ({
          id: n.id, x: n.position.x, y: n.position.y,
          fx: n.position.x, fy: n.position.y, r: n.data.radius,
        })),
        ...brandNew.map((n): SimNode => {
          const bias = anchorX.get(n.cpfCnpj);
          return {
            id: n.cpfCnpj,
            x: bias ?? WIDTH / 2 + (Math.random() - 0.5) * 200,
            y: HEIGHT / 2 + (Math.random() - 0.5) * 200,
            r: radiusFor(n.type),
          };
        }),
      ];
      const simLinks = allEdgesForLayout.map((e) => ({ source: e.source, target: e.target }));
      const sim = forceSimulation(simNodes as never[])
        .force("link", forceLink(simLinks as never[]).id((d) => (d as SimNode).id)
          .distance(160).strength(0.15))
        .force("charge", forceManyBody().strength(-380))
        .force("collide", forceCollide((d) => (d as SimNode).r + 34))
        .force(
          "x",
          forceX<SimNode>((d) => anchorX.get(d.id) ?? d.x).strength((d) => (anchorX.has(d.id) ? 0.22 : 0))
        )
        .stop();
      for (let i = 0; i < 260; i++) sim.tick();

      const posById = new Map(simNodes.map((n) => [n.id, { x: n.x, y: n.y }]));
      const updated = patched.map((n) => {
        const p = posById.get(n.id);
        return p ? { ...n, position: p } : n;
      });
      const added = brandNew.map((n) => {
        const p = posById.get(n.cpfCnpj)!;
        return toFlowNode(n, p.x, p.y);
      });
      return [...updated, ...added];
    },
    []
  );

  const findPaths = useCallback(
    (newId: string) => {
      setNodes((current) => {
        const existingIds = current.map((n) => n.id).filter((id) => id !== newId);
        if (existingIds.length === 0) return current;
        const onCanvas = new Set(current.map((n) => n.id));

        safeFetchJson<GraphQueryResponse>("/api/graph-paths", { newId, existingIds }).then((data) => {
          if (!data) return;
          const infos: GraphNodeInfo[] = data.nodes ?? [];
          const edgeRows: GraphEdgeRow[] = data.edges ?? [];

          const bridges = new Map<string, { bridged: Set<string>; maxAmount: number }>();
          for (const e of edgeRows) {
            for (const [a, b] of [[e.source, e.target], [e.target, e.source]] as const) {
              if (onCanvas.has(a)) continue;
              const rec = bridges.get(a) ?? { bridged: new Set<string>(), maxAmount: 0 };
              if (onCanvas.has(b)) rec.bridged.add(b);
              rec.maxAmount = Math.max(rec.maxAmount, e.amountCents);
              bridges.set(a, rec);
            }
          }
          const keptConnectors = new Set(
            [...bridges.entries()]
              .sort((x, y) => y[1].bridged.size - x[1].bridged.size || y[1].maxAmount - x[1].maxAmount)
              .slice(0, MAX_CONNECTORS)
              .map(([id]) => id)
          );
          const finalIds = new Set([...onCanvas, ...keptConnectors]);
          const keptInfos = infos.filter((n) => keptConnectors.has(n.cpfCnpj) || onCanvas.has(n.cpfCnpj));
          const keptEdges = edgeRows.filter((e) => finalIds.has(e.source) && finalIds.has(e.target));

          setNodes((cur) => runLayout(cur, keptInfos, keptEdges));
          setEdges((prev) => {
            const byId = new Map(prev.map((e) => [e.id, e]));
            for (const e of keptEdges) {
              const id = edgeId(e.source, e.target, e.kind);
              if (!byId.has(id)) {
                byId.set(id, {
                  id, source: e.source, target: e.target, type: "floating",
                  data: {
                    amountCents: Number(e.amountCents ?? (e as unknown as Record<string, unknown>).amountcents ?? 0),
                    kind: e.kind, circular: false, showLabel: true,
                  },
                });
              }
            }
            return applyCircularStyling([...byId.values()], [...finalIds]);
          });
        });
        return current;
      });
    },
    [runLayout, setNodes, setEdges]
  );

  const expandNode = useCallback(
    (newId: string) => {
      setNodes((current) => {
        safeFetchJson<GraphQueryResponse & { truncated?: boolean }>("/api/graph-expand", { cpfCnpj: newId })
          .then((data) => {
            if (!data) return;
            const infos: GraphNodeInfo[] = data.nodes ?? [];
            const edgeRows: GraphEdgeRow[] = data.edges ?? [];
            const idsAfter = new Set([...current.map((n) => n.id), ...infos.map((n) => n.cpfCnpj)]);

            setNodes((cur) => runLayout(cur, infos, edgeRows));
            setEdges((prev) => {
              const byId = new Map(prev.map((e) => [e.id, e]));
              for (const e of edgeRows) {
                const id = edgeId(e.source, e.target, e.kind);
                if (!byId.has(id)) {
                  byId.set(id, {
                    id, source: e.source, target: e.target, type: "floating",
                    data: {
                      amountCents: Number(e.amountCents ?? (e as unknown as Record<string, unknown>).amountcents ?? 0),
                      kind: e.kind, circular: false, showLabel: true,
                    },
                  });
                }
              }
              return applyCircularStyling([...byId.values()], [...idsAfter]);
            });
            if (data.truncated) {
              const label = infos.find((n) => n.cpfCnpj === newId)?.label ?? newId;
              setTruncatedNotice(`${label}: mostrando só os 400 maiores vínculos.`);
            }
          });
        return current;
      });
    },
    [runLayout, setNodes, setEdges]
  );

  const addNode = useCallback(
    (r: GraphSearchResult) => {
      setQ("");
      setResults([]);
      setOpen(false);
      setRoots((prev) => new Set(prev).add(r.cpfCnpj));
      setNodes((current) => {
        if (current.some((n) => n.id === r.cpfCnpj)) return current;
        const info: GraphNodeInfo = {
          cpfCnpj: r.cpfCnpj, type: r.type, kind: r.type === "person" ? "person" : "company",
          label: r.label, sanctioned: false, registryStatus: null, personId: null, photoUrl: null,
        };
        return runLayout(current, [info], []);
      });
      setNodes((nds) =>
        nds.map((n) => (n.id === r.cpfCnpj ? { ...n, data: { ...n.data, loading: true } } : n))
      );
      safeFetchJson<{ node: GraphNodeInfo | null }>("/api/graph-node", { cpfCnpj: r.cpfCnpj })
        .then((data) => {
          if (data?.node) setNodes((current) => runLayout(current, [data.node!], []));
        })
        .finally(() => {
          setNodes((nds) =>
            nds.map((n) => (n.id === r.cpfCnpj ? { ...n, data: { ...n.data, loading: false } } : n))
          );
          if (expandFull) expandNode(r.cpfCnpj);
          else findPaths(r.cpfCnpj);
        });
    },
    [runLayout, findPaths, expandNode, expandFull, setNodes]
  );

  const searchParams = useSearchParams();
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    const raw = searchParams.get("add");
    if (!raw) return;
    seededRef.current = true;
    // queueMicrotask, not setTimeout: Strict Mode's effect cleanup would cancel the first run.
    queueMicrotask(() => {
      for (const id of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
        const type: "person" | "company" = id.length === 14 ? "company" : "person";
        addNode({ type, cpfCnpj: id, label: id, sublabel: null });
      }
    });
  }, [searchParams, addNode]);

  const onNodeClick: NodeMouseHandler<FlowNode> = useCallback((_evt, node) => {
    setSelected(node.id);
  }, []);

  function removeNode(cpfCnpj: string) {
    setNodes((nds) => nds.filter((n) => n.id !== cpfCnpj));
    setEdges((eds) => eds.filter((e) => e.source !== cpfCnpj && e.target !== cpfCnpj));
    setRoots((prev) => {
      const next = new Set(prev);
      next.delete(cpfCnpj);
      return next;
    });
    if (selected === cpfCnpj) setSelected(null);
  }

  function clearAll() {
    setNodes([]);
    setEdges([]);
    setRoots(new Set());
    setSelected(null);
  }

  const selectedNode = nodes.find((n) => n.id === selected) ?? null;
  const selectedEdges = useMemo(
    () => (selected ? edges.filter((e) => e.source === selected || e.target === selected) : []),
    [edges, selected]
  );
  const labelFor = (id: string) => nodes.find((n) => n.id === id)?.data.label ?? id;
  const circularCount = edges.filter((e) => e.data?.circular).length;

  const minCents = minReais.trim() === "" ? null : Math.round(Number(minReais) * 100);
  const maxCents = maxReais.trim() === "" ? null : Math.round(Number(maxReais) * 100);
  const amountFilterActive =
    (minCents != null && !Number.isNaN(minCents)) || (maxCents != null && !Number.isNaN(maxCents));

  const visibleEdges = useMemo(() => {
    if (!amountFilterActive) return edges;
    return edges.filter((e) => {
      const amt = e.data?.amountCents ?? 0;
      if (minCents != null && !Number.isNaN(minCents) && amt < minCents) return false;
      if (maxCents != null && !Number.isNaN(maxCents) && amt > maxCents) return false;
      return true;
    });
  }, [edges, amountFilterActive, minCents, maxCents]);

  const visibleNodes = useMemo(() => {
    if (!amountFilterActive) return nodes;
    const keep = new Set<string>(roots);
    if (selected) keep.add(selected);
    for (const e of visibleEdges) {
      keep.add(e.source);
      keep.add(e.target);
    }
    return nodes.filter((n) => keep.has(n.id));
  }, [nodes, visibleEdges, amountFilterActive, selected, roots]);

  return (
    <div className="flex min-h-0 flex-1 flex-col h-full bg-[var(--bg)] text-[var(--fg-1)]">
      {/* Enterprise Top Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-1)] bg-[var(--surface)] px-6 py-3 shrink-0 z-10 shadow-xs">
        <div ref={boxRef} className="relative w-full max-w-sm">
          <div className="relative flex items-center">
            <svg
              className="absolute left-3 size-4 text-[var(--muted-2)] pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder="Buscar candidato, CPF ou CNPJ…"
              className="w-full rounded-[0px] border border-[var(--border-2)] bg-[var(--card-tone)] pl-9 pr-8 py-2 font-sans text-[13px] text-[var(--fg-1)] placeholder:text-[var(--muted-2)] outline-none focus:border-[#1D63FF] focus:ring-1 focus:ring-[#1D63FF]/30 transition-all"
            />
            {q ? (
              <button
                type="button"
                onClick={() => { setQ(""); setResults([]); }}
                className="absolute right-2.5 text-[var(--muted-2)] hover:text-[var(--fg-1)] text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            ) : null}
          </div>

          {open && (searching || results.length > 0) ? (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-[380px] w-full overflow-y-auto rounded-[0px] border border-[var(--border-2)] bg-[var(--surface)] shadow-2xl backdrop-blur-md divide-y divide-[var(--border-1)]">
              {searching && results.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                      <Skeleton className="h-4 w-14 flex-none" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))
                : results.map((r) => (
                    <button
                      key={r.cpfCnpj}
                      onMouseDown={() => addNode(r)}
                      className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--hover)] group cursor-pointer"
                    >
                      <span className="flex-none rounded-[0px] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider bg-[var(--card-tone)] border border-[var(--border-1)] text-[var(--fg-1)]">
                        {r.type === "person" ? "pessoa" : "empresa"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-[var(--fg-1)] group-hover:text-[#1D63FF] transition-colors">
                          {r.label}
                        </div>
                        {r.sublabel && (
                          <div className="truncate text-[11px] font-mono text-[var(--muted-2)]">
                            {r.sublabel}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
            </div>
          ) : null}
        </div>

        <label
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[0px] border text-[12px] cursor-pointer select-none transition-all ${
            expandFull
              ? "border-[#1D63FF] bg-[#1D63FF]/10 text-[var(--fg-1)] font-medium shadow-xs"
              : "border-[var(--border-1)] bg-[var(--card-tone)] text-[var(--muted)] hover:border-[var(--border-2)]"
          }`}
          title="Ao adicionar, traz TODOS os vínculos diretos desse nó, não só os que conectam com o que já está na tela."
        >
          <input
            type="checkbox"
            checked={expandFull}
            onChange={(e) => setExpandFull(e.target.checked)}
            className="accent-[#1D63FF] size-3.5 rounded-[0px]"
          />
          <span className="font-mono text-[11.5px]">Trazer rede inteira</span>
        </label>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[0px] border border-[var(--border-1)] bg-[var(--card-tone)] text-[12px] text-[var(--muted)]">
          <span className="text-[var(--muted-2)] font-mono text-[11px]">Movimentação:</span>
          <span className="font-mono text-[11px] text-[var(--muted-2)]">R$</span>
          <input
            type="number"
            inputMode="decimal"
            value={minReais}
            onChange={(e) => setMinReais(e.target.value)}
            placeholder="mínimo"
            className="w-20 bg-transparent border-b border-[var(--border-2)] px-1 py-0.5 font-mono text-[11px] text-[var(--fg-1)] placeholder:text-[var(--muted-2)] outline-none focus:border-[#1D63FF] text-center"
          />
          <span className="text-[var(--muted-2)]">–</span>
          <input
            type="number"
            inputMode="decimal"
            value={maxReais}
            onChange={(e) => setMaxReais(e.target.value)}
            placeholder="máximo"
            className="w-20 bg-transparent border-b border-[var(--border-2)] px-1 py-0.5 font-mono text-[11px] text-[var(--fg-1)] placeholder:text-[var(--muted-2)] outline-none focus:border-[#1D63FF] text-center"
          />
          {amountFilterActive ? (
            <button
              onClick={() => { setMinReais(""); setMaxReais(""); }}
              className="ml-1 text-[11px] font-mono font-medium text-[#1D63FF] hover:underline cursor-pointer"
            >
              limpar
            </button>
          ) : null}
        </div>

        <div className="px-3 py-1.5 rounded-[0px] border border-[var(--border-1)] bg-[var(--card-tone)] font-mono text-[11px] text-[var(--muted)]">
          {visibleNodes.length} {visibleNodes.length === 1 ? "nó" : "nós"} · {visibleEdges.length} conexões
          {amountFilterActive ? ` (de ${nodes.length} · ${edges.length})` : ""}
        </div>

        {circularCount > 0 ? (
          <div className="px-3 py-1.5 rounded-[0px] border border-rose-500/40 bg-rose-500/15 text-rose-300 font-mono text-[11px] flex items-center gap-2">
            <span className="size-2 rounded-[0px] bg-rose-500 animate-pulse" />
            <span>{circularCount} em triangulação circular</span>
          </div>
        ) : null}

        {truncatedNotice ? (
          <button
            onClick={() => setTruncatedNotice(null)}
            className="px-3 py-1.5 rounded-[0px] border border-amber-500/40 bg-amber-500/15 text-amber-300 font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
            title="Clique para dispensar"
          >
            ⚠ {truncatedNotice}
          </button>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setProModal({
                open: true,
                title: "Exportação de Grafo & Relatório Forense",
                description:
                  "Exporte a rede de vínculos investigada em alta definição (SVG/PDF vetorial) ou como matriz de adjacência (CSV, JSON, Gephi) com carimbo criptográfico para instrução probatória.",
              })
            }
            className="px-3 py-1.5 rounded-[0px] border border-[var(--border-1)] hover:border-[#1D63FF] hover:bg-[#1D63FF]/10 text-[var(--fg-1)] font-mono text-[11.5px] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Exportar dados e visualização do grafo"
          >
            <span>Exportar Grafo</span>
            <span className="px-1.5 py-0.2 font-mono text-[9px] font-bold bg-[#1D63FF]/15 text-[#1D63FF] border border-[#1D63FF]/30">
              PRO
            </span>
          </button>

          {nodes.length > 0 ? (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-[0px] border border-[var(--border-1)] hover:border-rose-500/40 hover:bg-rose-500/10 text-[var(--muted)] hover:text-rose-400 font-mono text-[11.5px] transition-colors cursor-pointer"
            >
              Limpar visualização
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="relative flex-1 bg-[var(--bg)] overflow-hidden">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--hover)_0%,_var(--bg)_70%)]">
            <GraphCommandCenter onAddNode={addNode} onQueryChange={onQueryChange} />
          </div>
        ) : (
          <ReactFlow<FlowNode, FlowEdge>
            nodes={visibleNodes}
            edges={visibleEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelected(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            colorMode={colorMode}
            fitView
            minZoom={0.15}
            proOptions={{ hideAttribution: true }}
            style={{ backgroundColor: "var(--bg)", width: "100%", height: "100%" }}
          >
            <Background color={colorMode === "dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"} gap={24} size={1.2} />
            <Controls showInteractive={false} className="!border !border-[var(--border-1)] !rounded-[0px] !bg-[var(--surface)]" />
            <MiniMap
              pannable
              zoomable
              maskColor={colorMode === "dark" ? "rgba(7, 9, 19, 0.85)" : "rgba(248, 250, 252, 0.85)"}
              nodeColor={(n) => NODE_COLOR[(n as FlowNode).data.kind].stroke}
              className="!border !border-[var(--border-1)] !rounded-[0px] !bg-[var(--surface)]"
            />
          </ReactFlow>
        )}

        {/* Selected Node Inspector Panel */}
        {selectedNode ? (
          <div className="absolute top-4 right-4 w-84 rounded-[0px] border border-[var(--border-1)] bg-[var(--surface)] p-5 shadow-2xl z-20">
            <span className="card-dot card-dot--tl" />
            <span className="card-dot card-dot--tr" />
            <span className="card-dot card-dot--bl" />
            <span className="card-dot card-dot--br" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-[0px] shrink-0"
                    style={{ backgroundColor: NODE_COLOR[selectedNode.data.kind].stroke }}
                  />
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    {NODE_KIND_LABEL[selectedNode.data.kind]}
                  </span>
                </div>
                <div className="mt-1 truncate text-[14.5px] font-semibold text-[var(--fg-1)]">
                  {selectedNode.data.label}
                </div>
                <div className="mt-0.5 font-mono text-[10.5px] text-[var(--muted-2)]">
                  {selectedNode.id}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="size-6 rounded-[0px] hover:bg-[var(--hover)] flex items-center justify-center text-[var(--muted-2)] hover:text-[var(--fg-1)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedNode.data.sanctioned ? (
              <div className="mt-3 rounded-[0px] border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 font-mono text-[10.5px] text-rose-400 flex items-center gap-1.5">
                <span>⚠</span> Sanção federal ativa (CEIS/CNEP)
              </div>
            ) : null}

            {selectedNode.data.registryStatus ? (
              <div className="mt-2 font-mono text-[10.5px] text-[var(--muted-2)]">
                Situação cadastral: <span className="text-[var(--fg-1)]">{selectedNode.data.registryStatus}</span>
              </div>
            ) : null}

            {selectedEdges.length > 0 ? (
              <div className="mt-4 border-t border-[var(--border-1)] pt-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-2)] mb-2 font-semibold">
                  Vínculos na tela ({selectedEdges.length}):
                </div>
                <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
                  {selectedEdges.map((e) => (
                    <div
                      key={e.id}
                      className={`flex items-center justify-between gap-2 rounded-[0px] px-2 py-1 font-mono text-[10.5px] border border-[var(--border-1)] ${
                        e.data?.circular ? "bg-rose-500/10 text-rose-300 border-rose-500/30" : "bg-[var(--card-tone)] text-[var(--muted)]"
                      }`}
                    >
                      <div className="truncate min-w-0">
                        <span className="font-bold mr-1">{e.source === selectedNode.id ? "→" : "←"}</span>
                        {e.data?.kind === "ownership" ? (
                          <span className="mr-1.5 rounded-[0px] bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold text-rose-300 uppercase">
                            Sócio
                          </span>
                        ) : null}
                        <span className="text-[var(--fg-1)] font-medium">
                          {labelFor(e.source === selectedNode.id ? e.target : e.source)}
                        </span>
                      </div>
                      <span className="font-semibold shrink-0 text-[var(--fg-1)]">
                        {formatBRL(Number(e.data?.amountCents ?? (e.data as unknown as Record<string, unknown>)?.amountcents ?? 0))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-[var(--border-1)]">
              <button
                type="button"
                onClick={() =>
                  setProModal({
                    open: true,
                    title: `Rastreamento Profundo de Vínculos (${selectedNode.data.label})`,
                    description:
                      "Execute uma varredura recursiva de até 5 saltos para revelar intermediários, sócios cruzados, fornecedores satélites e triangulações bancárias ocultas.",
                  })
                }
                className="w-full flex items-center justify-center gap-2 rounded-[0px] border border-[#1D63FF]/40 bg-[#1D63FF]/10 hover:bg-[#1D63FF]/20 text-[#1D63FF] py-2 text-[11px] font-mono font-semibold uppercase tracking-wide transition-colors cursor-pointer"
              >
                <span>⚡ Rastrear Vínculos Ocultos</span>
                <span className="px-1.5 py-0.2 font-mono text-[9px] font-bold bg-[#1D63FF]/20 text-[#1D63FF]">
                  PRO
                </span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(selectedNode.id.length === 14 ? `/cnpj/${selectedNode.id}` : `/cpf/${selectedNode.id}`)
                  }
                  className="flex-1 rounded-[0px] bg-[#1D63FF] hover:bg-[#1550D6] text-white py-2 text-[11px] font-mono font-semibold tracking-wide uppercase transition-colors text-center cursor-pointer shadow-xs"
                >
                  Ver Ficha Completa
                </button>
                <button
                  onClick={() => removeNode(selectedNode.id)}
                  className="rounded-[0px] border border-[var(--border-1)] hover:border-rose-500/40 hover:bg-rose-500/10 px-3 py-2 text-[11px] font-mono font-medium text-[var(--muted)] hover:text-rose-400 uppercase transition-colors cursor-pointer"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Enterprise Bottom Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-1)] bg-[var(--surface)] px-6 py-2.5 font-mono text-[10.5px] text-[var(--muted)] shrink-0">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[9.5px] uppercase tracking-wider text-[var(--muted-2)] font-semibold">Entidades:</span>
          {(Object.keys(NODE_COLOR) as Array<keyof typeof NODE_COLOR>).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-[0px] border"
                style={{ backgroundColor: NODE_COLOR[k].fill, borderColor: NODE_COLOR[k].stroke }}
              />
              <span>{NODE_KIND_LABEL[k]}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 border-l border-[var(--border-1)] pl-4">
          <span className="text-[9.5px] uppercase tracking-wider text-[var(--muted-2)] font-semibold">Fluxos:</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 bg-[#10B981]" /> Doação
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-4 bg-[#1D63FF]" /> Pagamento
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="inline-block h-[2px] w-4 bg-rose-500" /> Triangulação Circular
          </span>
        </div>
      </div>

      <ProUpgradeModal
        open={Boolean(proModal?.open)}
        onClose={() => setProModal(null)}
        featureTitle={proModal?.title ?? "Recurso Avançado Eletto Pro"}
        featureDescription={proModal?.description ?? "Acesse inteligência pericial de grafos profundos para subsidiar investigações e auditorias de alta complexidade."}
        benefits={[
          "Expansão recursiva de nós e relacionamentos em até 5 saltos",
          "Exportação vetorial em SVG/PDF e matriz de grafos (Gephi, CSV, JSON)",
          "Detecção de doações circulares multinível e empresas de fachada",
          "Dossiês periciais ilimitados com chancela SHA-256",
        ]}
      />
    </div>
  );
}

export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
}
