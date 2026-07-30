package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.common.ResourceNotFoundException;

public class SubscriberNotFoundException extends ResourceNotFoundException {

    public SubscriberNotFoundException(Long id) {
        super("Subscriber not found: " + id);
    }

    public SubscriberNotFoundException(String detail) {
        super("Subscriber not found: " + detail);
    }
}
