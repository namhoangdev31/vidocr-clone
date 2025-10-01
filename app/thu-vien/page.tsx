import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import LibraryPortfolio from './LibraryPortfolio';
import LibraryBlog from './LibraryBlog';
import LibraryResources from './LibraryResources';
import LibraryCTA from './LibraryCTA';
import LibraryHero from './LibraryHero';

export default function LibraryPage() {
  return (
    <main>
      <Header />
      <LibraryHero />
      <LibraryPortfolio />
      <LibraryBlog />
      <LibraryResources />
      {/* <LibraryCTA /> */}
      <Footer />
    </main>
  );
}
