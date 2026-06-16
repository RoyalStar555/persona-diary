import { Home, Pencil, Notebook, Pen, Calendar, ChartLine, Briefcase, Heart, Moon, Map, ShieldCheck, Settings, LogOut } from "lucide-react";
import { useDiary } from "./DiaryContext";
import type { ViewId } from "./types";

const navItems: { id: ViewId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "editor", label: "New entry", icon: Pencil },
  { id: "entries", label: "All entries", icon: Notebook },
  { id: "handwriting", label: "Stylus / draw", icon: Pen },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: ChartLine },
];

const cats = [
  { name: "Work", icon: Briefcase, color: "#3B6D11" },
  { name: "Personal", icon: Heart, color: "#534AB7" },
  { name: "Dreams", icon: Moon, color: "#D4537E" },
  { name: "Travel", icon: Map, color: "#1D9E75" },
];

export function Sidebar() {
  const { view, setView, entries, categoryFilter, setCategoryFilter, logout, user } = useDiary();

  function pickCategory(name: string) {
    setCategoryFilter(categoryFilter === name ? "" : name);
    setView("entries");
  }

  return (
    <nav
      className="dy-surf-bg sticky overflow-y-auto dy-scroll flex flex-col gap-0.5 p-2.5 border-r"
      style={{
        top: 58,
        height: "calc(100vh - 58px)",
        borderColor: "var(--dy-bdr)",
      }}
    >
      <Section label="Navigate" />
      {navItems.map((it) => (
        <NavBtn
          key={it.id}
          active={view === it.id && !categoryFilter}
          onClick={() => { setCategoryFilter(""); setView(it.id); }}
          icon={it.icon}
          label={it.label}
          badge={it.id === "entries" ? String(entries.length) : it.badge}
        />
      ))}
      <Section label="Categories" />
      {cats.map((c) => (
        <NavBtn
          key={c.name}
          icon={c.icon}
          label={c.name}
          active={categoryFilter === c.name}
          onClick={() => pickCategory(c.name)}
          dot={c.color}
        />
      ))}
      <Section label="Tools" />
      <NavBtn active={view === "security"} onClick={() => setView("security")} icon={ShieldCheck} label="Security" />
      <NavBtn active={view === "settings"} onClick={() => setView("settings")} icon={Settings} label="Customise" />

      <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--dy-bdr)" }}>
        {user && (
          <div className="px-2.5 pb-2 text-[11px]" style={{ color: "var(--dy-tx3)" }}>
            Signed in as <strong style={{ color: "var(--dy-tx2)" }}>{user.username}</strong>
          </div>
        )}
        <NavBtn onClick={logout} icon={LogOut} label="Log out" />
      </div>
    </nav>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div
      className="text-[10px] font-bold uppercase tracking-wider px-2.5 pt-2.5 pb-1 mt-1.5"
      style={{ color: "var(--dy-tx3)" }}
    >
      {label}
    </div>
  );
}

function NavBtn({
  active, onClick, icon: Icon, label, badge, dot,
}: {
  active?: boolean; onClick?: () => void; icon: React.ElementType; label: string; badge?: string; dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] text-left w-full transition-all border-none"
      style={{
        background: active ? "var(--dy-ap)" : "transparent",
        color: active ? "var(--dy-a)" : "var(--dy-tx2)",
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--dy-ap)";
          e.currentTarget.style.color = "var(--dy-a)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--dy-tx2)";
        }
      }}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "var(--dy-al)", color: "#412402" }}>
          {badge}
        </span>
      )}
      {dot && <span className="w-[9px] h-[9px] rounded-full" style={{ background: dot }} />}
    </button>
  );
}
