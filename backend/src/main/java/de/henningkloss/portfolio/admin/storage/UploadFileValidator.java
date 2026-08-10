package de.henningkloss.portfolio.admin.storage;

import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;

/**
 * Shared upload allowlist for every {@link FileStorageService} implementation, so the
 * set of acceptable file types doesn't drift between them.
 */
final class UploadFileValidator {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "webp");

    private UploadFileValidator() {
    }

    static String validateAndExtractExtension(String originalFilename) {
        if (!StringUtils.hasText(originalFilename) || !originalFilename.contains(".")) {
            throw new UnsupportedFileTypeException("File has no extension");
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1)
                .toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new UnsupportedFileTypeException("Unsupported file type: " + extension);
        }
        return extension;
    }
}
