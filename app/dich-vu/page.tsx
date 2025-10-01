
import ServiceHero from './ServiceHero';
import ServiceFeaturesList from './ServiceFeaturesList';
import ServiceDemo from './ServiceDemo';
import ServicePricingNew from './ServicePricingNew';
import ServiceFinalCTA from './ServiceFinalCTA';
import Header from '../components/landing/Header';

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ServiceHero />
      <ServiceFeaturesList />
      <ServiceDemo />
      <ServicePricingNew />
      <ServiceFinalCTA />
    </main>
  );
}
