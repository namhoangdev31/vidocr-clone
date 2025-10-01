  import Header from '../components/landing/Header';
  import PricingHero from './PricingHero';
import VideoComparison from './VideoComparison';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import SupportedUseCases from './SupportedUseCases';
import LanguageSupport from './LanguageSupport';
import CoreFeatures from './CoreFeatures';
import Testimonials from './Testimonials';
import TrustedBy from './TrustedBy';
import WhatYouGet from './WhatYouGet';
import SimplePricing from './SimplePricing';
import ResourcesInsights from './ResourcesInsights';
import FinalCTA from './FinalCTA';

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PricingHero />
        <VideoComparison />
        <WhyChooseUs />
        <HowItWorks />
        <SupportedUseCases />
        <LanguageSupport />
        <CoreFeatures />
        <Testimonials />
        <TrustedBy />
        <WhatYouGet />
        <SimplePricing />
        <ResourcesInsights />
        <FinalCTA />
      </main>
    </>
  );
}