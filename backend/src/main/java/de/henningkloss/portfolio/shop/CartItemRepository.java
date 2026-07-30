package de.henningkloss.portfolio.shop;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /** Fetches the product in the same query – the cart response needs it for every line. */
    @EntityGraph(attributePaths = "product")
    List<CartItem> findByUserIdOrderByCreatedAtAsc(Long userId);

    @EntityGraph(attributePaths = "product")
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserId(Long userId);
}
