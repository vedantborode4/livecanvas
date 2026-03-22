"use client";

import { initDraw, ToolType } from "@/draw";
import { useEffect, useRef, useState, useCallback } from "react";

const TOOLS: { id: ToolType; label: string; icon: string; shortcut: string }[] = [
  { id: "pointer",  label: "Select",    icon: "pointer",  shortcut: "V" },
  { id: "rect",     label: "Rectangle", icon: "rect",     shortcut: "R" },
  { id: "circle",   label: "Circle",    icon: "circle",   shortcut: "C" },
  { id: "ellipse",  label: "Ellipse",   icon: "ellipse",  shortcut: "O" },
  { id: "diamond",  label: "Diamond",   icon: "diamond",  shortcut: "D" },
  { id: "triangle", label: "Triangle",  icon: "triangle",  shortcut: "T" },
  { id: "line",     label: "Line",      icon: "line",     shortcut: "L" },
  { id: "arrow",    label: "Arrow",     icon: "arrow",    shortcut: "A" },
  { id: "pencil",   label: "Pencil",    icon: "pencil",   shortcut: "P" },
  { id: "text",     label: "Text",      icon: "text",     shortcut: "X" },
  { id: "eraser",   label: "Eraser",    icon: "eraser",   shortcut: "E" },
];

function ToolIcon({ type, size = 18 }: { type: string; size?: number }) {
  const s = size;
  const c = s / 2;
  const p = 3;
  const stroke = "currentColor";
  const sw = 1.6;

  switch (type) {
    case "pointer":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${p} ${p}L${p} ${s - p}L${c} ${c + 2}L${s - p} ${c + 2}Z`} fill="currentColor" opacity={0.3} />
          <path d={`M${p} ${p}L${p} ${s - p}L${c} ${c + 2}L${s - p} ${c + 2}Z`} />
        </svg>
      );
    case "rect":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x={p} y={p + 1} width={s - p * 2} height={s - p * 2 - 2} rx={2} />
        </svg>
      );
    case "circle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw}>
          <circle cx={c} cy={c} r={c - p} />
        </svg>
      );
    case "ellipse":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw}>
          <ellipse cx={c} cy={c} rx={c - p} ry={c - p - 2} />
        </svg>
      );
    case "diamond":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
          <path d={`M${c} ${p}L${s - p} ${c}L${c} ${s - p}L${p} ${c}Z`} />
        </svg>
      );
    case "triangle":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
          <path d={`M${c} ${p}L${s - p} ${s - p}L${p} ${s - p}Z`} />
        </svg>
      );
    case "line":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round">
          <line x1={p} y1={s - p} x2={s - p} y2={p} />
        </svg>
      );
    case "arrow":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <line x1={p} y1={s - p} x2={s - p} y2={p} />
          <polyline points={`${s - p - 5},${p} ${s - p},${p} ${s - p},${p + 5}`} />
        </svg>
      );
    case "pencil":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${p + 1} ${s - p - 1}L${c - 1} ${c + 1}L${c + 2} ${p + 2}L${s - p - 1} ${c - 1}`} />
          <line x1={p + 1} y1={s - p - 1} x2={p + 3} y2={s - p - 3} />
        </svg>
      );
    case "text":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round">
          <line x1={p + 1} y1={p + 1} x2={s - p - 1} y2={p + 1} />
          <line x1={c} y1={p + 1} x2={c} y2={s - p - 1} />
          <line x1={c - 3} y1={s - p - 1} x2={c + 3} y2={s - p - 1} />
        </svg>
      );
    case "eraser":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${s - p - 2} ${p + 2}L${c + 2} ${s - p}L${p} ${c + 1}L${c} ${p}Z`} />
          <line x1={c - 2} y1={s - p} x2={s - p} y2={s - p} />
        </svg>
      );
    default:
      return <span className="text-xs">{type[0]?.toUpperCase()}</span>;
  }
}

const CURSOR_MAP: Record<ToolType, string> = {
  pointer: "default",
  rect: "crosshair",
  circle: "crosshair",
  ellipse: "crosshair",
  line: "crosshair",
  arrow: "crosshair",
  diamond: "crosshair",
  triangle: "crosshair",
  pencil: "crosshair",
  text: "text",
  eraser: "crosshair",
};

export function Canvas({
  roomId,
  socket,
  token,
}: {
  roomId: string;
  socket: WebSocket;
  token: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>("rect");
  const selectedToolRef = useRef<ToolType>("rect");
  const engineRef = useRef<ReturnType<typeof initDraw> | null>(null);
  const [shapeCount, setShapeCount] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Keep ref in sync
  const changeTool = useCallback((t: ToolType) => {
    setSelectedTool(t);
    selectedToolRef.current = t;
  }, []);

  // Init canvas engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const engine = initDraw(
      canvas,
      roomId,
      socket,
      token,
      () => selectedToolRef.current,
      (count) => setShapeCount(count),
      (u, r) => { setCanUndo(u); setCanRedo(r); }
    );
    engineRef.current = engine;

    return () => {
      engine.cleanup();
      window.removeEventListener("resize", resize);
    };
  }, [roomId, socket, token]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't capture when typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault(); engineRef.current?.undo(); return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault(); engineRef.current?.redo(); return;
      }

      // Tool shortcuts
      const tool = TOOLS.find((t) => t.shortcut.toLowerCase() === e.key.toLowerCase());
      if (tool) changeTool(tool.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeTool]);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1e1e2e" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: CURSOR_MAP[selectedTool] }}
      />

      {/* ─── Top toolbar ─── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5 px-2 py-1.5 rounded-xl bg-[#181825]/90 backdrop-blur-xl border border-[#313244]/60 shadow-2xl shadow-black/40">
        {TOOLS.map((tool, i) => {
          const isActive = selectedTool === tool.id;
          const showSep = i === 0 || i === 5 || i === 8 || i === 10;
          return (
            <div key={tool.id} className="flex items-center">
              {showSep && i !== 0 && (
                <div className="w-px h-5 bg-[#313244]/60 mx-1" />
              )}
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(tool.id)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <button
                  onClick={() => changeTool(tool.id)}
                  className={`
                    relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150
                    ${isActive
                      ? "bg-[#89b4fa]/15 text-[#89b4fa] shadow-inner"
                      : "text-[#6c7086] hover:text-[#a6adc8] hover:bg-[#313244]/40"
                    }
                  `}
                >
                  <ToolIcon type={tool.icon} size={18} />
                </button>

                {showTooltip === tool.id && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-[#11111b] border border-[#313244] text-xs whitespace-nowrap pointer-events-none shadow-xl z-50">
                    <span className="text-[#cdd6f4]">{tool.label}</span>
                    <span className="ml-2 text-[#585b70] font-mono">{tool.shortcut}</span>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#11111b] border-l border-t border-[#313244] rotate-45" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#181825]/90 backdrop-blur-xl border border-[#313244]/60 shadow-2xl shadow-black/40">
        {/* Undo */}
        <button
          onClick={() => engineRef.current?.undo()}
          disabled={!canUndo}
          className={`p-1.5 rounded-md transition-colors ${canUndo ? "text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]/40" : "text-[#45475a] cursor-not-allowed"}`}
          title="Undo (Ctrl+Z)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h7a3 3 0 0 1 0 6H8" />
            <polyline points="6,3 3,6 6,9" />
          </svg>
        </button>

        {/* Redo */}
        <button
          onClick={() => engineRef.current?.redo()}
          disabled={!canRedo}
          className={`p-1.5 rounded-md transition-colors ${canRedo ? "text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]/40" : "text-[#45475a] cursor-not-allowed"}`}
          title="Redo (Ctrl+Y)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 6H6a3 3 0 0 0 0 6h2" />
            <polyline points="10,3 13,6 10,9" />
          </svg>
        </button>

        <div className="w-px h-5 bg-[#313244]/60" />

        {/* Clear */}
        <button
          onClick={() => engineRef.current?.clearAll()}
          className="p-1.5 rounded-md text-[#a6adc8] hover:text-[#f38ba8] hover:bg-[#f38ba8]/10 transition-colors"
          title="Clear canvas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,4 4,13 12,13 13,4" />
            <line x1="2" y1="4" x2="14" y2="4" />
            <line x1="6" y1="2" x2="10" y2="2" />
            <line x1="6" y1="7" x2="6" y2="10" />
            <line x1="10" y1="7" x2="10" y2="10" />
          </svg>
        </button>

        <div className="w-px h-5 bg-[#313244]/60" />

        <span className="text-xs text-[#585b70] tabular-nums font-mono select-none">
          {shapeCount} {shapeCount === 1 ? "shape" : "shapes"}
        </span>
      </div>

      {/* ─── Help hint ─── */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-[#45475a] select-none leading-relaxed text-right">
        Scroll to zoom &middot; Pointer to pan
      </div>
    </div>
  );
}
