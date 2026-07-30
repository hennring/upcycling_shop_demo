package de.henningkloss.portfolio.newsletter.controller;

import de.henningkloss.portfolio.newsletter.SubscriberService;
import de.henningkloss.portfolio.newsletter.dto.SubscriberResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * CRM endpoints. Protected by the {@code /api/admin/**} rule in SecurityConfig.
 * The newsletter editor and send-out follow in phase 5.
 */
@RestController
@RequestMapping("/api/admin/newsletter/subscribers")
@RequiredArgsConstructor
public class AdminSubscriberController {

    private final SubscriberService subscriberService;

    @GetMapping
    public List<SubscriberResponse> list() {
        return subscriberService.getAll();
    }

    /** Feeds the "Abonnentenzahl" tile of the admin dashboard. */
    @GetMapping("/active-count")
    public long activeCount() {
        return subscriberService.getActiveCount();
    }

    @GetMapping("/{id}")
    public SubscriberResponse get(@PathVariable Long id) {
        return subscriberService.getById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subscriberService.delete(id);
    }
}
