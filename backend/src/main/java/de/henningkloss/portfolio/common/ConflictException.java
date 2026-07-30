package de.henningkloss.portfolio.common;

/**
 * Base class for requests that clash with existing state (duplicate e-mail, ...) –
 * mapped to HTTP 409 by {@link ApiExceptionHandler}.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
