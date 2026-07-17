export function RegionGlyph({ color, letter }: { color: string; letter: string }) {
  return (
    <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl overflow-hidden" style={{ background: `color-mix(in oklab, ${color} 20%, transparent)` }}>
      <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(120% 80% at 30% 20%, ${color} 0%, transparent 60%)` }} />
      <span className="relative font-display text-lg font-bold" style={{ color }}>{letter}</span>
    </div>
  );
}
