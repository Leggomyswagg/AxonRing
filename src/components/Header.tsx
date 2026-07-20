import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { COLLECTIONS, searchProducts } from '@/data/catalog';
import { analytics } from '@/hooks/useAnalytics';

const NAV_COLLECTIONS = COLLECTIONS.filter(c => c.handle !== 'all-rings' && c.is_visible);

export default function Header() {
  const [scrolled,        setScrolled]        = useState(false);
  const [mobileOpen,      setMobileOpen]       = useState(false);
  const [collectionsOpen, setCollectionsOpen]  = useState(false);
  const [searchOpen,      setSearchOpen]       = useState(false);
  const [searchQuery,     setSearchQuery]      = useState('');
  const searchRef                              = useRef<HTMLDivElement>(null);
  const { cartCount, setIsCartOpen }           = useCart();
  const location                               = useLocation();

  const searchResults = searchQuery.length >= 2 ? searchProducts(searchQuery).slice(0, 5) : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCollectionsOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.length >= 2) analytics.search(q);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl' : 'bg-transparent'}`}>
      {/* Promo bar */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-center py-1.5 text-xs font-medium tracking-wide">
        Free Shipping on All Orders — Use code <span className="font-bold">WELCOME10</span> for 10% off
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              AXON<span className="text-rose-400">RING</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Collections dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white transition-colors py-2">
                Collections <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {collectionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-5 grid grid-cols-2 gap-3">
                  {NAV_COLLECTIONS.map(col => (
                    <Link
                      key={col.id}
                      to={`/collections/${col.handle}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                        <img src={col.image_url} alt={col.title} className="w-full h-full object-cover opacity-70" />
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-rose-400 transition-colors text-sm">{col.title}</p>
                        <p className="text-xs text-zinc-500 line-clamp-1">{col.description}</p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    to="/collections/all-rings"
                    className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-rose-400 font-semibold text-sm"
                  >
                    View All Rings →
                  </Link>
                </div>
              )}
            </div>

            <Link to="/collections/all-rings"   className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">All Rings</Link>
            <Link to="/collections/elite"       className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Elite</Link>
            <Link to="/collections/new-arrivals" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">New Arrivals</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(''); }}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-4">
                  <input
                    type="text"
                    placeholder="Search rings..."
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {searchResults.map(p => (
                        <Link
                          key={p.id}
                          to={`/product/${p.handle}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
                        >
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{p.name}</p>
                            <p className="text-xs text-rose-400">${p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchQuery.length >= 2 && searchResults.length === 0 && (
                    <p className="text-sm text-zinc-500 mt-3 text-center">No results for "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800">
          <div className="px-4 py-6 space-y-1">
            {[
              { to: '/collections/all-rings',    label: 'All Rings'    },
              { to: '/collections/elite',        label: 'Elite'        },
              { to: '/collections/pro',          label: 'Pro'          },
              { to: '/collections/standard',     label: 'Standard'     },
              { to: '/collections/new-arrivals', label: 'New Arrivals' },
              { to: '/collections/best-sellers', label: 'Best Sellers' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="block px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
