package de.henningkloss.portfolio.shop;

import de.henningkloss.portfolio.common.ResourceNotFoundException;

public class ProductNotFoundException extends ResourceNotFoundException {

    public ProductNotFoundException(Long id) {
        super("Product not found: " + id);
    }

    public ProductNotFoundException(String slug) {
        super("Product not found: " + slug);
    }
}
