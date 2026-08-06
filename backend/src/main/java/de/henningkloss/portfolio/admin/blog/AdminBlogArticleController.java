package de.henningkloss.portfolio.admin.blog;

import de.henningkloss.portfolio.admin.blog.dto.ImageUploadResponse;
import de.henningkloss.portfolio.admin.storage.FileStorageService;
import de.henningkloss.portfolio.blog.BlogArticleService;
import de.henningkloss.portfolio.blog.dto.BlogArticleRequest;
import de.henningkloss.portfolio.blog.dto.BlogArticleResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * CMS endpoints (drafts included). Protected by the {@code /api/admin/**} rule
 * in SecurityConfig and, in addition, method security here.
 */
@RestController
@RequestMapping("/api/admin/blog")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBlogArticleController {

    private final BlogArticleService blogArticleService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public List<BlogArticleResponse> list() {
        return blogArticleService.getAll();
    }

    @GetMapping("/{id}")
    public BlogArticleResponse get(@PathVariable Long id) {
        return blogArticleService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogArticleResponse create(@Valid @RequestBody BlogArticleRequest request) {
        return blogArticleService.create(request);
    }

    @PutMapping("/{id}")
    public BlogArticleResponse update(@PathVariable Long id, @Valid @RequestBody BlogArticleRequest request) {
        return blogArticleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        blogArticleService.delete(id);
    }

    /**
     * Uploads a header image and returns its public URL, to be passed as
     * {@code imageUrl} in a subsequent create/update call.
     */
    @PostMapping("/images")
    @ResponseStatus(HttpStatus.CREATED)
    public ImageUploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
        return new ImageUploadResponse(fileStorageService.store(file, "blog"));
    }
}
