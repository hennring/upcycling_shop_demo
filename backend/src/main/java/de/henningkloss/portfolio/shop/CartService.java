package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.auth.UserRepository;
import de.henningkloss.portfolio.shop.dto.CartItemRequest;
import de.henningkloss.portfolio.shop.dto.CartItemResponse;
import de.henningkloss.portfolio.shop.dto.CartResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private static final int MAX_QUANTITY_PER_PRODUCT = 99;

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(Long userId) {
        return toResponse(cartItemRepository.findByUserIdOrderByCreatedAtAsc(userId));
    }

    /**
     * Adds a product to the cart, or increases the quantity if it is already in there.
     */
    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Product product = productRepository.findById(request.productId())
                .filter(Product::isActive)
                .orElseThrow(() -> new ProductNotFoundException(request.productId()));

        cartItemRepository.findByUserIdAndProductId(userId, product.getId())
                .ifPresentOrElse(
                        item -> item.setQuantity(cappedQuantity(item.getQuantity() + request.quantity())),
                        () -> cartItemRepository.save(CartItem.builder()
                                .user(userRepository.getReferenceById(userId))
                                .product(product)
                                .quantity(cappedQuantity(request.quantity()))
                                .build())
                );

        return getCartAfterFlush(userId);
    }

    @Transactional
    public CartResponse setQuantity(Long userId, Long productId, int quantity) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(cappedQuantity(quantity));
        }

        return getCartAfterFlush(userId);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long productId) {
        cartItemRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(cartItemRepository::delete);

        return getCartAfterFlush(userId);
    }

    @Transactional
    public void clear(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    private CartResponse getCartAfterFlush(Long userId) {
        cartItemRepository.flush();
        return toResponse(cartItemRepository.findByUserIdOrderByCreatedAtAsc(userId));
    }

    private int cappedQuantity(int quantity) {
        return Math.min(quantity, MAX_QUANTITY_PER_PRODUCT);
    }

    private CartResponse toResponse(List<CartItem> items) {
        List<CartItemResponse> lines = items.stream()
                .map(this::toLine)
                .toList();

        BigDecimal total = lines.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int itemCount = lines.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        return new CartResponse(lines, itemCount, total);
    }

    private CartItemResponse toLine(CartItem item) {
        Product product = item.getProduct();
        return new CartItemResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getImageUrl(),
                product.getPrice(),
                item.getQuantity(),
                product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}
