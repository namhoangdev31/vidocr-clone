import Hero from '@/app/components/landing/Hero'
import CoreFeature from '@/app/components/landing/CoreFeature'
import SmartFeatures from '@/app/components/landing/SmartFeatures'
import SmartAnalysis from '@/app/components/landing/SmartAnalysis'
import HowItWorks from '@/app/components/landing/HowItWorks'
import Applications from '@/app/components/landing/Applications'
import LanguageSupport from '@/app/components/landing/LanguageSupport'
import AdvancedFeatures from '@/app/components/landing/AdvancedFeatures'
import Testimonials from '@/app/components/landing/Testimonials'
import Stats from '@/app/components/landing/Stats'
import Pricing from '@/app/components/landing/Pricing'
import Blog from '@/app/components/landing/Blog'
import CallToAction from '@/app/components/landing/CallToAction'
import Footer from '@/app/components/landing/Footer'
import Header from '../components/landing/Header'

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <CoreFeature />
      <SmartFeatures />
      <SmartAnalysis />
      <HowItWorks />
      <Applications />
      <LanguageSupport /> 
      <AdvancedFeatures />
      <Testimonials />
      <Stats />
      <Pricing />
      <Blog />
      {/* <CallToAction /> */}
      <Footer />
    </main>
  )
}
