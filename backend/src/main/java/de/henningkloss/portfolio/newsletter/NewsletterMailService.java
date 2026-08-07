package de.henningkloss.portfolio.newsletter;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Dispatches one newsletter to a list of recipients over SMTP (MailHog locally,
 * Brevo's SMTP relay in production - see architektur-entscheidungen.md). Best-effort:
 * a failed address is logged and skipped rather than aborting the whole send-out.
 */
@Service
@Slf4j
public class NewsletterMailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String siteBaseUrl;

    public NewsletterMailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress,
            @Value("${app.site.base-url}") String siteBaseUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.siteBaseUrl = siteBaseUrl;
    }

    public void send(Newsletter newsletter, List<String> recipientEmails) {
        for (String recipientEmail : recipientEmails) {
            try {
                mailSender.send(buildMessage(newsletter, recipientEmail));
            } catch (MailException | jakarta.mail.MessagingException e) {
                log.warn("Failed to send newsletter {} to {}: {}", newsletter.getId(), recipientEmail, e.getMessage());
            }
        }
    }

    private MimeMessage buildMessage(Newsletter newsletter, String recipientEmail) throws jakarta.mail.MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromAddress);
        helper.setTo(recipientEmail);
        helper.setSubject(newsletter.getSubject());
        helper.setText(buildBody(newsletter), true);
        return message;
    }

    private String buildBody(Newsletter newsletter) {
        if (newsletter.getBlogArticle() == null) {
            return newsletter.getContent();
        }
        String articleUrl = siteBaseUrl + "/werkstattbuch/" + newsletter.getBlogArticle().getSlug();
        return newsletter.getContent()
                + "<p>Du willst noch mehr über diese Neuigkeit erfahren?<br>"
                + "Dann schau in unserem <a href=\"" + articleUrl + "\">Werkstattbrief</a> vorbei.</p>";
    }
}
