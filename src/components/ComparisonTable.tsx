import { Link } from 'react-router-dom';
import { Check, X, Crown } from 'lucide-react';

const tiers = [
  {
    name: 'Standard',
    price: 'From $299',
    description: 'Essential smart ring technology',
    link: '/collections/standard',
    highlight: false,
    features: {
      'NFC Payments': true,
      'Heart Rate Monitoring': true,
      'Sleep Tracking': true,
      'Smart Notifications': true,
      'Water Resistance (50m)': true,
      'SpO2 Monitoring': false,
      'ECG Monitoring': false,
      'Smart Home Control': 'Basic',
      'Gesture Control': false,
      'Multi-Card NFC': false,
      'VIP Concierge': false,
      'Premium Materials': 'Titanium',
    },
  },
  {
    name: 'Pro',
    price: 'From $399',
    description: 'Advanced features for power users',
    link: '/collections/pro',
    highlight: true,
    features: {
      'NFC Payments': true,
      'Heart Rate Monitoring': true,
      'Sleep Tracking': true,
      'Smart Notifications': true,
      'Water Resistance (50m)': true,
      'SpO2 Monitoring': true,
      'ECG Monitoring': false,
      'Smart Home Control': 'Advanced',
      'Gesture Control': true,
      'Multi-Card NFC': false,
      'VIP Concierge': false,
      'Premium Materials': 'Titanium + Accent',
    },
  },
  {
    name: 'Elite',
    price: 'From $449',
    description: 'Uncompromising luxury & technology',
    link: '/collections/elite',
    highlight: false,
    features: {
      'NFC Payments': true,
      'Heart Rate Monitoring': true,
      'Sleep Tracking': true,
      'Smart Notifications': true,
      'Water Resistance (50m)': '100m',
      'SpO2 Monitoring': true,
      'ECG Monitoring': true,
      'Smart Home Control': 'Full Suite',
      'Gesture Control': true,
      'Multi-Card NFC': true,
      'VIP Concierge': true,
      'Premium Materials': 'Gold / Tungsten',
    },
  },
];

export default function ComparisonTable() {
  return (
    <section className="py-24 lg:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">Compare</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">Tier</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Every AxonRing delivers premium quality. The difference is in the details.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                tier.highlight
                  ? 'bg-gradient-to-b from-rose-500/10 to-zinc-900/50 border-2 border-rose-500/30 shadow-xl shadow-rose-500/10'
                  : 'bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Most Popular</span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent mb-2">{tier.price}</p>
                <p className="text-sm text-zinc-500">{tier.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {Object.entries(tier.features).map(([feature, value]) => (
                  <div key={feature} className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                    <span className="text-sm text-zinc-400">{feature}</span>
                    {value === true ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                    ) : value === false ? (
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                        <X className="w-3 h-3 text-zinc-600" />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">{value}</span>
                    )}
                  </div>
                ))}
              </div>

              <Link
                to={tier.link}
                className={`block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 ${
                  tier.highlight
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/20'
                    : 'border border-zinc-700 hover:border-zinc-500 text-white hover:bg-zinc-800'
                }`}
              >
                Shop {tier.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
