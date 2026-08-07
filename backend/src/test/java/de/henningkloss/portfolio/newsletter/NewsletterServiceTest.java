package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.blog.BlogArticleRepository;
import de.henningkloss.portfolio.newsletter.dto.NewsletterResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NewsletterServiceTest {

    private final NewsletterRepository newsletterRepository = mock(NewsletterRepository.class);
    private final BlogArticleRepository blogArticleRepository = mock(BlogArticleRepository.class);
    private final SubscriberService subscriberService = mock(SubscriberService.class);
    private final NewsletterMailService newsletterMailService = mock(NewsletterMailService.class);

    private final NewsletterService newsletterService = new NewsletterService(
            newsletterRepository, blogArticleRepository, subscriberService, newsletterMailService);

    private static Newsletter draft(Long id) {
        return Newsletter.builder()
                .id(id)
                .subject("Werkstattbrief")
                .content("<p>Hallo</p>")
                .status(NewsletterStatus.DRAFT)
                .build();
    }

    @Test
    void send_dispatchesToActiveSubscribersAndMarksSent() {
        Newsletter newsletter = draft(1L);
        when(newsletterRepository.findById(1L)).thenReturn(Optional.of(newsletter));
        when(subscriberService.getActiveEmails()).thenReturn(List.of("max@example.com"));

        NewsletterResponse response = newsletterService.send(1L);

        verify(newsletterMailService).send(eq(newsletter), eq(List.of("max@example.com")));
        assertThat(response.status()).isEqualTo(NewsletterStatus.SENT);
        assertThat(response.sentAt()).isNotNull();
    }

    @Test
    void send_alreadySent_isRejectedWithoutDispatching() {
        Newsletter newsletter = draft(1L);
        newsletter.setStatus(NewsletterStatus.SENT);
        when(newsletterRepository.findById(1L)).thenReturn(Optional.of(newsletter));

        assertThatThrownBy(() -> newsletterService.send(1L))
                .isInstanceOf(NewsletterAlreadySentException.class);

        verify(newsletterMailService, never()).send(any(), any());
    }

    @Test
    void send_unknownId_throwsNotFound() {
        when(newsletterRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> newsletterService.send(1L))
                .isInstanceOf(NewsletterNotFoundException.class);
    }
}
