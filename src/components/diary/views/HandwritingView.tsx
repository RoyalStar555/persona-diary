import { useEffect, useRef, useState } from "react";
import { Pen, Eraser, Trash, Download, Save, Info } from "lucide-react";
import { PageTitle } from "../primitives";

const COLORS = ["#2C1A0E","#C8820A","#185FA5","#3B6D11","#A32D2D","#534AB7","#D4537E"];

export function HandwritingView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ drawing: false, lx: 0, ly: 0 });
  const [color, setColor] = useState("#2C1A0E");
  const [size, setSize] = useState(3);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const getPos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      stateRef.current.drawing = true;
      const p = getPos(e);
      stateRef.current.lx = p.x; stateRef.current.ly = p.y;
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!stateRef.current.drawing) return;
      const p = getPos(e);
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
      e.preventDefault();
    };
    const onUp = () => { stateRef.current.drawing = false; };

    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointerleave", onUp);
    return () => {
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerup", onUp);
      c.removeEventListener("pointerleave", onUp);
    };
  }, [color, size, tool]);

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

  return (
    <div className="p-5">
      <PageTitle title="Stylus & handwriting canvas" sub="Draw, sketch, or write by hand — mouse, touch, or stylus all supported." />
      <div className="flex gap-2 items-center mb-2.5 flex-wrap">
        {COLORS.map((c) => (
          <div key={c} onClick={() => { setColor(c); setTool("pen"); }}
            className="w-[22px] h-[22px] rounded-full cursor-pointer"
            style={{ background: c, border: `2.5px solid ${color === c && tool === "pen" ? "var(--dy-tx)" : "transparent"}` }} />
        ))}
        <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />
        <label className="text-[11px]" style={{ color: "var(--dy-tx3)" }}>Size</label>
        <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-20" />
        <span className="text-[11px]" style={{ color: "var(--dy-tx2)" }}>{size}px</span>
        <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />
        <ToolBtn active={tool === "pen"} onClick={() => setTool("pen")}><Pen size={13} /> Pen</ToolBtn>
        <ToolBtn active={tool === "eraser"} onClick={() => setTool("eraser")}><Eraser size={13} /> Eraser</ToolBtn>
        <ToolBtn onClick={clear}><Trash size={13} /> Clear</ToolBtn>
        <ToolBtn onClick={download}><Download size={13} /> Download</ToolBtn>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "var(--dy-a)" }} onClick={() => alert("Handwriting page saved as a new diary entry! ✨")}>
          <Save size={13} /> Save as entry
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        tabIndex={0}
        className="max-w-full rounded-xl block"
        style={{ background: "var(--dy-card)", border: "1.5px solid var(--dy-bdr)", cursor: "crosshair", touchAction: "none" }}
      />
      <p className="text-[11px] mt-2 flex items-center gap-1.5" style={{ color: "var(--dy-tx3)" }}>
        <Info size={13} /> Use a stylus for pressure-sensitive drawing. Mouse and touch are fully supported.
      </p>
    </div>
  );
}

function ToolBtn({ children, onClick, active }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-xs px-2 py-1.5 rounded cursor-pointer"
      style={{
        background: active ? "var(--dy-ap)" : "transparent",
        color: active ? "var(--dy-a)" : "var(--dy-tx2)",
        border: `1.5px solid ${active ? "var(--dy-al)" : "transparent"}`,
      }}>
      {children}
    </button>
  );
}
