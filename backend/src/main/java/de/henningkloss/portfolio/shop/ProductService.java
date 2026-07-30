package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.common.Slugs;
import de.henningkloss.portfolio.shop.dto.ProductRequest;
import de.henningkloss.portfolio.shop.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .slug(resolveSlug(request.slug(), request.name(), null))
                .description(request.description())
                .price(request.price())
                .imageUrl(request.imageUrl())
                .active(request.active())
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.setName(request.name());
        product.setSlug(resolveSlug(request.slug(), request.name(), id));
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl());
        product.setActive(request.active());

        return toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }

    /** Catalogue for the public shop – inactive products stay hidden. */
    public List<ProductResponse> getAllActive() {
        return productRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProductResponse> getAll() {
        return productRepository.findAllByOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getActiveBySlug(String slug) {
        return productRepository.findBySlugAndActiveTrue(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new ProductNotFoundException(slug));
    }

    public ProductResponse getById(Long id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private String resolveSlug(String requestedSlug, String name, Long excludeId) {
        return Slugs.uniqueSlug(requestedSlug, name, candidate -> excludeId == null
                ? productRepository.existsBySlug(candidate)
                : productRepository.existsBySlugAndIdNot(candidate, excludeId));
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.isActive()
        );
    }
}
