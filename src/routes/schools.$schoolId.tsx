import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, MapPin, Mail, Phone, Globe, Navigation, GraduationCap, BookOpen, Trophy, Building2, Calendar } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { AvailabilityRing } from "@/components/app/AvailabilityRing";
import { getSchool, getRegion, schoolStats, type School, type GradeAvailability } from "@/lib/data";
import { useFavorites } from "@/lib/favorites";
import { useState } from "react";

export const Route = createFileRoute("/schools/$schoolId")({
  component: SchoolPage,
  loader: ({ params }) => {
    const school = getSchool(params.schoolId);
    if (!school) throw notFound();
    return { school };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">School not found</div>,
});

const TABS = ["Availability", "Overview", "Programs", "Contact"] as const;

function SchoolPage() {
  const { school } = Route.useLoaderData();
  const region = getRegion(school.regionId)!;
  const st = schoolStats(school);
  const availPct = Math.round(((st.capacity - st.enrolled) / st.capacity) * 100);
  const { has, toggle } = useFavorites();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Availability");

  return (
    <AppShell>
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <Link to="/regions/$regionId" params={{ regionId: region.id }} className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="flex items-center gap-2">
          <button onClick={() => toggle(school.id)} className="grid h-10 w-10 place-items-center rounded-full glass">
            <Heart className={`h-4 w-4 ${has(school.id) ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full glass"><Share2 className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-card)]" style={{ background: `linear-gradient(135deg, ${region.color}, oklch(0.22 0.06 265))` }}>
        <div className="absolute inset-0 opacity-60 gradient-mesh" />
        <div className="relative p-5 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/70">{region.name} Region</p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-white text-balance">{school.name}</h1>
          <p className="mt-2 text-sm text-white/80">{school.town} · {school.type} · {school.level}{school.boarding ? " · Hostel" : ""}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{school.language}</Badge>
            <Badge>Est. {school.established}</Badge>
            {school.boarding && <Badge>Boarding</Badge>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 rounded-full bg-muted p-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="relative flex-1 rounded-full px-3 py-2 text-xs font-medium">
            {tab === t && <motion.span layoutId="school-tab" className="absolute inset-0 rounded-full bg-background shadow-[var(--shadow-card)]" transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} />}
            <span className={`relative z-10 ${tab === t ? "text-foreground" : "text-muted-foreground"}`}>{t}</span>
          </button>
        ))}
      </div>

      {tab === "Availability" && (
        <section className="mt-5 space-y-5">
          <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="font-display text-sm font-semibold">Overall availability</p>
            <div className="mt-3 flex items-center gap-5">
              <AvailabilityRing available={availPct} />
              <div className="flex-1 space-y-3">
                <RowStat label="Total capacity" value={st.capacity.toLocaleString()} />
                <RowStat label="Enrolled" value={st.enrolled.toLocaleString()} />
                <RowStat label="Available" value={st.available.toLocaleString()} color="text-success" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="mb-3 font-display text-sm font-semibold">Availability by grade</p>
            <ul className="space-y-3">
              {school.grades.map((g: GradeAvailability, i: number) => {
                const av = g.capacity - g.enrolled;
                const pct = Math.round((g.enrolled / g.capacity) * 100);
                const status = pct < 70 ? "success" : pct < 90 ? "warning" : "destructive";
                const color = status === "success" ? "var(--success)" : status === "warning" ? "var(--warning)" : "var(--destructive)";
                return (
                  <li key={g.grade}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{g.grade}</span>
                      <span className="tabular-nums text-muted-foreground">{av} space{av === 1 ? "" : "s"} · {g.classes} classes</span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                        style={{ background: color }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
              <LegendDot color="var(--success)" label="Available" />
              <LegendDot color="var(--warning)" label="Nearly full" />
              <LegendDot color="var(--destructive)" label="Full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-[var(--shadow-card)]">Save school</button>
            <button className="rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-[var(--shadow-float)]"><Navigation className="mr-1 inline h-4 w-4" /> Get directions</button>
          </div>
        </section>
      )}

      {tab === "Overview" && (
        <section className="mt-5 space-y-4">
          <Card title="About"><p className="text-sm leading-relaxed text-muted-foreground">{school.description}</p></Card>
          <Card title="Mission"><p className="text-sm text-muted-foreground">{school.mission}</p></Card>
          <Card title="Vision"><p className="text-sm text-muted-foreground">{school.vision}</p></Card>
          <Card title="Facilities" icon={Building2}>
            <div className="flex flex-wrap gap-2">
              {school.facilities.map((f: string) => <span key={f} className="rounded-full bg-muted px-3 py-1 text-xs">{f}</span>)}
            </div>
          </Card>
        </section>
      )}

      {tab === "Programs" && (
        <section className="mt-5 space-y-4">
          <Card title="Subjects offered" icon={BookOpen}>
            <div className="flex flex-wrap gap-2">
              {school.subjects.map((s: string) => <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs">{s}</span>)}
            </div>
          </Card>
          <Card title="Extracurricular" icon={Trophy}>
            <div className="flex flex-wrap gap-2">
              {school.extracurricular.map((s: string) => <span key={s} className="rounded-full bg-success/10 px-3 py-1 text-xs text-success">{s}</span>)}
            </div>
          </Card>
          <Card title="Admissions" icon={GraduationCap}>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> Applications open Jan 15 – Mar 31</li>
              <li>· Certified birth certificate</li>
              <li>· Latest report card</li>
              <li>· Proof of residence</li>
              <li>· Passport photo</li>
            </ul>
          </Card>
        </section>
      )}

      {tab === "Contact" && (
        <section className="mt-5 space-y-3">
          <ContactRow icon={Mail} label={school.email} />
          <ContactRow icon={Phone} label={school.phone} />
          <ContactRow icon={Globe} label={school.website} />
          <ContactRow icon={MapPin} label={school.address} />
          <div className="rounded-3xl bg-card p-3 shadow-[var(--shadow-card)]">
            <div className="relative h-40 overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${region.color}, oklch(0.22 0.06 265))` }}>
              <div className="absolute inset-0 gradient-mesh opacity-70" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur mx-auto"><MapPin className="h-4 w-4" /></div>
                <p className="mt-2 text-xs">{school.address}</p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">Principal: {school.principal}</p>
        </section>
      )}
    </AppShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">{children}</span>;
}
function RowStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-display font-bold tabular-nums ${color ?? ""}`}>{value}</span>
    </div>
  );
}
function LegendDot({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />{label}</span>;
}
function Card({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="mb-3 flex items-center gap-2 font-display text-sm font-semibold">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />} {title}
      </p>
      {children}
    </div>
  );
}
function ContactRow({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted"><Icon className="h-4 w-4" /></div>
      <span className="min-w-0 truncate text-sm">{label}</span>
    </div>
  );
}
