package de.henningkloss.portfolio.shop.dto;

import de.henningkloss.portfolio.shop.ProductCategory;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        ProductCategory category,
        String material,
        BigDecimal price,
        /** Pieces available; 0 means "vergriffen". */
        int stock,
        String imageUrl,
        boolean active
) {
}
