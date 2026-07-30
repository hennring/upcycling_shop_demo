package de.henningkloss.portfolio.newsletter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "subscriber", indexes = {
        // serves the admin statistic (count of active subscribers) and the send-out query
        @Index(name = "ix_subscriber_active", columnList = "active")
})
@Getter
@Setter
@NoArgsConstructor
// private: instances are created through the builder, never with a hand-set id
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Subscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Always stored lowercase so the unique constraint is effectively case-insensitive. */
    @Column(nullable = false, unique = true, length = 320)
    private String email;

    /**
     * Opaque secret for the unsubscribe link in every mail. Without it, unsubscribing
     * would only need someone else's e-mail address.
     */
    @Column(nullable = false, unique = true, length = 36)
    private String unsubscribeToken;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant subscribedAt;

    private Instant unsubscribedAt;
}
