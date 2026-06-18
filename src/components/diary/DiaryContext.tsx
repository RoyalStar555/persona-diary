import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { INITIAL_ENTRIES, type Entry, type ViewId } from "./types";

export type User = { id: string; username: string };
type StoredUser = {
  id: string; username: string;
  passwordHash: string; pinHash: string;
  pwSalt?: string; pinSalt?: string; v?: number;
};

type SecuritySettings = {
  autoLock: boolean;
  hidePreview: boolean;
  screenshotBlock: boolean;
  fingerprint: boolean;
  faceId: boolean;
  autoBackup: boolean;
  credentialId?: string;
};

const DEFAULT_SEC: SecuritySettings = {
  autoLock: true, hidePreview: true, screenshotBlock: true,
  fingerprint: false, faceId: false, autoBackup: true,
};

type Ctx = {
  view: ViewId;
  setView: (v: ViewId) => void;
  entries: Entry[];
  addEntry: (e: Entry) => void;
  dark: boolean;
  toggleDark: () => void;
  locked: boolean;
  unlock: () => void;
  lock: () => void;
  streak: number;
  editEntry: Entry | null;
  setEditEntry: (e: Entry | null) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  themeName: string;
  setTheme: (name: string) => void;
  // auth
  user: User | null;
  signup: (u: string, p: string, pin: string) => Promise<{ ok: boolean; error?: string }>;
  login: (u: string, p: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  verifyPin: (pin: string) => Promise<boolean>;
  // security
  security: SecuritySettings;
  setSecurity: (patch: Partial<SecuritySettings>) => void;
  registerBiometric: () => Promise<{ ok: boolean; error?: string }>;
  biometricUnlock: () => Promise<{ ok: boolean; error?: string }>;
  // misc
  factoryReset: () => void;
  clearDrafts: () => void;
  draft: string;
  setDraft: (s: string) => void;
  calendarDate: Date;
  setCalendarDate: (d: Date) => void;
};

const DiaryCtx = createContext<Ctx | null>(null);

const THEMES: Record<string, { a: string; al: string; ap: string }> = {
  amber: { a: "#C8820A", al: "#FAC775", ap: "#FAEEDA" },
  purple: { a: "#534AB7", al: "#CECBF6", ap: "#EEEDFE" },
  teal: { a: "#1D9E75", al: "#9FE1CB", ap: "#E1F5EE" },
  coral: { a: "#D85A30", al: "#F5C4B3", ap: "#FAECE7" },
  blue: { a: "#185FA5", al: "#85B7EB", ap: "#E6F1FB" },
  gray: { a: "#5F5E5A", al: "#D3D1C7", ap: "#F1EFE8" },
};

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// PBKDF2-SHA256, 150k iterations — resistant to brute force on stolen localStorage dumps.
async function pbkdf2(password: string, salt: string, iterations = 150_000) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations, hash: "SHA-256" },
    key, 256
  );
  return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readJSON<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; }
}
function writeJSON(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }

const K = {
  users: "mydiary_users",
  session: "mydiary_session",
  entries: (uid: string) => `mydiary_entries_${uid}`,
  draft: (uid: string) => `mydiary_draft_${uid}`,
  security: (uid: string) => `mydiary_security_${uid}`,
  dark: "mydiary_dark",
  theme: "mydiary_theme",
};

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewId>("auth");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dark, setDark] = useState(false);
  const [locked, setLocked] = useState(true);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [themeName, setThemeName] = useState("amber");
  const [security, setSecurityState] = useState<SecuritySettings>(DEFAULT_SEC);
  const [draft, setDraftState] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const streak = 12;

  // Boot: restore session
  useEffect(() => {
    try {
      if (localStorage.getItem(K.dark) === "1") setDark(true);
      const t = localStorage.getItem(K.theme);
      if (t) applyTheme(t);
    } catch {}
    const sess = readJSON<{ userId?: string } | null>(K.session, null);
    const users = readJSON<Record<string, StoredUser>>(K.users, {});
    if (sess?.userId) {
      const u = Object.values(users).find((x) => x.id === sess.userId);
      if (u) {
        setUser({ id: u.id, username: u.username });
        loadUserData(u.id);
        setView("lock");
        setLocked(true);
        return;
      }
    }
    setView("auth");
    setLocked(false); // auth screen shouldn't render lock
  }, []);

  function loadUserData(uid: string) {
    setEntries(readJSON<Entry[]>(K.entries(uid), INITIAL_ENTRIES));
    setSecurityState({ ...DEFAULT_SEC, ...readJSON<Partial<SecuritySettings>>(K.security(uid), {}) });
    setDraftState(readJSON<string>(K.draft(uid), ""));
  }

  // Persist entries
  useEffect(() => {
    if (user) writeJSON(K.entries(user.id), entries);
  }, [entries, user]);

  // Persist draft
  useEffect(() => {
    if (user) writeJSON(K.draft(user.id), draft);
  }, [draft, user]);

  // Persist security
  useEffect(() => {
    if (user) writeJSON(K.security(user.id), security);
  }, [security, user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem(K.dark, dark ? "1" : "0"); } catch {}
  }, [dark]);

  function applyTheme(name: string) {
    const t = THEMES[name];
    if (!t) return;
    const r = document.documentElement;
    r.style.setProperty("--dy-a", t.a);
    r.style.setProperty("--dy-al", t.al);
    r.style.setProperty("--dy-ap", t.ap);
    setThemeName(name);
    try { localStorage.setItem(K.theme, name); } catch {}
  }

  // -------- AUTH ----------
  const signup = useCallback(async (username: string, password: string, pin: string) => {
    username = username.trim();
    if (!username || password.length < 4) return { ok: false, error: "Username and 4+ char password required." };
    if (!/^\d{4}$/.test(pin)) return { ok: false, error: "PIN must be 4 digits." };
    const users = readJSON<Record<string, StoredUser>>(K.users, {});
    if (users[username.toLowerCase()]) return { ok: false, error: "Username already exists." };
    const id = "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const stored: StoredUser = {
      id, username,
      passwordHash: await sha256(password + ":" + username.toLowerCase()),
      pinHash: await sha256(pin + ":" + id),
    };
    users[username.toLowerCase()] = stored;
    writeJSON(K.users, users);
    writeJSON(K.entries(id), []);
    writeJSON(K.security(id), DEFAULT_SEC);
    writeJSON(K.session, { userId: id });
    setUser({ id, username });
    loadUserData(id);
    setLocked(true);
    setView("lock");
    return { ok: true };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const users = readJSON<Record<string, StoredUser>>(K.users, {});
    const u = users[username.trim().toLowerCase()];
    if (!u) return { ok: false, error: "User not found." };
    const h = await sha256(password + ":" + username.trim().toLowerCase());
    if (h !== u.passwordHash) return { ok: false, error: "Incorrect password." };
    writeJSON(K.session, { userId: u.id });
    setUser({ id: u.id, username: u.username });
    loadUserData(u.id);
    setLocked(true);
    setView("lock");
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(K.session); } catch {}
    setUser(null);
    setEntries([]);
    setDraftState("");
    setSecurityState(DEFAULT_SEC);
    setLocked(false);
    setView("auth");
  }, []);

  const verifyPin = useCallback(async (pin: string) => {
    if (!user) return false;
    const users = readJSON<Record<string, StoredUser>>(K.users, {});
    const u = Object.values(users).find((x) => x.id === user.id);
    if (!u) return false;
    const h = await sha256(pin + ":" + user.id);
    return h === u.pinHash;
  }, [user]);

  // -------- BIOMETRICS (WebAuthn) ----------
  const registerBiometric = useCallback(async () => {
    if (!user) return { ok: false, error: "Not signed in." };
    if (!window.PublicKeyCredential) return { ok: false, error: "WebAuthn not supported in this browser." };
    try {
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: "MyDiary" },
          user: {
            id: new TextEncoder().encode(user.id),
            name: user.username,
            displayName: user.username,
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { userVerification: "preferred" },
          timeout: 30000,
        },
      }) as PublicKeyCredential | null;
      if (!cred) return { ok: false, error: "Cancelled." };
      const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
      setSecurityState((s) => ({ ...s, credentialId: credId, fingerprint: true }));
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Registration failed." };
    }
  }, [user]);

  const biometricUnlock = useCallback(async () => {
    if (!security.credentialId) return { ok: false, error: "No biometric registered. Enable in Security." };
    if (!window.PublicKeyCredential) return { ok: false, error: "WebAuthn not supported." };
    try {
      const raw = Uint8Array.from(atob(security.credentialId), (c) => c.charCodeAt(0));
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{ id: raw, type: "public-key" }],
          userVerification: "preferred",
          timeout: 30000,
        },
      });
      if (!assertion) return { ok: false, error: "Cancelled." };
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Biometric failed." };
    }
  }, [security.credentialId]);

  // -------- AUTO-LOCK ----------
  const lastActiveRef = useRef(Date.now());
  useEffect(() => {
    if (!user || locked || !security.autoLock) return;
    const bump = () => { lastActiveRef.current = Date.now(); };
    const events = ["mousemove", "keydown", "pointerdown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, bump));
    const interval = setInterval(() => {
      if (Date.now() - lastActiveRef.current > 5 * 60 * 1000) {
        setLocked(true);
        setView("lock");
      }
    }, 15000);
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, bump));
      clearInterval(interval);
    };
  }, [user, locked, security.autoLock]);

  // -------- ACTIONS ----------
  const factoryReset = useCallback(() => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("mydiary_")) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {}
    setUser(null);
    setEntries([]);
    setDraftState("");
    setSecurityState(DEFAULT_SEC);
    setLocked(false);
    setView("auth");
  }, []);

  const clearDrafts = useCallback(() => {
    if (user) writeJSON(K.draft(user.id), "");
    setDraftState("");
  }, [user]);

  const value = useMemo<Ctx>(() => ({
    view, setView,
    entries, addEntry: (e) => setEntries((prev) => [e, ...prev]),
    dark, toggleDark: () => setDark((d) => !d),
    locked,
    unlock: () => { setLocked(false); setView("dashboard"); },
    lock: () => { setLocked(true); setView("lock"); },
    streak,
    editEntry, setEditEntry,
    searchQuery, setSearchQuery,
    categoryFilter, setCategoryFilter,
    themeName, setTheme: applyTheme,
    user, signup, login, logout, verifyPin,
    security, setSecurity: (patch) => setSecurityState((s) => ({ ...s, ...patch })),
    registerBiometric, biometricUnlock,
    factoryReset, clearDrafts,
    draft, setDraft: setDraftState,
    calendarDate, setCalendarDate,
  }), [view, entries, dark, locked, editEntry, searchQuery, categoryFilter, themeName, user, security, draft, calendarDate, signup, login, logout, verifyPin, registerBiometric, biometricUnlock, factoryReset, clearDrafts]);

  return <DiaryCtx.Provider value={value}>{children}</DiaryCtx.Provider>;
}

export function useDiary() {
  const c = useContext(DiaryCtx);
  if (!c) throw new Error("useDiary must be used within DiaryProvider");
  return c;
}
