package de.henningkloss.portfolio.shop.controller;

import de.henningkloss.portfolio.auth.User;
import de.henningkloss.portfolio.shop.CartService;
import de.henningkloss.portfolio.shop.dto.CartItemRequest;
import de.henningkloss.portfolio.shop.dto.CartResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Cart of the logged-in user. There is no checkout endpoint on purpose – the
 * flow ends at the "buy" button (see anforderungen.md).
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    public record QuantityRequest(@Min(0) @Max(99) int quantity) {
    }

    @GetMapping
    public CartResponse getCart(@AuthenticationPrincipal User user) {
        return cartService.getCart(user.getId());
    }

    @PostMapping("/items")
    public CartResponse addItem(@AuthenticationPrincipal User user, @Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(user.getId(), request);
    }

    /** Sets an absolute quantity; {@code 0} removes the line. */
    @PutMapping("/items/{productId}")
    public CartResponse setQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @Valid @RequestBody QuantityRequest request
    ) {
        return cartService.setQuantity(user.getId(), productId, request.quantity());
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse removeItem(@AuthenticationPrincipal User user, @PathVariable Long productId) {
        return cartService.removeItem(user.getId(), productId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clear(@AuthenticationPrincipal User user) {
        cartService.clear(user.getId());
    }
}
