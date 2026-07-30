package de.henningkloss.portfolio.blog;

import de.henningkloss.portfolio.blog.dto.BlogArticleRequest;
import de.henningkloss.portfolio.blog.dto.BlogArticleResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Import(BlogArticleService.class)
class BlogArticleServiceTest {

    @Autowired
    private BlogArticleService service;

    private static BlogArticleRequest request(String title, boolean published) {
        return new BlogArticleRequest(title, null, null, "Inhalt", null, published);
    }

    @Test
    void create_derivesSlugFromTitle() {
        BlogArticleResponse article = service.create(request("Über unsere Services!", true));

        assertThat(article.slug()).isEqualTo("uber-unsere-services");
    }

    @Test
    void create_duplicateTitle_getsSuffixedSlug() {
        service.create(request("Hallo Welt", true));
        BlogArticleResponse second = service.create(request("Hallo Welt", true));

        assertThat(second.slug()).isEqualTo("hallo-welt-2");
    }

    @Test
    void publishedAt_isSetOnPublishAndClearedOnUnpublish() {
        BlogArticleResponse draft = service.create(request("Entwurf", false));
        assertThat(draft.publishedAt()).isNull();

        BlogArticleResponse published = service.update(draft.id(),
                new BlogArticleRequest("Entwurf", draft.slug(), null, "Inhalt", null, true));
        assertThat(published.publishedAt()).isNotNull();

        BlogArticleResponse unpublished = service.update(draft.id(),
                new BlogArticleRequest("Entwurf", draft.slug(), null, "Inhalt", null, false));
        assertThat(unpublished.publishedAt()).isNull();
    }

    @Test
    void publicFeed_hidesDrafts() {
        service.create(request("Veröffentlicht", true));
        BlogArticleResponse draft = service.create(request("Entwurf", false));

        assertThat(service.getAllPublished()).hasSize(1);
        assertThat(service.getAll()).hasSize(2);
        assertThatThrownBy(() -> service.getPublishedBySlug(draft.slug()))
                .isInstanceOf(BlogArticleNotFoundException.class);
    }
}
