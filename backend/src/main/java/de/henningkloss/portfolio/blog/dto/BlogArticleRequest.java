package de.henningkloss.portfolio.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogArticleRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 220) String slug,
        @Size(max = 500) String excerpt,
        @NotBlank String content,
        @Size(max = 500) String imageUrl,
        boolean published
) {
}
