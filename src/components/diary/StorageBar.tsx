import { useEffect, useState } from "react";
import { HardDrive } from "lucide-react";
import { useDiary } from "./DiaryContext";

export const STORAGE_QUOTA_BYTES = 5 * 1024 * 1024;

export function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function measureLocalStorage() {
  let total = 0;
  let mine = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const v = localStorage.getItem(k) ?? "";
      const size = (k.length + v.length) * 2;
      total += size;
      if (k.startsWith("mydiary_")) mine += size;
    }
  } catch {}
  return { total, mine };
}

export function StorageBar({ compact = false }: { compact?: boolean }) {
  const { entries } = useDiary();
  const [storage, setStorage] = useState(() => measureLocalStorage());

  useEffect(() => {
    setStorage(measureLocalStorage());
    const onStorage = () => setStorage(measureLocalStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [entries]);

  const pct = Math.min(100, (storage.total / STORAGE_QUOTA_BYTES) * 100);
  const barColor = pct > 85 ? "#C24A1C" : pct > 60 ? "#C8820A" : "#3B6D11";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--dy-tx)" }}>
          <HardDrive size={15} /> Local storage
        </div>
        <div className="text-[11px]" style={{ color: "var(--dy-tx3)" }}>
          {fmtBytes(storage.total)} / ~{fmtBytes(STORAGE_QUOTA_BYTES)} ({pct.toFixed(1)}%)
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--dy-ap)" }}>
        <div className="h-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      {!compact && (
        <div className="text-[11px] mt-2" style={{ color: "var(--dy-tx3)" }}>
          Your diary uses {fmtBytes(storage.mine)} across {entries.length} entries. Browsers typically allow ~5 MB per site — roughly 2,500–5,000 typical journal entries. Export regularly to keep a backup.
        </div>
      )}
    </div>
  );
}
