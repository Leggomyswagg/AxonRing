import React from 'react';
import { featureBanners, lifestyleImages } from '@/data/products';
import { Target, Lightbulb, Users, Globe, Award, Shield, Zap, Heart } from 'lucide-react';

interface AboutPageProps {
  onShopNow: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onShopNow }) => {
  const values = [
    { icon: Lightbulb, title: 'Innovation First', desc: 'We push the boundaries of NFC technology to create wearables that genuinely improve daily life.' },
    { icon: Shield, title: 'Security by Design', desc: 'Every AxonRing features military-grade encryption and secure NFC protocols to protect your data.' },
    { icon: Heart, title: 'Crafted with Care', desc: 'Premium materials, meticulous engineering, and rigorous quality testing in every ring we ship.' },
    { icon: Globe, title: 'Global Compatibility', desc: 'Our NFC chips work with 10,000+ devices and payment systems across 30+ countries.' },
  ];

  const milestones = [
    { year: '2022', title: 'Founded', desc: 'AxonRing was born from a simple idea: what if your ring could do everything your phone does?' },
    { year: '2023', title: 'First Product', desc: 'Launched the AxonRing Classic, our first NFC smart ring, selling 5,000 units in the first month.' },
    { year: '2024', title: 'Full Collection', desc: 'Expanded to 16 models covering every lifestyle, from essential to luxury.' },
    { year: '2025', title: '50K+ Sold', desc: 'Reached 50,000 rings sold across 30+ countries with a 98% satisfaction rate.' },
    { year: '2026', title: 'Next Gen NFC', desc: 'Introducing programmable NFC with custom automation, gesture control, and biometric auth.' },
  ];

  const team = [
    { name: 'Alex Chen', role: 'CEO & Co-Founder', initials: 'AC', color: 'from-cyan-500 to-blue-600' },
    { name: 'Maya Rodriguez', role: 'CTO', initials: 'MR', color: 'from-purple-500 to-pink-600' },
    { name: 'David Kim', role: 'Head of Design', initials: 'DK', color: 'from-amber-500 to-orange-600' },
    { name: 'Sarah Patel', role: 'VP of Engineering', initials: 'SP', color: 'from-green-500 to-teal-600' },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6">
            Redefining <span className="gradient-text">Wearable Tech</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We believe the most powerful technology should be invisible. AxonRing puts the future
            on your finger — no screens, no charging, just seamless NFC connectivity.
          </p>
        </div>

        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-20 aspect-[21/9]">
          <img
            src={featureBanners[1]}
            alt="AxonRing Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,25%,6%)] via-[hsl(220,25%,6%)]/50 to-transparent flex items-center">
            <div className="p-8 sm:p-12 max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-3">Technology That Disappears</h2>
              <p className="text-gray-300">
                The best wearable is one you forget you're wearing. AxonRing's ultra-slim profile
                and premium materials make it indistinguishable from a luxury fashion ring.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((v, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Our <span className="gradient-text">Journey</span>
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className={`flex flex-col lg:flex-row items-center gap-6 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 inline-block">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{m.year}</span>
                      <h4 className="text-lg font-bold text-white mt-1">{m.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-[hsl(220,25%,6%)] z-10 flex-shrink-0 hidden lg:block" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-white text-center mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="text-gray-400 text-center max-w-lg mx-auto mb-12">
            A passionate team of engineers, designers, and dreamers building the future of wearable NFC technology.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all duration-300">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white`}>
                  {t.initials}
                </div>
                <h4 className="text-sm font-bold text-white">{t.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-400/10">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Join the Revolution?</h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Experience the future of NFC wearable technology. Find your perfect AxonRing today.
          </p>
          <button
            onClick={onShopNow}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
          >
            Shop the Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
