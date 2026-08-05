/** Placeholder figures - kept in sync with brand.md, Abschnitt 10. */
const FACTS = [
  { value: '14 t', label: 'Material bisher verarbeitet' },
  { value: '31', label: 'Quellen, die uns beliefern' },
  { value: '> 2.000', label: 'Stücke im Umlauf' },
  { value: '2019', label: 'seit diesem Jahr in der Werkstatt' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-900">
      {/* decorative background: rust glow with a brass counterpoint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-rust/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-brass/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs font-medium tracking-wide text-brass uppercase">
            Upcycling-Manufaktur aus Leipzig
          </span>

          <h1 className="mt-6 font-display text-4xl leading-tight font-semibold text-white md:text-5xl">
            Alten Dingen ein
            <span className="text-brass"> zweites Leben</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">
            Wir bekommen Material, das ausgemustert wurde – Bühnenstoff, Restholz, altes Besteck,
            Fahrradschläuche. Daraus machen wir Möbel, Taschen, Schmuck und Kleinzeug, das man
            wieder täglich benutzt. Nicht schonen. Benutzen.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#produkte"
              className="rounded-lg bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
            >
              Produkte ansehen
            </a>
            <a
              href="#material"
              className="rounded-lg border border-stone-600 px-6 py-3 text-sm font-medium text-stone-200 transition-colors hover:border-stone-400 hover:text-white"
            >
              Material spenden
            </a>
          </div>
        </div>

        {/* stand-in for a real workshop photo: four facts that carry the same weight visually */}
        <dl className="grid gap-4 sm:grid-cols-2 lg:justify-self-end">
          {FACTS.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <dt className="font-display text-2xl font-semibold text-white">{fact.value}</dt>
              <dd className="mt-1 text-sm text-stone-400">{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
