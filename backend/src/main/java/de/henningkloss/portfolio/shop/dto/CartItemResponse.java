package de.henningkloss.portfolio.shop.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String name,
        String slug,
        String imageUrl,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal
) {
}
