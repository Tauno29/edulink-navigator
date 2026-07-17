import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/favourites", label: "Saved", icon: Heart },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 w-[min(560px,calc(100%-1.5rem))]">
      <div className="glass rounded-full px-2 py-2 shadow-[0_20px_60px_-20px_oklch(0.22_0.06_265/0.35)]">
        <ul className="grid grid-cols-5 gap-1">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="relative flex flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[11px] font-medium transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className={`relative z-10 h-[18px] w-[18px] ${active ? "text-background" : "text-muted-foreground"}`} strokeWidth={active ? 2.4 : 2} />
                  <span className={`relative z-10 ${active ? "text-background" : "text-muted-foreground"}`}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
