package de.henningkloss.portfolio.shop.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String name,
        String slug,
        String imageUrl,
        BigDecimal unitPrice,
        int quantity,
        /** Pieces the batch still holds, so the client can cap its quantity control. */
        int availableStock,
        BigDecimal lineTotal
) {
}
