import type { Category, ProductCategory } from '../../api/contracts';

/** URL form of a category, so /shop?kategorie=moebel stays shareable. */
export function categorySlug(category: ProductCategory): string {
  return category.toLowerCase();
}

/** An unknown slug (or one from a category the backend didn't return) falls back to "all". */
export function categoryFromSlug(slug: string | null, categories: Category[]): ProductCategory | null {
  if (!slug) {
    return null;
  }
  const match = categories.find((entry) => categorySlug(entry.key) === slug.toLowerCase());
  return match?.key ?? null;
}
