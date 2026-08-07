package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.common.ConflictException;

/** A newsletter can only be sent once - re-sending would spam every subscriber again. */
public class NewsletterAlreadySentException extends ConflictException {

    public NewsletterAlreadySentException(Long id) {
        super("Newsletter already sent: " + id);
    }
}
