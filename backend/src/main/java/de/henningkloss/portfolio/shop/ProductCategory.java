package de.henningkloss.portfolio.shop;

/**
 * The five product categories from brand.md, Abschnitt 6. Deliberately broad, because
 * the incoming material decides what gets built. Stored as a string, not an ordinal, so
 * adding or reordering constants never rewrites existing rows.
 *
 * <p>German labels stay in the frontend - the backend only ships the key.</p>
 */
public enum ProductCategory {

    MOEBEL,
    EINRICHTUNG,
    MODE,
    SCHMUCK,
    KLEINZEUG
}
