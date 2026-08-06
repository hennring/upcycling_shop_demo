package de.henningkloss.portfolio.admin.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Serves files written by {@link LocalFileStorageService} back out over HTTP.
 * Active under the same condition as that service.
 */
@Configuration
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalStorageResourceConfig implements WebMvcConfigurer {

    private final String basePath;
    private final String publicPath;

    public LocalStorageResourceConfig(
            @Value("${app.storage.local.base-path}") String basePath,
            @Value("${app.storage.local.public-path}") String publicPath) {
        this.basePath = basePath;
        this.publicPath = publicPath;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = "file:" + basePath.replace("\\", "/") + "/";
        registry.addResourceHandler(publicPath + "/**").addResourceLocations(location);
    }
}
