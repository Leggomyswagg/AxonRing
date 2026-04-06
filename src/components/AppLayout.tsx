import Header from './Header';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import CollectionCards from './CollectionCards';
import HowItWorks from './HowItWorks';
import ComparisonTable from './ComparisonTable';
import Testimonials from './Testimonials';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />
      <main>
        <Hero />
        <FeaturedProducts />
        <CollectionCards />
        <HowItWorks />
        <ComparisonTable />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
