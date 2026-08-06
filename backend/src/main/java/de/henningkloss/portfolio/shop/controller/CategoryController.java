package de.henningkloss.portfolio.shop.controller;

import de.henningkloss.portfolio.shop.CategoryService;
import de.henningkloss.portfolio.shop.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public endpoint for the category overview on the landing page and the shop filter.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> list() {
        return categoryService.getAll();
    }
}
