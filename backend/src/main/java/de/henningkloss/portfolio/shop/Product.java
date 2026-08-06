package de.henningkloss.portfolio.shop;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "product", indexes = {
        @Index(name = "ix_product_active", columnList = "active"),
        // the shop overview groups by category, the admin list filters by it
        @Index(name = "ix_product_category", columnList = "category")
})
@Getter
@Setter
@NoArgsConstructor
// private: instances are created through the builder, never with a hand-set id
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ProductCategory category;

    /**
     * The "Materialzettel" from brand.md, Abschnitt 9: what the thing used to be, before
     * the page says what it costs. Free text on purpose - every batch of material is
     * different ("Theatervorhang · Segeltuch").
     */
    @Column(length = 200)
    private String material;

    /** Gross price in EUR. Money is never a floating point type. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    /**
     * Pieces available from the current batch. {@code 0} means "vergriffen": the product
     * stays in the catalogue (brand.md, Abschnitt 10) but cannot be put into a cart.
     * Distinct from {@link #active}, which is the soft delete.
     *
     * <p>Nothing decrements this - the application ends at the "Kauf" button, so there are
     * no orders that could consume stock.</p>
     */
    @Column(nullable = false)
    @Builder.Default
    private int stock = 0;

    @Column(length = 500)
    private String imageUrl;

    /** Soft delete: inactive products stay referenced by existing cart items. */
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
