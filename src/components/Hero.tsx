import React from 'react';
import { heroBanner } from '@/data/products';
import { ArrowRight, Shield, Zap, Wifi } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow, onLearnMore }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">

      {/* Full-bleed Ultra banner — edge to edge, no borders */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="AxonRing Ultra"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay — heavy on left for text legibility, fades to transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
        {/* Top/bottom fade to black — ensures seamless blend with site */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        {/* Subtle vignette on all edges */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="py-32 max-w-2xl">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-gold mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.2em]">
              AxonRing Ultra — Premium NFC Smart Ring
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] mb-4 animate-slide-in">
            <span className="text-white">Your World,</span>
            <br />
            <span className="gradient-text">One Tap Away</span>
          </h1>

          {/* Sub headline */}
          <p className="font-serif text-2xl sm:text-3xl text-gray-300 font-light mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your whole wallet. On one finger.
          </p>

          {/* Gold divider */}
          <div className="gold-divider mb-6" />

          {/* Body copy */}
          <p className="text-base text-gray-400 leading-relaxed mb-8 max-w-md animate-fade-in" style={{ animationDelay: '0.15s' }}>
            Leave your cards, keys, and phone at home. AxonRing stores your payment info,
            access credentials, and digital identity — all on your hand.
          </p>

          {/* Bullet points */}
          <ul className="space-y-3 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {[
              'Tap to pay at any NFC terminal worldwide',
              'Replace your office keycard and house keys',
              'Share contacts and socials in one tap',
              'Compatible with 10,000+ NFC devices',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-400 text-sm">
                <span className="w-4 h-4 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={onShopNow}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 tracking-wider text-sm uppercase"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLearnMore}
              className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-semibold hover:border-yellow-500/50 hover:text-yellow-400 transition-all duration-300 text-sm uppercase tracking-wider"
            >
              Explore NFC
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Shield, text: 'Military-Grade Encryption' },
              { icon: Zap, text: 'No Battery Required' },
              { icon: Wifi, text: 'Works Worldwide' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-500">
                <Icon className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-medium tracking-wide">{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-yellow-500" />
        <span className="text-[9px] text-gray-500 uppercase tracking-[0.3em]">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
