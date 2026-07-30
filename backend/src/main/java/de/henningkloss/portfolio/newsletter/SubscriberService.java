package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.newsletter.dto.SubscribeRequest;
import de.henningkloss.portfolio.newsletter.dto.SubscriberResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubscriberService {

    private final SubscriberRepository subscriberRepository;

    /**
     * Idempotent sign-up: re-subscribing an existing address reactivates it instead
     * of failing on the unique constraint. Returns nothing on purpose – the endpoint
     * is public, so it must not reveal whether an address is already subscribed.
     */
    @Transactional
    public void subscribe(SubscribeRequest request) {
        String email = normalizeEmail(request.email());

        Subscriber subscriber = subscriberRepository.findByEmail(email)
                .orElseGet(() -> subscriberRepository.save(Subscriber.builder()
                        .email(email)
                        .unsubscribeToken(UUID.randomUUID().toString())
                        .build()));

        subscriber.setActive(true);
        subscriber.setUnsubscribedAt(null);
    }

    /**
     * Unsubscribe via the token from the mail footer. Unknown tokens are ignored so
     * the endpoint cannot be used to probe for valid ones.
     */
    @Transactional
    public void unsubscribeByToken(String token) {
        subscriberRepository.findByUnsubscribeToken(token)
                .filter(Subscriber::isActive)
                .ifPresent(subscriber -> {
                    subscriber.setActive(false);
                    subscriber.setUnsubscribedAt(Instant.now());
                });
    }

    @Transactional
    public void delete(Long id) {
        if (!subscriberRepository.existsById(id)) {
            throw new SubscriberNotFoundException(id);
        }
        subscriberRepository.deleteById(id);
    }

    public SubscriberResponse getById(Long id) {
        return subscriberRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new SubscriberNotFoundException(id));
    }

    public List<SubscriberResponse> getAll() {
        return subscriberRepository.findAllByOrderBySubscribedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    /** Basis-Statistik for the admin dashboard. */
    public long getActiveCount() {
        return subscriberRepository.countByActiveTrue();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private SubscriberResponse toResponse(Subscriber subscriber) {
        return new SubscriberResponse(
                subscriber.getId(),
                subscriber.getEmail(),
                subscriber.isActive(),
                subscriber.getSubscribedAt(),
                subscriber.getUnsubscribedAt()
        );
    }
}
