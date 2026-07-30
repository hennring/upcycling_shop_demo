package de.henningkloss.portfolio.blog.dto;

import java.time.Instant;

public record BlogArticleResponse(
        Long id,
        String title,
        String slug,
        String excerpt,
        String content,
        String imageUrl,
        boolean published,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
