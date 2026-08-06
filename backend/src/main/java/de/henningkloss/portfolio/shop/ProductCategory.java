package de.henningkloss.portfolio.shop;

import lombok.Getter;

/**
 * The five product categories from brand.md, Abschnitt 6. Deliberately broad, because
 * the incoming material decides what gets built. Stored as a string, not an ordinal, so
 * adding or reordering constants never rewrites existing rows.
 *
 * <p>Title, description and material are the fixed copy from brand.md; the price range is
 * not part of this enum because it depends on the current catalogue, not on the category
 * itself - see {@link CategoryService}.</p>
 */
@Getter
public enum ProductCategory {

    MOEBEL(
            "Möbel",
            "Hocker, Regale, Beistelltische, Sitzbänke. Aus Kulissenholz und Restholz vom "
                    + "Tischler, geölt statt lackiert.",
            "Kulissenholz · Restholz · Bauholz"
    ),
    EINRICHTUNG(
            "Einrichtung",
            "Lampen, Spiegelrahmen, Wandhaken, Körbe, Übertöpfe. Die Dinge, die eine Wohnung "
                    + "erst fertig machen.",
            "Blech · Emaille · Bühnenholz"
    ),
    MODE(
            "Mode & Taschen",
            "Umhängetaschen, Rucksäcke, Schürzen, Jacken. Bühnenstoff und Segeltuch halten mehr "
                    + "aus als die meisten Neuware.",
            "Theatervorhang · Segeltuch · Arbeitskleidung"
    ),
    SCHMUCK(
            "Schmuck",
            "Ringe und Ketten aus altem Besteck, Ohrringe aus Platinen und Fahrradspeichen. "
                    + "Getragen, nicht ausgestellt.",
            "Silberbesteck · Platinen · Speichen"
    ),
    KLEINZEUG(
            "Nützliches Kleinzeug",
            "Schlüsselanhänger, Spanngummis aus Fahrradschlauch, Flaschenöffner, Etuis, "
                    + "Stiftehalter. Kleine Sachen, die man verliert und nachkauft.",
            "Fahrradschlauch · Kette · Stoffreste"
    );

    private final String title;
    private final String description;
    private final String material;

    ProductCategory(String title, String description, String material) {
        this.title = title;
        this.description = description;
        this.material = material;
    }
}
