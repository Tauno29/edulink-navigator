import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, ArrowLeft, X, SlidersHorizontal, Building2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SCHOOLS, REGIONS, schoolStats } from "@/lib/data";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/search")({ component: SearchPage });

const POPULAR = ["Windhoek High School","Swakopmund Primary School","Hage Geingob Secondary","Walvis Bay Private School","Rehoboth Combined"];

function SearchPage() {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [type, setType] = useState<"" | "Government" | "Private">("");
  const [availOnly, setAvailOnly] = useState(false);

  const results = useMemo(() => {
    if (!q && !grade && !region && !type && !availOnly) return [];
    return SCHOOLS.filter((s) => {
      if (q && !`${s.name} ${s.town}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (region && s.regionId !== region) return false;
      if (type && s.type !== type) return false;
      if (grade) {
        const g = s.grades.find((x) => x.grade === grade);
        if (!g || g.capacity - g.enrolled <= 0) return false;
      }
      if (availOnly) {
        const st = schoolStats(s);
        if (st.available <= 0) return false;
      }
      return true;
    }).slice(0, 40);
  }, [q, grade, region, type, availOnly]);

  const showPopular = !q && !grade && !region && !type && !availOnly;

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Search schools</h1>
        <div className="w-10" />
      </div>

      <div className="flex items-center gap-3 rounded-2xl glass px-4 py-3.5 shadow-[var(--shadow-card)]">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="School, town, or region" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        {q && <button onClick={() => setQ("")} className="text-muted-foreground"><X className="h-4 w-4" /></button>}
      </div>

      {/* Filters */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <Select value={grade} onChange={setGrade} placeholder="Any grade" options={["Pre-Primary", ...Array.from({length:12}, (_,i)=>`Grade ${i+1}`)]} />
        <Select value={region} onChange={setRegion} placeholder="Any region" options={REGIONS.map(r => ({ value: r.id, label: r.name }))} />
        <Select value={type} onChange={(v)=>setType(v as any)} placeholder="Any type" options={["Government","Private"]} />
        <button onClick={() => setAvailOnly(v => !v)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${availOnly ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>Available only</button>
      </div>

      {/* Results */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          {showPopular ? (
            <motion.div key="popular" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Popular schools</p>
              <ul className="space-y-2">
                {POPULAR.map((name) => {
                  const s = SCHOOLS.find((x) => x.name === name);
                  if (!s) return null;
                  return (
                    <li key={s.id}>
                      <Link to="/schools/$schoolId" params={{ schoolId: s.id }} className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)]">
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{s.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-2 text-xs text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"}</p>
              <ul className="space-y-2">
                {results.map((s) => {
                  const r = REGIONS.find((r) => r.id === s.regionId)!;
                  const st = schoolStats(s);
                  return (
                    <li key={s.id}>
                      <Link to="/schools/$schoolId" params={{ schoolId: s.id }} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)]">
                        <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${r.color} 15%, transparent)`, color: r.color }}><Building2 className="h-4 w-4" /></div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{s.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.name} · {s.town} · {s.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold tabular-nums text-success">{st.available}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">spaces</p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
                {results.length === 0 && <p className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground">No matches. Try different filters.</p>}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

function Select({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: (string | { value: string; label: string })[] }) {
  return (
    <div className="relative shrink-0">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="cursor-pointer appearance-none rounded-full bg-muted px-3 py-1.5 pr-7 text-xs font-medium text-foreground outline-none">
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">▾</span>
    </div>
  );
}
