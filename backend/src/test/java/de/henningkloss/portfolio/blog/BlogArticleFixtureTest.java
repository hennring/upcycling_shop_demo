package de.henningkloss.portfolio.blog;

import de.henningkloss.portfolio.blog.config.BlogArticleFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import({BlogArticleFixture.class, BlogArticleService.class})
// the fixture bean is @ConditionalOnProperty, so it only exists with the flag switched on
@TestPropertySource(properties = "app.fixtures.enabled=true")
class BlogArticleFixtureTest {

    @Autowired
    private BlogArticleFixture fixture;

    @Autowired
    private BlogArticleService service;

    @Autowired
    private BlogArticleRepository repository;

    @BeforeEach
    void emptyTheTable() {
        // the fixture is an ApplicationRunner and already seeded while the test context
        // started up - clear that out so each test controls the starting state itself
        repository.deleteAll();
        repository.flush();
    }

    @Test
    void seedsThreePublishedArticlesIntoAnEmptyDatabase() {
        fixture.run(null);

        assertThat(service.getAllPublished())
                .hasSize(3)
                // the feed is sorted by publishedAt desc, so the newest article comes first
                .isSortedAccordingTo((a, b) -> b.publishedAt().compareTo(a.publishedAt()))
                .allSatisfy(article -> {
                    assertThat(article.slug()).isNotBlank();
                    assertThat(article.excerpt()).isNotBlank();
                    assertThat(article.content()).isNotBlank();
                });
    }

    @Test
    void doesNothingWhenArticlesAlreadyExist() {
        repository.saveAndFlush(BlogArticle.builder()
                .title("Vorhandener Artikel")
                .slug("vorhandener-artikel")
                .content("Inhalt")
                .build());

        fixture.run(null);

        assertThat(repository.count()).isEqualTo(1);
    }
}
