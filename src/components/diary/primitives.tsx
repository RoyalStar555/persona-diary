import { ReactNode } from "react";

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`dy-card p-4 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <div className="text-[13px] font-semibold mb-3 flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
      {icon && <span style={{ color: "var(--dy-a)" }}>{icon}</span>}
      {children}
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <>
      <div className="text-xl font-bold mb-1" style={{ color: "var(--dy-tx)" }}>{title}</div>
      {sub && <div className="text-[13px] mb-4" style={{ color: "var(--dy-tx3)" }}>{sub}</div>}
    </>
  );
}

export function MoodChip({ label, bg, color, bdr, selected, onClick }: { label: string; bg: string; color: string; bdr: string; selected?: boolean; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      className="px-3 py-[5px] rounded-full text-xs cursor-pointer font-medium transition-all"
      style={{
        background: bg,
        color,
        border: `1.5px solid ${bdr}`,
        boxShadow: selected ? "0 0 0 2.5px var(--dy-a)" : "none",
      }}
    >
      {label}
    </span>
  );
}

export function EntryItem({ entry, onClick }: { entry: import("./types").Entry; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="dy-card p-3 mb-2 cursor-pointer transition-all flex gap-3 hover:-translate-y-px"
      style={{ borderColor: "var(--dy-bdr)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--dy-al)"; e.currentTarget.style.boxShadow = "0 3px 14px rgba(160,82,45,.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--dy-bdr)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div className="text-center min-w-[38px]">
        <div className="text-xl font-extrabold leading-none" style={{ color: "var(--dy-a)" }}>{entry.day}</div>
        <div className="text-[9px] uppercase mt-0.5" style={{ color: "var(--dy-tx3)" }}>{entry.mon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold mb-1" style={{ color: "var(--dy-tx)" }}>{entry.title}</div>
        <div className="text-xs leading-[1.5] line-clamp-2" style={{ color: "var(--dy-tx3)" }}>{entry.preview}</div>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: entry.moodBg, color: entry.moodColor }}>{entry.mood}</span>
          {entry.cats.map((c) => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: entry.catBg, color: entry.catColor }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
