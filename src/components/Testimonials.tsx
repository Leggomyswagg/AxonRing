import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'James Chen',
    role: 'Tech Executive',
    image: 'https://d64gsuwffb70l.cloudfront.net/69d0c917003e3eb97e85a036_1775291040742_f7291fc8.jpg',
    rating: 5,
    text: 'The AxonRing Apex has completely replaced my wallet and keycard. I tap my ring at coffee shops, unlock my office, and track my health — all without reaching for my phone. This is the future of wearable tech.',
    product: 'AxonRing Apex',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Fitness Coach',
    image: 'https://d64gsuwffb70l.cloudfront.net/69d0c917003e3eb97e85a036_1775291042613_17264579.jpg',
    rating: 5,
    text: 'As a fitness professional, I need accurate health data without bulky wearables. The Pulse gives me medical-grade heart rate and SpO2 monitoring in a ring that weighs less than my wedding band. My clients are all ordering one.',
    product: 'AxonRing Pulse',
  },
  {
    name: 'Marcus Rivera',
    role: 'Smart Home Enthusiast',
    image: 'https://d64gsuwffb70l.cloudfront.net/69d0c917003e3eb97e85a036_1775291042404_ccb4d589.jpg',
    rating: 5,
    text: 'I\'ve automated my entire home with the Nexus. A wave unlocks my front door, a tap dims the living room lights, and a gesture starts my morning coffee routine. It feels like living in the future.',
    product: 'AxonRing Nexus',
  },
  {
    name: 'Elena Vasquez',
    role: 'Luxury Lifestyle Blogger',
    rating: 5,
    text: 'The Aurora Pro is the most beautiful piece of technology I\'ve ever worn. The rose gold finish with the diamond accent gets compliments everywhere. The fact that it\'s also a payment device and health tracker is just incredible.',
    product: 'AxonRing Aurora Pro',
  },
  {
    name: 'David Park',
    role: 'Venture Capitalist',
    rating: 5,
    text: 'I\'ve invested in dozens of wearable companies, and AxonRing is the only one that\'s nailed the intersection of luxury and utility. The Luxe model is my daily driver — 18K gold that pays for my lunch.',
    product: 'AxonRing Luxe',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-24 lg:py-32 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">150,000+</span> Wearers
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-8 lg:p-12 transition-all duration-500">
            <div className="flex items-center gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="text-xl lg:text-2xl text-zinc-200 leading-relaxed mb-8 font-light italic">
              "{t.text}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {t.image && (
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700" />
                )}
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </div>
              </div>
              <div className="hidden sm:block px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full">
                <p className="text-sm font-medium text-rose-400">{t.product}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="p-3 border border-zinc-700 hover:border-zinc-500 rounded-full transition-colors hover:bg-zinc-800">
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-rose-500 w-8' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-3 border border-zinc-700 hover:border-zinc-500 rounded-full transition-colors hover:bg-zinc-800">
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
