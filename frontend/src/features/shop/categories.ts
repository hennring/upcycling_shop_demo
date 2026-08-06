import type { ProductCategory } from '../../api/contracts';

/**
 * German labels and the order from brand.md, Abschnitt 6 - the backend only knows the
 * keys. The array order is the display order of the filter and of the overview groups;
 * alphabetical sorting would put "Möbel" behind "Mode".
 */
export const CATEGORIES: { key: ProductCategory; label: string }[] = [
  { key: 'MOEBEL', label: 'Möbel' },
  { key: 'EINRICHTUNG', label: 'Einrichtung' },
  { key: 'MODE', label: 'Mode & Taschen' },
  { key: 'SCHMUCK', label: 'Schmuck' },
  { key: 'KLEINZEUG', label: 'Nützliches Kleinzeug' },
];

const LABELS = new Map(CATEGORIES.map(({ key, label }) => [key, label]));

export function categoryLabel(category: ProductCategory): string {
  return LABELS.get(category) ?? category;
}

/** URL form of a category, so /shop?kategorie=moebel stays shareable. */
export function categorySlug(category: ProductCategory): string {
  return category.toLowerCase();
}

export function categoryFromSlug(slug: string | null): ProductCategory | null {
  if (!slug) {
    return null;
  }
  const match = CATEGORIES.find((entry) => categorySlug(entry.key) === slug.toLowerCase());
  return match?.key ?? null;
}
