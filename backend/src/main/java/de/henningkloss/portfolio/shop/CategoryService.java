package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.shop.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final ProductRepository productRepository;

    /**
     * The five categories with their brand.md copy and a price range computed from the
     * active catalogue - not a static figure, so it always matches what is actually for
     * sale. A category with no active products gets a null range instead of a stale one.
     */
    public List<CategoryResponse> getAll() {
        Map<ProductCategory, List<Product>> byCategory = productRepository.findByActiveTrueOrderByNameAsc().stream()
                .collect(Collectors.groupingBy(Product::getCategory));

        return List.of(ProductCategory.values()).stream()
                .map(category -> toResponse(category, byCategory.getOrDefault(category, List.of())))
                .toList();
    }

    private CategoryResponse toResponse(ProductCategory category, List<Product> products) {
        BigDecimal minPrice = products.stream().map(Product::getPrice).min(Comparator.naturalOrder()).orElse(null);
        BigDecimal maxPrice = products.stream().map(Product::getPrice).max(Comparator.naturalOrder()).orElse(null);

        return new CategoryResponse(
                category,
                category.getTitle(),
                category.getDescription(),
                category.getMaterial(),
                minPrice,
                maxPrice
        );
    }
}
