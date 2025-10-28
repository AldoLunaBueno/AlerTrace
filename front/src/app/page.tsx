import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { StatsSection } from '@/components/landing/stats-section'
import { AboutSection } from '@/components/landing/about-section'
import { RevolutionCtaSection } from '@/components/landing/revolution-cta-section'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'
import { Navbar } from '@/components/landing/navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RevolutionCtaSection />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
