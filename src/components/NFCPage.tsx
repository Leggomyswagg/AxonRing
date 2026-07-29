import React from 'react';
import { featureBanners, lifestyleImages } from '@/data/products';
import {
  Wifi, CreditCard, Lock, Smartphone, Home, Share2, Heart, Fingerprint,
  Shield, Zap, Globe, CheckCircle, ArrowRight
} from 'lucide-react';

interface NFCPageProps {
  onShopNow: () => void;
}

const NFCPage: React.FC<NFCPageProps> = ({ onShopNow }) => {
  const capabilities = [
    {
      icon: CreditCard,
      title: 'Contactless Payments',
      desc: 'Pay at any NFC-enabled terminal worldwide. Works with Visa, Mastercard, Apple Pay, and Google Pay. No phone needed.',
      details: ['Tokenized transactions', 'Multi-card support', 'Instant notifications', 'Spending limits'],
    },
    {
      icon: Lock,
      title: 'Access Control',
      desc: 'Replace keys, keycards, and fobs. Unlock doors, offices, hotel rooms, and vehicles with a tap of your ring.',
      details: ['MIFARE Classic/DESFire', 'HID iCLASS compatible', 'Custom key cloning', 'Multi-door support'],
    },
    {
      icon: Share2,
      title: 'Digital Identity',
      desc: 'Share your business card, portfolio, social profiles, or any URL instantly. No app needed on the receiver\'s end.',
      details: ['vCard sharing', 'Custom landing pages', 'Social media links', 'QR code fallback'],
    },
    {
      icon: Smartphone,
      title: 'Phone Automation',
      desc: 'Trigger custom actions on your phone with a tap. Launch apps, toggle settings, send messages, or run shortcuts.',
      details: ['iOS Shortcuts support', 'Android Tasker/IFTTT', 'Custom NFC tags', 'Multi-action sequences'],
    },
    {
      icon: Home,
      title: 'Smart Home',
      desc: 'Control your entire smart home ecosystem. Tap to adjust lights, temperature, music, and security systems.',
      details: ['HomeKit compatible', 'Google Home support', 'Alexa integration', 'Scene triggers'],
    },
    {
      icon: Fingerprint,
      title: 'Biometric Auth',
      desc: 'Use your ring as a second factor for secure authentication. Works with FIDO2/WebAuthn for passwordless login.',
      details: ['FIDO2 certified', 'WebAuthn support', 'Hardware security', 'Anti-cloning protection'],
    },
  ];

  const specs = [
    { label: 'NFC Protocol', value: 'ISO 14443A/B, ISO 15693' },
    { label: 'NFC Forum', value: 'Type 2 & Type 4 Tags' },
    { label: 'Frequency', value: '13.56 MHz' },
    { label: 'Read Range', value: '1-4 cm (optimized)' },
    { label: 'Memory', value: 'Up to 888 bytes (NTAG216)' },
    { label: 'Encryption', value: 'AES-128 / 3DES' },
    { label: 'Power', value: 'Passive (no battery needed)' },
    { label: 'Durability', value: '100,000+ read/write cycles' },
    { label: 'Compatibility', value: 'All NFC-enabled devices' },
    { label: 'Certifications', value: 'CE, FCC, ISO 14443' },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">NFC Technology</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6">
            The Power of <span className="gradient-text">NFC</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Near Field Communication technology enables your AxonRing to communicate with
            any NFC-enabled device within centimeters — securely, instantly, and without any battery.
          </p>
        </div>

        {/* How It Works */}
        <div className="relative rounded-2xl overflow-hidden mb-20">
          <img
            src={featureBanners[0]}
            alt="NFC Technology"
            className="w-full h-[350px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,25%,6%)] to-transparent flex items-center">
            <div className="p-8 sm:p-12 max-w-xl">
              <h2 className="text-3xl font-bold text-white mb-4">How NFC Works</h2>
              <div className="space-y-4">
                {[
                  { step: '01', text: 'Your ring contains a passive NFC chip — no battery or charging needed.' },
                  { step: '02', text: 'When brought near an NFC reader, electromagnetic induction powers the chip.' },
                  { step: '03', text: 'Data is exchanged securely in milliseconds through encrypted protocols.' },
                  { step: '04', text: 'The action completes — payment processed, door unlocked, info shared.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{item.step}</span>
                    <p className="text-sm text-gray-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            NFC <span className="gradient-text">Capabilities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-4">
                  <cap.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cap.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{cap.desc}</p>
                <ul className="space-y-1.5">
                  {cap.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Technical <span className="gradient-text">Specifications</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl overflow-hidden border border-white/5">
              {specs.map((spec, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-6 py-4 ${
                    i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                  } ${i < specs.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <span className="text-sm text-gray-400">{spec.label}</span>
                  <span className="text-sm font-semibold text-white">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-400/10 mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Bank-Level Security</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Every NFC transaction is protected by AES-128 encryption and tokenization.
                Your actual card numbers are never stored on the ring or transmitted during payments.
                Anti-cloning technology prevents unauthorized duplication.
              </p>
              <div className="flex flex-wrap gap-3">
                {['AES-128 Encryption', 'Tokenized Payments', 'Anti-Cloning', 'FIDO2 Certified'].map(badge => (
                  <span key={badge} className="px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-cyan-400/10 flex items-center justify-center animate-pulse-glow">
                <Lock className="w-16 h-16 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-4">Experience NFC Freedom</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Join 50,000+ people who have upgraded their daily interactions with AxonRing NFC technology.
          </p>
          <button
            onClick={onShopNow}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
          >
            Shop NFC Rings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFCPage;
