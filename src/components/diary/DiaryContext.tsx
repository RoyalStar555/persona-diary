import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { INITIAL_ENTRIES, type Entry, type ViewId } from "./types";

type Ctx = {
  view: ViewId;
  setView: (v: ViewId) => void;
  entries: Entry[];
  addEntry: (e: Entry) => void;
  dark: boolean;
  toggleDark: () => void;
  locked: boolean;
  unlock: () => void;
  lock: () => void;
  streak: number;
  editEntry: Entry | null;
  setEditEntry: (e: Entry | null) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  themeName: string;
  setTheme: (name: string) => void;
};

const DiaryCtx = createContext<Ctx | null>(null);

const THEMES: Record<string, { a: string; al: string; ap: string }> = {
  amber: { a: "#C8820A", al: "#FAC775", ap: "#FAEEDA" },
  purple: { a: "#534AB7", al: "#CECBF6", ap: "#EEEDFE" },
  teal: { a: "#1D9E75", al: "#9FE1CB", ap: "#E1F5EE" },
  coral: { a: "#D85A30", al: "#F5C4B3", ap: "#FAECE7" },
  blue: { a: "#185FA5", al: "#85B7EB", ap: "#E6F1FB" },
  gray: { a: "#5F5E5A", al: "#D3D1C7", ap: "#F1EFE8" },
};

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("lock");
  const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES);
  const [dark, setDark] = useState(false);
  const [locked, setLocked] = useState(true);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [themeName, setThemeName] = useState("amber");
  const streak = 12;

  useEffect(() => {
    try {
      if (localStorage.getItem("mydiary_dark") === "1") setDark(true);
      const t = localStorage.getItem("mydiary_theme");
      if (t) applyTheme(t);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("mydiary_dark", dark ? "1" : "0"); } catch {}
  }, [dark]);

  function applyTheme(name: string) {
    const t = THEMES[name];
    if (!t) return;
    const r = document.documentElement;
    r.style.setProperty("--dy-a", t.a);
    r.style.setProperty("--dy-al", t.al);
    r.style.setProperty("--dy-ap", t.ap);
    setThemeName(name);
    try { localStorage.setItem("mydiary_theme", name); } catch {}
  }

  return (
    <DiaryCtx.Provider value={{
      view, setView,
      entries, addEntry: (e) => setEntries(prev => [e, ...prev]),
      dark, toggleDark: () => setDark(d => !d),
      locked, unlock: () => { setLocked(false); setView("dashboard"); },
      lock: () => { setLocked(true); setView("lock"); },
      streak,
      editEntry, setEditEntry,
      searchQuery, setSearchQuery,
      themeName, setTheme: applyTheme,
    }}>
      {children}
    </DiaryCtx.Provider>
  );
}

export function useDiary() {
  const c = useContext(DiaryCtx);
  if (!c) throw new Error("useDiary must be used within DiaryProvider");
  return c;
}
