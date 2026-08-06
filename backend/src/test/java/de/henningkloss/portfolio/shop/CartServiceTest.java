package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.auth.Role;
import de.henningkloss.portfolio.auth.User;
import de.henningkloss.portfolio.auth.UserRepository;
import de.henningkloss.portfolio.shop.dto.CartItemRequest;
import de.henningkloss.portfolio.shop.dto.CartResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Import(CartService.class)
class CartServiceTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private Long userId;
    private Product product;

    @BeforeEach
    void setUp() {
        userId = userRepository.save(User.builder()
                .email("max@example.com")
                .passwordHash("hashed")
                .role(Role.USER)
                .build()).getId();

        product = productRepository.save(Product.builder()
                .name("Website-Audit")
                .slug("website-audit")
                .category(ProductCategory.KLEINZEUG)
                .price(new BigDecimal("149.00"))
                .stock(10)
                .build());
    }

    @Test
    void addItem_twice_increasesQuantityInsteadOfDuplicatingTheLine() {
        cartService.addItem(userId, new CartItemRequest(product.getId(), 1));
        CartResponse cart = cartService.addItem(userId, new CartItemRequest(product.getId(), 2));

        assertThat(cart.items()).hasSize(1);
        assertThat(cart.itemCount()).isEqualTo(3);
        assertThat(cart.total()).isEqualByComparingTo("447.00");
    }

    @Test
    void setQuantity_toZero_removesTheLine() {
        cartService.addItem(userId, new CartItemRequest(product.getId(), 2));

        CartResponse cart = cartService.setQuantity(userId, product.getId(), 0);

        assertThat(cart.items()).isEmpty();
        assertThat(cart.total()).isEqualByComparingTo("0");
    }

    @Test
    void addItem_inactiveProduct_isRejected() {
        product.setActive(false);
        productRepository.saveAndFlush(product);

        assertThatThrownBy(() -> cartService.addItem(userId, new CartItemRequest(product.getId(), 1)))
                .isInstanceOf(ProductNotFoundException.class);
    }

    @Test
    void addItem_soldOutProduct_isRejected() {
        product.setStock(0);
        productRepository.saveAndFlush(product);

        assertThatThrownBy(() -> cartService.addItem(userId, new CartItemRequest(product.getId(), 1)))
                .isInstanceOf(OutOfStockException.class);
    }

    @Test
    void addItem_moreThanTheBatchHolds_isCappedAtTheStock() {
        product.setStock(3);
        productRepository.saveAndFlush(product);

        CartResponse cart = cartService.addItem(userId, new CartItemRequest(product.getId(), 5));

        assertThat(cart.items()).singleElement().satisfies(line -> {
            assertThat(line.quantity()).isEqualTo(3);
            assertThat(line.availableStock()).isEqualTo(3);
        });
        assertThat(cart.total()).isEqualByComparingTo("447.00");
    }

    @Test
    void addItem_repeatedly_neverExceedsTheStock() {
        product.setStock(2);
        productRepository.saveAndFlush(product);

        cartService.addItem(userId, new CartItemRequest(product.getId(), 2));
        CartResponse cart = cartService.addItem(userId, new CartItemRequest(product.getId(), 2));

        assertThat(cart.itemCount()).isEqualTo(2);
    }

    @Test
    void setQuantity_aboveTheStock_isCapped() {
        product.setStock(4);
        productRepository.saveAndFlush(product);
        cartService.addItem(userId, new CartItemRequest(product.getId(), 1));

        CartResponse cart = cartService.setQuantity(userId, product.getId(), 99);

        assertThat(cart.itemCount()).isEqualTo(4);
    }

    @Test
    void setQuantity_onAProductThatWentOutOfStock_removesTheLine() {
        cartService.addItem(userId, new CartItemRequest(product.getId(), 2));
        product.setStock(0);
        productRepository.saveAndFlush(product);

        CartResponse cart = cartService.setQuantity(userId, product.getId(), 1);

        assertThat(cart.items()).isEmpty();
    }

    @Test
    void clear_removesAllLinesOfTheUser() {
        cartService.addItem(userId, new CartItemRequest(product.getId(), 1));

        cartService.clear(userId);

        assertThat(cartService.getCart(userId).items()).isEmpty();
    }
}
