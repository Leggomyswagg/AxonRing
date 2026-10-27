import React, { useState, useCallback } from 'react';

import { CartProvider } from '@/contexts/CartContext';
import { products, Product } from '@/data/products';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import NFCSection from './NFCSection';
import ComparisonSection from './ComparisonSection';
import TrustSection from './TrustSection';
import ShopPage from './ShopPage';
import ProductDetail from './ProductDetail';
import Checkout from './Checkout';
import AboutPage from './AboutPage';
import NFCPage from './NFCPage';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import Footer from './Footer';

type Page = 'home' | 'shop' | 'product' | 'checkout' | 'about' | 'nfc';

const AppLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleViewProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getRelatedProducts = useCallback((product: Product) => {
    return products.filter(p => p.id !== product.id && p.category === product.category);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <CartDrawer onCheckout={() => handlePageChange('checkout')} />
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onViewProduct={handleViewProduct}
        />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero
                onShopNow={() => handlePageChange('shop')}
                onLearnMore={() => handlePageChange('nfc')}
              />
              <FeaturedProducts
                onViewProduct={handleViewProduct}
                onViewAll={() => handlePageChange('shop')}
              />
              <NFCSection />
              <ComparisonSection onShopCategory={() => handlePageChange('shop')} />
              <TrustSection />
            </>
          )}

          {currentPage === 'shop' && (
            <ShopPage onViewProduct={handleViewProduct} />
          )}

          {currentPage === 'product' && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onBack={() => handlePageChange('shop')}
              onViewProduct={handleViewProduct}
              relatedProducts={getRelatedProducts(selectedProduct)}
            />
          )}

          {currentPage === 'checkout' && (
            <Checkout onBack={() => handlePageChange('shop')} />
          )}

          {currentPage === 'about' && (
            <AboutPage onShopNow={() => handlePageChange('shop')} />
          )}

          {currentPage === 'nfc' && (
            <NFCPage onShopNow={() => handlePageChange('shop')} />
          )}
        </main>

        <Footer setCurrentPage={handlePageChange} />
      </div>
    </CartProvider>
  );
};

export default AppLayout;
