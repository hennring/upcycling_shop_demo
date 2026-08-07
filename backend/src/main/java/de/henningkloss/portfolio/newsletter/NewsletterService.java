package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.blog.BlogArticle;
import de.henningkloss.portfolio.blog.BlogArticleNotFoundException;
import de.henningkloss.portfolio.blog.BlogArticleRepository;
import de.henningkloss.portfolio.newsletter.dto.NewsletterRequest;
import de.henningkloss.portfolio.newsletter.dto.NewsletterResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;
    private final BlogArticleRepository blogArticleRepository;

    @Transactional
    public NewsletterResponse create(NewsletterRequest request) {
        Newsletter newsletter = Newsletter.builder()
                .subject(request.subject())
                .content(request.content())
                .blogArticle(resolveBlogArticle(request.blogArticleId()))
                .build();

        return toResponse(newsletterRepository.save(newsletter));
    }

    @Transactional
    public NewsletterResponse update(Long id, NewsletterRequest request) {
        Newsletter newsletter = newsletterRepository.findById(id)
                .orElseThrow(() -> new NewsletterNotFoundException(id));

        newsletter.setSubject(request.subject());
        newsletter.setContent(request.content());
        newsletter.setBlogArticle(resolveBlogArticle(request.blogArticleId()));

        return toResponse(newsletter);
    }

    @Transactional
    public void delete(Long id) {
        if (!newsletterRepository.existsById(id)) {
            throw new NewsletterNotFoundException(id);
        }
        newsletterRepository.deleteById(id);
    }

    public NewsletterResponse getById(Long id) {
        return newsletterRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NewsletterNotFoundException(id));
    }

    public List<NewsletterResponse> getAll() {
        return newsletterRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private BlogArticle resolveBlogArticle(Long blogArticleId) {
        if (blogArticleId == null) {
            return null;
        }
        return blogArticleRepository.findById(blogArticleId)
                .orElseThrow(() -> new BlogArticleNotFoundException(blogArticleId));
    }

    private NewsletterResponse toResponse(Newsletter newsletter) {
        BlogArticle article = newsletter.getBlogArticle();
        return new NewsletterResponse(
                newsletter.getId(),
                newsletter.getSubject(),
                newsletter.getContent(),
                newsletter.getStatus(),
                article == null ? null : article.getId(),
                article == null ? null : article.getTitle(),
                article == null ? null : article.getSlug(),
                newsletter.getCreatedAt(),
                newsletter.getUpdatedAt(),
                newsletter.getSentAt()
        );
    }
}
