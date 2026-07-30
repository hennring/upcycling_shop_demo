package de.henningkloss.portfolio.newsletter.dto;

import java.time.Instant;

public record SubscriberResponse(
        Long id,
        String email,
        boolean active,
        Instant subscribedAt,
        Instant unsubscribedAt
) {
}
