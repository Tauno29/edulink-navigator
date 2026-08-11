import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, BellRing, CalendarClock, Megaphone } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { NOTIFICATIONS } from "@/lib/data";
import { useReadNotifications } from "@/lib/local-state";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — EduSpace Namibia" },
      { name: "description", content: "Availability updates, ministry announcements and reminders for school placement in Namibia." },
      { property: "og:title", content: "Notifications — EduSpace Namibia" },
      { property: "og:description", content: "Availability updates and ministry announcements for school placement in Namibia." },
    ],
  }),
  component: NotificationsPage,
});

const iconFor = { availability: BellRing, reminder: CalendarClock, announcement: Megaphone };

function NotificationsPage() {
  const { isRead, markAll, markOne } = useReadNotifications();
  const unreadIds = NOTIFICATIONS.filter((n) => n.unread && !isRead(n.id)).map((n) => n.id);

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Notifications</h1>
        <button
          disabled={unreadIds.length === 0}
          onClick={() => { markAll(unreadIds); toast.success("All notifications marked as read"); }}
          className="text-xs font-medium text-muted-foreground disabled:opacity-40"
        >
          Mark all read
        </button>
      </div>

      <ul className="space-y-2">
        {NOTIFICATIONS.map((n) => {
          const Icon = iconFor[n.type] ?? Bell;
          const unread = n.unread && !isRead(n.id);
          return (
            <li key={n.id}>
              <button
                onClick={() => markOne(n.id)}
                className={`flex w-full items-start gap-3 rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-card)] transition active:scale-[0.99] ${unread ? "ring-1 ring-success/30" : ""}`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/10 text-success"><Icon className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{n.time}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
