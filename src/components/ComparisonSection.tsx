import React from 'react';
import { lifestyleImages } from '@/data/products';
import { ArrowRight, Zap, Shield, Gem, Dumbbell } from 'lucide-react';

interface ComparisonSectionProps {
  onShopCategory: () => void;
}

const categoryCards = [
  {
    title: 'Essential',
    desc: 'Start your NFC journey with core features at an accessible price.',
    price: 'From $129',
    icon: Zap,
    image: lifestyleImages[0],
    gradient: 'from-teal-500/20 to-green-500/20',
  },
  {
    title: 'Premium',
    desc: 'Advanced health metrics and encrypted NFC for professionals.',
    price: 'From $349',
    icon: Shield,
    image: lifestyleImages[1],
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    title: 'Luxury',
    desc: '18K gold accents, sapphire crystal, and VIP NFC services.',
    price: 'From $459',
    icon: Gem,
    image: lifestyleImages[2],
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'Sport',
    desc: 'Rugged construction with VO2 max tracking and gym NFC access.',
    price: 'From $199',
    icon: Dumbbell,
    image: lifestyleImages[3],
    gradient: 'from-red-500/20 to-pink-500/20',
  },
];

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onShopCategory }) => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Find Your <span className="gradient-text">Perfect Ring</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Whether you're a tech enthusiast, fitness fanatic, or luxury connoisseur —
            there's an AxonRing designed for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((card, i) => (
            <button
              key={i}
              onClick={onShopCategory}
              className="group relative rounded-xl overflow-hidden text-left"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-300 mb-2 leading-relaxed">{card.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400">{card.price}</span>
                    <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
