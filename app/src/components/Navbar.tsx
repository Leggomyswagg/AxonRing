import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react';
import { LOGO_URL } from '@/data/products';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onSearchOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onSearchOpen }) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop', hasDropdown: true },
    { label: 'NFC Technology', page: 'nfc' },
    { label: 'Our Story', page: 'about' },
  ];

  const shopCategories = ['All Rings', 'Essential', 'Classic', 'Wellness', 'Sport', 'Tech', 'Premium', 'Luxury'];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-yellow-900/60 via-yellow-800/40 to-yellow-900/60 text-yellow-200 border-b border-yellow-500/20 text-center py-2 px-4 text-sm font-medium">
        <span className="hidden sm:inline">FREE SHIPPING on orders over $199 | Use code </span>
        <span className="font-bold">NFC2026</span>
        <span className="hidden sm:inline"> for 15% off your first order</span>
        <span className="sm:hidden"> — 15% OFF First Order</span>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-yellow-500/10 shadow-lg shadow-black/40'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 group"
            >
              <img
                src={LOGO_URL}
                alt="AxonRing"
                className="h-12 w-auto object-contain drop-shadow-lg"
              />
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <div key={link.page} className="relative">
                  <button
                    onClick={() => {
                      if (link.hasDropdown) {
                        setShopDropdown(!shopDropdown);
                      } else {
                        setCurrentPage(link.page);
                        setShopDropdown(false);
                      }
                    }}
                    className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-yellow-400 ${
                      currentPage === link.page ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Shop Dropdown */}
                  {link.hasDropdown && shopDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 glass rounded-lg py-2 shadow-xl">
                      {shopCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCurrentPage('shop');
                            setShopDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSearchOpen}
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-yellow-500 text-black text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass border-t border-white/5">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <button
                  key={link.page}
                  onClick={() => {
                    setCurrentPage(link.page);
                    setMobileOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
