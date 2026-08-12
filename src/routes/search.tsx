import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon, ArrowLeft, X, Building2, Check } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { REGIONS, GRADES, FIELDS, SCHOOL_INDEX, type SchoolIndexEntry } from "@/lib/data";
import { useState, useMemo, useDeferredValue, useCallback, memo, useEffect } from "react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search schools — EduSpace Namibia" },
      { name: "description", content: "Instantly search Namibian schools and filter by region, grade and field of study to find open placements." },
      { property: "og:title", content: "Search schools — EduSpace Namibia" },
      { property: "og:description", content: "Filter Namibian schools by region, grade and field of study to find open placements." },
    ],
  }),
  component: SearchPage,
});

const PAGE_SIZE = 12;

function SearchPage() {
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("");
  const [region, setRegion] = useState("");
  const [field, setField] = useState("");
  const [availOnly, setAvailOnly] = useState(false);
  const [page, setPage] = useState(1);

  const dq = useDeferredValue(q);
  const needle = dq.trim().toLowerCase();
  const hasFilters = Boolean(needle || grade || region || field || availOnly);

  const results = useMemo(() => {
    if (!hasFilters) return [];
    const out: SchoolIndexEntry[] = [];
    for (const e of SCHOOL_INDEX) {
      if (region && e.regionId !== region) continue;
      if (needle && !e.text.includes(needle)) continue;
      if (grade && (e.gradeOpen[grade] ?? 0) <= 0) continue;
      if (field && !e.fields.has(field)) continue;
      if (availOnly && e.available <= 0) continue;
      out.push(e);
    }
    return out;
  }, [needle, grade, region, field, availOnly, hasFilters]);

  useEffect(() => { setPage(1); }, [needle, grade, region, field, availOnly]);

  const visible = results.slice(0, page * PAGE_SIZE);
  const clearAll = useCallback(() => {
    setQ(""); setGrade(""); setRegion(""); setField(""); setAvailOnly(false);
  }, []);

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Link to="/" preload="intent" className="grid h-10 w-10 place-items-center rounded-full glass"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-base font-semibold">Search schools</h1>
        <div className="w-10" />
      </div>

      <div className="flex items-center gap-3 rounded-2xl glass px-4 py-3.5 shadow-[var(--shadow-card)]">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="School, town, or region"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          enterKeyHint="search"
          autoComplete="off"
        />
        {q && <button aria-label="Clear search" onClick={() => setQ("")} className="text-muted-foreground"><X className="h-4 w-4" /></button>}
      </div>

      {/* Filter chips */}
      <ChipRow label="Region" value={region} onChange={setRegion} options={REGIONS.map((r) => ({ value: r.id, label: r.name }))} />
      <ChipRow label="Grade" value={grade} onChange={setGrade} options={GRADES.map((g) => ({ value: g, label: g.replace("Grade ", "Gr ") }))} />
      <ChipRow label="Field of study" value={field} onChange={setField} options={FIELDS.map((f) => ({ value: f, label: f }))} />

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setAvailOnly((v) => !v)}
          aria-pressed={availOnly}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${availOnly ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}
        >
          {availOnly && <Check className="mr-1 inline h-3 w-3" />}Available only
        </button>
        {hasFilters && (
          <button onClick={clearAll} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">Clear all</button>
        )}
      </div>

      {/* Results */}
      <div className="mt-5">
        {!hasFilters ? (
          <p className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground">
            Start typing or pick a filter to see schools instantly.
          </p>
        ) : (
          <>
            <p className="mb-2 text-xs text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
              {results.length > visible.length ? ` · showing ${visible.length}` : ""}
            </p>
            <ul className="space-y-2">
              {visible.map((e) => <ResultRow key={e.school.id} entry={e} />)}
            </ul>
            {results.length === 0 && (
              <p className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground">No matches. Try different filters.</p>
            )}
            {visible.length < results.length && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-[var(--shadow-card)]"
              >
                Load {Math.min(PAGE_SIZE, results.length - visible.length)} more
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

const ResultRow = memo(function ResultRow({ entry }: { entry: SchoolIndexEntry }) {
  const s = entry.school;
  return (
    <li>
      <Link
        to="/schools/$schoolId"
        params={{ schoolId: s.id }}
        preload="intent"
        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[var(--shadow-card)]"
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${entry.regionColor} 15%, transparent)`, color: entry.regionColor }}>
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{s.name}</p>
          <p className="truncate text-xs text-muted-foreground">{entry.regionName} · {s.town} · {s.type}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold tabular-nums text-success">{entry.available}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">spaces</p>
        </div>
      </Link>
    </li>
  );
});

const ChipRow = memo(function ChipRow({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(active ? "" : o.value)}
              aria-pressed={active}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
