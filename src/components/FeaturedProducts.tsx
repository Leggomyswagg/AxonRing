import React from 'react';
import { products, Product } from '@/data/products';
import ProductCard from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedProductsProps {
  onViewProduct: (product: Product) => void;
  onViewAll: () => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onViewProduct, onViewAll }) => {
  // Show 8 featured products (those with badges + highest rated)
  const featured = products
    .sort((a, b) => {
      if (a.badge && !b.badge) return -1;
      if (!a.badge && b.badge) return 1;
      return b.rating - a.rating;
    })
    .slice(0, 8);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Featured Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Best <span className="gradient-text">Sellers</span>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="group flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mt-4 sm:mt-0"
          >
            View All Rings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Can't decide? Take our Ring Finder Quiz
            </h3>
            <p className="text-sm text-gray-400">
              Answer 5 quick questions and we'll recommend the perfect AxonRing for your lifestyle.
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="flex-shrink-0 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
          >
            Find My Ring
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
