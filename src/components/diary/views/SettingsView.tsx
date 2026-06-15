import { useDiary } from "../DiaryContext";
import { Card, PageTitle } from "../primitives";
import { Toggle } from "./SecurityView";

const SWATCHES: [string, string, string][] = [
  ["amber", "#C8820A", "Warm amber"],
  ["purple", "#534AB7", "Lavender"],
  ["teal", "#1D9E75", "Forest"],
  ["coral", "#D85A30", "Terracotta"],
  ["blue", "#185FA5", "Ocean"],
  ["gray", "#5F5E5A", "Slate"],
];

export function SettingsView() {
  const { themeName, setTheme, dark, toggleDark } = useDiary();
  return (
    <div className="p-5">
      <PageTitle title="Customise" sub="Make your diary uniquely yours" />
      <Card>
        <Row label="Theme colour" sub="Pick your accent palette">
          <div className="flex gap-2 flex-wrap">
            {SWATCHES.map(([n, c, t]) => (
              <div key={n} title={t} onClick={() => setTheme(n)}
                className="w-[26px] h-[26px] rounded-full cursor-pointer transition-all"
                style={{
                  background: c,
                  border: `2px solid ${themeName === n ? "var(--dy-tx)" : "transparent"}`,
                  transform: themeName === n ? "scale(1.13)" : "none",
                }} />
            ))}
          </div>
        </Row>
        <Row label="Dark / light mode" sub="Switch theme brightness">
          <button onClick={toggleDark} className="relative w-14 h-[29px] rounded-full cursor-pointer"
            style={{ background: dark ? "var(--dy-a)" : "var(--dy-bdr)", border: `1.5px solid ${dark ? "var(--dy-a)" : "var(--dy-bdr)"}` }}>
            <span className="absolute top-0.5 w-[23px] h-[23px] rounded-full bg-white transition-all" style={{ left: dark ? 29 : 2 }} />
          </button>
        </Row>
        <Row label="Default font" sub="Writing font in editor">
          <Sel options={["Sans-serif", "Serif", "Monospace"]} />
        </Row>
        <Row label="Layout style" sub="How entries are organised">
          <Sel options={["Timeline (feed)", "Calendar grid", "Notebook chapters", "Tabbed categories"]} />
        </Row>
        <Row label="Daily reminder" sub="Get nudged to write">
          <Toggle label="" defaultOn />
        </Row>
        <Row label="Reminder time">
          <input type="time" defaultValue="20:00" className="text-xs px-2 py-1 rounded outline-none"
            style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx)" }} />
        </Row>
        <Row label="Distraction-free mode" sub="Hide sidebar while writing">
          <Toggle label="" />
        </Row>
        <Row label="Default export format" last>
          <Sel options={["PDF", "Plain text (.txt)", "Markdown (.md)", "Encrypted archive"]} />
        </Row>
      </Card>
    </div>
  );
}

function Row({ label, sub, children, last }: { label: string; sub?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 gap-2.5 flex-wrap"
      style={{ borderBottom: last ? "none" : "1px solid var(--dy-bdr)" }}>
      <div>
        <div className="text-[13px] font-semibold" style={{ color: "var(--dy-tx)" }}>{label}</div>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Sel({ options }: { options: string[] }) {
  return (
    <select className="text-xs px-2 py-1 rounded outline-none cursor-pointer"
      style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}
