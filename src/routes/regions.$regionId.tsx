import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MapPin, Building2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { RegionGlyph } from "@/components/app/RegionGlyph";
import { getRegion, schoolsByRegion, schoolStats, REGIONS } from "@/lib/data";
import { useState } from "react";

export const Route = createFileRoute("/regions/$regionId")({
  component: RegionPage,
  loader: ({ params }) => {
    const region = getRegion(params.regionId);
    if (!region) throw notFound();
    return { region };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Region not found</div>,
});

function RegionPage() {
  const { region } = Route.useLoaderData();
  const schools = schoolsByRegion(region.id);
  const available = region.totalCapacity - region.enrolled;
  const occ = Math.round((region.enrolled / region.totalCapacity) * 100);
  const [q, setQ] = useState("");
  const filtered = schools.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <span className="text-xs text-muted-foreground">Region</span>
        <div className="w-10" />
      </div>

      <div className="flex items-center gap-3">
        <RegionGlyph color={region.color} letter={region.name[0]} />
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">{region.name} Region</h1>
          <p className="text-xs text-muted-foreground">{region.totalSchools} schools · {available.toLocaleString()} spaces</p>
        </div>
      </div>

      {/* Hero illustration */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-5 h-40 overflow-hidden rounded-3xl"
        style={{ background: `linear-gradient(135deg, ${region.color}, oklch(0.22 0.06 265))` }}
      >
        <div className="absolute inset-0 opacity-70 gradient-mesh" />
        <svg viewBox="0 0 400 160" className="absolute inset-x-0 bottom-0 w-full">
          <path d="M0 130 Q100 90 200 110 T400 100 V160 H0 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M0 140 Q120 110 220 125 T400 130 V160 H0 Z" fill="rgba(255,255,255,0.25)" />
          <rect x="170" y="80" width="60" height="45" fill="white" opacity="0.9" rx="4"/>
          <polygon points="170,80 200,60 230,80" fill="white" opacity="0.95" />
          <rect x="195" y="100" width="10" height="25" fill={region.color} />
          <line x1="200" y1="55" x2="200" y2="45" stroke="white" strokeWidth="2" />
          <rect x="200" y="42" width="12" height="8" fill="white" />
        </svg>
        <div className="absolute left-5 top-5">
          <p className="text-[10px] uppercase tracking-widest text-white/70">Capital</p>
          <p className="font-display text-lg font-bold text-white">{region.capital}</p>
        </div>
      </motion.div>

      {/* Statistics grid */}
      <section className="mt-5 grid grid-cols-2 gap-2">
        <StatBox label="Total schools" value={region.totalSchools} />
        <StatBox label="Total capacity" value={region.totalCapacity.toLocaleString()} />
        <StatBox label="Enrolled learners" value={region.enrolled.toLocaleString()} />
        <StatBox label="Available spaces" value={available.toLocaleString()} accent />
        <StatBox label="Government" value={region.governmentSchools} />
        <StatBox label="Private" value={region.privateSchools} />
        <StatBox label="Primary / Secondary / Combined" value={`${region.primarySchools} / ${region.secondarySchools} / ${region.combinedSchools}`} full />
        <StatBox label="Occupancy" value={`${occ}%`} full />
      </section>

      {/* Search */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl glass px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search schools in this region" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>

      {/* Schools */}
      <section className="mt-4">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="font-display text-base font-bold">Schools</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} results</span>
        </div>
        <ul className="space-y-2">
          {filtered.map((s) => {
            const st = schoolStats(s);
            return (
              <li key={s.id}>
                <Link to="/schools/$schoolId" params={{ schoolId: s.id }} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)]">
                  <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${region.color} 15%, transparent)`, color: region.color }}>
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" />{s.town} · {s.type} · {s.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold tabular-nums text-success">{st.available}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">spaces</p>
                  </div>
                </Link>
              </li>
            );
          })}
          {filtered.length === 0 && <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground">No schools match your search.</p>}
        </ul>
      </section>
    </AppShell>
  );
}

function StatBox({ label, value, accent, full }: { label: string; value: string | number; accent?: boolean; full?: boolean }) {
  return (
    <div className={`rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] ${full ? "col-span-2" : ""}`}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-xl font-bold tabular-nums ${accent ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}

// static list generation
void REGIONS;
