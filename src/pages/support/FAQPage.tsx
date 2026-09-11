import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SupportShell from './SupportShell';

const FAQ_SECTIONS: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: 'Sizing & Ordering',
    items: [
      {
        q: 'How do I find my ring size?',
        a: <>The most reliable way is our <Link to="/product/axonring-sizing-kit" className="text-rose-400 hover:text-rose-300">$10 Sizing Kit</Link> (credited toward your ring). You can also match a ring you already own using the chart on our <Link to="/size-guide" className="text-rose-400 hover:text-rose-300">Size Guide</Link>.</>,
      },
      {
        q: 'What if I order the wrong size?',
        a: 'Free size exchanges within 30 days of delivery. Start an exchange by contacting support with your order number.',
      },
      {
        q: 'Is there a monthly subscription?',
        a: 'No — and there never will be. Every AxonRing feature, including health insights and NFC payments, is included with the ring. Your data is yours.',
      },
      {
        q: 'Can I pay in installments?',
        a: 'Yes. Installment options are shown at checkout where available, letting you split your purchase into interest-free payments.',
      },
    ],
  },
  {
    title: 'Product & Features',
    items: [
      {
        q: 'How do NFC payments work?',
        a: 'AxonRing carries a secure NFC chip — link a supported card in the companion app, then tap your ring on any contactless terminal. No phone, no battery required for payments.',
      },
      {
        q: 'What health metrics does AxonRing track?',
        a: 'Depending on tier: heart rate, sleep stages, SpO2, and ECG (Elite). See the tier comparison on the home page for the full feature matrix.',
      },
      {
        q: 'Is AxonRing waterproof?',
        a: 'All rings are water resistant to 50m (IP68). Swim, shower, and wash your hands without taking it off.',
      },
      {
        q: 'How long does the battery last?',
        a: 'Up to 6 days of health tracking per charge. NFC payments work even with a dead battery — the payment chip is passive.',
      },
      {
        q: 'Which phones is AxonRing compatible with?',
        a: 'iOS 16+ and Android 12+. NFC payments work at any contactless terminal independently of your phone.',
      },
    ],
  },
  {
    title: 'Shipping, Returns & Warranty',
    items: [
      {
        q: 'How much is shipping?',
        a: <>Free standard shipping on orders of $199 or more; $14.99 below that. Details on our <Link to="/shipping" className="text-rose-400 hover:text-rose-300">shipping page</Link>.</>,
      },
      {
        q: 'What is the return policy?',
        a: <>30-day returns, no questions asked, plus free size exchanges. See <Link to="/returns" className="text-rose-400 hover:text-rose-300">returns & warranty</Link>.</>,
      },
      {
        q: 'What does the warranty cover?',
        a: '2 years against manufacturing defects — sensors, battery, charging, and NFC hardware. The Elite tier adds a lifetime finish guarantee.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <SupportShell
      eyebrow="Help Center"
      title="Frequently Asked Questions"
      subtitle="Everything about sizing, features, shipping, and returns. Can't find your answer? Contact us below."
    >
      <div className="space-y-12">
        {FAQ_SECTIONS.map(section => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
            <Accordion type="single" collapsible className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-6">
              {section.items.map(item => (
                <AccordionItem key={item.q} value={item.q} className="border-zinc-800/60">
                  <AccordionTrigger className="text-left text-white hover:no-underline hover:text-rose-300">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-zinc-400 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div id="contact" className="mt-16 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Still need help?</h2>
        <p className="text-sm text-zinc-400 mb-4">Our support team replies within one business day.</p>
        <a
          href="mailto:support@axonring.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-full transition-all"
        >
          support@axonring.com
        </a>
      </div>
    </SupportShell>
  );
}
