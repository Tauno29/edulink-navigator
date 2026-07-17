import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, BellRing, CalendarClock, Megaphone } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { NOTIFICATIONS } from "@/lib/data";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

const iconFor = { availability: BellRing, reminder: CalendarClock, announcement: Megaphone };

function NotificationsPage() {
  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Notifications</h1>
        <button className="text-xs font-medium text-muted-foreground">Mark all read</button>
      </div>

      <ul className="space-y-2">
        {NOTIFICATIONS.map((n) => {
          const Icon = iconFor[n.type] ?? Bell;
          return (
            <li key={n.id} className={`flex items-start gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] ${n.unread ? "ring-1 ring-success/30" : ""}`}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><Icon className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-success" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{n.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
