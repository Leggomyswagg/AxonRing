import React from 'react';
import { heroImage } from '@/data/products';
import { ArrowRight, Shield, Zap, Wifi } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onLearnMore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow, onLearnMore }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="AxonRing Smart Ring"
          className="w-full h-full object-cover"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,6%)] via-transparent to-transparent" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              NFC-Powered Smart Wearable
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 animate-slide-in">
            <span className="text-white">The Future</span>
            <br />
            <span className="text-white">On Your </span>
            <span className="gradient-text">Finger</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 max-w-lg animate-slide-in" style={{ animationDelay: '0.1s' }}>
            Tap to pay. Tap to unlock. Tap to connect. AxonRing combines premium craftsmanship with
            advanced NFC technology — transforming how you interact with the world.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={onShopNow}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLearnMore}
              className="flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Explore NFC
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium">No Charging Needed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium">Universal NFC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
