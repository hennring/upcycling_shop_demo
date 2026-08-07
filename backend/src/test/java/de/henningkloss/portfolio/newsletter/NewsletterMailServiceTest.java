package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.blog.BlogArticle;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NewsletterMailServiceTest {

    private final JavaMailSender mailSender = mock(JavaMailSender.class);
    private final NewsletterMailService mailService =
            new NewsletterMailService(mailSender, "newsletter@example.com", "https://foobar.de");

    private static Newsletter newsletter(String subject, String content) {
        return Newsletter.builder().subject(subject).content(content).build();
    }

    @Test
    void send_setsFromSubjectAndHtmlContentPerRecipient() throws MessagingException, IOException {
        when(mailSender.createMimeMessage())
                .thenAnswer(invocation -> new MimeMessage(Session.getInstance(new Properties())));

        mailService.send(newsletter("Werkstattbrief", "<p>Hallo Werkstatt</p>"),
                List.of("max@example.com", "erika@example.com"));

        ArgumentCaptor<MimeMessage> sent = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(2)).send(sent.capture());

        List<MimeMessage> messages = sent.getAllValues();
        assertThat(messages).hasSize(2);
        for (MimeMessage message : messages) {
            // a real JavaMailSenderImpl.send() calls saveChanges() before transmitting, which is
            // what syncs the Content-Type header after MimeMessageHelper.setText(..., true); the
            // mocked sender here never does, so it has to happen explicitly to assert on it
            message.saveChanges();
            assertThat(message.getSubject()).isEqualTo("Werkstattbrief");
            assertThat(message.getContentType()).contains("text/html");
            assertThat((String) message.getContent()).isEqualTo("<p>Hallo Werkstatt</p>");
            assertThat(message.getFrom()[0].toString()).isEqualTo("newsletter@example.com");
        }
        assertThat(messages.get(0).getAllRecipients()[0].toString()).isEqualTo("max@example.com");
        assertThat(messages.get(1).getAllRecipients()[0].toString()).isEqualTo("erika@example.com");
    }

    @Test
    void send_withLinkedArticle_appendsArticleLinkToContent() throws MessagingException, IOException {
        when(mailSender.createMimeMessage())
                .thenAnswer(invocation -> new MimeMessage(Session.getInstance(new Properties())));
        BlogArticle article = BlogArticle.builder()
                .title("Neuer Anstrich")
                .slug("neuer-anstrich")
                .content("...")
                .build();
        Newsletter newsletter = Newsletter.builder()
                .subject("Werkstattbrief")
                .content("<p>Hallo Werkstatt</p>")
                .blogArticle(article)
                .build();

        mailService.send(newsletter, List.of("max@example.com"));

        ArgumentCaptor<MimeMessage> sent = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(sent.capture());
        MimeMessage message = sent.getValue();
        message.saveChanges();
        String body = (String) message.getContent();
        assertThat(body).contains("<p>Hallo Werkstatt</p>");
        assertThat(body).contains("href=\"https://foobar.de/werkstattbuch/neuer-anstrich\"");
        assertThat(body).contains("Du willst noch mehr über diese Neuigkeit erfahren?<br>");
        assertThat(body).contains(">Werkstattbrief</a>");
    }

    @Test
    void send_recipientFailure_isSkippedWithoutAbortingTheRest() {
        when(mailSender.createMimeMessage())
                .thenAnswer(invocation -> new MimeMessage(Session.getInstance(new Properties())));
        doThrow(new MailSendException("rejected")).doNothing().when(mailSender).send(any(MimeMessage.class));

        mailService.send(newsletter("Werkstattbrief", "<p>Hallo</p>"),
                List.of("bounced@example.com", "max@example.com"));

        verify(mailSender, times(2)).send(any(MimeMessage.class));
    }
}
