package de.henningkloss.portfolio.newsletter;

import de.henningkloss.portfolio.blog.BlogArticle;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "newsletter")
@Getter
@Setter
@NoArgsConstructor
// private: instances are created through the builder, never with a hand-set id
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /** Optional: points the recipient at one article; null if this newsletter stands on its own. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_article_id")
    private BlogArticle blogArticle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private NewsletterStatus status = NewsletterStatus.DRAFT;

    /** Set once the send-out feature dispatches this newsletter; null while it is a draft. */
    private Instant sentAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
