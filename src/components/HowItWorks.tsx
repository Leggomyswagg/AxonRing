import { useState } from 'react';
import { CreditCard, Activity, Home, Smartphone, Fingerprint, Globe } from 'lucide-react';

const features = [
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Contactless Payments',
    subtitle: 'Tap. Pay. Done.',
    description: 'Make secure NFC payments at any contactless terminal worldwide. Link your credit cards, debit cards, and digital wallets. No phone needed — just tap your ring.',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    stats: [
      { label: 'Supported Banks', value: '500+' },
      { label: 'Countries', value: '80+' },
      { label: 'Transaction Limit', value: 'Unlimited' },
    ],
  },
  {
    id: 'health',
    icon: Activity,
    title: 'Health Monitoring',
    subtitle: '24/7 Wellness Insights',
    description: 'Medical-grade sensors track heart rate, blood oxygen, body temperature, and sleep patterns. Get real-time health insights and personalized recommendations through the AxonRing app.',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    stats: [
      { label: 'Sensors', value: '7' },
      { label: 'Accuracy', value: '99.2%' },
      { label: 'Data Points/Day', value: '10K+' },
    ],
  },
  {
    id: 'smart-home',
    icon: Home,
    title: 'Smart Home Control',
    subtitle: 'Your Home, Your Gesture',
    description: 'Control lights, locks, thermostats, and 500+ smart home devices with programmable gestures. Wave to unlock your door, tap to dim the lights, rotate to adjust the temperature.',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    stats: [
      { label: 'Compatible Devices', value: '500+' },
      { label: 'Gestures', value: '12' },
      { label: 'Response Time', value: '<50ms' },
    ],
  },
  {
    id: 'access',
    icon: Fingerprint,
    title: 'Digital Identity',
    subtitle: 'You Are Your Key',
    description: 'Replace keycards, passwords, and badges. Your AxonRing stores encrypted digital credentials for office access, gym entry, hotel rooms, and event tickets — all in one secure ring.',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    stats: [
      { label: 'Credentials', value: '50+' },
      { label: 'Encryption', value: 'AES-256' },
      { label: 'NFC Range', value: '4cm' },
    ],
  },
];

export default function HowItWorks() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">Technology</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            One Ring. <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">Infinite Possibilities.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Discover the four pillars of AxonRing technology that are redefining what a ring can do.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Feature tabs */}
          <div className="lg:col-span-2 space-y-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature.id === feature.id;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? `${feature.bgColor} ${feature.borderColor} shadow-lg`
                      : 'border-zinc-800/50 hover:border-zinc-700 bg-zinc-900/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? `bg-gradient-to-br ${feature.color}` : 'bg-zinc-800'}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-zinc-400'}`}>{feature.title}</h3>
                      <p className={`text-sm ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature detail */}
          <div className="lg:col-span-3">
            <div className={`p-8 lg:p-10 rounded-3xl border ${activeFeature.borderColor} ${activeFeature.bgColor} min-h-[400px] flex flex-col justify-between transition-all duration-500`}>
              <div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${activeFeature.color} mb-6 shadow-lg`}>
                  <activeFeature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">{activeFeature.title}</h3>
                <p className="text-zinc-300 text-lg leading-relaxed mb-8">{activeFeature.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {activeFeature.stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-black/30 rounded-xl border border-white/5">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
