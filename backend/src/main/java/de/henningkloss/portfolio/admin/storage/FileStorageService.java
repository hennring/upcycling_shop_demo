package de.henningkloss.portfolio.admin.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Persists an uploaded file and returns its public URL. Which implementation is
 * active is chosen by {@code app.storage.provider} (see {@link LocalFileStorageService}
 * and {@link OracleCloudFileStorageService}).
 */
public interface FileStorageService {

    /**
     * @param subdirectory logical grouping under the storage root, e.g. "blog"
     * @return the public URL the stored file is reachable at
     */
    String store(MultipartFile file, String subdirectory);
}
