package de.henningkloss.portfolio.admin.newsletter;

import de.henningkloss.portfolio.newsletter.NewsletterService;
import de.henningkloss.portfolio.newsletter.dto.NewsletterRequest;
import de.henningkloss.portfolio.newsletter.dto.NewsletterResponse;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Newsletter composition and send-out. Protected by the {@code /api/admin/**} rule in
 * SecurityConfig and, in addition, method security here.
 */
@RestController
@RequestMapping("/api/admin/newsletter/campaigns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminNewsletterController {

    private final NewsletterService newsletterService;

    @GetMapping
    public List<NewsletterResponse> list() {
        return newsletterService.getAll();
    }

    @GetMapping("/{id}")
    public NewsletterResponse get(@PathVariable Long id) {
        return newsletterService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NewsletterResponse create(@Valid @RequestBody NewsletterRequest request) {
        return newsletterService.create(request);
    }

    @PutMapping("/{id}")
    public NewsletterResponse update(@PathVariable Long id, @Valid @RequestBody NewsletterRequest request) {
        return newsletterService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        newsletterService.delete(id);
    }

    @PostMapping("/{id}/send")
    public NewsletterResponse send(@PathVariable Long id) {
        return newsletterService.send(id);
    }
}
