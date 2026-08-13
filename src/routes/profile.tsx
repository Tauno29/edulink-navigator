import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Bell, LifeBuoy, Info, User, Heart, Clock, Check, X } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useState } from "react";
import { toast } from "sonner";
import { useFavorites } from "@/lib/favorites";
import { NOTIFICATIONS, REGIONS, SCHOOLS } from "@/lib/data";
import { useUserName } from "@/lib/user-profile";
import { useReadNotifications, useRecentSchools } from "@/lib/local-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — EduSpace Namibia" },
      { name: "description", content: "Manage your name, saved schools, viewing history and notification preferences on EduSpace Namibia." },
      { property: "og:title", content: "Your profile — EduSpace Namibia" },
      { property: "og:description", content: "Manage your saved schools and viewing history on EduSpace Namibia." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { ids } = useFavorites();
  const { name, setName } = useUserName();
  const { isRead } = useReadNotifications();
  const { ids: recent, clear: clearRecent } = useRecentSchools();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [panel, setPanel] = useState<"history" | "help" | "about" | null>(null);

  const unread = NOTIFICATIONS.filter((n) => n.unread && !isRead(n.id)).length;
  const recentSchools = recent.map((id) => SCHOOLS.find((s) => s.id === id)).filter(Boolean);
  const display = name || "Guest";

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Profile</h1>
        <div className="w-10" />
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-hero text-lg font-bold text-background">
          {display.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { setName(draft.trim()); setEditing(false); toast.success("Name updated"); }
                  if (e.key === "Escape") setEditing(false);
                }}
                placeholder="Your name"
                className="min-w-0 flex-1 rounded-xl bg-muted px-3 py-2 text-sm outline-none ring-ring/40 focus:ring-2"
              />
              <button
                aria-label="Save name"
                onClick={() => { setName(draft.trim()); setEditing(false); toast.success("Name updated"); }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success text-success-foreground"
              ><Check className="h-4 w-4" /></button>
              <button aria-label="Cancel" onClick={() => setEditing(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <>
              <p className="truncate font-display text-lg font-bold">{display}</p>
              <p className="text-xs text-muted-foreground">Saved on this device</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniStat icon={Heart} value={ids.length} label="Saved" onClick={() => navigate({ to: "/favourites" })} />
        <MiniStat icon={Clock} value={recentSchools.length} label="Viewed" onClick={() => setPanel(panel === "history" ? null : "history")} />
        <MiniStat icon={Bell} value={unread} label="Alerts" onClick={() => navigate({ to: "/notifications" })} />
      </div>

      <Section title="Account">
        <RowLink icon={User} label="Personal information" onClick={() => { setDraft(name); setEditing(true); }} />
        <RowLink icon={Clock} label="Viewing history" value={String(recentSchools.length)} onClick={() => setPanel(panel === "history" ? null : "history")} />
        <RowLink icon={Heart} label="Saved schools" value={String(ids.length)} onClick={() => navigate({ to: "/favourites" })} />
        <RowLink icon={Bell} label="Notifications" value={unread ? `${unread} new` : "All read"} onClick={() => navigate({ to: "/notifications" })} />
      </Section>

      {panel === "history" && (
        <div className="mt-2 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
          {recentSchools.length === 0 ? (
            <p className="px-1 py-3 text-center text-xs text-muted-foreground">No schools viewed yet.</p>
          ) : (
            <>
              <ul className="space-y-1">
                {recentSchools.map((s) => (
                  <li key={s!.id}>
                    <Link to="/schools/$schoolId" params={{ schoolId: s!.id }} className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-muted/60">
                      <span className="truncate">{s!.name}</span>
                      <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">{REGIONS.find((r) => r.id === s!.regionId)?.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={() => { clearRecent(); toast.success("Viewing history cleared"); }} className="mt-2 w-full rounded-xl bg-muted px-3 py-2 text-xs font-medium">Clear history</button>
            </>
          )}
        </div>
      )}

      <Section title="Support">
        <RowLink icon={LifeBuoy} label="Help centre" onClick={() => setPanel(panel === "help" ? null : "help")} />
        <RowLink icon={Info} label="About EduSpace" onClick={() => setPanel(panel === "about" ? null : "about")} />
      </Section>

      {panel === "help" && (
        <Panel>
          <p className="font-semibold text-foreground">How do I find open spaces?</p>
          <p>Open Search, pick a grade and region, then switch on “Available only”.</p>
          <p className="mt-3 font-semibold text-foreground">What does a class card show?</p>
          <p>Tap any grade on a school page to see each class, its enrolment, field of study and class teacher.</p>
          <p className="mt-3 font-semibold text-foreground">Still stuck?</p>
          <a href="mailto:support@eduspace.edu.na" className="text-success underline">support@eduspace.edu.na</a>
        </Panel>
      )}

      {panel === "about" && (
        <Panel>
          <p>EduSpace Namibia shows school placement availability across all 14 regions, down to individual class level.</p>
          <p className="mt-2">Everything you save — your name, saved schools and viewing history — stays on this device.</p>
        </Panel>
      )}

      <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground">EduSpace Namibia · v1.0</p>
    </AppShell>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 rounded-2xl bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-[var(--shadow-card)]">{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">{children}</div>
    </section>
  );
}

function RowLink({ icon: Icon, label, value, onClick }: { icon: any; label: string; value?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-border/60 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-muted/50 active:bg-muted">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted"><Icon className="h-4 w-4" /></div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function MiniStat({ icon: Icon, value, label, onClick }: { icon: any; value: number | string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-2xl bg-card p-3 text-left shadow-[var(--shadow-card)] transition active:scale-[0.98]">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <p className="mt-2 font-display text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </button>
  );
}
