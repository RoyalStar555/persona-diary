import { useMemo, useState } from "react";
import { FileText, FileCode, ShieldCheck, Download, FolderArchive, File as FileIcon } from "lucide-react";
import JSZip from "jszip";
import { Card, PageTitle } from "../primitives";
import { useDiary } from "../DiaryContext";
import type { Entry } from "../types";
import { StorageBar } from "../StorageBar";


function entryToMarkdown(e: Entry) {
  const date = e.date ?? `${e.mon} ${e.day}`;
  const cats = e.cats?.length ? `\n**Categories:** ${e.cats.join(", ")}` : "";
  return `# ${e.title}\n\n**Date:** ${date}  \n**Mood:** ${e.mood}${cats}\n\n${e.body}\n`;
}

function entryToText(e: Entry) {
  const date = e.date ?? `${e.mon} ${e.day}`;
  return `${e.title}\nDate: ${date}\nMood: ${e.mood}\nCategories: ${(e.cats ?? []).join(", ")}\n\n${e.body}\n`;
}

function safeFile(s: string) {
  return s.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || "entry";
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type RangeMode = "all" | "month" | "year" | "custom";

export function ExportView() {
  const { entries, user } = useDiary();
  const [mode, setMode] = useState<RangeMode>("month");
  const now = new Date();
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState<"md" | "txt" | "json">("md");
  const [busy, setBusy] = useState(false);


  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (!e.date) return mode === "all";
      const d = e.date;
      if (mode === "all") return true;
      if (mode === "month") return d.startsWith(month);
      if (mode === "year") return d.startsWith(year);
      if (mode === "custom") {
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      }
      return true;
    });
  }, [entries, mode, month, year, from, to]);

  const rangeLabel =
    mode === "all" ? "all entries" :
    mode === "month" ? month :
    mode === "year" ? year :
    `${from || "…"}_to_${to || "…"}`;

  function computeFiltered(m: RangeMode): Entry[] {
    return entries.filter((e) => {
      if (!e.date) return m === "all";
      const d = e.date;
      if (m === "all") return true;
      if (m === "month") return d.startsWith(month);
      if (m === "year") return d.startsWith(year);
      if (m === "custom") {
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      }
      return true;
    });
  }

  async function exportFolder(overrideMode?: RangeMode, overrideFormat?: "md" | "txt" | "json") {
    const m = overrideMode ?? mode;
    const f = overrideFormat ?? format;
    const items = overrideMode ? computeFiltered(m) : filtered;
    const label =
      m === "all" ? "all entries" :
      m === "month" ? month :
      m === "year" ? year :
      `${from || "…"}_to_${to || "…"}`;

    if (!items.length) {
      alert("No entries match this range.");
      return;
    }
    setBusy(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(`diary_${label}`)!;
      const idx = items
        .slice()
        .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
        .map((e) => `- ${e.date ?? ""}  ${e.title}  (${e.mood})`)
        .join("\n");
      folder.file("INDEX.md", `# Diary Export — ${label}\n\nUser: ${user?.username ?? "anonymous"}\nEntries: ${items.length}\nExported: ${new Date().toISOString()}\n\n${idx}\n`);
      for (const e of items) {
        const base = `${e.date ?? "undated"}_${safeFile(e.title)}`;
        if (f === "md") folder.file(`${base}.md`, entryToMarkdown(e));
        else if (f === "txt") folder.file(`${base}.txt`, entryToText(e));
        else folder.file(`${base}.json`, JSON.stringify(e, null, 2));
        if (e.sketch?.startsWith("data:image")) {
          const b64 = e.sketch.split(",")[1];
          if (b64) folder.file(`${base}.png`, b64, { base64: true });
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      download(blob, `diary_${label}.zip`);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed. See console for details.");
    } finally {
      setBusy(false);
    }
  }


  function exportJsonBackup() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    download(blob, `diary_backup_${user?.username ?? "user"}_${new Date().toISOString().slice(0, 10)}.json`);
  }

  return (
    <div className="p-5 space-y-4">
      <PageTitle title="Export your diary" sub="Download entries as a folder, by month, year, or any custom range" />

      {/* Storage bar */}
      <Card>
        <StorageBar />
      </Card>


      {/* Range picker */}
      <Card>
        <div className="text-[13px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
          <FolderArchive size={15} /> Download a folder (.zip)
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(["month", "year", "custom", "all"] as RangeMode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-3 py-1.5 rounded-full text-[12px] capitalize transition-all"
              style={{
                border: "1.5px solid var(--dy-bdr)",
                background: mode === m ? "var(--dy-al)" : "transparent",
                color: "var(--dy-tx)",
                fontWeight: mode === m ? 700 : 500,
              }}>
              {m === "all" ? "All entries" : m}
            </button>
          ))}
        </div>

        {mode === "month" && (
          <label className="block text-[12px] mb-3" style={{ color: "var(--dy-tx2)" }}>
            Month
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              className="ml-2 px-2 py-1 rounded-md" style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-bg)", color: "var(--dy-tx)" }} />
          </label>
        )}
        {mode === "year" && (
          <label className="block text-[12px] mb-3" style={{ color: "var(--dy-tx2)" }}>
            Year
            <input type="number" min="2000" max="2100" value={year} onChange={(e) => setYear(e.target.value)}
              className="ml-2 px-2 py-1 rounded-md w-24" style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-bg)", color: "var(--dy-tx)" }} />
          </label>
        )}
        {mode === "custom" && (
          <div className="flex flex-wrap gap-2 mb-3 text-[12px]" style={{ color: "var(--dy-tx2)" }}>
            <label>From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="ml-1 px-2 py-1 rounded-md" style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-bg)", color: "var(--dy-tx)" }} /></label>
            <label>To <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="ml-1 px-2 py-1 rounded-md" style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-bg)", color: "var(--dy-tx)" }} /></label>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {(["md", "txt", "json"] as const).map((f) => (
            <button key={f} onClick={() => setFormat(f)}
              className="px-3 py-1.5 rounded-full text-[12px] uppercase transition-all"
              style={{
                border: "1.5px solid var(--dy-bdr)",
                background: format === f ? "var(--dy-al)" : "transparent",
                color: "var(--dy-tx)",
                fontWeight: format === f ? 700 : 500,
              }}>
              .{f}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-[12px]" style={{ color: "var(--dy-tx3)" }}>
            {filtered.length} entr{filtered.length === 1 ? "y" : "ies"} will be included
          </div>
          <button onClick={() => exportFolder()} disabled={busy || !filtered.length}
            className="px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 disabled:opacity-50"
            style={{ background: "var(--dy-a)", color: "#fff" }}>
            <Download size={15} /> {busy ? "Packing…" : "Download .zip"}
          </button>
        </div>
      </Card>

      {/* Single-format quick exports */}
      <Card>
        <div className="text-[13px] font-semibold mb-2" style={{ color: "var(--dy-tx)" }}>Quick exports</div>
        <div onClick={exportJsonBackup}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl mb-2 cursor-pointer"
          style={{ border: "1.5px solid var(--dy-bdr)" }}>
          <div>
            <div className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
              <FileCode size={15} /> Full JSON backup
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>
              Complete data export including sketches — use this for full restores
            </div>
          </div>
          <Download size={17} style={{ color: "var(--dy-tx3)" }} />
        </div>
        <div onClick={() => { setMode("all"); setFormat("md"); exportFolder(); }}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl mb-2 cursor-pointer"
          style={{ border: "1.5px solid var(--dy-bdr)" }}>
          <div>
            <div className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
              <FileText size={15} /> All entries as Markdown folder
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>
              One .md per entry, plus an INDEX.md — ready for Obsidian or Notion
            </div>
          </div>
          <FolderArchive size={17} style={{ color: "var(--dy-tx3)" }} />
        </div>
        <div onClick={() => { setMode("all"); setFormat("txt"); exportFolder(); }}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer"
          style={{ border: "1.5px solid var(--dy-bdr)" }}>
          <div>
            <div className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
              <FileIcon size={15} /> All entries as Plain text folder
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>
              One .txt per entry — readable in any app
            </div>
          </div>
          <FolderArchive size={17} style={{ color: "var(--dy-tx3)" }} />
        </div>
      </Card>

      <div className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--dy-tx3)" }}>
        <ShieldCheck size={13} color="#3B6D11" />
        All exports are processed locally in your browser. Nothing is sent to any server.
      </div>
    </div>
  );
}
