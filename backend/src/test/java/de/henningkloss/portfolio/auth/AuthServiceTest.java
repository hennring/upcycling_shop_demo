package de.henningkloss.portfolio.auth;

import de.henningkloss.portfolio.auth.dto.AuthResponse;
import de.henningkloss.portfolio.auth.dto.LoginRequest;
import de.henningkloss.portfolio.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final AuthenticationManager authenticationManager = mock(AuthenticationManager.class);

    private final AuthService authService =
            new AuthService(userRepository, passwordEncoder, jwtService, authenticationManager);

    @Test
    void register_storesLowercasedEmailAndHashedPassword() {
        when(userRepository.existsByEmail("max@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(new RegisterRequest(" Max@Example.COM ", "password123"));

        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertThat(saved.getValue().getEmail()).isEqualTo("max@example.com");
        assertThat(saved.getValue().getPasswordHash()).isEqualTo("hashed");
        assertThat(saved.getValue().getRole()).isEqualTo(Role.USER);
        assertThat(response.token()).isEqualTo("jwt-token");
    }

    @Test
    void register_sameEmailDifferentCasing_isRejected() {
        when(userRepository.existsByEmail("max@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(new RegisterRequest("MAX@example.com", "password123")))
                .isInstanceOf(EmailAlreadyUsedException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_authenticatesWithLowercasedEmail() {
        User user = User.builder().email("max@example.com").passwordHash("hashed").role(Role.USER).build();
        when(userRepository.findByEmail("max@example.com")).thenReturn(java.util.Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        AuthResponse response = authService.login(new LoginRequest("Max@Example.com", "password123"));

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("max@example.com", "password123"));
        assertThat(response.email()).isEqualTo("max@example.com");
    }
}
