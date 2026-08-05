const VALUES = [
  {
    title: 'Nichts ist Müll, was noch Material ist',
    text: 'Wir suchen zuerst das Material und dann das Produkt. Was uns erreicht, bestimmt, was wir bauen – nicht andersherum.',
  },
  {
    title: 'Benutzen ist die beste Wertschätzung',
    text: 'Unsere Sachen sind keine Deko fürs Regal. Sie sollen Kratzer bekommen, weil sie täglich in Gebrauch sind.',
  },
  {
    title: 'Herkunft gehört dazu',
    text: 'An jedem Stück steht, woraus es war. Das ist keine Randnotiz, das ist der halbe Grund, warum man es kauft.',
  },
];

export function AboutSection() {
  return (
    <section id="ueber-uns" className="scroll-mt-20 bg-stone-50 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-rust uppercase">Über uns</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-stone-900 md:text-4xl">
            Sechs Leute, ein Hinterhof, viel zu viel Material
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone-600">
            <p>
              Angefangen hat es 2019 mit einem Berg Bühnenmaterial. Ein Leipziger Theater löste
              sein Lager auf – Vorhangstoff, Kulissenholz, Scheinwerferblenden – und zwei von uns
              fuhren mit einem geliehenen Transporter hin, weil es zu schade war für die Presse.
            </p>
            <p>
              Aus den ersten Vorhängen wurden Taschen, aus den Kulissenbrettern die Werkbank, auf
              der wir heute noch arbeiten. Inzwischen sind wir zwei Tischler, eine Schneiderin,
              eine Goldschmiedin, ein Metaller und eine Person für Laden und Versand.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border-l-4 border-brass bg-white p-6 shadow-sm">
            <p className="text-stone-700 italic">
              „Am schönsten ist der Moment, wenn jemand eine Tasche zurückbringt, weil der
              Reißverschluss hin ist. Dann war sie im Gebrauch – und das war der Plan.“
            </p>
            <p className="mt-3 text-sm text-stone-500">— Nadja Ehlert, Gründerin</p>
          </div>
        </div>

        <dl className="space-y-8 lg:pt-20">
          {VALUES.map((value) => (
            <div key={value.title} className="border-l border-stone-200 pl-6">
              <dt className="font-display text-lg font-semibold text-stone-900">{value.title}</dt>
              <dd className="mt-2 leading-relaxed text-stone-600">{value.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
