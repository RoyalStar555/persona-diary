import { useState } from "react";
import { Book, LogIn, UserPlus } from "lucide-react";
import { useDiary } from "../DiaryContext";

export function AuthView() {
  const { signup, login } = useDiary();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    const res = mode === "signup"
      ? await signup(username, password, pin)
      : await login(username, password);
    setBusy(false);
    if (!res.ok) setErr(res.error ?? "Something went wrong.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 dy-font-sans" style={{ background: "var(--dy-bg)" }}>
      <div className="dy-card w-full max-w-[380px] p-7" style={{ borderRadius: 22 }}>
        <div className="flex items-center justify-center gap-2 font-bold text-xl mb-1" style={{ color: "var(--dy-a)" }}>
          <Book size={22} /> MyDiary
        </div>
        <div className="text-center text-[13px] mb-5" style={{ color: "var(--dy-tx3)" }}>
          {mode === "signup" ? "Create your private journal" : "Welcome back"}
        </div>

        <div className="flex p-1 rounded-xl mb-4" style={{ background: "var(--dy-ap)" }}>
          {(["signup", "login"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setErr(""); setPassword(""); setPin(""); }}
              className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
              style={{
                background: mode === m ? "var(--dy-card)" : "transparent",
                color: mode === m ? "var(--dy-a)" : "var(--dy-tx3)",
              }}>
              {m === "signup" ? <><UserPlus size={13} /> Sign up</> : <><LogIn size={13} /> Log in</>}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-2.5" autoComplete="off">
          <Field label="Username" value={username} onChange={setUsername} placeholder="e.g. moonwriter" autoComplete="username" />
          <Field label="Password" value={password} onChange={setPassword} type="password"
            placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          {mode === "signup" && (
            <Field label="4-digit PIN (lock-screen)" value={pin} onChange={(v) => setPin(v.replace(/\D/g, "").slice(0, 4))} placeholder="••••" type="password" autoComplete="off" />
          )}
          {err && <div className="text-xs" style={{ color: "var(--dy-red, #B91C1C)" }}>{err}</div>}
          <button type="submit" disabled={busy}
            className="mt-1 text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--dy-a)" }}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="text-[10px] text-center mt-4" style={{ color: "var(--dy-tx3)" }}>
          Your data lives only in this browser. No cloud, no tracking.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold" style={{ color: "var(--dy-tx2)" }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} autoComplete={autoComplete}
        className="px-3 py-2 rounded-lg text-sm outline-none"
        style={{ border: "1.5px solid var(--dy-bdr)", background: "var(--dy-card)", color: "var(--dy-tx)" }} />
    </label>
  );
}
