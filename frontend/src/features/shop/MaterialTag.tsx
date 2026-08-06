/**
 * The "Materialzettel" from brand.md, Abschnitt 9: a small label that says what the thing
 * used to be, before the page says what it costs.
 */
export function MaterialTag({ material }: { material: string | null }) {
  if (!material) {
    return null;
  }

  return (
    <p className="inline-flex items-center gap-2 rounded-md border border-brass/50 bg-brass/10 px-2 py-1 font-mono text-xs text-stone-700">
      <span className="tracking-wider text-stone-500 uppercase">War mal</span>
      {material}
    </p>
  );
}
