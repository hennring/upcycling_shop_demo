package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.shop.dto.CategoryResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(CategoryService.class)
class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void computesThePriceRangeFromActiveProductsOfTheCategory() {
        productRepository.saveAll(java.util.List.of(
                product(ProductCategory.SCHMUCK, "24.00", true),
                product(ProductCategory.SCHMUCK, "42.00", true),
                // inactive: must not pull the range down
                product(ProductCategory.SCHMUCK, "5.00", false)
        ));

        CategoryResponse schmuck = categoryService.getAll().stream()
                .filter(category -> category.key() == ProductCategory.SCHMUCK)
                .findFirst()
                .orElseThrow();

        assertThat(schmuck.minPrice()).isEqualTo(new BigDecimal("24.00"));
        assertThat(schmuck.maxPrice()).isEqualTo(new BigDecimal("42.00"));
    }

    @Test
    void leavesTheRangeEmptyForACategoryWithoutActiveProducts() {
        CategoryResponse moebel = categoryService.getAll().stream()
                .filter(category -> category.key() == ProductCategory.MOEBEL)
                .findFirst()
                .orElseThrow();

        assertThat(moebel.minPrice()).isNull();
        assertThat(moebel.maxPrice()).isNull();
    }

    @Test
    void carriesTheBrandCopyForEveryCategory() {
        assertThat(categoryService.getAll())
                .hasSize(ProductCategory.values().length)
                .allSatisfy(category -> {
                    assertThat(category.title()).isNotBlank();
                    assertThat(category.description()).isNotBlank();
                    assertThat(category.material()).isNotBlank();
                });
    }

    private static Product product(ProductCategory category, String price, boolean active) {
        return Product.builder()
                .name("Testprodukt " + price)
                .slug("testprodukt-" + category + "-" + price.replace(".", ""))
                .category(category)
                .price(new BigDecimal(price))
                .stock(1)
                .active(active)
                .build();
    }
}
