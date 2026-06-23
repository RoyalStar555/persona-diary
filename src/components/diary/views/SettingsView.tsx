import { useState } from "react";
import { AlertTriangle, Eraser, Download } from "lucide-react";
import { useDiary } from "../DiaryContext";
import { Card, PageTitle } from "../primitives";
import { Toggle } from "./SecurityView";
import { StorageBar } from "../StorageBar";


const SWATCHES: [string, string, string][] = [
  ["amber", "#C8820A", "Warm amber"],
  ["purple", "#534AB7", "Lavender"],
  ["teal", "#1D9E75", "Forest"],
  ["coral", "#D85A30", "Terracotta"],
  ["blue", "#185FA5", "Ocean"],
  ["gray", "#5F5E5A", "Slate"],
];

export function SettingsView() {
  const { themeName, setTheme, dark, toggleDark, factoryReset, clearDrafts, draft, setView } = useDiary();
  const [confirming, setConfirming] = useState(false);
  const [draftMsg, setDraftMsg] = useState("");


  return (
    <div className="p-5 space-y-4">
      <PageTitle title="Customise" sub="Make your diary uniquely yours" />

      <Card>
        <StorageBar />
        <button onClick={() => setView("export")}
          className="mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
          <Download size={13} /> Export & backup entries
        </button>
      </Card>

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
        <Row label="Default export format">
          <Sel options={["PDF", "Plain text (.txt)", "Markdown (.md)", "Encrypted archive"]} />
        </Row>
        <Row label="Clear draft" sub={draft ? `${draft.length} characters in unsaved draft.` : "No unsaved draft."} last>
          <button
            onClick={() => { clearDrafts(); setDraftMsg("Draft cleared."); setTimeout(() => setDraftMsg(""), 2500); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer"
            style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
            <Eraser size={13} /> Clear unsaved draft
          </button>
        </Row>
        {draftMsg && <div className="text-xs mt-1" style={{ color: "var(--dy-a)" }}>{draftMsg}</div>}
      </Card>

      <div className="mt-5">
        <Card style={{ borderColor: "#E5C0B5", background: "#FAECE7" }}>
          <div className="text-[13px] font-semibold mb-1 flex items-center gap-1.5" style={{ color: "#7A1F0A" }}>
            <AlertTriangle size={14} /> Danger zone
          </div>
          <p className="text-xs mb-3" style={{ color: "#7A1F0A" }}>
            Factory reset will permanently erase all accounts, entries, drafts, themes and security settings stored in this browser.
          </p>
          {!confirming ? (
            <button onClick={() => setConfirming(true)}
              className="text-xs font-semibold text-white px-3.5 py-2 rounded-lg cursor-pointer"
              style={{ background: "#B91C1C" }}>Factory reset</button>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button onClick={factoryReset}
                className="text-xs font-semibold text-white px-3.5 py-2 rounded-lg cursor-pointer"
                style={{ background: "#B91C1C" }}>Yes, erase everything</button>
              <button onClick={() => setConfirming(false)}
                className="text-xs px-3.5 py-2 rounded-lg cursor-pointer"
                style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>Cancel</button>
            </div>
          )}
        </Card>
      </div>
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
