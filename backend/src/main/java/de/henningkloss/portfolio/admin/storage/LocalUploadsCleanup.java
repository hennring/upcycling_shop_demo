package de.henningkloss.portfolio.admin.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

/**
 * Deletes the local upload directory on shutdown, so files uploaded during a
 * local IntelliJ run don't pile up between test runs. Only active for the
 * "local" profile - the docker-compose upload volume is left alone.
 */
@Slf4j
@Component
@Profile("local")
public class LocalUploadsCleanup implements ApplicationListener<ContextClosedEvent> {

    private final Path basePath;

    public LocalUploadsCleanup(@Value("${app.storage.local.base-path}") String basePath) {
        this.basePath = Path.of(basePath);
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        if (!Files.exists(basePath)) {
            return;
        }
        try (var paths = Files.walk(basePath)) {
            paths.sorted(Comparator.reverseOrder()).forEach(this::deleteQuietly);
            log.info("Cleaned up local upload directory {}", basePath);
        } catch (IOException e) {
            log.warn("Failed to clean up local upload directory {}", basePath, e);
        }
    }

    private void deleteQuietly(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Could not delete {}", path, e);
        }
    }
}
