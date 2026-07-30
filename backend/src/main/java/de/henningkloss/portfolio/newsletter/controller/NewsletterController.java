package de.henningkloss.portfolio.newsletter.controller;

import de.henningkloss.portfolio.newsletter.SubscriberService;
import de.henningkloss.portfolio.newsletter.dto.SubscribeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public newsletter sign-up and opt-out. Both endpoints answer with 204 regardless
 * of whether the address was known, so they leak no subscriber data.
 */
@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final SubscriberService subscriberService;

    @PostMapping("/subscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void subscribe(@Valid @RequestBody SubscribeRequest request) {
        subscriberService.subscribe(request);
    }

    @PostMapping("/unsubscribe")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsubscribe(@RequestParam String token) {
        subscriberService.unsubscribeByToken(token);
    }
}
