package de.henningkloss.portfolio.admin.storage;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.UUID;

/**
 * Uploads files to an S3-compatible Object Storage bucket. Targets Oracle Cloud Object
 * Storage's S3 Compatibility API (phasenplan.md, Phase 7) via the AWS SDK, which keeps
 * this service portable to any other S3-compatible provider by only changing config -
 * no Oracle-specific SDK or API calls involved. Active when {@code app.storage.provider=oracle}.
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "oracle")
public class OracleCloudFileStorageService implements FileStorageService {

    private final S3Client s3Client;
    private final String bucket;
    private final String publicBaseUrl;

    public OracleCloudFileStorageService(
            @Value("${app.storage.oracle.endpoint}") String endpoint,
            @Value("${app.storage.oracle.region}") String region,
            @Value("${app.storage.oracle.bucket}") String bucket,
            @Value("${app.storage.oracle.access-key}") String accessKey,
            @Value("${app.storage.oracle.secret-key}") String secretKey,
            @Value("${app.storage.oracle.public-base-url}") String publicBaseUrl) {
        this(S3Client.builder()
                        .endpointOverride(URI.create(endpoint))
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                        .forcePathStyle(true)
                        .build(),
                bucket, publicBaseUrl);
    }

    OracleCloudFileStorageService(S3Client s3Client, String bucket, String publicBaseUrl) {
        this.s3Client = s3Client;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl.endsWith("/") ? publicBaseUrl.substring(0, publicBaseUrl.length() - 1) : publicBaseUrl;
    }

    @Override
    public String store(MultipartFile file, String subdirectory) {
        String extension = UploadFileValidator.validateAndExtractExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + extension;
        String key = subdirectory + "/" + filename;

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(file.getContentType())
                            .contentLength(file.getSize())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to upload file to object storage", e);
        }

        log.info("Uploaded file to object storage at key {}", key);
        return publicBaseUrl + "/" + encodeKey(key);
    }

    private String encodeKey(String key) {
        return Arrays.stream(key.split("/"))
                .map(segment -> URLEncoder.encode(segment, StandardCharsets.UTF_8).replace("+", "%20"))
                .reduce((a, b) -> a + "/" + b)
                .orElse(key);
    }

    @PreDestroy
    void close() {
        s3Client.close();
    }
}
