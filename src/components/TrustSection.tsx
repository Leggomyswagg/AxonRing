import React from 'react';
import { Shield, Truck, RotateCcw, Headphones, Star, Award, Lock, CheckCircle } from 'lucide-react';

const trustBadges = [
  { icon: Shield, label: 'Secure Checkout', desc: '256-bit SSL encryption on every order' },
  { icon: Truck, label: 'Free Shipping', desc: 'Complimentary on all orders over $199' },
  { icon: RotateCcw, label: '30-Day Returns', desc: 'Hassle-free, no questions asked' },
  { icon: Headphones, label: '24/7 Support', desc: 'Real humans, always ready to help' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Tech Executive',
    text: 'The AxonRing Elite has completely replaced my wallet and office keycard. One tap and I\'m in — it\'s effortless.',
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James K.',
    role: 'Fitness Coach',
    text: 'I wear my AxonRing Sport 24/7. NFC gym access, contactless payment, all from my finger. It\'s changed everything.',
    rating: 5,
    avatar: 'JK',
  },
  {
    name: 'Elena R.',
    role: 'Entrepreneur',
    text: 'Sharing my digital business card with a tap? That\'s the future. People are always blown away at networking events.',
    rating: 5,
    avatar: 'ER',
  },
];

const TrustSection: React.FC = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-sm overflow-hidden mb-24">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 bg-black hover:bg-yellow-500/[0.03] transition-colors duration-300 group">
              <div className="w-12 h-12 rounded-sm bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                <badge.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{badge.label}</h4>
              <p className="text-xs text-gray-600">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-14">
          <p className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.3em] mb-4">Real Reviews</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-gray-500 max-w-lg mx-auto">
            Join the growing community of AxonRing wearers who've transformed how they move through the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-sm overflow-hidden mb-24">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 bg-black hover:bg-yellow-500/[0.02] transition-colors duration-300">
              <div className="flex items-center gap-1 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-[10px] font-bold text-black">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security / Compliance strip */}
        <div className="flex flex-wrap items-center justify-center gap-10 pt-10 border-t border-white/5">
          {[
            { icon: Lock, label: 'PCI DSS Compliant' },
            { icon: Shield, label: 'SSL Secured' },
            { icon: Award, label: 'ISO 14443 Certified' },
            { icon: CheckCircle, label: 'CE / FCC Approved' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-600 hover:text-yellow-500/60 transition-colors">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
