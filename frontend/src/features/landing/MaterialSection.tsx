/** Where the material comes from - brand.md, Abschnitt 5. */
const SOURCES = [
  'Theater & Veranstaltungstechnik',
  'Segelmacher & Bootsbauer',
  'Handwerksbetriebe',
  'Wohnungsauflösungen & Haushalte',
  'Betriebe im Wandel',
  'Fahrradwerkstätten',
  'Privatspenden',
];

export function MaterialSection() {
  return (
    <section id="material" className="scroll-mt-20 bg-stone-900 py-24 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brass uppercase">Material</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
            Sie haben Material für uns?
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone-300">
            <p>
              Werkstattauflösung, Restposten, ein Dachboden voller Stoff, drei Kisten altes
              Besteck – schreiben Sie uns, was da ist. Am besten mit Fotos und einer Angabe zur
              Menge.
            </p>
            <p className="text-base text-stone-400">
              Wir nehmen nicht alles. Es muss substanziell sein, sauber verarbeitbar und in Menge
              da – sonst holen wir nur Arbeit ab. Eine ehrliche Absage ist schneller als ein
              Container.
            </p>
          </div>

          <a
            href="mailto:material@zweite-chance.example"
            className="mt-8 inline-block rounded-lg bg-rust px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
          >
            Material anbieten
          </a>
        </div>

        <div className="lg:pt-16">
          <p className="text-sm font-medium text-white">Woher unser Material kommt</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SOURCES.map((source) => (
              <li
                key={source}
                className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brass" />
                {source}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-stone-500">
            Über Privatspenden kommen die meisten Überraschungen.
          </p>
        </div>
      </div>
    </section>
  );
}
