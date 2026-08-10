package de.henningkloss.portfolio.admin.storage;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class OracleCloudFileStorageServiceTest {

    @Mock
    S3Client s3Client;

    @Test
    void store_validImage_uploadsAndReturnsPublicUrl() {
        OracleCloudFileStorageService service = new OracleCloudFileStorageService(
                s3Client, "my-bucket", "https://objectstorage.eu-frankfurt-1.oraclecloud.com/n/ns/b/my-bucket/o");
        MockMultipartFile file = new MockMultipartFile("file", "header.jpg", "image/jpeg", "content".getBytes());

        String url = service.store(file, "blog");

        assertThat(url).startsWith("https://objectstorage.eu-frankfurt-1.oraclecloud.com/n/ns/b/my-bucket/o/blog/")
                .endsWith(".jpg");

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        Mockito.verify(s3Client).putObject(requestCaptor.capture(), any(RequestBody.class));
        assertThat(requestCaptor.getValue().bucket()).isEqualTo("my-bucket");
        assertThat(requestCaptor.getValue().contentType()).isEqualTo("image/jpeg");
    }

    @Test
    void store_unsupportedExtension_throws() {
        OracleCloudFileStorageService service = new OracleCloudFileStorageService(
                s3Client, "my-bucket", "https://objectstorage.eu-frankfurt-1.oraclecloud.com/n/ns/b/my-bucket/o");
        MockMultipartFile file = new MockMultipartFile("file", "malware.exe", "application/octet-stream", "content".getBytes());

        assertThrows(UnsupportedFileTypeException.class, () -> service.store(file, "blog"));
    }
}
