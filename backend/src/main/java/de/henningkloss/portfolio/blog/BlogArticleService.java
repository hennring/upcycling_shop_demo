package de.henningkloss.portfolio.blog;

import de.henningkloss.portfolio.blog.dto.BlogArticleRequest;
import de.henningkloss.portfolio.blog.dto.BlogArticleResponse;
import de.henningkloss.portfolio.common.Slugs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BlogArticleService {

    private final BlogArticleRepository blogArticleRepository;

    @Transactional
    public BlogArticleResponse create(BlogArticleRequest request) {
        BlogArticle article = BlogArticle.builder()
                .title(request.title())
                .slug(resolveSlug(request.slug(), request.title(), null))
                .excerpt(request.excerpt())
                .content(request.content())
                .imageUrl(request.imageUrl())
                .published(request.published())
                .publishedAt(request.published() ? Instant.now() : null)
                .build();

        return toResponse(blogArticleRepository.save(article));
    }

    @Transactional
    public BlogArticleResponse update(Long id, BlogArticleRequest request) {
        BlogArticle article = blogArticleRepository.findById(id)
                .orElseThrow(() -> new BlogArticleNotFoundException(id));

        boolean nowPublished = request.published();

        article.setTitle(request.title());
        article.setSlug(resolveSlug(request.slug(), request.title(), id));
        article.setExcerpt(request.excerpt());
        article.setContent(request.content());
        article.setImageUrl(request.imageUrl());
        // keep the original publication date on re-edits, clear it when unpublishing
        if (nowPublished && !article.isPublished()) {
            article.setPublishedAt(Instant.now());
        } else if (!nowPublished) {
            article.setPublishedAt(null);
        }
        article.setPublished(nowPublished);

        return toResponse(article);
    }

    @Transactional
    public void delete(Long id) {
        if (!blogArticleRepository.existsById(id)) {
            throw new BlogArticleNotFoundException(id);
        }
        blogArticleRepository.deleteById(id);
    }

    public BlogArticleResponse getById(Long id) {
        return blogArticleRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new BlogArticleNotFoundException(id));
    }

    /** Detail view for the public news feed – drafts must not leak. */
    public BlogArticleResponse getPublishedBySlug(String slug) {
        return blogArticleRepository.findBySlugAndPublishedTrue(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new BlogArticleNotFoundException(slug));
    }

    public List<BlogArticleResponse> getAll() {
        return blogArticleRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<BlogArticleResponse> getAllPublished() {
        return blogArticleRepository.findByPublishedTrueOrderByPublishedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private String resolveSlug(String requestedSlug, String title, Long excludeId) {
        return Slugs.uniqueSlug(requestedSlug, title, candidate -> excludeId == null
                ? blogArticleRepository.existsBySlug(candidate)
                : blogArticleRepository.existsBySlugAndIdNot(candidate, excludeId));
    }

    private BlogArticleResponse toResponse(BlogArticle article) {
        return new BlogArticleResponse(
                article.getId(),
                article.getTitle(),
                article.getSlug(),
                article.getExcerpt(),
                article.getContent(),
                article.getImageUrl(),
                article.isPublished(),
                article.getPublishedAt(),
                article.getCreatedAt(),
                article.getUpdatedAt()
        );
    }
}
