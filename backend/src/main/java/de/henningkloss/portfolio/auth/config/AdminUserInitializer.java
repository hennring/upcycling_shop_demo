package de.henningkloss.portfolio.auth.config;

import de.henningkloss.portfolio.auth.Role;
import de.henningkloss.portfolio.auth.User;
import de.henningkloss.portfolio.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Creates the first ADMIN account on startup. Registration always yields role USER,
 * so without this the admin area would be unreachable. Credentials come from the
 * environment (Kubernetes secret in production) and are only applied if the account
 * does not exist yet – existing passwords are never overwritten.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            log.info("No app.admin.email/password configured - skipping admin bootstrap");
            return;
        }

        String email = adminEmail.trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            return;
        }

        userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build());
        log.info("Created initial admin account {}", email);
    }
}
