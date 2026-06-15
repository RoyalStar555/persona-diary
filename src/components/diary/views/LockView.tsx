import { useEffect, useState } from "react";
import { Lock, Fingerprint, Delete } from "lucide-react";
import { useDiary } from "../DiaryContext";

const PIN = "1234";

export function LockView() {
  const { unlock } = useDiary();
  const [buf, setBuf] = useState("");
  const [err, setErr] = useState("");

  function press(k: string) {
    setErr("");
    if (k === "del") { setBuf((b) => b.slice(0, -1)); return; }
    if (k === "bio") { unlock(); return; }
    if (buf.length >= 4) return;
    const next = buf + k;
    setBuf(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === PIN) { unlock(); setBuf(""); }
        else { setErr("Incorrect PIN. Try again."); setBuf(""); }
      }, 220);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      else if (e.key === "Backspace") press("del");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buf]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-center rounded-xl py-12" style={{ background: "var(--dy-ap)", minHeight: 540 }}>
        <div className="dy-card text-center px-9 py-8" style={{ borderRadius: 22, maxWidth: 310, width: "90%" }}>
          <div className="w-[60px] h-[60px] rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "var(--dy-ap)", color: "var(--dy-a)" }}>
            <Lock size={28} />
          </div>
          <div className="text-[22px] font-bold mb-1 dy-font-serif" style={{ color: "var(--dy-tx)" }}>Welcome back</div>
          <div className="text-[13px] mb-5" style={{ color: "var(--dy-tx3)" }}>Enter your PIN to unlock your diary</div>

          <div className="flex gap-3 justify-center mb-5">
            {[0,1,2,3].map((i) => (
              <div key={i} className="w-[14px] h-[14px] rounded-full transition-all"
                style={{
                  background: i < buf.length ? "var(--dy-a)" : "transparent",
                  border: `2px solid ${i < buf.length ? "var(--dy-a)" : "var(--dy-al)"}`,
                }} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[210px] mx-auto mb-3">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <Key key={n} onClick={() => press(String(n))}>{n}</Key>
            ))}
            <Key onClick={() => press("bio")} small><Fingerprint size={20} /></Key>
            <Key onClick={() => press("0")}>0</Key>
            <Key onClick={() => press("del")} small><Delete size={18} /></Key>
          </div>

          <div className="text-xs font-medium min-h-[16px]" style={{ color: "var(--dy-red)" }}>{err}</div>

          <button onClick={() => press("bio")} className="flex items-center justify-center gap-1.5 text-xs w-full p-2 mt-1.5 cursor-pointer transition-colors"
            style={{ color: "var(--dy-tx3)", background: "none", border: "none" }}>
            <Fingerprint size={16} /> Use fingerprint instead
          </button>
          <p className="text-[10px] mt-2.5" style={{ color: "var(--dy-tx3)" }}>Demo PIN: <strong>1234</strong></p>
        </div>
      </div>
    </div>
  );
}

function Key({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} className="aspect-square rounded-xl cursor-pointer flex items-center justify-center transition-all active:scale-95"
      style={{
        border: "1.5px solid var(--dy-bdr)",
        background: "var(--dy-card)",
        color: small ? "var(--dy-tx3)" : "var(--dy-tx)",
        fontSize: small ? 13 : 18,
        fontWeight: small ? 400 : 600,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--dy-ap)"; e.currentTarget.style.borderColor = "var(--dy-al)"; e.currentTarget.style.color = "var(--dy-a)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--dy-card)"; e.currentTarget.style.borderColor = "var(--dy-bdr)"; e.currentTarget.style.color = small ? "var(--dy-tx3)" : "var(--dy-tx)"; }}>
      {children}
    </button>
  );
}
