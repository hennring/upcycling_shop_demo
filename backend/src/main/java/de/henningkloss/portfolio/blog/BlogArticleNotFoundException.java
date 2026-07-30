package de.henningkloss.portfolio.blog;

import de.henningkloss.portfolio.common.ResourceNotFoundException;

public class BlogArticleNotFoundException extends ResourceNotFoundException {

    public BlogArticleNotFoundException(Long id) {
        super("Blog article not found: " + id);
    }

    public BlogArticleNotFoundException(String slug) {
        super("Blog article not found: " + slug);
    }
}
