package de.henningkloss.portfolio.shop.dto;

import de.henningkloss.portfolio.shop.ProductCategory;

import java.math.BigDecimal;

public record CategoryResponse(
        ProductCategory key,
        String title,
        String description,
        String material,
        /** Lowest and highest price among the category's active products; null if it has none. */
        BigDecimal minPrice,
        BigDecimal maxPrice
) {
}
