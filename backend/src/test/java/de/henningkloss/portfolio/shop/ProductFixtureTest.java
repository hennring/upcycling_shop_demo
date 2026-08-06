package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.shop.config.ProductFixture;
import de.henningkloss.portfolio.shop.dto.ProductResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import({ProductFixture.class, ProductService.class})
// the fixture bean is @ConditionalOnProperty, so it only exists with the flag switched on
@TestPropertySource(properties = "app.fixtures.enabled=true")
class ProductFixtureTest {

    @Autowired
    private ProductFixture fixture;

    @Autowired
    private ProductService service;

    @Autowired
    private ProductRepository repository;

    @BeforeEach
    void emptyTheTable() {
        // the fixture is an ApplicationRunner and already seeded while the test context
        // started up - clear that out so each test controls the starting state itself
        repository.deleteAll();
        repository.flush();
    }

    @Test
    void seedsACatalogueCoveringEveryCategory() {
        fixture.run(null);

        assertThat(service.getAll())
                .isNotEmpty()
                .allSatisfy(product -> {
                    assertThat(product.slug()).isNotBlank();
                    assertThat(product.description()).isNotBlank();
                    assertThat(product.material()).isNotBlank();
                    assertThat(product.price()).isGreaterThan(BigDecimal.ZERO);
                })
                .extracting(ProductResponse::category)
                .containsAll(List.of(ProductCategory.values()));
    }

    @Test
    void keepsSoldOutProductsInTheCatalogueWithoutStock() {
        fixture.run(null);

        // "vergriffen" is stock 0, not a removed product - the shop still shows it
        assertThat(service.getAllActive())
                .allMatch(ProductResponse::active)
                .anyMatch(product -> product.stock() == 0)
                .anyMatch(product -> product.stock() > 0);
    }

    @Test
    void doesNothingWhenProductsAlreadyExist() {
        repository.saveAndFlush(Product.builder()
                .name("Vorhandenes Produkt")
                .slug("vorhandenes-produkt")
                .category(ProductCategory.KLEINZEUG)
                .price(new BigDecimal("10.00"))
                .stock(1)
                .build());

        fixture.run(null);

        assertThat(repository.count()).isEqualTo(1);
    }
}
