import { useEffect, useRef, useState } from "react";
import { Pen, Eraser, Trash, Download, Save, Info, Square, Circle, Minus, ArrowRight } from "lucide-react";
import { PageTitle } from "../primitives";
import { useDiary } from "../DiaryContext";
import { MOODS, type Entry } from "../types";

const COLORS = ["#2C1A0E","#C8820A","#185FA5","#3B6D11","#A32D2D","#534AB7","#D4537E"];

type Tool = "pen" | "eraser" | "rect" | "ellipse" | "line" | "arrow";

export function HandwritingView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    drawing: boolean;
    lx: number; ly: number;
    sx: number; sy: number;
    snapshot: ImageData | null;
  }>({ drawing: false, lx: 0, ly: 0, sx: 0, sy: 0, snapshot: null });
  const [color, setColor] = useState("#2C1A0E");
  const [size, setSize] = useState(3);
  const [tool, setTool] = useState<Tool>("pen");
  const [feedback, setFeedback] = useState("");
  const { addEntry, setView } = useDiary();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const getPos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
    };

    const drawShape = (x: number, y: number) => {
      const s = stateRef.current;
      if (!s.snapshot) return;
      ctx.putImageData(s.snapshot, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = size;
      ctx.beginPath();
      if (tool === "rect") {
        ctx.strokeRect(s.sx, s.sy, x - s.sx, y - s.sy);
      } else if (tool === "ellipse") {
        const cx = (s.sx + x) / 2, cy = (s.sy + y) / 2;
        const rx = Math.abs(x - s.sx) / 2, ry = Math.abs(y - s.sy) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === "line") {
        ctx.moveTo(s.sx, s.sy);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === "arrow") {
        ctx.moveTo(s.sx, s.sy);
        ctx.lineTo(x, y);
        ctx.stroke();
        const angle = Math.atan2(y - s.sy, x - s.sx);
        const head = Math.max(10, size * 4);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - head * Math.cos(angle - Math.PI / 6), y - head * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x - head * Math.cos(angle + Math.PI / 6), y - head * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }
    };

    const onDown = (e: PointerEvent) => {
      const p = getPos(e);
      stateRef.current.drawing = true;
      stateRef.current.lx = p.x; stateRef.current.ly = p.y;
      stateRef.current.sx = p.x; stateRef.current.sy = p.y;
      if (tool !== "pen" && tool !== "eraser") {
        stateRef.current.snapshot = ctx.getImageData(0, 0, c.width, c.height);
      }
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!stateRef.current.drawing) return;
      const p = getPos(e);
      if (tool === "pen" || tool === "eraser") {
        ctx.beginPath();
        if (tool === "eraser") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = size * 5;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = color;
          ctx.lineWidth = size * (e.pressure > 0 ? Math.max(0.5, e.pressure * 1.5) : 1);
        }
        ctx.moveTo(stateRef.current.lx, stateRef.current.ly);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        stateRef.current.lx = p.x; stateRef.current.ly = p.y;
      } else {
        drawShape(p.x, p.y);
      }
      e.preventDefault();
    };
    const onUp = (e?: PointerEvent) => {
      if (stateRef.current.drawing && e && tool !== "pen" && tool !== "eraser") {
        const p = getPos(e);
        drawShape(p.x, p.y);
      }
      stateRef.current.drawing = false;
      stateRef.current.snapshot = null;
    };

    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp as any);
    c.addEventListener("pointerleave", onUp as any);
    return () => {
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerup", onUp as any);
      c.removeEventListener("pointerleave", onUp as any);
    };
  }, [color, size, tool]);

  function isBlank() {
    const c = canvasRef.current;
    if (!c) return true;
    const ctx = c.getContext("2d");
    if (!ctx) return true;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < data.length; i += 4) if (data[i] !== 0) return false;
    return true;
  }

  function clear() {
    const c = canvasRef.current; const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
  }
  function download() {
    const c = canvasRef.current; if (!c) return;
    const a = document.createElement("a");
    a.download = "diary-sketch.png";
    a.href = c.toDataURL();
    a.click();
  }

  function saveAsEntry() {
    const c = canvasRef.current; if (!c) return;
    if (isBlank()) { setFeedback("Canvas is empty — draw something first."); return; }
    const dataUrl = c.toDataURL("image/png");
    const now = new Date();
    const mood = MOODS[0];
    const iso = now.toISOString().slice(0, 10);
    const e: Entry = {
      id: String(Date.now()),
      date: iso,
      day: String(now.getDate()).padStart(2, "0"),
      mon: now.toLocaleString("en", { month: "short" }),
      title: "Handwritten note — " + now.toLocaleDateString(),
      preview: "A handwritten / sketched entry. Open to view the canvas.",
      body: "A handwritten / sketched entry captured on the canvas.",
      sketch: dataUrl,
      mood: mood.label, moodBg: mood.bg, moodColor: mood.color, moodBdr: mood.bdr,
      cats: ["Personal"],
      catBg: "#EAF3DE", catColor: "#173404",
    };
    addEntry(e);
    setFeedback("Sketch saved as a new diary entry ✨");
    setTimeout(() => setView("entries"), 700);
  }

  return (
    <div className="p-5">
      <PageTitle title="Stylus & handwriting canvas" sub="Draw, sketch, or write by hand — mouse, touch, or stylus all supported." />
      <div className="flex gap-2 items-center mb-2.5 flex-wrap">
        {COLORS.map((c) => (
          <div key={c} onClick={() => { setColor(c); }}
            className="w-[22px] h-[22px] rounded-full cursor-pointer"
            style={{ background: c, border: `2.5px solid ${color === c ? "var(--dy-tx)" : "transparent"}` }} />
        ))}
        <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />
        <label className="text-[11px]" style={{ color: "var(--dy-tx3)" }}>Size</label>
        <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-20" />
        <span className="text-[11px]" style={{ color: "var(--dy-tx2)" }}>{size}px</span>
        <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />
        <ToolBtn active={tool === "pen"} onClick={() => setTool("pen")}><Pen size={13} /> Pen</ToolBtn>
        <ToolBtn active={tool === "eraser"} onClick={() => setTool("eraser")}><Eraser size={13} /> Eraser</ToolBtn>
        <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />
        <ToolBtn active={tool === "rect"} onClick={() => setTool("rect")} title="Rectangle"><Square size={13} /></ToolBtn>
        <ToolBtn active={tool === "ellipse"} onClick={() => setTool("ellipse")} title="Ellipse"><Circle size={13} /></ToolBtn>
        <ToolBtn active={tool === "line"} onClick={() => setTool("line")} title="Line"><Minus size={13} /></ToolBtn>
        <ToolBtn active={tool === "arrow"} onClick={() => setTool("arrow")} title="Arrow"><ArrowRight size={13} /></ToolBtn>
        <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />
        <ToolBtn onClick={clear}><Trash size={13} /> Clear</ToolBtn>
        <ToolBtn onClick={download}><Download size={13} /> Download</ToolBtn>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "var(--dy-a)" }} onClick={saveAsEntry}>
          <Save size={13} /> Save as entry
        </button>
      </div>
      {feedback && (
        <div className="text-xs mb-2" style={{ color: "var(--dy-a)" }}>{feedback}</div>
      )}
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        tabIndex={0}
        className="max-w-full rounded-xl block"
        style={{ background: "var(--dy-card)", border: "1.5px solid var(--dy-bdr)", cursor: "crosshair", touchAction: "none" }}
      />
      <p className="text-[11px] mt-2 flex items-center gap-1.5" style={{ color: "var(--dy-tx3)" }}>
        <Info size={13} /> Use a stylus for pressure-sensitive drawing. Click and drag to draw shapes.
      </p>
    </div>
  );
}

function ToolBtn({ children, onClick, active, title }: { children: React.ReactNode; onClick?: () => void; active?: boolean; title?: string }) {
  return (
    <button onClick={onClick} title={title} aria-label={title} className="flex items-center gap-1 text-xs px-2 py-1.5 rounded cursor-pointer"
      style={{
        background: active ? "var(--dy-ap)" : "transparent",
        color: active ? "var(--dy-a)" : "var(--dy-tx2)",
        border: `1.5px solid ${active ? "var(--dy-al)" : "transparent"}`,
      }}>
      {children}
    </button>
  );
}
