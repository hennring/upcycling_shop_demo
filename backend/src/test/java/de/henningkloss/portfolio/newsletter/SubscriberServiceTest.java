package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.newsletter.dto.SubscribeRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(SubscriberService.class)
class SubscriberServiceTest {

    @Autowired
    private SubscriberService service;

    @Autowired
    private SubscriberRepository repository;

    @Test
    void subscribe_isIdempotentAndCaseInsensitive() {
        service.subscribe(new SubscribeRequest("Max@Example.com"));
        service.subscribe(new SubscribeRequest("max@example.com"));

        assertThat(repository.findAll()).hasSize(1);
        assertThat(repository.findByEmail("max@example.com")).isPresent();
        assertThat(service.getActiveCount()).isEqualTo(1);
    }

    @Test
    void unsubscribeByToken_deactivatesSubscriber() {
        service.subscribe(new SubscribeRequest("max@example.com"));
        Subscriber subscriber = repository.findByEmail("max@example.com").orElseThrow();

        service.unsubscribeByToken(subscriber.getUnsubscribeToken());

        assertThat(subscriber.isActive()).isFalse();
        assertThat(subscriber.getUnsubscribedAt()).isNotNull();
        assertThat(service.getActiveCount()).isZero();
    }

    @Test
    void unsubscribeByToken_unknownToken_isIgnored() {
        service.subscribe(new SubscribeRequest("max@example.com"));

        service.unsubscribeByToken("does-not-exist");

        assertThat(service.getActiveCount()).isEqualTo(1);
    }

    @Test
    void subscribe_afterUnsubscribe_reactivates() {
        service.subscribe(new SubscribeRequest("max@example.com"));
        Subscriber subscriber = repository.findByEmail("max@example.com").orElseThrow();
        service.unsubscribeByToken(subscriber.getUnsubscribeToken());

        service.subscribe(new SubscribeRequest("max@example.com"));

        assertThat(subscriber.isActive()).isTrue();
        assertThat(subscriber.getUnsubscribedAt()).isNull();
        assertThat(repository.findAll()).hasSize(1);
    }
}
