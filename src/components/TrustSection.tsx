import React from 'react';
import { Shield, Truck, RotateCcw, Headphones, Star, Award, Lock, CheckCircle } from 'lucide-react';

const trustBadges = [
  { icon: Shield, label: 'Secure Checkout', desc: '256-bit SSL encryption' },
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $199' },
  { icon: RotateCcw, label: '30-Day Returns', desc: 'No questions asked' },
  { icon: Headphones, label: '24/7 Support', desc: 'Expert assistance' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Tech Executive',
    text: 'The AxonRing Elite has completely replaced my wallet and office keycard. The NFC is incredibly responsive.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James K.',
    role: 'Fitness Coach',
    text: 'I wear my AxonRing Sport 24/7. The health tracking is accurate and the NFC gym access is a game-changer.',
    rating: 5,
    avatar: 'JK',
  },
  {
    name: 'Elena R.',
    role: 'Entrepreneur',
    text: 'Sharing my digital business card with a tap of my ring? That\'s the future. AxonRing Innovate is brilliant.',
    rating: 5,
    avatar: 'ER',
  },
];

const stats = [
  { value: '50K+', label: 'Rings Sold' },
  { value: '4.8', label: 'Average Rating' },
  { value: '98%', label: 'Satisfaction' },
  { value: '30+', label: 'Countries' },
];

const TrustSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {trustBadges.map((badge, i) => (
            <div
              key={i}
              className="trust-badge flex flex-col items-center text-center p-6 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center mb-3">
                <badge.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{badge.label}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Join the growing community of AxonRing wearers who have transformed how they interact with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-50">
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-5 h-5" />
            <span className="text-xs font-medium">PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-medium">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Award className="w-5 h-5" />
            <span className="text-xs font-medium">ISO 14443 Certified</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs font-medium">CE / FCC Approved</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
