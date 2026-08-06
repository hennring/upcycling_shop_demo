package de.henningkloss.portfolio.admin.storage;

/**
 * Thrown when an uploaded file's extension is not on the allowlist – mapped to
 * HTTP 400 by {@code ApiExceptionHandler}.
 */
public class UnsupportedFileTypeException extends RuntimeException {

    public UnsupportedFileTypeException(String message) {
        super(message);
    }
}
