import { CalendarMini } from "./DashboardView";
import { PageTitle, Card } from "../primitives";

export function CalendarView() {
  const legend = [
    ["#EF9F27", "Happy/Excited"],
    ["#27500A", "Calm"],
    ["#534AB7", "Grateful"],
    ["#D4537E", "Emotional"],
  ];
  return (
    <div className="p-5">
      <PageTitle title="Calendar view" sub="Click any highlighted date to read that entry" />
      <Card style={{ maxWidth: 560 }}>
        <CalendarMini />
        <div className="flex gap-4 mt-3.5 flex-wrap">
          {legend.map(([c, l]) => (
            <span key={l} className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--dy-tx3)" }}>
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
