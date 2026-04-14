import React, { useState, useMemo } from 'react';
import { products, categories, Product } from '@/data/products';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';


interface ShopPageProps {
  onViewProduct: (product: Product) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onViewProduct }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [activeCategory, sortBy, searchQuery, priceRange]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Smart Ring <span className="gradient-text">Collection</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Discover our complete range of NFC-powered smart rings. From essential everyday wearables
            to luxury statement pieces.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rings..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                showFilters ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-[hsl(220,25%,12%)] border border-white/10 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="name">A-Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            <span className="text-xs text-gray-500">{filteredProducts.length} products</span>
          </div>
        </div>


        {/* Price Filter */}
        {showFilters && (
          <div className="mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h4 className="text-sm font-semibold text-white mb-3">Price Range</h4>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">${priceRange[0]}</span>
              <input
                type="range"
                min="0"
                max="600"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1 accent-cyan-500"
              />
              <span className="text-xs text-gray-500">${priceRange[1]}</span>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">No rings found</p>
            <p className="text-sm text-gray-600">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setPriceRange([0, 600]);
              }}
              className="mt-4 px-6 py-2 text-sm text-cyan-400 border border-cyan-400/20 rounded-lg hover:bg-cyan-400/10 transition-colors"
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
