import { SiteHeader } from '@/components/landing/site-header'
import {
  Hero,
  Features,
  HowItWorks,
  CouriersSection,
  CTA,
  Footer,
} from '@/components/landing/sections'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CouriersSection />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
