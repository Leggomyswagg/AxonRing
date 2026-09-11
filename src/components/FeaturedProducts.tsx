import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { PRODUCTS } from '@/data/catalog';

const FILTERS = [
  { key: 'all',      label: 'All Rings' },
  { key: 'standard', label: 'Standard'  },
  { key: 'pro',      label: 'Pro'       },
  { key: 'elite',    label: 'Elite'     },
];

export default function FeaturedProducts() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.tags.includes(filter));

  return (
    <section className="py-24 lg:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">Our Collection</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Premium Smart Rings</h2>
          </div>
          <Link
            to="/collections/all-rings"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                filter === f.key
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} featured={i === 0 && filter === 'all'} />
          ))}
        </div>
      </div>
    </section>
  );
}
