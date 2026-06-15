import { useState } from "react";
import { ShieldCheck, Key, Fingerprint, EyeOff, Cloud, Lock, Download } from "lucide-react";
import { useDiary } from "../DiaryContext";
import { Card, PageTitle } from "../primitives";

export function SecurityView() {
  const { setView } = useDiary();
  return (
    <div className="p-5">
      <PageTitle title="Security" sub="Your diary is fully protected" />
      <div className="rounded-xl p-3 mb-4 flex items-center gap-2.5"
        style={{ background: "#EAF3DE", border: "1.5px solid #C0DD97" }}>
        <ShieldCheck size={20} color="#3B6D11" />
        <div>
          <div className="text-[13px] font-bold" style={{ color: "#173404" }}>End-to-end encrypted</div>
          <div className="text-xs" style={{ color: "#3B6D11" }}>All entries are encrypted locally. Only you can read them.</div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Sec icon={<Key size={14} />} title="PIN lock" desc="4-digit PIN to protect your diary.">
          <button onClick={() => setView("lock")} className="w-full justify-center flex items-center gap-1.5 text-xs text-white font-semibold py-2 rounded-lg cursor-pointer"
            style={{ background: "var(--dy-a)" }}>
            <Lock size={13} /> Set / change PIN
          </button>
          <Toggle label="Auto-lock after 5 min" defaultOn />
        </Sec>
        <Sec icon={<Fingerprint size={14} />} title="Biometrics" desc="Fingerprint or face unlock.">
          <Toggle label="Fingerprint unlock" defaultOn />
          <Toggle label="Face ID" />
        </Sec>
        <Sec icon={<EyeOff size={14} />} title="Privacy" desc="Control visibility.">
          <Toggle label="Hide preview on lock" defaultOn />
          <Toggle label="Screenshot block" defaultOn />
        </Sec>
        <Sec icon={<Cloud size={14} />} title="Backup" desc="Encrypted cloud backup.">
          <Toggle label="Auto encrypted backup" defaultOn />
          <button onClick={() => setView("export")} className="w-full justify-center flex items-center gap-1.5 text-xs mt-1.5 py-2 rounded-lg cursor-pointer"
            style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
            <Download size={13} /> Export archive
          </button>
        </Sec>
      </div>
    </div>
  );
}

function Sec({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="text-[13px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
        <span style={{ color: "var(--dy-a)" }}>{icon}</span>{title}
      </div>
      <div className="text-[11px] mb-2.5" style={{ color: "var(--dy-tx3)" }}>{desc}</div>
      <div className="flex flex-col">{children}</div>
    </Card>
  );
}

export function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: "var(--dy-bdr)" }}>
      <span className="text-xs" style={{ color: "var(--dy-tx2)" }}>{label}</span>
      <button onClick={() => setOn(!on)} className="relative w-[38px] h-5 rounded-full border-none cursor-pointer transition-colors"
        style={{ background: on ? "var(--dy-a)" : "var(--dy-bdr)" }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: on ? 20 : 2 }} />
      </button>
    </div>
  );
}
