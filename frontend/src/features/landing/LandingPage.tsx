import { HeroSection } from './HeroSection';
import { ProductsSection } from './ProductsSection';
import { ProcessSection } from './ProcessSection';
import { AboutSection } from './AboutSection';
import { BlogArticleSection } from './BlogArticleSection';
import { MaterialSection } from './MaterialSection';
import { NewsletterSection } from '../newsletter/NewsletterSection';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <ProcessSection />
      <AboutSection />
      <BlogArticleSection />
      <NewsletterSection />
      <MaterialSection />
    </>
  );
}
