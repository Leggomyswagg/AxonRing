import { Link } from 'react-router-dom';
import { ArrowRight, Wifi, Shield, Zap } from 'lucide-react';

const HERO_IMG = 'https://d64gsuwffb70l.cloudfront.net/69d0c917003e3eb97e85a036_1775290974994_c1322658.jpg';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="AxonRing Hero" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-rose-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">Now Shipping Worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
            Luxury
            <br />
            Meets
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              Technology
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
            The world's most advanced NFC smart ring. Pay, unlock, track, and control — all from the ring on your finger. Crafted from premium materials for those who refuse to compromise.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              to="/collections/all-rings"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/collections/elite"
              className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-600 hover:border-zinc-400 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/5"
            >
              Explore Elite
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Wifi, label: 'NFC Payments', color: 'text-cyan-400' },
              { icon: Shield, label: 'Health Tracking', color: 'text-emerald-400' },
              { icon: Zap, label: 'Smart Home', color: 'text-amber-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800/50 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50M+', label: 'NFC Transactions' },
              { value: '150K+', label: 'Happy Wearers' },
              { value: '4.9/5', label: 'Customer Rating' },
              { value: '2yr', label: 'Warranty' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
