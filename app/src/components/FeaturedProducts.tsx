import React from 'react';
import { products, Product, lifestyleImages } from '@/data/products';
import ProductCard from './ProductCard';
import { ArrowRight, Zap, Star } from 'lucide-react';

interface FeaturedProductsProps {
  onViewProduct: (product: Product) => void;
  onViewAll: () => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onViewProduct, onViewAll }) => {
  const flagship = products.find(p => p.flagship);
  const rest = products.filter(p => !p.flagship);

  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section intro */}
        <div className="mb-16">
          <p className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.3em] mb-3">The Collection</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight">
              Crafted for <span className="gradient-text">Every Life</span>
            </h2>
            <button
              onClick={onViewAll}
              className="group flex items-center gap-2 text-sm text-gray-500 hover:text-yellow-400 transition-colors self-start sm:self-auto uppercase tracking-wider font-semibold"
            >
              View all rings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="gold-divider mt-5" />
        </div>

        {/* ── FLAGSHIP HERO CARD ── */}
        {flagship && (
          <div
            className="relative overflow-hidden mb-6 cursor-pointer group border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-500"
            onClick={() => onViewProduct(flagship)}
          >
            {/* Background image */}
            <div className="relative h-[420px] sm:h-[520px]">
              <img
                src={flagship.image}
                alt={flagship.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-10 sm:px-16 max-w-2xl">
                {/* Label */}
                <div className="flex items-center gap-2 mb-5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-[0.25em]">Most Advanced Ring We Offer</span>
                </div>

                <h2 className="font-serif text-5xl sm:text-7xl font-bold text-white mb-3 leading-none">
                  {flagship.name}
                </h2>

                <p className="text-yellow-400/80 font-serif text-xl italic mb-4">
                  The world's first smart ring with a micro-display & button.
                </p>

                <div className="gold-divider mb-5" />

                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-lg">
                  Real-time notifications on your finger. ECG, blood pressure, SpO2 — all visible at a glance.
                  One button. Infinite control. This is what's next.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Micro-Display', 'Tactile Button', 'ECG Monitor', 'AI Health Coach', 'Gesture Control'].map(f => (
                    <span key={f} className="px-3 py-1 text-[10px] font-semibold text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 uppercase tracking-wider">
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA + price */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => onViewProduct(flagship)}
                    className="group/btn flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-sm uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-400 transition-all"
                  >
                    Shop the Ultra
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <div>
                    <p className="text-white text-2xl font-bold">${flagship.price}</p>
                    <p className="text-gray-600 text-xs line-through">${flagship.originalPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner tag */}
            <div className="absolute top-6 right-6 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
              NEW
            </div>
          </div>
        )}

        {/* ── LIFESTYLE EDITORIAL STRIP ── */}
        <div className="grid grid-cols-3 gap-2 mb-16 h-[320px]">
          <div className="col-span-2 relative overflow-hidden group cursor-pointer" onClick={onViewAll}>
            <img src={lifestyleImages[0]} alt="AxonRing in action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-7">
              <p className="text-yellow-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-1.5">New Arrivals</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">The Premium Series</h3>
              <button className="flex items-center gap-2 text-white text-xs font-semibold border-b border-yellow-500 pb-0.5 hover:text-yellow-400 transition-colors">
                Shop Now <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex-1 relative overflow-hidden group cursor-pointer" onClick={onViewAll}>
              <img src={lifestyleImages[1]} alt="AxonRing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4"><p className="text-white text-[10px] font-semibold uppercase tracking-wider">Luxury</p></div>
            </div>
            <div className="flex-1 relative overflow-hidden group cursor-pointer" onClick={onViewAll}>
              <img src={lifestyleImages[2]} alt="AxonRing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-4"><p className="text-white text-[10px] font-semibold uppercase tracking-wider">Everyday</p></div>
            </div>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-16 overflow-hidden">
          {[
            { number: '50,000+', label: 'Rings Sold' },
            { number: '30+', label: 'Countries' },
            { number: '4.9★', label: 'Avg Rating' },
            { number: '98%', label: 'Satisfied Customers' },
          ].map(({ number, label }) => (
            <div key={label} className="bg-black py-8 px-6 text-center">
              <p className="font-serif text-4xl font-bold gradient-text mb-1">{number}</p>
              <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">{label}</p>
            </div>
          ))}
        </div>

        {/* ── REST OF COLLECTION ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.3em] mb-2">Best Sellers</p>
            <h3 className="font-serif text-3xl font-bold text-white">The Full Lineup</h3>
          </div>
          <button onClick={onViewAll} className="group flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-yellow-400 transition-colors uppercase tracking-wider">
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {rest.map(product => (
            <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} />
          ))}
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        <div className="relative overflow-hidden">
          <img src={lifestyleImages[3]} alt="AxonRing" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent flex items-center">
            <div className="px-10 max-w-lg">
              <p className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.3em] mb-3">Why AxonRing</p>
              <h3 className="font-serif text-3xl font-bold text-white mb-3 leading-tight">
                Your whole wallet.<br />On one finger.
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Leave your cards, keys, and phone at home. AxonRing stores your payment info,
                access credentials, and digital identity — all on your hand.
              </p>
              <button
                onClick={onViewAll}
                className="group flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-sm uppercase tracking-wider hover:from-yellow-500 hover:to-yellow-400 transition-all"
              >
                Find Your Ring
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
