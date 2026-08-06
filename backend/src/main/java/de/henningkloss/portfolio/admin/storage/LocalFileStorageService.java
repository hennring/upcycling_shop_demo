package de.henningkloss.portfolio.admin.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Stores uploaded files on the local filesystem, under the container's working
 * directory (see {@code docker-compose.yml}, volume {@code uploads-data}). Active
 * unless {@code app.storage.provider} is explicitly set to something else.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageService implements FileStorageService {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "webp");

    private final Path basePath;
    private final String publicPath;

    public LocalFileStorageService(
            @Value("${app.storage.local.base-path}") String basePath,
            @Value("${app.storage.local.public-path}") String publicPath) {
        this.basePath = Path.of(basePath);
        this.publicPath = publicPath;
    }

    @Override
    public String store(MultipartFile file, String subdirectory) {
        String extension = extensionOf(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new UnsupportedFileTypeException("Unsupported file type: " + extension);
        }

        String filename = UUID.randomUUID() + "." + extension;
        Path targetDir = basePath.resolve(subdirectory);
        Path target = targetDir.resolve(filename);

        try {
            Files.createDirectories(targetDir);
            file.transferTo(target);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store uploaded file", e);
        }

        log.info("Stored uploaded file at {}", target);
        return publicPath + "/" + subdirectory + "/" + filename;
    }

    private String extensionOf(String originalFilename) {
        if (!StringUtils.hasText(originalFilename) || !originalFilename.contains(".")) {
            throw new UnsupportedFileTypeException("File has no extension");
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1);
        return extension.toLowerCase(Locale.ROOT);
    }
}
