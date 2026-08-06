import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/#produkte', label: 'Produkte' },
  { href: '/#werkstatt', label: 'Werkstatt' },
  { href: '/#ueber-uns', label: 'Über uns' },
  { href: '/#werkstattbuch', label: 'Werkstattbuch' },
  { href: '/#werkstattbrief', label: 'Werkstattbrief abonnieren' },
];

const MATERIAL = [
  { href: '/#material', label: 'Material spenden' },
  { href: '/#material', label: 'Woher unser Material kommt' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-800 bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-sm">
            <Link to="/">
              <BrandMark size="sm" tone="paper" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              Werkstatt im Leipziger Osten. Wir machen aus Material, das schon ein Leben hinter
              sich hat, Dinge, die man wieder täglich benutzt.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white">Manufaktur</span>
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-stone-400 transition-colors hover:text-brass"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-white">Material</span>
            {MATERIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-stone-400 transition-colors hover:text-brass"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-12 border-t border-stone-800 pt-6 text-xs text-stone-500">
          © 2026 Zweite Chance · Demo-Inhalte eines Portfolio-Projekts, kein echtes Unternehmen.
        </p>
      </div>
    </footer>
  );
}
