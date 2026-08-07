package de.henningkloss.portfolio.newsletter.dto;

import de.henningkloss.portfolio.newsletter.NewsletterStatus;

import java.time.Instant;

public record NewsletterResponse(
        Long id,
        String subject,
        String content,
        NewsletterStatus status,
        Long blogArticleId,
        String blogArticleTitle,
        String blogArticleSlug,
        Instant createdAt,
        Instant updatedAt,
        Instant sentAt
) {
}
