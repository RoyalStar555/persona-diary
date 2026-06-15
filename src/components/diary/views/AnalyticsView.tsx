import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from "recharts";
import { ChartBar, Smile, Tags } from "lucide-react";
import { Card, CardTitle, PageTitle, MoodChip } from "../primitives";

const entryData = [
  { d: "M", v: 1 },{ d: "T", v: 2 },{ d: "W", v: 0 },{ d: "T", v: 1 },{ d: "F", v: 3 },{ d: "S", v: 1 },{ d: "S", v: 2 },
  { d: "M", v: 0 },{ d: "T", v: 1 },{ d: "W", v: 1 },{ d: "T", v: 2 },{ d: "F", v: 1 },{ d: "S", v: 1 },{ d: "S", v: 2 },
];

const moods: [string, number, string][] = [
  ["😊 Happy", 42, "#EF9F27"],
  ["🌿 Calm", 28, "#27500A"],
  ["💜 Grateful", 18, "#534AB7"],
  ["😢 Sad", 7, "#378ADD"],
  ["😤 Stressed", 5, "#D85A30"],
];

const tags: { label: string; bg: string; color: string; bdr: string; selected?: boolean }[] = [
  { label: "Personal ×38", bg: "#FAEEDA", color: "#412402", bdr: "#FAC775", selected: true },
  { label: "Work ×24", bg: "#F1EFE8", color: "#2C2C2A", bdr: "#D3D1C7" },
  { label: "Dreams ×17", bg: "#FBEAF0", color: "#4B1528", bdr: "#F4C0D1" },
  { label: "Travel ×12", bg: "#E6F1FB", color: "#042C53", bdr: "#B5D4F4" },
  { label: "Health ×9", bg: "#EAF3DE", color: "#173404", bdr: "#C0DD97" },
];

export function AnalyticsView() {
  return (
    <div className="p-5">
      <PageTitle title="Analytics & insights" sub="Understand your emotional patterns over time" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Stat label="Entries this month" value="18" sub="+6 vs last month" />
        <Stat label="Avg words/entry" value="412" sub="+22 words" />
        <Stat label="Dominant mood" value="😊" sub="Happy — 42%" />
        <Stat label="Consistency" value="86%" sub="Days with entries" />
      </div>

      <div className="grid md:grid-cols-2 gap-3.5 mb-3.5">
        <Card>
          <CardTitle icon={<ChartBar size={14} />}>Entries per day (14 days)</CardTitle>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer>
              <BarChart data={entryData}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--dy-tx3)" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--dy-ap)" }} contentStyle={{ background: "var(--dy-card)", border: "1.5px solid var(--dy-bdr)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                  {entryData.map((d, i) => (
                    <Cell key={i} fill={d.v >= 2 ? "var(--dy-a)" : "var(--dy-al)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle icon={<Smile size={14} />}>Mood frequency</CardTitle>
          <div className="mt-2">
            {moods.map(([l, p, c]) => (
              <div key={l} className="flex items-center gap-2 mb-2">
                <span className="text-xs w-[72px]" style={{ color: "var(--dy-tx2)" }}>{l}</span>
                <div className="flex-1 h-2 rounded" style={{ background: "var(--dy-bdr)" }}>
                  <div className="h-full rounded" style={{ width: `${p}%`, background: c, transition: "width .6s" }} />
                </div>
                <span className="text-[11px] w-6 text-right" style={{ color: "var(--dy-tx3)" }}>{p}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle icon={<Tags size={14} />}>Most used tags</CardTitle>
        <div className="flex gap-1.5 flex-wrap mt-1">
          {tags.map((t) => <MoodChip key={t.label} {...t} />)}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="dy-card px-4 py-3.5">
      <div className="text-[11px] mb-1" style={{ color: "var(--dy-tx3)" }}>{label}</div>
      <div className="text-[22px] font-bold leading-tight" style={{ color: "var(--dy-tx)" }}>{value}</div>
      <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>{sub}</div>
    </div>
  );
}
