package de.henningkloss.portfolio.blog.controller;

import de.henningkloss.portfolio.blog.BlogArticleService;
import de.henningkloss.portfolio.blog.dto.BlogArticleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public news feed. Only published articles are visible here.
 */
@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogArticleController {

    private final BlogArticleService blogArticleService;

    @GetMapping
    public List<BlogArticleResponse> list() {
        return blogArticleService.getAllPublished();
    }

    @GetMapping("/{slug}")
    public BlogArticleResponse getBySlug(@PathVariable String slug) {
        return blogArticleService.getPublishedBySlug(slug);
    }
}
