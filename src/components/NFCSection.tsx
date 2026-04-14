import React from 'react';
import { lifestyleImages, featureBanners } from '@/data/products';
import { Smartphone, CreditCard, Lock, Share2, Heart, Home, Fingerprint, Wifi } from 'lucide-react';

const nfcFeatures = [
  {
    icon: CreditCard,
    title: 'Contactless Payments',
    desc: 'Tap to pay anywhere that accepts NFC payments. Works with Visa, Mastercard, and Apple Pay.',
  },
  {
    icon: Lock,
    title: 'Smart Access Control',
    desc: 'Unlock doors, offices, and vehicles with a simple tap. Replace keys and access cards.',
  },
  {
    icon: Share2,
    title: 'Digital Business Card',
    desc: 'Share your contact info, portfolio, or social profiles instantly with a tap.',
  },
  {
    icon: Smartphone,
    title: 'Phone Automation',
    desc: 'Trigger custom actions on your phone — launch apps, toggle settings, send messages.',
  },
  {
    icon: Home,
    title: 'Smart Home Control',
    desc: 'Control lights, thermostats, and smart devices with a tap on any NFC reader.',
  },
  {
    icon: Fingerprint,
    title: 'Identity Verification',
    desc: 'Secure two-factor authentication and digital identity verification on the go.',
  },
  {
    icon: Heart,
    title: 'Medical ID',
    desc: 'Store emergency medical info accessible by first responders with a simple scan.',
  },
  {
    icon: Wifi,
    title: 'WiFi Sharing',
    desc: 'Share your WiFi credentials instantly — guests tap your ring to connect.',
  },
];

const NFCSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">NFC Technology</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            One Tap. <span className="gradient-text">Infinite Possibilities.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every AxonRing is powered by advanced NFC technology that transforms a simple tap
            into a world of seamless interactions.
          </p>
        </div>

        {/* Feature Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-16 group">
          <img
            src={featureBanners[0]}
            alt="NFC Smart Ring in action"
            className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,25%,6%)] via-[hsl(220,25%,6%)]/60 to-transparent flex items-center">
            <div className="p-8 sm:p-12 max-w-lg">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Your World, One Tap Away
              </h3>
              <p className="text-gray-300 mb-4">
                From contactless payments to smart home control, AxonRing's NFC chip
                works with thousands of devices and services worldwide.
              </p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                <span>Compatible with 10,000+ NFC devices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nfcFeatures.map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 hover:bg-cyan-400/[0.03] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/20 transition-colors">
                <feature.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Lifestyle Gallery */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {lifestyleImages.map((img, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden group aspect-[3/2]">
              <img
                src={img}
                alt={`NFC Smart Ring lifestyle ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NFCSection;
