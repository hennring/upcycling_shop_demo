package de.henningkloss.portfolio.shop.dto;

import de.henningkloss.portfolio.shop.ProductCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank @Size(max = 200) String name,
        @Size(max = 220) String slug,
        String description,
        @NotNull ProductCategory category,
        @Size(max = 200) String material,
        @NotNull @DecimalMin("0.00") @Digits(integer = 10, fraction = 2) BigDecimal price,
        @Min(0) @Max(999) int stock,
        @Size(max = 500) String imageUrl,
        boolean active
) {
}
