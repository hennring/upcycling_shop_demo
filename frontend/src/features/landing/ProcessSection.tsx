/** The four steps from brand.md, Abschnitt 4. */
const STEPS = [
  {
    title: 'Ankommen',
    text: 'Material erreicht uns per Spende, Abholung oder Kooperation. Wir nehmen nicht alles – es muss substanziell sein, sauber verarbeitbar und in Menge da.',
  },
  {
    title: 'Sortieren & verstehen',
    text: 'Was ist das für ein Holz, wie reißfest ist der Stoff, was hält Gewicht? Manches wandert ins Regal und wartet Monate auf seine Idee.',
  },
  {
    title: 'Entwerfen an der Sache',
    text: 'Wir entwerfen nicht am Papier, sondern am Material. Der Zuschnitt eines alten Segels entscheidet, was daraus wird.',
  },
  {
    title: 'Fertigen in kleinen Mengen',
    text: 'Was reicht, reicht. Ist die Charge durch, ist das Produkt weg. Nachbestellen geht nicht, und das ist ehrlich so gemeint.',
  },
];

export function ProcessSection() {
  return (
    <section id="werkstatt" className="scroll-mt-20 bg-stone-100 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold tracking-widest text-rust uppercase">Werkstatt</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-stone-900 md:text-4xl">
          Zuerst das Material, dann das Produkt
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-stone-600">
          Umgekehrt funktioniert es nicht. Wir setzen uns nie ein Produkt in den Kopf und suchen
          dann Material dafür.
        </p>

        <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t-2 border-stone-300 pt-6">
              <span className="font-mono text-sm text-rust">0{index + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-stone-900">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-stone-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
