package de.henningkloss.portfolio.newsletter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewsletterRequest(
        @NotBlank @Size(max = 200) String subject,
        @NotBlank String content,
        Long blogArticleId
) {
}
