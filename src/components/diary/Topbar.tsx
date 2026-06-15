import { useState } from "react";
import { Book, Search, Flame, Bell, Download, Lock, Sun, Moon } from "lucide-react";
import { useDiary } from "./DiaryContext";

export function Topbar() {
  const { setView, streak, dark, toggleDark, searchQuery, setSearchQuery } = useDiary();
  const [notifDot] = useState(true);

  return (
    <header
      className="col-span-full flex items-center gap-2.5 px-4 sticky top-0 z-50 border-b dy-glass"
      style={{ borderColor: "var(--dy-bdr)", height: 58 }}
    >
      <button
        onClick={() => setView("dashboard")}
        className="flex items-center gap-2 font-bold text-lg cursor-pointer"
        style={{ color: "var(--dy-a)" }}
      >
        <Book size={22} /> MyDiary
      </button>

      <div className="flex-1 max-w-[360px] ml-auto relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--dy-tx3)" }}
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search entries, moods, tags…"
          className="w-full pl-9 pr-3 py-2 rounded-full text-[13px] outline-none transition-all"
          style={{
            border: "1.5px solid var(--dy-bdr)",
            background: "var(--dy-card)",
            color: "var(--dy-tx)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--dy-al)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(200,130,10,.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--dy-bdr)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      <div className="flex items-center gap-1.5 ml-2.5">
        <div
          className="text-xs font-bold px-3 py-1 rounded-full hidden sm:flex items-center gap-1"
          style={{ background: "var(--dy-al)", color: "#412402" }}
        >
          <Flame size={12} /> {streak}-day streak
        </div>
        <IconBtn onClick={() => setView("notifications")} title="Notifications" badge={notifDot}>
          <Bell size={16} />
        </IconBtn>
        <IconBtn onClick={() => setView("export")} title="Export">
          <Download size={16} />
        </IconBtn>
        <IconBtn onClick={() => setView("lock")} title="Lock diary">
          <Lock size={16} />
        </IconBtn>
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="relative w-14 h-[29px] rounded-full cursor-pointer transition-colors"
          style={{
            background: dark ? "var(--dy-a)" : "var(--dy-bdr)",
            border: `1.5px solid ${dark ? "var(--dy-a)" : "var(--dy-bdr)"}`,
          }}
        >
          <span
            className="absolute top-0.5 w-[23px] h-[23px] rounded-full bg-white transition-all flex items-center justify-center"
            style={{ left: dark ? 29 : 2 }}
          >
            {dark ? <Moon size={13} color="#412402" /> : <Sun size={13} color="#854F0B" />}
          </span>
        </button>
      </div>
    </header>
  );
}

function IconBtn({ children, onClick, title, badge }: { children: React.ReactNode; onClick?: () => void; title?: string; badge?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer transition-all"
      style={{
        border: "1.5px solid var(--dy-bdr)",
        background: "var(--dy-card)",
        color: "var(--dy-tx2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--dy-ap)";
        e.currentTarget.style.borderColor = "var(--dy-al)";
        e.currentTarget.style.color = "var(--dy-a)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--dy-card)";
        e.currentTarget.style.borderColor = "var(--dy-bdr)";
        e.currentTarget.style.color = "var(--dy-tx2)";
      }}
    >
      {children}
      {badge && (
        <span
          className="absolute top-1 right-1 w-[7px] h-[7px] rounded-full"
          style={{ background: "#E24B4A", border: "1.5px solid var(--dy-surf)" }}
        />
      )}
    </button>
  );
}
