package de.henningkloss.portfolio.auth.dto;

public record AuthResponse(String token, String email, String role) {
}
