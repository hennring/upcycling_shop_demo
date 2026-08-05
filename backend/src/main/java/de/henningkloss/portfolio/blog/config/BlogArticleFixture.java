package de.henningkloss.portfolio.blog.config;

import de.henningkloss.portfolio.blog.BlogArticle;
import de.henningkloss.portfolio.blog.BlogArticleRepository;
import de.henningkloss.portfolio.common.Slugs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Seeds demo articles so the "Werkstattbuch" feed on the landing page has content
 * before the admin CMS (phase 5) exists. Wording follows brand.md - material first,
 * then the product. Only active with {@code app.fixtures.enabled=true}
 * (local profile and docker-compose) and only while the table is still empty, so it never
 * fights with articles written through the admin API.
 */
@Component
@ConditionalOnProperty(name = "app.fixtures.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class BlogArticleFixture implements ApplicationRunner {

    private final BlogArticleRepository blogArticleRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (blogArticleRepository.count() > 0) {
            log.info("Blog articles already present - skipping fixture");
            return;
        }

        Instant now = Instant.now();
        List<BlogArticle> articles = List.of(
                article("400 Meter Theatervorhang sind angekommen",
                        "Ein Haus in Lindenau hat seinen Bühnenfundus aufgelöst. Schwerer Samt, "
                                + "dunkelrot, teilweise noch mit Nummernschildern der Technik.",
                        """
                        Vier Rollen, zusammen etwa 400 Meter. Der Stoff ist schwerer als alles, was wir sonst \
                        auf dem Tisch haben - gut für Taschenböden, schlecht für die Nadel. Zwei Nadeln sind \
                        beim Probenähen abgebrochen, bevor die Maschine die richtige Einstellung hatte.

                        Was daraus wird: Umhängetaschen mit Segeltuchboden, dazu eine Serie Schürzen. \
                        Die Stellen mit den aufgenähten Nummern schneiden wir nicht heraus. Wenn eine Tasche \
                        früher am Bühnenrand gehangen hat, darf man das sehen.
                        """,
                        now.minus(2, ChronoUnit.DAYS)),
                article("Warum wir Kisten auch wieder wegschicken",
                        "Wir bekommen mehr angeboten, als wir verarbeiten können. Was wir annehmen, "
                                + "hat weniger mit gut und schlecht zu tun als mit Menge.",
                        """
                        Die häufigste Absage geht an gut gemeinte Einzelstücke: drei Bretter, eine Jacke, \
                        zwei Teller. Alles brauchbar, aber für eine Serie reicht es nicht - und ein Entwurf, \
                        den wir genau einmal bauen können, kostet mehr Zeit als er einbringt.

                        Was uns hilft, sind Chargen: eine Werkstattauflösung, ein Restposten, ein ganzer \
                        Dachboden. Dann können wir am Material entwerfen und wissen, dass die zweite und \
                        dritte Tasche genauso gut wird wie die erste.

                        Und ja - manches lehnen wir ab, weil es kaputt ist statt gebraucht. Verharztes Holz, \
                        Stoff mit Schimmel, verzogene Rahmen. Das ist kein Material mehr, das ist Arbeit \
                        ohne Ergebnis.
                        """,
                        now.minus(9, ChronoUnit.DAYS)),
                article("Aus 60 Fahrradschläuchen wurden Spanngummis",
                        "Drei Werkstätten aus dem Viertel sammeln ihre Flickreste für uns. Daraus gibt "
                                + "es jetzt Spanngummis, die kein Gummiband der Welt überlebt.",
                        """
                        Fahrradschlauch ist das dankbarste Material, das wir kennen: reißfest, wasserdicht, \
                        und es kommt in einer Menge an, mit der man planen kann. Aus einem Schlauch werden \
                        vier Spanngummis oder ein Satz Griffbänder.

                        Die erste Charge lag zwei Wochen im Regal, bis klar war, wie der Knoten hält. \
                        Jetzt sind 240 Stück fertig. Wenn sie weg sind, warten wir auf die nächste Runde \
                        Flickreste - das dauert etwa einen Monat.
                        """,
                        now.minus(21, ChronoUnit.DAYS))
        );

        blogArticleRepository.saveAll(articles);
        log.info("Seeded {} demo blog articles", articles.size());
    }

    private static BlogArticle article(String title, String excerpt, String content, Instant publishedAt) {
        return BlogArticle.builder()
                .title(title)
                .slug(Slugs.slugify(title))
                .excerpt(excerpt)
                .content(content)
                .published(true)
                .publishedAt(publishedAt)
                .build();
    }
}
