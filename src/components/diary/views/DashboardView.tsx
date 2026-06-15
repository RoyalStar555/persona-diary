import { useMemo, useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Flame, MoodSmile, Pencil, LetterA } from "lucide-react";
import { useDiary } from "./DiaryContext";
import { MOODS } from "./types";
import { Card, CardTitle, EntryItem, MoodChip } from "./primitives";

const Letter = (props: any) => <span className="font-bold" {...props}>A</span>;

export function DashboardView() {
  const { entries, setView, setEditEntry, streak } = useDiary();
  const [mood, setMood] = useState(0);

  const today = useMemo(() => new Date(), []);
  const dateStr = today.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-5">
      <div className="text-xl font-bold mb-1" style={{ color: "var(--dy-tx)" }}>
        Good morning ✨ How are you feeling?
      </div>
      <div className="text-[13px] mb-4" style={{ color: "var(--dy-tx3)" }}>
        {dateStr} — Let today's thoughts flow freely.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat icon={<Pencil size={12} />} label="Total entries" value="124" sub="+3 this week" />
        <Stat icon={<Flame size={12} />} label="Streak" value={`${streak} 🔥`} sub="Best: 31 days" />
        <Stat icon={<Letter />} label="Words written" value="48.2k" sub="Avg 390/entry" />
        <Stat icon={<MoodSmile size={12} />} label="Happy days" value="78%" sub="This month" />
      </div>

      <div className="grid lg:grid-cols-[1fr_310px] gap-3.5">
        <div>
          <Card className="mb-3">
            <CardTitle icon={<MoodSmile size={14} />}>Today's mood</CardTitle>
            <div className="flex gap-1.5 flex-wrap">
              {MOODS.map((m, i) => (
                <MoodChip key={m.label} {...m} selected={mood === i} onClick={() => setMood(i)} />
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle icon={<Clock size={14} />}>Recent entries</CardTitle>
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
          <div
            key={i}
            className="flex-1 min-w-[5px] rounded-t-[3px]"
            style={{
              background: v ? "var(--dy-a)" : "var(--dy-al)",
              height: v ? `${28 + ((i * 7) % 28)}px` : `${5 + ((i * 3) % 8)}px`,
            }}
          />
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

export function CalendarMini() {
  const moodColors: Record<number, string> = { 2: "#27500A", 3: "#534AB7", 4: "#EF9F27", 5: "#EF9F27", 7: "#D4537E", 8: "#534AB7", 9: "#27500A", 11: "#EF9F27", 12: "#D4537E", 13: "#534AB7" };
  const dnames = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  const today = 14;

  return (
    <>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-bold" style={{ color: "var(--dy-tx)" }}>June 2026</span>
        <div className="flex gap-1">
          <NavArrow><ChevronLeft size={14} /></NavArrow>
          <NavArrow><ChevronRight size={14} /></NavArrow>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[3px]">
        {dnames.map((d) => (
          <div key={d} className="text-[10px] font-bold text-center py-1" style={{ color: "var(--dy-tx3)" }}>{d}</div>
        ))}
        <div />
        {days.map((d) => {
          const mood = moodColors[d];
          const isToday = d === today;
          return (
            <div
              key={d}
              className="aspect-square flex flex-col items-center justify-center rounded-md cursor-pointer text-xs relative transition-all"
              style={{
                background: isToday ? "var(--dy-a)" : mood ? "var(--dy-ap)" : "transparent",
                color: isToday ? "white" : mood ? "var(--dy-a)" : "var(--dy-tx2)",
                fontWeight: isToday || mood ? 700 : 400,
              }}
            >
              {d}
              {mood && !isToday && (
                <span className="absolute bottom-0.5 w-[5px] h-[5px] rounded-full" style={{ background: mood }} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function NavArrow({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="w-[26px] h-[26px] rounded-md flex items-center justify-center cursor-pointer transition-all"
      style={{ background: "transparent", border: "1.5px solid var(--dy-bdr)", color: "var(--dy-tx2)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--dy-ap)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}
