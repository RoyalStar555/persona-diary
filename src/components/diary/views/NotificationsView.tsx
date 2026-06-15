import { Flame, Smile, Bell, CloudCheck, Star } from "lucide-react";
import { Card, PageTitle } from "../primitives";

const items = [
  { icon: Flame, text: "Your 12-day writing streak is on fire! Keep going to beat your record of 31 days.", time: "Today, 8:00 AM" },
  { icon: Smile, text: "Monthly mood summary ready — you had 78% happy days in June so far.", time: "Today, 7:30 AM" },
  { icon: Bell, text: "Daily writing reminder — you haven't written today yet. Your streak is counting on you!", time: "Yesterday, 8:00 PM" },
  { icon: CloudCheck, text: "Encrypted backup completed successfully. All 124 entries are safe.", time: "Yesterday, 3:12 AM" },
  { icon: Star, text: "You wrote 3 entries this week — that's your best week this month!", time: "13 Jun, 11:00 PM" },
];

export function NotificationsView() {
  return (
    <div className="p-5">
      <PageTitle title="Notifications" sub="Recent activity and reminders" />
      <Card>
        {items.map((it, i) => (
          <div key={i} className="flex gap-3 py-2.5" style={{ borderBottom: i < items.length - 1 ? "1px solid var(--dy-bdr)" : "none" }}>
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--dy-ap)", color: "var(--dy-a)" }}>
              <it.icon size={17} />
            </div>
            <div>
              <div className="text-xs leading-[1.5]" style={{ color: "var(--dy-tx)" }}>{it.text}</div>
              <div className="text-[10px] mt-1" style={{ color: "var(--dy-tx3)" }}>{it.time}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
