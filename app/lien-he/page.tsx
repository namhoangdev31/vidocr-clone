
import ContactHero from './ContactHero';
import ContactForm from './ContactForm';
import ContactMap from './ContactMap';
import ContactCTA from './ContactCTA';
import Header from '../components/landing/Header';

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ContactHero />
      <ContactForm />
      <ContactMap />
      <ContactCTA />
    </main>
  );
}
