import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import GuideHero from './GuideHero';
import FAQ from './FAQ';
import GuideCTA from './GuideCTA';

export default function GuidePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <GuideHero />
      <FAQ />
      {/* <GuideCTA /> */}
      <Footer />
    </main>
  );
}
