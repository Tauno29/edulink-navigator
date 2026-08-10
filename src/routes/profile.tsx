import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Bell, Moon, LifeBuoy, Info, LogOut, User, Heart, FileText } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites";
import { REGIONS } from "@/lib/data";
import { useUserName } from "@/lib/user-profile";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { ids } = useFavorites();
  const { name } = useUserName();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Profile</h1>
        <div className="w-10" />
      </div>

      <div className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-hero text-background text-lg font-bold">
          {(name || "Ndapewa Nashilongo").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold">{name || "Ndapewa Nashilongo"}</p>
          <p className="text-xs text-muted-foreground">Khomas · Windhoek</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniStat icon={Heart} value={ids.length} label="Saved" />
        <MiniStat icon={FileText} value={REGIONS.length} label="Regions" />
        <MiniStat icon={Bell} value={3} label="Alerts" />
      </div>

      <Section title="Preferences">
        <RowToggle icon={Moon} label="Dark mode" value={dark} onChange={setDark} />
        <RowLink icon={Bell} label="Notifications" />
      </Section>

      <Section title="Account">
        <RowLink icon={User} label="Personal information" />
        <RowLink icon={FileText} label="Viewing history" />
        <RowLink icon={Heart} label="Saved schools" value={String(ids.length)} />
      </Section>

      <Section title="Support">
        <RowLink icon={LifeBuoy} label="Help center" />
        <RowLink icon={Info} label="About EduSpace" />
      </Section>

      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3.5 text-sm font-semibold text-destructive">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
      <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">EduSpace Namibia · v1.0</p>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="mb-2 px-1 text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">{children}</div>
    </section>
  );
}
function RowLink({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <button className="flex w-full items-center gap-3 border-b border-border/60 px-4 py-3.5 text-left last:border-0 hover:bg-muted/50">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted"><Icon className="h-4 w-4" /></div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
function RowToggle({ icon: Icon, label, value, onChange }: { icon: any; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 last:border-0">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted"><Icon className="h-4 w-4" /></div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-success" : "bg-muted-foreground/30"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
function MiniStat({ icon: Icon, value, label }: { icon: any; value: number | string; label: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <p className="mt-2 font-display text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
