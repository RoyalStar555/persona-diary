import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Calendar, Clock, Mic, Mic2, X, Save, FileText, Bold, Italic,
  Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter,
  AlignRight, Quote, Smile, Undo2, Redo2, Tag,
} from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { useDiary } from "../DiaryContext";
import { MOODS, type Entry } from "../types";
import { MoodChip } from "../primitives";

const FONT_FAMILIES: { id: string; label: string; css: string }[] = [
  { id: "inter", label: "Inter", css: "'Inter', sans-serif" },
  { id: "playfair", label: "Playfair Display", css: "'Playfair Display', serif" },
  { id: "merriweather", label: "Merriweather", css: "'Merriweather', serif" },
  { id: "caveat", label: "Caveat (handwriting)", css: "'Caveat', cursive" },
  { id: "comic", label: "Comic Neue", css: "'Comic Neue', cursive" },
  { id: "mono", label: "Space Mono", css: "'Space Mono', monospace" },
];

const PROMPTS = [
  "What made you smile today?",
  "Describe a moment of unexpected beauty you witnessed.",
  "What are three things you are grateful for right now?",
  "What challenge taught you something valuable recently?",
  "If today had a colour, what would it be and why?",
  "Write a letter to your future self about today.",
  "What would your ideal tomorrow look like?",
  "Describe someone who inspired you today.",
];

const CAT_LIST = ["Personal", "Work", "Dreams", "Travel", "Health", "Gratitude"];

export function EditorView() {
  const { setView, addEntry, editEntry, setEditEntry, draft, setDraft, clearDrafts, dark } = useDiary();
  const editorRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const sttBaseRef = useRef<string>("");
  const savedRangeRef = useRef<Range | null>(null);

  const [title, setTitle] = useState(editEntry?.title ?? "");
  const [moodIdx, setMoodIdx] = useState(0);
  const [cats, setCats] = useState<string[]>(editEntry?.cats ?? ["Personal"]);
  const [extraCats, setExtraCats] = useState<string[]>([]);
  const [fontFamily, setFontFamily] = useState<string>("inter");
  const [fontSize, setFontSize] = useState("15px");
  const [wc, setWc] = useState({ words: 0, chars: 0 });
  const [now, setNow] = useState(new Date());
  const [voicing, setVoicing] = useState(false);
  const [dictating, setDictating] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editEntry) {
      const sketch = editEntry.sketch ? `<p><img src="${editEntry.sketch}" alt="Handwritten sketch" style="max-width:100%;border-radius:8px;border:1.5px solid var(--dy-bdr)" /></p>` : "";
      editorRef.current.innerHTML = sketch + `<p>${editEntry.body}</p>`;
    } else if (draft) {
      editorRef.current.innerHTML = draft;
    }
    updateWc();
    return () => setEditEntry(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function updateWc() {
    const html = editorRef.current?.innerHTML ?? "";
    if (!editEntry) setDraft(html);
    const text = editorRef.current?.innerText.trim() ?? "";
    const words = text ? text.split(/\s+/).length : 0;
    setWc({ words, chars: text.length });
  }

  function fmt(cmd: string) {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
  }

  function addPrompt(p: string) {
    if (!editorRef.current) return;
    editorRef.current.innerHTML += `<em style="color:var(--dy-tx3)">${p}</em><p></p>`;
    setFeedback("Prompt added! Start writing below it ✨");
    setTimeout(() => setFeedback(""), 3000);
    updateWc();
  }

  function insertQuote() {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, '<blockquote style="border-left:3px solid var(--dy-al);padding-left:12px;color:var(--dy-tx2);margin:8px 0;font-style:italic">Your quote here</blockquote>');
  }

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const r = savedRangeRef.current;
    editorRef.current?.focus();
    if (r) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
  }

  function insertAtCursor(text: string) {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      editorRef.current?.append(document.createTextNode(text));
    } else {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(text);
      range.insertNode(node);
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
      savedRangeRef.current = range.cloneRange();
    }
    updateWc();
  }

  function applyFontFamily(id: string) {
    setFontFamily(id);
    const fam = FONT_FAMILIES.find((f) => f.id === id);
    if (!fam) return;
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      // wrap selection in a span with inline font-family so it persists
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontFamily = fam.css;
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        sel.removeAllRanges();
        const r = document.createRange();
        r.selectNodeContents(span);
        sel.addRange(r);
      } catch {
        document.execCommand("fontName", false, fam.css);
      }
    }
    if (editorRef.current) editorRef.current.style.fontFamily = fam.css;
    updateWc();
  }

  function toggleVoice() {
    if (!voicing) {
      const txt = editorRef.current?.innerText ?? "";
      if (!txt.trim() || !window.speechSynthesis) {
        alert("Nothing to read. Write some text first!");
        return;
      }
      const u = new SpeechSynthesisUtterance(txt);
      u.onend = () => setVoicing(false);
      speechSynthesis.speak(u);
      setVoicing(true);
    } else {
      window.speechSynthesis?.cancel();
      setVoicing(false);
    }
  }

  function toggleSTT() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported. Please use Chrome or Edge.");
      return;
    }
    if (!dictating) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      sttBaseRef.current = editorRef.current?.innerHTML ?? "";
      rec.onresult = (e: any) => {
        let t = "";
        for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
        if (editorRef.current) editorRef.current.innerHTML = sttBaseRef.current + `<span style="color:var(--dy-tx3)">${t}</span>`;
      };
      rec.onend = () => setDictating(false);
      rec.start();
      recRef.current = rec;
      setDictating(true);
    } else {
      recRef.current?.stop();
      setDictating(false);
    }
  }

  function save() {
    const t = title || "Untitled entry";
    const body = editorRef.current?.innerText ?? "";
    const mood = MOODS[moodIdx];
    const e: Entry = {
      id: String(Date.now()),
      date: now.toISOString().slice(0, 10),
      day: String(now.getDate()).padStart(2, "0"),
      mon: now.toLocaleString("en", { month: "short" }),
      title: t,
      preview: body.slice(0, 160),
      body,
      sketch: editEntry?.sketch,
      mood: mood.label, moodBg: mood.bg, moodColor: mood.color, moodBdr: mood.bdr,
      cats: [...cats, ...extraCats],
      catBg: "#EAF3DE", catColor: "#173404",
    };
    addEntry(e);
    if (!editEntry) clearDrafts();
    setFeedback(`Entry "${t}" saved securely! ✨`);
    setTimeout(() => setView("entries"), 900);
  }

  function exportTxt() {
    const t = title || "diary-entry";
    const body = editorRef.current?.innerText ?? "";
    const blob = new Blob([t + "\n\n" + body], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = t.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".txt";
    a.click();
  }

  function toggleCat(name: string, custom?: boolean) {
    const list = custom ? extraCats : cats;
    const setter = custom ? setExtraCats : setCats;
    setter(list.includes(name) ? list.filter((c) => c !== name) : [...list, name]);
  }

  function addCustom() {
    const t = prompt("Enter new tag name:");
    if (t?.trim()) setExtraCats([...extraCats, t.trim()]);
  }

  const fontCls = `dy-font-${font}`;

  return (
    <div className="p-5">
      <div className="dy-card p-3.5 mb-4" style={{ background: "var(--dy-ap)", borderColor: "var(--dy-al)" }}>
        <div className="text-xs font-bold mb-2.5 flex items-center gap-1.5" style={{ color: "var(--dy-a)" }}>
          <Sparkles size={14} /> AI writing prompts — click to add to your entry
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => addPrompt(p)}
              className="px-3 py-1 rounded-full text-[11px] cursor-pointer transition-all"
              style={{ border: "1.5px solid var(--dy-al)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--dy-a)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--dy-card)"; e.currentTarget.style.color = "var(--dy-tx2)"; }}
            >
              {p.length > 32 ? p.slice(0, 30) + "…" : p}
            </button>
          ))}
        </div>
        {feedback && (
          <div className="mt-2.5 p-2.5 dy-card text-xs" style={{ color: "var(--dy-green)" }}>{feedback}</div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2.5 mb-3.5 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--dy-tx)" }}>{editEntry ? "Edit entry" : "New entry"}</h1>
          <div className="text-xs flex items-center gap-2.5 mt-1" style={{ color: "var(--dy-tx3)" }}>
            <Calendar size={13} /> {now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            <Clock size={13} /> {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <VBtn onClick={toggleVoice} bg={voicing ? "var(--dy-red)" : "var(--dy-terra)"} pulse={voicing}>
            <Mic size={13} /> {voicing ? "Stop reading" : "Voice read"}
          </VBtn>
          <VBtn onClick={toggleSTT} bg={dictating ? "var(--dy-red)" : "var(--dy-blue)"} pulse={dictating}>
            <Mic2 size={13} /> {dictating ? "Stop dictating" : "Dictate"}
          </VBtn>
          <EBtn onClick={() => setView("entries")}><X size={13} /> Discard</EBtn>
          <SBtn onClick={save}><Save size={13} /> Save</SBtn>
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry title…"
        className="w-full px-0 py-2 text-[17px] font-bold mb-3 outline-none bg-transparent"
        style={{ borderBottom: "2px solid var(--dy-bdr)", color: "var(--dy-tx)" }}
      />

      <div className="flex gap-1 px-2.5 py-2 dy-surf-bg rounded-lg mb-3 flex-wrap items-center" style={{ border: "1.5px solid var(--dy-bdr)" }}>
        <Select value={font} onChange={(v) => setFont(v as any)} options={[["sans","Sans-serif"],["serif","Serif"],["mono","Mono"]]} />
        <Select value={fontSize} onChange={setFontSize} options={[["13px","13px"],["15px","15px"],["17px","17px"],["20px","20px"],["24px","24px"]]} />
        <Sep />
        <TbBtn label="Bold" onClick={() => fmt("bold")}><Bold size={13} /></TbBtn>
        <TbBtn label="Italic" onClick={() => fmt("italic")}><Italic size={13} /></TbBtn>
        <TbBtn label="Underline" onClick={() => fmt("underline")}><Underline size={13} /></TbBtn>
        <TbBtn label="Strikethrough" onClick={() => fmt("strikeThrough")}><Strikethrough size={13} /></TbBtn>
        <Sep />
        <TbBtn label="Bulleted list" onClick={() => fmt("insertUnorderedList")}><List size={13} /></TbBtn>
        <TbBtn label="Numbered list" onClick={() => fmt("insertOrderedList")}><ListOrdered size={13} /></TbBtn>
        <Sep />
        <TbBtn label="Align left" onClick={() => fmt("justifyLeft")}><AlignLeft size={13} /></TbBtn>
        <TbBtn label="Align center" onClick={() => fmt("justifyCenter")}><AlignCenter size={13} /></TbBtn>
        <TbBtn label="Align right" onClick={() => fmt("justifyRight")}><AlignRight size={13} /></TbBtn>
        <Sep />
        <TbBtn label="Insert quote" onClick={insertQuote}><Quote size={13} /></TbBtn>
        <TbBtn label="Insert emoji" onClick={insertEmoji}><Smile size={13} /></TbBtn>
        <TbBtn label="Undo" onClick={() => fmt("undo")}><Undo2 size={13} /></TbBtn>
        <TbBtn label="Redo" onClick={() => fmt("redo")}><Redo2 size={13} /></TbBtn>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {MOODS.slice(0, 6).map((m, i) => (
          <MoodChip key={m.label} {...m} selected={moodIdx === i} onClick={() => setMoodIdx(i)} />
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline
        suppressContentEditableWarning
        onInput={updateWc}
        data-placeholder="Pour your heart out… this is your safe space."
        className={`dy-editor ${fontCls} w-full min-h-[300px] px-5 py-4 rounded-xl outline-none transition-all leading-[1.8]`}
        style={{
          border: "1.5px solid var(--dy-bdr)",
          background: "var(--dy-card)",
          color: "var(--dy-tx)",
          fontSize,
        }}
      />

      <div className="flex items-center justify-between mt-2.5">
        <div className="text-xs" style={{ color: "var(--dy-tx3)" }}>{wc.words} words · {wc.chars} characters</div>
        <div className="flex gap-1.5">
          <EBtn onClick={exportTxt}><FileText size={13} /> Export .txt</EBtn>
          <SBtn onClick={save}><Save size={13} /> Save entry</SBtn>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[13px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
          <Tag size={13} style={{ color: "var(--dy-a)" }} /> Categories
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CAT_LIST.map((c) => (
            <Ctab key={c} active={cats.includes(c)} onClick={() => toggleCat(c)}>{c}</Ctab>
          ))}
          {extraCats.map((c) => (
            <Ctab key={c} active onClick={() => toggleCat(c, true)}>{c}</Ctab>
          ))}
          <Ctab onClick={addCustom}>+ Add tag</Ctab>
        </div>
      </div>
    </div>
  );
}

function VBtn({ children, onClick, bg, pulse }: { children: React.ReactNode; onClick?: () => void; bg: string; pulse?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs text-white px-3.5 py-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-90 ${pulse ? "dy-pulse" : ""}`}
      style={{ background: bg }}
    >{children}</button>
  );
}
function EBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all"
      style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
      {children}
    </button>
  );
}
function SBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-[13px] font-semibold text-white px-5 py-2 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
      style={{ background: "var(--dy-a)" }}>
      {children}
    </button>
  );
}
function TbBtn({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label?: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="p-1.5 rounded cursor-pointer text-xs flex items-center transition-all"
      style={{ color: "var(--dy-tx2)", border: "1.5px solid transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--dy-ap)"; e.currentTarget.style.color = "var(--dy-a)"; e.currentTarget.style.borderColor = "var(--dy-al)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--dy-tx2)"; e.currentTarget.style.borderColor = "transparent"; }}>
      {children}
    </button>
  );
}
function Sep() {
  return <div className="w-px h-5 mx-1" style={{ background: "var(--dy-bdr)" }} />;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="text-xs px-2 py-1 rounded outline-none cursor-pointer"
      style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx2)" }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
function Ctab({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <span onClick={onClick} className="px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all"
      style={{
        border: `1.5px solid ${active ? "var(--dy-a)" : "var(--dy-bdr)"}`,
        background: active ? "var(--dy-a)" : "var(--dy-card)",
        color: active ? "white" : "var(--dy-tx2)",
      }}>{children}</span>
  );
}
