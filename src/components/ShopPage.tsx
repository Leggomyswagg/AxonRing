import React, { useState, useMemo } from 'react';
import { products, Product } from '@/data/products';
import ProductCard from './ProductCard';
import { ArrowRight, SlidersHorizontal, ChevronDown, Search, Zap } from 'lucide-react';

interface ShopPageProps {
  onViewProduct: (product: Product) => void;
}

const categories = ['All', 'Flagship', 'Premium', 'Luxury', 'Everyday', 'Sport', 'Essential'];

const ShopPage: React.FC<ShopPageProps> = ({ onViewProduct }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory !== 'All') filtered = filtered.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q)
      );
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'reviews': filtered.sort((a, b) => b.reviews - a.reviews); break;
      default:
        // Featured: flagship first, then by rating
        filtered.sort((a, b) => {
          if (a.flagship && !b.flagship) return -1;
          if (!a.flagship && b.flagship) return 1;
          return b.rating - a.rating;
        });
    }
    return filtered;
  }, [activeCategory, sortBy, searchQuery, priceRange]);

  const flagship = products.find(p => p.flagship);

  return (
    <section className="pt-8 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Page header */}
        <div className="pt-12 pb-10 border-b border-white/5 mb-10">
          <p className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.3em] mb-3">AxonRing</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-4">
            The Collection
          </h1>
          <p className="text-gray-500 max-w-xl text-base leading-relaxed">
            Eight rings. One for every life. Crafted from the finest materials with NFC technology
            that works anywhere in the world.
          </p>
        </div>

        {/* Flagship callout banner */}
        {flagship && (
          <div
            className="relative overflow-hidden mb-10 cursor-pointer border border-yellow-500/25 hover:border-yellow-500/50 transition-all duration-300 group"
            onClick={() => onViewProduct(flagship)}
          >
            <div className="relative h-36 sm:h-48">
              <img src={flagship.image} alt={flagship.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-center px-8 sm:px-12">
              <div className="flex items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-[0.25em]">Most Advanced Ring We Offer</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">{flagship.name}</h2>
                  <p className="text-gray-400 text-sm">Micro-display · Tactile button · ECG · AI Health · ${flagship.price}</p>
                </div>
              </div>
              <button className="ml-auto flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-sm uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-400 transition-all group-hover:gap-3">
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1">NEW</div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold transition-all duration-200 uppercase tracking-wider ${
                activeCategory === cat
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 py-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rings..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors w-52"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors border ${
                showFilters ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/5' : 'border-white/10 text-gray-500 bg-white/5 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-7 py-2 bg-white/5 border border-white/10 text-xs text-gray-400 focus:outline-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600 pointer-events-none" />
            </div>
            <span className="text-xs text-gray-600">{filteredProducts.length} rings</span>
          </div>
        </div>

        {/* Price filter */}
        {showFilters && (
          <div className="mb-8 p-5 border border-white/5 bg-white/[0.02]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Price Range</h4>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 w-12">${priceRange[0]}</span>
              <input
                type="range" min="0" max="700" step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1 accent-yellow-500"
              />
              <span className="text-xs text-gray-500 w-12 text-right">${priceRange[1]}</span>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-white mb-2">Nothing found</p>
            <p className="text-sm text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setPriceRange([0, 700]); }}
              className="px-6 py-2.5 text-xs font-semibold text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/5 transition-colors uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopPage;
