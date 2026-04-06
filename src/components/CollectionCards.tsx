import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COLLECTIONS } from '@/data/catalog';

const TIER_COLORS: Record<string, string> = {
  standard:     'from-zinc-600 to-zinc-700',
  pro:          'from-rose-600 to-rose-700',
  elite:        'from-amber-500 to-amber-600',
  'new-arrivals': 'from-violet-600 to-violet-700',
  'best-sellers': 'from-emerald-600 to-emerald-700',
};

const DISPLAY_COLLECTIONS = COLLECTIONS.filter(c => c.handle !== 'all-rings' && c.is_visible);

export default function CollectionCards() {
  return (
    <section className="py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">Collections</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Find Your{' '}
            <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
              Perfect Ring
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            From essential smart features to uncompromising luxury — choose the collection that matches your lifestyle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISPLAY_COLLECTIONS.map(col => (
            <Link
              key={col.id}
              to={`/collections/${col.handle}`}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-500 aspect-[4/3]"
            >
              <img
                src={col.image_url}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${TIER_COLORS[col.handle] || 'from-zinc-600 to-zinc-700'} mb-4`}>
                  {col.title}
                </div>
                <p className="text-sm text-zinc-300 mb-4 line-clamp-2">{col.description}</p>
                <div className="flex items-center gap-2 text-rose-400 group-hover:text-rose-300 transition-colors">
                  <span className="text-sm font-semibold">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
