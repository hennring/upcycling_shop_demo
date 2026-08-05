import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-sm tracking-widest text-rust uppercase">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-stone-900">
        Diese Seite ist nicht mehr da
      </h1>
      <p className="mt-4 text-stone-600">
        Kommt vor: Was durch ist, ist durch. Vielleicht ist der Bereich aber auch einfach noch im
        Aufbau.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-rust px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-dark"
      >
        Zurück zur Werkstatt
      </Link>
    </div>
  );
}
