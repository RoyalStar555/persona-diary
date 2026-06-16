import { DiaryProvider, useDiary } from "./DiaryContext";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./views/DashboardView";
import { EditorView } from "./views/EditorView";
import { EntriesView } from "./views/EntriesView";
import { HandwritingView } from "./views/HandwritingView";
import { CalendarView } from "./views/CalendarView";
import { AnalyticsView } from "./views/AnalyticsView";
import { LockView } from "./views/LockView";
import { SecurityView } from "./views/SecurityView";
import { SettingsView } from "./views/SettingsView";
import { NotificationsView } from "./views/NotificationsView";
import { ExportView } from "./views/ExportView";
import { AuthView } from "./views/AuthView";

function Shell() {
  const { view, locked, user } = useDiary();

  if (!user) return <AuthView />;

  if (locked) {
    return (
      <div className="min-h-screen dy-font-sans" style={{ background: "var(--dy-bg)" }}>
        <LockView />
      </div>
    );
  }

  return (
    <div className="min-h-screen dy-font-sans grid" style={{ gridTemplateColumns: "230px 1fr", gridTemplateRows: "58px 1fr" }}>
      <Topbar />
      <div className="hidden md:block"><Sidebar /></div>
      <main className="dy-scroll overflow-y-auto md:col-start-2" style={{ background: "var(--dy-bg)", minHeight: "calc(100vh - 58px)" }}>
        {view === "dashboard" && <DashboardView />}
        {view === "editor" && <EditorView />}
        {view === "entries" && <EntriesView />}
        {view === "handwriting" && <HandwritingView />}
        {view === "calendar" && <CalendarView />}
        {view === "analytics" && <AnalyticsView />}
        {view === "lock" && <LockView />}
        {view === "security" && <SecurityView />}
        {view === "settings" && <SettingsView />}
        {view === "notifications" && <NotificationsView />}
        {view === "export" && <ExportView />}
      </main>
    </div>
  );
}

export function DiaryApp() {
  return (
    <DiaryProvider>
      <Shell />
    </DiaryProvider>
  );
}
