import React, { useState } from 'react';
import { featureImages } from '@/data/products';
import { CreditCard, Lock, Heart, Activity, Camera, Share2, Zap, Laptop } from 'lucide-react';

const nfcFeatures = [
  {
    icon: CreditCard,
    title: 'Contactless Payments',
    desc: 'Tap to pay anywhere NFC is accepted. Visa, Mastercard, Apple Pay — all from your finger.',
    image: 'healthDashboard', // woman at coffee shop tapping ring
  },
  {
    icon: Activity,
    title: 'Fitness Tracking',
    desc: '7×24H heart rate, blood oxygen, sleep score, and stress — all tracked silently on your finger.',
    image: 'gpsMotion', // man running city
  },
  {
    icon: Heart,
    title: 'Sleep Monitoring',
    desc: 'Track your sleep stages, recovery score, and restfulness every night automatically.',
    image: 'healthDashboard', // woman sleeping
  },
  {
    icon: Lock,
    title: 'Smart Access Control',
    desc: 'Unlock doors, offices, and vehicles with a tap. Say goodbye to keys and access cards.',
    image: 'accessControl', // man unlocking smart door
  },
  {
    icon: Camera,
    title: 'Remote Camera Control',
    desc: 'Shake your finger to snap a photo hands-free. Perfect for selfies and group shots.',
    image: 'remoteCamera', // woman selfie with ring
  },
  {
    icon: Laptop,
    title: 'Productivity Mode',
    desc: 'Control presentations, scroll pages, and manage your workflow with simple gestures.',
    image: 'working', // person at laptop
  },
  {
    icon: Zap,
    title: 'GPS Motion Modes',
    desc: 'Walking, running, climbing, cycling, golf — track every move with precision GPS.',
    image: 'cycling', // man cycling
  },
  {
    icon: Share2,
    title: 'Digital Business Card',
    desc: 'Share your contact, portfolio, or socials instantly with one tap — no app needed.',
    image: 'lifestyle', // social rooftop
  },
];

const NFCSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#060606] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-yellow-500/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-yellow-500 text-xs font-semibold uppercase tracking-[0.3em] mb-4">What It Does</p>
          <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white mb-4">
            One Ring. <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
          <div className="gold-divider mx-auto mb-5" />
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Every AxonRing is powered by advanced NFC technology that transforms a simple tap
            into a world of seamless interactions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nfcFeatures.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-yellow-500/25 transition-all duration-400 cursor-default"
              onMouseEnter={() => setActiveFeature(i)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={featureImages[feature.image as keyof typeof featureImages]}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: activeFeature === i ? 'scale(1.08)' : 'scale(1)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-400" />
                <div className="absolute top-4 left-4">
                  <div className="w-9 h-9 bg-black/60 backdrop-blur-sm border border-yellow-500/30 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="p-5 border-t border-white/5">
                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-500 transition-colors">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NFCSection;
