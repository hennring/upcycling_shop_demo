package de.henningkloss.portfolio.common;

/**
 * Base class for "the thing you asked for does not exist" – mapped to HTTP 404
 * by {@link ApiExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
