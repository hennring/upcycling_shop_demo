import { HeroSection } from './HeroSection';
import { ProductsSection } from './ProductsSection';
import { ProcessSection } from './ProcessSection';
import { AboutSection } from './AboutSection';
import { NewsSection } from './NewsSection';
import { MaterialSection } from './MaterialSection';
import { NewsletterSection } from '../newsletter/NewsletterSection';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <ProcessSection />
      <AboutSection />
      <NewsSection />
      <NewsletterSection />
      <MaterialSection />
    </>
  );
}
