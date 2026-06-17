import { useMemo, useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Flame, Smile, Pencil, Type } from "lucide-react";
import { useDiary } from "../DiaryContext";
import { MOODS, type Entry } from "../types";
import { Card, CardTitle, EntryItem, MoodChip } from "../primitives";

export function DashboardView() {
  const { entries, setView, setEditEntry, streak } = useDiary();
  const [mood, setMood] = useState(0);

  const today = useMemo(() => new Date(), []);
  const dateStr = today.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--dy-tx)" }}>
        Good morning ✨ How are you feeling?
      </h1>
      <div className="text-[13px] mb-4" style={{ color: "var(--dy-tx3)" }}>
        {dateStr} — Let today's thoughts flow freely.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat icon={<Pencil size={12} />} label="Total entries" value={String(entries.length)} sub="Across all moods" />
        <Stat icon={<Flame size={12} />} label="Streak" value={`${streak} 🔥`} sub="Best: 31 days" />
        <Stat icon={<Type size={12} />} label="Words written" value={String(entries.reduce((a, e) => a + (e.body?.split(/\s+/).filter(Boolean).length ?? 0), 0))} sub="All entries" />
        <Stat icon={<Smile size={12} />} label="Happy days" value={`${entries.length ? Math.round(entries.filter((e) => /Happy|Excited|Grateful/.test(e.mood)).length / entries.length * 100) : 0}%`} sub="This month" />
      </div>

      <div className="grid lg:grid-cols-[1fr_310px] gap-3.5">
        <div>
          <Card className="mb-3">
            <CardTitle icon={<Smile size={14} />}>Today's mood</CardTitle>
            <div className="flex gap-1.5 flex-wrap">
              {MOODS.map((m, i) => (
                <MoodChip key={m.label} {...m} selected={mood === i} onClick={() => setMood(i)} />
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle icon={<Clock size={14} />}>Recent entries</CardTitle>
            {entries.length === 0 && <div className="text-xs" style={{ color: "var(--dy-tx3)" }}>No entries yet — write your first one.</div>}
            {entries.slice(0, 4).map((e) => (
              <EntryItem key={e.id} entry={e} onClick={() => { setEditEntry(e); setView("editor"); }} />
            ))}
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <Card>
            <CalendarMini />
          </Card>
          <Card>
            <CardTitle icon={<Flame size={14} />}>Writing streak — 21 days</CardTitle>
            <StreakBars />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="dy-card px-4 py-3.5">
      <div className="text-[11px] mb-1 flex items-center gap-1.5" style={{ color: "var(--dy-tx3)" }}>{icon}{label}</div>
      <div className="text-[22px] font-bold leading-tight" style={{ color: "var(--dy-tx)" }}>{value}</div>
      <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>{sub}</div>
    </div>
  );
}

function StreakBars() {
  const data = [1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1];
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  return (
    <>
      <div className="flex gap-[3px] items-end h-[60px] mt-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 min-w-[5px] rounded-t-[3px]"
            style={{
              background: v ? "var(--dy-a)" : "var(--dy-al)",
              height: v ? `${28 + ((i * 7) % 28)}px` : `${5 + ((i * 3) % 8)}px`,
            }} />
        ))}
      </div>
      <div className="flex gap-[3px] mt-1">
        {data.map((_, i) => (
          <span key={i} className="flex-1 text-[9px] text-center min-w-[5px]" style={{ color: "var(--dy-tx3)" }}>
            {days[i % 7]}
          </span>
        ))}
      </div>
    </>
  );
}

function entryDate(e: Entry): Date | null {
  if (e.date) return new Date(e.date + "T00:00:00");
  return null;
}

export function CalendarMini() {
  const { entries, calendarDate, setCalendarDate, setEditEntry, setView } = useDiary();
  const dnames = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = calendarDate.toLocaleString(undefined, { month: "long", year: "numeric" });
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Map dayNumber -> first matching entry of that day (this month)
  const byDay = useMemo(() => {
    const m = new Map<number, Entry>();
    for (const e of entries) {
      const d = entryDate(e);
      if (d && d.getFullYear() === year && d.getMonth() === month) {
        if (!m.has(d.getDate())) m.set(d.getDate(), e);
      }
    }
    return m;
  }, [entries, year, month]);

  function moodColor(mood: string) {
    if (/Happy|Excited/.test(mood)) return "#EF9F27";
    if (/Calm/.test(mood)) return "#27500A";
    if (/Grateful/.test(mood)) return "#534AB7";
    if (/Sad|Stressed|Tired/.test(mood)) return "#D4537E";
    return "#534AB7";
  }

  function shift(delta: number) {
    setCalendarDate(new Date(year, month + delta, 1));
  }

  function openDay(d: number) {
    const entry = byDay.get(d);
    if (entry) {
      setEditEntry(entry);
      setView("editor");
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-bold" style={{ color: "var(--dy-tx)" }}>{monthLabel}</span>
        <div className="flex gap-1">
          <NavArrow onClick={() => shift(-1)} aria="Previous month"><ChevronLeft size={14} /></NavArrow>
          <NavArrow onClick={() => shift(1)} aria="Next month"><ChevronRight size={14} /></NavArrow>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {dnames.map((d) => (
          <div key={d} className="text-[10px] font-bold text-center py-1" style={{ color: "var(--dy-tx3)" }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => <div key={`pad-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const entry = byDay.get(d);
          const isToday = isCurrentMonth && d === today.getDate();
          const color = entry ? moodColor(entry.mood) : undefined;
          return (
            <button
              key={d}
              onClick={() => openDay(d)}
              disabled={!entry && !isToday}
              title={entry ? entry.title : ""}
              className="aspect-square flex flex-col items-center justify-center rounded-md text-xs relative transition-all"
              style={{
                background: isToday ? "var(--dy-a)" : entry ? "var(--dy-ap)" : "transparent",
                color: isToday ? "white" : entry ? "var(--dy-a)" : "var(--dy-tx2)",
                fontWeight: isToday || entry ? 700 : 400,
                cursor: entry ? "pointer" : "default",
                border: "none",
              }}
            >
              {d}
              {color && !isToday && (
                <span className="absolute bottom-0.5 w-[5px] h-[5px] rounded-full" style={{ background: color }} />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

function NavArrow({ children, onClick, aria }: { children: React.ReactNode; onClick?: () => void; aria?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      className="w-[26px] h-[26px] rounded-md flex items-center justify-center cursor-pointer transition-all"
      style={{ background: "transparent", border: "1.5px solid var(--dy-bdr)", color: "var(--dy-tx2)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--dy-ap)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}
