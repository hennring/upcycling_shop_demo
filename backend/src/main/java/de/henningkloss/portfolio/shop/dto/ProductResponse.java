package de.henningkloss.portfolio.shop.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String imageUrl,
        boolean active
) {
}
