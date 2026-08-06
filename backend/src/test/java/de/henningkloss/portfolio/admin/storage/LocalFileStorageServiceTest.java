package de.henningkloss.portfolio.admin.storage;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LocalFileStorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void store_validImage_writesFileAndReturnsPublicUrl() throws Exception {
        LocalFileStorageService service = new LocalFileStorageService(tempDir.toString(), "/uploads");
        MockMultipartFile file = new MockMultipartFile("file", "header.jpg", "image/jpeg", "content".getBytes());

        String url = service.store(file, "blog");

        assertThat(url).startsWith("/uploads/blog/").endsWith(".jpg");
        String filename = url.substring(url.lastIndexOf('/') + 1);
        assertThat(Files.exists(tempDir.resolve("blog").resolve(filename))).isTrue();
    }

    @Test
    void store_unsupportedExtension_throws() {
        LocalFileStorageService service = new LocalFileStorageService(tempDir.toString(), "/uploads");
        MockMultipartFile file = new MockMultipartFile("file", "malware.exe", "application/octet-stream", "content".getBytes());

        assertThrows(UnsupportedFileTypeException.class, () -> service.store(file, "blog"));
    }

    @Test
    void store_noExtension_throws() {
        LocalFileStorageService service = new LocalFileStorageService(tempDir.toString(), "/uploads");
        MockMultipartFile file = new MockMultipartFile("file", "noextension", "image/jpeg", "content".getBytes());

        assertThrows(UnsupportedFileTypeException.class, () -> service.store(file, "blog"));
    }
}
