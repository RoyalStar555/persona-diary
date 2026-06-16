import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useDiary } from "../DiaryContext";
import { EntryItem } from "../primitives";

export function EntriesView() {
  const { entries, searchQuery, categoryFilter, setCategoryFilter, setView, setEditEntry } = useDiary();
  const [moodFilter, setMoodFilter] = useState("");
  const [sort, setSort] = useState("Newest first");

  const filtered = useMemo(() => {
    let list = entries.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchesQ = !q || e.title.toLowerCase().includes(q) || e.preview.toLowerCase().includes(q) || e.mood.toLowerCase().includes(q) || e.cats.some((c) => c.toLowerCase().includes(q));
      const matchesCat = !categoryFilter || e.cats.includes(categoryFilter);
      return matchesQ && matchesCat;
    });
    if (moodFilter) list = list.filter((e) => e.mood === moodFilter);
    if (sort === "Oldest first") list = [...list].reverse();
    return list;
  }, [entries, searchQuery, categoryFilter, moodFilter, sort]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="text-xl font-bold" style={{ color: "var(--dy-tx)" }}>All entries</div>
          <div className="text-[13px]" style={{ color: "var(--dy-tx3)" }}>Your complete journal</div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)} className="text-[13px] px-2.5 py-1.5 rounded outline-none cursor-pointer"
            style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
            <option value="">All moods</option>
            <option>😊 Happy</option><option>🌿 Calm</option><option>💜 Grateful</option><option>🤩 Excited</option><option>😢 Sad</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-[13px] px-2.5 py-1.5 rounded outline-none cursor-pointer"
            style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
            <option>Newest first</option><option>Oldest first</option>
          </select>
          <button onClick={() => setView("export")} className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg cursor-pointer"
            style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
            <Download size={13} /> Export all
          </button>
        </div>
      </div>

      {categoryFilter && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span style={{ color: "var(--dy-tx3)" }}>Filtered by category:</span>
          <span className="px-2.5 py-1 rounded-full font-semibold text-white" style={{ background: "var(--dy-a)" }}>
            {categoryFilter}
          </span>
          <button onClick={() => setCategoryFilter("")} className="underline cursor-pointer" style={{ color: "var(--dy-tx3)" }}>clear</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-5" style={{ color: "var(--dy-tx3)" }}>No entries found.</p>
      ) : (
        filtered.map((e) => (
          <EntryItem key={e.id} entry={e} onClick={() => { setEditEntry(e); setView("editor"); }} />
        ))
      )}
    </div>
  );
}
