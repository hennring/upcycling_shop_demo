package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.common.ResourceNotFoundException;

public class NewsletterNotFoundException extends ResourceNotFoundException {

    public NewsletterNotFoundException(Long id) {
        super("Newsletter not found: " + id);
    }
}
