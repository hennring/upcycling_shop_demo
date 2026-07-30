package de.henningkloss.portfolio.blog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogArticleRepository extends JpaRepository<BlogArticle, Long> {

    Optional<BlogArticle> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    List<BlogArticle> findByPublishedTrueOrderByPublishedAtDesc();

    List<BlogArticle> findAllByOrderByCreatedAtDesc();
}
