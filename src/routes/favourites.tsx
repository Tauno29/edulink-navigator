import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowLeft, Building2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { useFavorites } from "@/lib/favorites";
import { SCHOOLS, REGIONS, schoolStats } from "@/lib/data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/favourites")({ component: Favourites });

function Favourites() {
  const { ids, toggle } = useFavorites();
  const list = SCHOOLS.filter((s) => ids.includes(s.id));
  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Saved schools</h1>
        <div className="w-10" />
      </div>

      {list.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid h-20 w-20 place-items-center rounded-full bg-success/10">
            <Heart className="h-8 w-8 text-success" />
          </motion.div>
          <h2 className="mt-4 font-display text-xl font-bold">No favourites yet</h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">Tap the heart on any school to save it here for quick access.</p>
          <Link to="/search" className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Find schools</Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((s) => {
            const r = REGIONS.find((r) => r.id === s.regionId)!;
            const st = schoolStats(s);
            return (
              <li key={s.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)]">
                <Link to="/schools/$schoolId" params={{ schoolId: s.id }} className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${r.color} 15%, transparent)`, color: r.color }}>
                  <Building2 className="h-4 w-4" />
                </Link>
                <Link to="/schools/$schoolId" params={{ schoolId: s.id }} className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.name} · {st.available} spaces</p>
                </Link>
                <button onClick={() => toggle(s.id)} className="grid h-9 w-9 place-items-center rounded-full bg-muted"><Heart className="h-4 w-4 fill-destructive text-destructive" /></button>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
