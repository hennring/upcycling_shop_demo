package de.henningkloss.portfolio.shop.config;

import de.henningkloss.portfolio.common.Slugs;
import de.henningkloss.portfolio.shop.Product;
import de.henningkloss.portfolio.shop.ProductCategory;
import de.henningkloss.portfolio.shop.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds a demo catalogue so the shop has products before the admin CRUD (phase 5) exists.
 * Same rules as {@link de.henningkloss.portfolio.blog.config.BlogArticleFixture}: only with
 * {@code app.fixtures.enabled=true} (local profile and docker-compose) and only while the
 * table is still empty, so it never fights with products created through the admin API.
 *
 * <p>Every description follows the product-text rule from brand.md, Abschnitt 6: first what
 * it is made of, then what it is for. The third part - how many there are - is the
 * {@code stock} field, not prose, so the cart can enforce it. Prices stay inside the ranges
 * of the five categories.</p>
 *
 * <p>The last two entries have {@code stock = 0}: "vergriffen" is a normal state for a
 * workshop that builds what the material allows. They stay visible in the catalogue and
 * cannot be added to a cart.</p>
 */
@Component
@ConditionalOnProperty(name = "app.fixtures.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class ProductFixture implements ApplicationRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (productRepository.count() > 0) {
            log.info("Products already present - skipping fixture");
            return;
        }

        List<Product> products = List.of(
                product("Hocker Kulisse", ProductCategory.MOEBEL, "Kulissenholz · Bühnenbrett", "129.00", 6,
                        """
                        Gebaut aus Kulissenholz eines Leipziger Theaterhauses - 24 mm Sperrholz, auf der \
                        Unterseite steht noch die Kulissennummer.

                        Sitzhöhe 45 cm, hält ohne Nachdenken einen Erwachsenen, funktioniert genauso als \
                        Beistelltisch oder Blumenbank. Geölt statt lackiert, deshalb darf man ihn nass \
                        abwischen und muss ihn nicht schonen.
                        """),
                product("Regal Werkbank", ProductCategory.MOEBEL, "Restholz Tischlerei · Winkeleisen", "340.00", 2,
                        """
                        Restholz aus einer Tischlerei in Plagwitz, dazu Winkeleisen aus einer aufgelösten \
                        Werkstatt. Die Bretter sind unterschiedlich gewachsen, das sieht man an den Kanten.

                        Vier Ebenen, 180 cm hoch, tief genug für Ordner und Werkzeugkisten. Steht frei oder \
                        gegen die Wand geschraubt. Danach ist das Holz aus dieser Lieferung verbaut.
                        """),
                product("Beistelltisch Trommel", ProductCategory.MOEBEL, "Waschtrommel · Eichenrest", "185.00", 3,
                        """
                        Die Trommel einer ausgedienten Industriewaschmaschine, innen entrostet und klar \
                        lackiert, mit einer Platte aus Eichenrest darauf.

                        Als Beistelltisch neben dem Sofa gedacht; die Löcher lassen Licht durch, wenn man \
                        eine Lampe hineinstellt. Schwer genug, dass nichts wackelt.
                        """),
                product("Wandhaken Besteck", ProductCategory.EINRICHTUNG, "Silberbesteck · Eichenleiste", "38.00", 14,
                        """
                        Alte Gabeln aus Haushaltsauflösungen, kalt gebogen und auf eine Eichenleiste \
                        geschraubt. Kein Bauteil ist zweimal gleich.

                        Für Jacken, Schlüssel, Geschirrtücher - die Zinken halten mehr aus, als man ihnen \
                        ansieht. Leiste mit vier Haken, Bohrlöcher vorgebohrt.
                        """),
                product("Lampe Emaille", ProductCategory.EINRICHTUNG, "Emailleschirm · Textilkabel", "89.00", 5,
                        """
                        Emaillierter Werkstattschirm aus einer Halle in Engelsdorf, innen weiß, außen mit \
                        den Kratzern von vierzig Jahren. Neue Fassung, neues Textilkabel, geprüft.

                        Hängt über Küchentisch oder Werkbank und macht ein hartes, gerichtetes Licht - \
                        keine Stimmungsbeleuchtung. Jeder Schirm ist anders vernarbt.
                        """),
                product("Spiegelrahmen Bühne", ProductCategory.EINRICHTUNG, "Bühnenholz · Spiegelglas", "72.00", 7,
                        """
                        Rahmen aus Bühnenholz, Spiegelglas neu geschnitten, weil altes Glas fast immer \
                        blind ist.

                        60 x 45 cm, für Flur oder Bad, mit zwei Aufhängern auf der Rückseite. Die Farbreste \
                        auf dem Holz bleiben drauf.
                        """),
                product("Umhängetasche Vorhang", ProductCategory.MODE, "Theatervorhang · Segeltuch", "119.00", 12,
                        """
                        Schwerer roter Samt aus einem aufgelösten Bühnenfundus, Boden und Träger aus \
                        Segeltuch, damit die Tasche steht und sich nicht durchscheuert.

                        Passt für Laptop, Buch und Einkauf; ein Innenfach mit Reißverschluss. Der Samt \
                        nimmt Gebrauchsspuren an, das gehört dazu.
                        """),
                product("Schürze Segel", ProductCategory.MODE, "Segeltuch · Gurtband", "68.00", 9,
                        """
                        Segeltuch von einem Segelmacher in Rostock, Nackenband aus Gurtband einer \
                        Sicherheitsausrüstung.

                        Werkstattschürze in Latzform, zwei tiefe Taschen, knielang. Wasser perlt ab, \
                        Sägestaub klopft man raus. Waschbar bei 40 Grad.
                        """),
                product("Rucksack Fundus", ProductCategory.MODE, "Bühnenstoff · Fahrradschlauch", "138.00", 4,
                        """
                        Bühnenstoff außen, Fahrradschlauch als Kantenschutz und Zugband - beides bekommen \
                        wir regelmäßig, deshalb gibt es den Rucksack als kleine Serie.

                        Rolltop, etwa 22 Liter, gepolsterter Rücken. Für den Weg zur Arbeit und für \
                        Wochenendgepäck.
                        """),
                product("Ring Löffelstiel", ProductCategory.SCHMUCK, "Silberbesteck", "42.00", 18,
                        """
                        Aus dem Stiel eines versilberten Löffels gebogen und poliert; das Muster am Stielende \
                        bleibt sichtbar und sitzt oben auf dem Ring.

                        Alltagsschmuck, kein Schmuckkästchenstück - Silber läuft nach und das darf es. \
                        Größen 52 bis 60 auf Anfrage anpassbar.
                        """),
                product("Ohrringe Platine", ProductCategory.SCHMUCK, "Leiterplatte · Edelstahlhaken", "24.00", 30,
                        """
                        Grüne Leiterplatten aus ausgemusterter Bürotechnik, in Tropfenform geschnitten und \
                        an nickelfreien Edelstahlhaken.

                        Leicht genug für den ganzen Tag; jedes Paar hat eine andere Leiterbahnzeichnung.
                        """),
                product("Kette Speiche", ProductCategory.SCHMUCK, "Fahrradspeiche · Edelstahl", "35.00", 22,
                        """
                        Speichen aus drei Fahrradwerkstätten im Viertel, zu einem offenen Reif gebogen, \
                        Enden entgratet und poliert.

                        Liegt als Collier am Hals, kein Verschluss zum Fummeln. Verträgt Regen und \
                        Schweiß.
                        """),
                product("Spanngummi Schlauch", ProductCategory.KLEINZEUG, "Fahrradschlauch", "9.00", 99,
                        """
                        Aus Flickresten von drei Fahrradwerkstätten geschnitten - reißfest, wasserdicht, \
                        und es kommt in einer Menge an, mit der man planen kann.

                        Hält Gepäck auf dem Träger, Kabel im Karton und Deckel auf Kisten. Vierer-Set in \
                        gemischten Längen.
                        """),
                product("Flaschenöffner Schlüssel", ProductCategory.KLEINZEUG, "Maulschlüssel", "16.00", 26,
                        """
                        Ein alter Maulschlüssel aus einer Werkstattauflösung, am Maul ausgefräst und \
                        geschliffen.

                        Öffnet Kronkorken und liegt dabei schwer in der Hand. Passt an keinen \
                        Schlüsselbund - das ist ein Schubladenwerkzeug.
                        """),
                product("Stiftehalter Emaille", ProductCategory.KLEINZEUG, "Emailletasse · Filzrest", "14.00", 19,
                        """
                        Emailletassen mit abgeplatztem Rand, für die niemand mehr Kaffee eingießen will, \
                        innen mit Filzrest ausgelegt.

                        Für Stifte, Pinsel und Schraubendreher auf dem Schreibtisch. Der abgeplatzte Rand \
                        bleibt, geschliffen ist er nur dort, wo er scharf war.
                        """),
                // vergriffen: stays in the catalogue, but no stock - so it cannot go into a cart
                product("Sitzbank Turnhalle", ProductCategory.MOEBEL, "Turnhallenbank · Stahlfuß", "380.00", 0,
                        """
                        Bank aus einer abgerissenen Turnhalle in Schkeuditz, Sitzfläche abgeschliffen und \
                        geölt, Stahlfüße entrostet.

                        Für den Flur oder das Fußende des Betts, 160 cm lang. Die eingeschnitzten Namen \
                        von Generationen Schulkinder sind noch drin.
                        """),
                product("Etui Feuerwehrschlauch", ProductCategory.KLEINZEUG, "Feuerwehrschlauch", "29.00", 0,
                        """
                        Ausgemusterter Feuerwehrschlauch, innen gereinigt, flach genäht - das steifste \
                        Material, das wir je auf dem Tisch hatten.

                        Etui für Brille, Werkzeug oder Kabel, mit Reißverschluss. Man kann sich darauf \
                        stellen, ohne dass der Inhalt etwas merkt. Die nächste Lieferung steht aus.
                        """)
        );

        productRepository.saveAll(products);
        log.info("Seeded {} demo products", products.size());
    }

    private static Product product(
            String name,
            ProductCategory category,
            String material,
            String price,
            int stock,
            String description
    ) {
        return Product.builder()
                .name(name)
                .slug(Slugs.slugify(name))
                .description(description)
                .category(category)
                .material(material)
                .price(new BigDecimal(price))
                .stock(stock)
                .build();
    }
}
