package de.henningkloss.portfolio.common;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;
import java.util.regex.Pattern;

/**
 * URL-slug helpers shared by blog articles and products.
 */
public final class Slugs {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");
    private static final Pattern LEADING_TRAILING_DASHES = Pattern.compile("^-+|-+$");

    private Slugs() {
    }

    /**
     * Turns arbitrary text into a lowercase ASCII slug ("Über uns!" -> "uber-uns").
     */
    public static String slugify(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFKD)
                .toLowerCase(Locale.ROOT)
                .replaceAll("\\p{M}", "");
        String slug = NON_ALPHANUMERIC.matcher(normalized).replaceAll("-");
        return LEADING_TRAILING_DASHES.matcher(slug).replaceAll("");
    }

    /**
     * Slugifies {@code requestedSlug} (falling back to {@code fallback}) and appends
     * {@code -2}, {@code -3}, ... until {@code isTaken} reports the slug as free.
     */
    public static String uniqueSlug(String requestedSlug, String fallback, Predicate<String> isTaken) {
        String base = slugify(requestedSlug == null || requestedSlug.isBlank() ? fallback : requestedSlug);

        String candidate = base;
        int suffix = 2;
        while (isTaken.test(candidate)) {
            candidate = base + "-" + suffix++;
        }
        return candidate;
    }
}
