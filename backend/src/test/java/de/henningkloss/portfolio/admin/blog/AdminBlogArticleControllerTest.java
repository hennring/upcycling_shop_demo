package de.henningkloss.portfolio.admin.blog;

import de.henningkloss.portfolio.admin.storage.FileStorageService;
import de.henningkloss.portfolio.auth.Role;
import de.henningkloss.portfolio.auth.User;
import de.henningkloss.portfolio.auth.config.SecurityConfig;
import de.henningkloss.portfolio.auth.JwtService;
import de.henningkloss.portfolio.auth.UserDetailsServiceImpl;
import de.henningkloss.portfolio.blog.BlogArticleService;
import de.henningkloss.portfolio.blog.dto.BlogArticleResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminBlogArticleController.class)
@Import(SecurityConfig.class)
class AdminBlogArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BlogArticleService blogArticleService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    private static User admin() {
        return User.builder().email("admin@example.com").passwordHash("hashed").role(Role.ADMIN).build();
    }

    private static User regularUser() {
        return User.builder().email("user@example.com").passwordHash("hashed").role(Role.USER).build();
    }

    @Test
    void list_asAdmin_returnsOk() throws Exception {
        when(blogArticleService.getAll()).thenReturn(java.util.List.of(
                new BlogArticleResponse(1L, "Title", "slug", "excerpt", "content", null, true, Instant.now(), Instant.now(), Instant.now())));

        mockMvc.perform(get("/api/admin/blog").with(user(admin())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("slug"));
    }

    @Test
    void list_asRegularUser_returnsForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/blog").with(user(regularUser())))
                .andExpect(status().isForbidden());
    }

    @Test
    void list_anonymous_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/blog"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadImage_asAdmin_returnsCreated() throws Exception {
        when(fileStorageService.store(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.eq("blog")))
                .thenReturn("/uploads/blog/generated.jpg");

        MockMultipartFile file = new MockMultipartFile("file", "header.jpg", "image/jpeg", "content".getBytes());

        mockMvc.perform(multipart("/api/admin/blog/images").file(file).with(user(admin())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.imageUrl").value("/uploads/blog/generated.jpg"));
    }

    @Test
    void uploadImage_asRegularUser_returnsForbidden() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "header.jpg", "image/jpeg", "content".getBytes());

        mockMvc.perform(multipart("/api/admin/blog/images").file(file).with(user(regularUser())))
                .andExpect(status().isForbidden());
    }
}
