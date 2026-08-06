import { Link } from 'react-router-dom';

/** Shown at /admin for an authenticated non-admin - no redirect, so the denial is honest. */
export function AdminForbiddenPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Kein Zugriff</h1>
      <p className="mt-4 text-stone-600">
        Dieser Bereich ist der Verwaltung vorbehalten. Ihr Konto hat dafür keine Berechtigung.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
