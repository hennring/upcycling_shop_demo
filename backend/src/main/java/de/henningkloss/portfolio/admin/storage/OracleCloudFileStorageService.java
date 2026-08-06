package de.henningkloss.portfolio.admin.storage;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Not implemented yet. Will upload to an Oracle Cloud Object Storage bucket once
 * the production deployment (phasenplan.md, Phase 2) is set up; active when
 * {@code app.storage.provider=oracle}.
 */
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "oracle")
public class OracleCloudFileStorageService implements FileStorageService {

    @Override
    public String store(MultipartFile file, String subdirectory) {
        // TODO: integrate the OCI Object Storage SDK once the production bucket exists.
        throw new UnsupportedOperationException("Oracle Cloud Storage is not implemented yet");
    }
}
