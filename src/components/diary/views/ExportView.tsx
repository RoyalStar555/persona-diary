import { FileText, File, FileCode, Lock, ShieldCheck, Download } from "lucide-react";
import { Card, PageTitle } from "../primitives";

const opts = [
  { icon: FileText, name: "PDF document", desc: "Formatted, printable PDF with all entries and moods" },
  { icon: File, name: "Plain text (.txt)", desc: "Simple text file, readable anywhere" },
  { icon: FileCode, name: "Markdown (.md)", desc: "For Notion, Obsidian, or any markdown app" },
  { icon: Lock, name: "Encrypted archive (.zip)", desc: "Password-protected ZIP with AES-256 encryption" },
  { icon: FileCode, name: "JSON backup", desc: "Full data export for migration or backup" },
];

export function ExportView() {
  return (
    <div className="p-5">
      <PageTitle title="Export your diary" sub="Download entries in your preferred format" />
      <Card>
        {opts.map((o) => (
          <div key={o.name} onClick={() => alert(`Exporting as ${o.name}…`)}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl mb-2 cursor-pointer transition-all"
            style={{ border: "1.5px solid var(--dy-bdr)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--dy-al)"; e.currentTarget.style.background = "var(--dy-ap)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--dy-bdr)"; e.currentTarget.style.background = "transparent"; }}>
            <div>
              <div className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "var(--dy-tx)" }}>
                <o.icon size={15} /> {o.name}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--dy-tx3)" }}>{o.desc}</div>
            </div>
            <Download size={17} style={{ color: "var(--dy-tx3)" }} />
          </div>
        ))}
      </Card>
      <div className="text-[11px] flex items-center gap-1.5 mt-2.5" style={{ color: "var(--dy-tx3)" }}>
        <ShieldCheck size={13} color="#3B6D11" />
        All exports are processed locally. Nothing is sent to any server.
      </div>
    </div>
  );
}
