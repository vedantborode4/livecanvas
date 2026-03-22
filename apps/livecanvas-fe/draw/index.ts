import { backendURL } from "@/components/util";
import axios from "axios";

// ─── Shape Types ───────────────────────────────────────────────
export type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "ellipse"; centerX: number; centerY: number; radiusX: number; radiusY: number }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number }
  | { type: "arrow"; startX: number; startY: number; endX: number; endY: number }
  | { type: "diamond"; centerX: number; centerY: number; halfW: number; halfH: number }
  | { type: "triangle"; x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }
  | { type: "pencil"; points: { x: number; y: number }[] }
  | { type: "text"; x: number; y: number; content: string };

export type ToolType =
  | "pointer"
  | "rect"
  | "circle"
  | "ellipse"
  | "line"
  | "arrow"
  | "diamond"
  | "triangle"
  | "pencil"
  | "text"
  | "eraser";

// ─── Theme ─────────────────────────────────────────────────────
const COLORS = {
  bg: "#1e1e2e",
  grid: "rgba(108, 112, 134, 0.08)",
  stroke: "#cdd6f4",
  strokePreview: "rgba(137, 180, 250, 0.8)",
};

// ─── Main Init ─────────────────────────────────────────────────
export function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  token: string,
  getSelectedTool: () => ToolType,
  onShapesChanged: (count: number) => void,
  onUndoRedoChanged: (canUndo: boolean, canRedo: boolean) => void
): { cleanup: () => void; undo: () => void; redo: () => void; clearAll: () => void } {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return { cleanup: () => {}, undo: () => {}, redo: () => {}, clearAll: () => {} };

  let existingShapes: Shape[] = [];
  const undoStack: Shape[][] = [];
  const redoStack: Shape[][] = [];
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];

  let panX = 0;
  let panY = 0;
  let scale = 1;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;

  let textInput: HTMLInputElement | null = null;

  function screenToWorld(sx: number, sy: number) {
    return { x: (sx - panX) / scale, y: (sy - panY) / scale };
  }

  // ─── Load existing ──────────────────────────────────────────
  (async () => {
    try { existingShapes = await getExistingShape(roomId, token); } catch { existingShapes = []; }
    onShapesChanged(existingShapes.length);
    onUndoRedoChanged(false, false);
    render();
  })();

  // ─── Socket ─────────────────────────────────────────────────
  function onMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat") {
        existingShapes.push(JSON.parse(msg.message));
        onShapesChanged(existingShapes.length);
        render();
      }
    } catch { /* ignore */ }
  }
  socket.addEventListener("message", onMessage);

  // ─── Undo / Redo ────────────────────────────────────────────
  function pushUndo() {
    undoStack.push(JSON.parse(JSON.stringify(existingShapes)));
    redoStack.length = 0;
    if (undoStack.length > 50) undoStack.shift();
    onUndoRedoChanged(true, false);
  }

  function undo() {
    if (!undoStack.length) return;
    redoStack.push(JSON.parse(JSON.stringify(existingShapes)));
    existingShapes = undoStack.pop()!;
    onShapesChanged(existingShapes.length);
    onUndoRedoChanged(undoStack.length > 0, redoStack.length > 0);
    render();
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(JSON.parse(JSON.stringify(existingShapes)));
    existingShapes = redoStack.pop()!;
    onShapesChanged(existingShapes.length);
    onUndoRedoChanged(undoStack.length > 0, redoStack.length > 0);
    render();
  }

  function clearAll() {
    if (!existingShapes.length) return;
    pushUndo();
    existingShapes = [];
    onShapesChanged(0);
    render();
  }

  // ─── Rendering ──────────────────────────────────────────────
  function render() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);

    // Dot grid
    const gs = 24;
    const sgx = Math.floor(-panX / scale / gs) * gs;
    const sgy = Math.floor(-panY / scale / gs) * gs;
    ctx.fillStyle = COLORS.grid;
    for (let gx = sgx; gx < sgx + w / scale + gs; gx += gs)
      for (let gy = sgy; gy < sgy + h / scale + gs; gy += gs) {
        ctx.beginPath(); ctx.arc(gx, gy, 1, 0, Math.PI * 2); ctx.fill();
      }

    existingShapes.forEach(s => drawShape(ctx, s, false));
    ctx.restore();
  }

  function renderPreview(preview: Shape | null) {
    render();
    if (!preview) return;
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);
    drawShape(ctx, preview, true);
    ctx.restore();
  }

  // ─── Shape renderer ─────────────────────────────────────────
  function drawShape(c: CanvasRenderingContext2D, s: Shape, preview: boolean) {
    c.strokeStyle = preview ? COLORS.strokePreview : COLORS.stroke;
    c.lineWidth = 2 / scale;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.setLineDash(preview ? [6 / scale, 4 / scale] : []);

    switch (s.type) {
      case "rect": {
        c.beginPath();
        roundRect(c, s.x, s.y, s.width, s.height, 4 / scale);
        c.stroke();
        break;
      }
      case "circle": {
        const r = Math.abs(s.radius);
        if (r > 0) { c.beginPath(); c.arc(s.centerX, s.centerY, r, 0, Math.PI * 2); c.stroke(); }
        break;
      }
      case "ellipse": {
        const rx = Math.abs(s.radiusX), ry = Math.abs(s.radiusY);
        if (rx > 0 && ry > 0) { c.beginPath(); c.ellipse(s.centerX, s.centerY, rx, ry, 0, 0, Math.PI * 2); c.stroke(); }
        break;
      }
      case "line": {
        c.beginPath(); c.moveTo(s.startX, s.startY); c.lineTo(s.endX, s.endY); c.stroke();
        break;
      }
      case "arrow": {
        c.beginPath(); c.moveTo(s.startX, s.startY); c.lineTo(s.endX, s.endY); c.stroke();
        const a = Math.atan2(s.endY - s.startY, s.endX - s.startX);
        const hl = 14 / scale;
        c.beginPath();
        c.moveTo(s.endX, s.endY);
        c.lineTo(s.endX - hl * Math.cos(a - Math.PI / 6), s.endY - hl * Math.sin(a - Math.PI / 6));
        c.moveTo(s.endX, s.endY);
        c.lineTo(s.endX - hl * Math.cos(a + Math.PI / 6), s.endY - hl * Math.sin(a + Math.PI / 6));
        c.stroke();
        break;
      }
      case "diamond": {
        c.beginPath();
        c.moveTo(s.centerX, s.centerY - s.halfH);
        c.lineTo(s.centerX + s.halfW, s.centerY);
        c.lineTo(s.centerX, s.centerY + s.halfH);
        c.lineTo(s.centerX - s.halfW, s.centerY);
        c.closePath(); c.stroke();
        break;
      }
      case "triangle": {
        c.beginPath();
        c.moveTo(s.x1, s.y1); c.lineTo(s.x2, s.y2); c.lineTo(s.x3, s.y3);
        c.closePath(); c.stroke();
        break;
      }
      case "pencil": {
        if (s.points.length < 2) break;
        c.beginPath(); c.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) c.lineTo(s.points[i].x, s.points[i].y);
        c.stroke();
        break;
      }
      case "text": {
        c.setLineDash([]);
        c.font = `${16 / scale}px "Inter", system-ui, sans-serif`;
        c.fillStyle = preview ? COLORS.strokePreview : COLORS.stroke;
        c.fillText(s.content, s.x, s.y);
        break;
      }
    }
  }

  function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const x1 = w < 0 ? x + w : x, y1 = h < 0 ? y + h : y;
    const aw = Math.abs(w), ah = Math.abs(h);
    const cr = Math.min(r, aw / 2, ah / 2);
    c.moveTo(x1 + cr, y1);
    c.lineTo(x1 + aw - cr, y1);
    c.arcTo(x1 + aw, y1, x1 + aw, y1 + cr, cr);
    c.lineTo(x1 + aw, y1 + ah - cr);
    c.arcTo(x1 + aw, y1 + ah, x1 + aw - cr, y1 + ah, cr);
    c.lineTo(x1 + cr, y1 + ah);
    c.arcTo(x1, y1 + ah, x1, y1 + ah - cr, cr);
    c.lineTo(x1, y1 + cr);
    c.arcTo(x1, y1, x1 + cr, y1, cr);
    c.closePath();
  }

  // ─── Build shape ────────────────────────────────────────────
  function buildShape(tool: ToolType, sx: number, sy: number, ex: number, ey: number): Shape | null {
    const w = ex - sx, h = ey - sy;
    switch (tool) {
      case "rect": return { type: "rect", x: sx, y: sy, width: w, height: h };
      case "circle": return { type: "circle", centerX: sx + w / 2, centerY: sy + h / 2, radius: Math.sqrt(w * w + h * h) / 2 };
      case "ellipse": return { type: "ellipse", centerX: sx + w / 2, centerY: sy + h / 2, radiusX: Math.abs(w / 2), radiusY: Math.abs(h / 2) };
      case "line": return { type: "line", startX: sx, startY: sy, endX: ex, endY: ey };
      case "arrow": return { type: "arrow", startX: sx, startY: sy, endX: ex, endY: ey };
      case "diamond": return { type: "diamond", centerX: sx + w / 2, centerY: sy + h / 2, halfW: Math.abs(w / 2), halfH: Math.abs(h / 2) };
      case "triangle": return { type: "triangle", x1: sx + w / 2, y1: sy, x2: sx, y2: sy + h, x3: ex, y3: sy + h };
      default: return null;
    }
  }

  // ─── Eraser ─────────────────────────────────────────────────
  function eraseAt(wx: number, wy: number) {
    const t = 10 / scale;
    for (let i = existingShapes.length - 1; i >= 0; i--) {
      if (hitTest(existingShapes[i], wx, wy, t)) {
        pushUndo();
        existingShapes.splice(i, 1);
        onShapesChanged(existingShapes.length);
        render();
        return;
      }
    }
  }

  function hitTest(s: Shape, px: number, py: number, t: number): boolean {
    switch (s.type) {
      case "rect": {
        const x1 = Math.min(s.x, s.x + s.width), x2 = Math.max(s.x, s.x + s.width);
        const y1 = Math.min(s.y, s.y + s.height), y2 = Math.max(s.y, s.y + s.height);
        return (px >= x1 - t && px <= x2 + t && py >= y1 - t && py <= y1 + t) ||
               (px >= x1 - t && px <= x2 + t && py >= y2 - t && py <= y2 + t) ||
               (px >= x1 - t && px <= x1 + t && py >= y1 - t && py <= y2 + t) ||
               (px >= x2 - t && px <= x2 + t && py >= y1 - t && py <= y2 + t);
      }
      case "circle": return Math.abs(Math.hypot(px - s.centerX, py - s.centerY) - Math.abs(s.radius)) < t;
      case "ellipse": {
        if (!s.radiusX || !s.radiusY) return false;
        const nx = (px - s.centerX) / s.radiusX, ny = (py - s.centerY) / s.radiusY;
        return Math.abs(Math.sqrt(nx * nx + ny * ny) - 1) < t / Math.min(s.radiusX, s.radiusY);
      }
      case "line": case "arrow": return dSeg(px, py, s.startX, s.startY, s.endX, s.endY) < t;
      case "diamond": {
        const { centerX: cx, centerY: cy, halfW: hw, halfH: hh } = s;
        return dSeg(px, py, cx, cy - hh, cx + hw, cy) < t || dSeg(px, py, cx + hw, cy, cx, cy + hh) < t ||
               dSeg(px, py, cx, cy + hh, cx - hw, cy) < t || dSeg(px, py, cx - hw, cy, cx, cy - hh) < t;
      }
      case "triangle": return dSeg(px, py, s.x1, s.y1, s.x2, s.y2) < t || dSeg(px, py, s.x2, s.y2, s.x3, s.y3) < t || dSeg(px, py, s.x3, s.y3, s.x1, s.y1) < t;
      case "pencil": {
        for (let i = 1; i < s.points.length; i++) if (dSeg(px, py, s.points[i - 1].x, s.points[i - 1].y, s.points[i].x, s.points[i].y) < t) return true;
        return false;
      }
      case "text": return px >= s.x && px <= s.x + s.content.length * 10 && py >= s.y - 16 && py <= s.y + 4;
    }
  }

  function dSeg(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  // ─── Mouse events ──────────────────────────────────────────
  function onDown(e: MouseEvent) {
    const tool = getSelectedTool();
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;

    if (e.button === 1 || (e.button === 0 && tool === "pointer")) {
      isPanning = true; panStartX = sx - panX; panStartY = sy - panY;
      canvas.style.cursor = "grabbing"; return;
    }

    const w = screenToWorld(sx, sy);

    if (tool === "eraser") { eraseAt(w.x, w.y); isDrawing = true; startX = w.x; startY = w.y; return; }
    if (tool === "text") { spawnTextInput(e.clientX, e.clientY, w.x, w.y); return; }

    isDrawing = true; startX = w.x; startY = w.y;
    if (tool === "pencil") pencilPoints = [{ x: w.x, y: w.y }];
  }

  function onMove(e: MouseEvent) {
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;

    if (isPanning) { panX = sx - panStartX; panY = sy - panStartY; render(); return; }
    if (!isDrawing) return;

    const tool = getSelectedTool();
    const w = screenToWorld(sx, sy);

    if (tool === "eraser") { eraseAt(w.x, w.y); return; }
    if (tool === "pencil") { pencilPoints.push({ x: w.x, y: w.y }); renderPreview({ type: "pencil", points: [...pencilPoints] }); return; }

    renderPreview(buildShape(tool, startX, startY, w.x, w.y));
  }

  function onUp(e: MouseEvent) {
    if (isPanning) { isPanning = false; canvas.style.cursor = ""; return; }
    if (!isDrawing) return;
    isDrawing = false;

    const tool = getSelectedTool();
    if (tool === "eraser") { render(); return; }

    const r = canvas.getBoundingClientRect();
    const w = screenToWorld(e.clientX - r.left, e.clientY - r.top);

    let shape: Shape | null = null;
    if (tool === "pencil" && pencilPoints.length > 1) {
      shape = { type: "pencil", points: [...pencilPoints] }; pencilPoints = [];
    } else {
      shape = buildShape(tool, startX, startY, w.x, w.y);
    }

    if (!shape) { render(); return; }

    // Skip tiny accidental clicks
    if (tool !== "pencil" && tool !== "text") {
      if (Math.hypot(w.x - startX, w.y - startY) < 3 / scale) { render(); return; }
    }

    pushUndo();
    existingShapes.push(shape);
    onShapesChanged(existingShapes.length);
    socket.send(JSON.stringify({ type: "chat", roomId, message: JSON.stringify(shape) }));
    render();
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const ns = Math.max(0.1, Math.min(5, scale * factor));
    panX = mx - ((mx - panX) / scale) * ns;
    panY = my - ((my - panY) / scale) * ns;
    scale = ns;
    render();
  }

  function spawnTextInput(cx: number, cy: number, wx: number, wy: number) {
    if (textInput) textInput.remove();
    const inp = document.createElement("input");
    inp.type = "text";
    inp.style.cssText = `position:fixed;left:${cx}px;top:${cy - 10}px;background:transparent;border:1px solid rgba(137,180,250,0.5);border-radius:4px;color:#cdd6f4;font-size:16px;font-family:"Inter",system-ui,sans-serif;padding:2px 6px;outline:none;z-index:1000;min-width:100px;`;
    document.body.appendChild(inp);
    inp.focus();
    textInput = inp;

    function commit() {
      const txt = inp.value.trim();
      if (txt) {
        const shape: Shape = { type: "text", x: wx, y: wy, content: txt };
        pushUndo(); existingShapes.push(shape); onShapesChanged(existingShapes.length);
        socket.send(JSON.stringify({ type: "chat", roomId, message: JSON.stringify(shape) }));
        render();
      }
      inp.remove(); textInput = null;
    }

    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { inp.remove(); textInput = null; } });
    inp.addEventListener("blur", commit);
  }

  // ─── Bind ───────────────────────────────────────────────────
  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseup", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  const noCtx = (e: Event) => e.preventDefault();
  canvas.addEventListener("contextmenu", noCtx);

  function cleanup() {
    canvas.removeEventListener("mousedown", onDown);
    canvas.removeEventListener("mousemove", onMove);
    canvas.removeEventListener("mouseup", onUp);
    canvas.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("contextmenu", noCtx);
    socket.removeEventListener("message", onMessage);
    if (textInput) textInput.remove();
  }

  return { cleanup, undo, redo, clearAll };
}

// ─── API ──────────────────────────────────────────────────────
async function getExistingShape(roomId: string, token: string): Promise<Shape[]> {
  try {
    const res = await axios.post(`${backendURL}/chat/room/${roomId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    return res.data.messages.map((x: { message: string }) => { try { return JSON.parse(x.message); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
