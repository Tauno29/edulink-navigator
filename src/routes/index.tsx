import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, Sparkles, Building2, Users, TrendingUp, Bell } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { RegionGlyph } from "@/components/app/RegionGlyph";
import { REGIONS, ANNOUNCEMENTS, SCHOOLS, schoolStats } from "@/lib/data";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const totalSchools = REGIONS.reduce((a, r) => a + r.totalSchools, 0);
  const totalAvailable = REGIONS.reduce((a, r) => a + (r.totalCapacity - r.enrolled), 0);
  const totalCapacity = REGIONS.reduce((a, r) => a + r.totalCapacity, 0);
  const avgOcc = Math.round((REGIONS.reduce((a, r) => a + r.enrolled, 0) / totalCapacity) * 100);
  const { ids } = useFavorites();
  const favSchools = SCHOOLS.filter((s) => ids.includes(s.id)).slice(0, 3);
  const featured = SCHOOLS.slice(0, 3);

  return (
    <AppShell>
      {/* Hero */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-background">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">EduSpace Namibia</p>
              <p className="font-display text-sm font-semibold">Ministry of Education</p>
            </div>
          </div>
          <Link to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-full glass">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-success ring-2 ring-background" />
          </Link>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6 text-balance font-display text-[34px] font-bold leading-[1.05]">
          Good morning.<br />
          <span className="text-muted-foreground">Find placement across Namibia.</span>
        </motion.h1>
      </header>

      {/* Search */}
      <Link to="/search" className="group flex items-center gap-3 rounded-2xl glass px-4 py-3.5 shadow-[var(--shadow-card)] transition hover:scale-[1.005]">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search schools, towns, grades…</span>
        <span className="ml-auto rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">⌘K</span>
      </Link>

      {/* Stats */}
      <section className="mt-4 grid grid-cols-3 gap-2">
        <StatChip icon={Building2} value={totalSchools.toLocaleString()} label="Schools" />
        <StatChip icon={Users} value={`${(totalCapacity / 1000).toFixed(0)}k`} label="Capacity" />
        <StatChip icon={TrendingUp} value={`${totalAvailable.toLocaleString()}`} label="Spaces" />
      </section>

      {/* Regions */}
      <section className="mt-8">
        <SectionHeader title="All 14 Regions" hint={`Avg. occupancy ${avgOcc}%`} />
        <ul className="mt-3 space-y-2">
          {REGIONS.map((r, i) => {
            const available = r.totalCapacity - r.enrolled;
            const occ = Math.round((r.enrolled / r.totalCapacity) * 100);
            return (
              <motion.li key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}>
                <Link
                  to="/regions/$regionId"
                  params={{ regionId: r.id }}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
                >
                  <RegionGlyph color={r.color} letter={r.name[0]} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] font-semibold">{r.name} Region</p>
                    <p className="truncate text-xs text-muted-foreground">{r.totalSchools} schools · {r.capital}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-display text-sm font-bold tabular-nums" style={{ color: r.color }}>{available.toLocaleString()}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{occ}% full</p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* Featured */}
      <section className="mt-8">
        <SectionHeader title="Featured schools" hint="Editor's pick" />
        <div className="mt-3 -mx-5 overflow-x-auto px-5">
          <div className="flex gap-3 pb-2">
            {featured.map((s) => {
              const st = schoolStats(s);
              const region = REGIONS.find((r) => r.id === s.regionId)!;
              return (
                <Link key={s.id} to="/schools/$schoolId" params={{ schoolId: s.id }} className="w-64 shrink-0 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
                  <div className="relative h-24" style={{ background: `linear-gradient(135deg, ${region.color}, oklch(0.22 0.06 265))` }}>
                    <div className="absolute inset-0 opacity-40 gradient-mesh" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                      <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">{s.type}</span>
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-black">{st.available} spaces</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 font-display text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.town} · {region.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Favourites */}
      {favSchools.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Your favourites" hint={`${favSchools.length} saved`} />
          <ul className="mt-3 space-y-2">
            {favSchools.map((s) => {
              const st = schoolStats(s);
              return (
                <li key={s.id}>
                  <Link to="/schools/$schoolId" params={{ schoolId: s.id }} className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)]">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-success/10 text-success"><Building2 className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.town} · {st.available} spaces</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Announcements */}
      <section className="mt-8">
        <SectionHeader title="Latest announcements" hint="Ministry" />
        <ul className="mt-3 space-y-2">
          {ANNOUNCEMENTS.map((a) => (
            <li key={a.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">{a.tag}</div>
              <p className="font-display text-sm font-semibold">{a.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function StatChip({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <p className="mt-2 font-display text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}
