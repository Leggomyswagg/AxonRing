import { Link } from 'react-router-dom';
import { Ruler, Package, CircleDot, ArrowRight, Moon, Thermometer, Hand } from 'lucide-react';
import SupportShell from './SupportShell';

const SIZE_CHART = [
  { us: '6', diameter: '16.5 mm', circumference: '51.9 mm' },
  { us: '7', diameter: '17.3 mm', circumference: '54.4 mm' },
  { us: '8', diameter: '18.1 mm', circumference: '57.0 mm' },
  { us: '9', diameter: '19.0 mm', circumference: '59.5 mm' },
  { us: '10', diameter: '19.8 mm', circumference: '62.1 mm' },
  { us: '11', diameter: '20.6 mm', circumference: '64.6 mm' },
  { us: '12', diameter: '21.4 mm', circumference: '67.2 mm' },
];

export default function SizeGuidePage() {
  return (
    <SupportShell
      eyebrow="Fit First"
      title="Size Guide"
      subtitle="A smart ring only works when it fits. Unlike jewelry, AxonRing's sensors need consistent skin contact — so getting your size right matters more than with a normal ring."
    >
      {/* Sizing kit hero card */}
      <div className="rounded-3xl border-2 border-rose-500/30 bg-gradient-to-b from-rose-500/10 to-zinc-900/50 p-8 mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Recommended: start with the Sizing Kit</h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Seven try-on sizers shipped free. Wear your best-fit sizer for 24 hours — including a workout and a night's
                sleep — before ordering. The $10 kit price is credited toward your ring.
              </p>
            </div>
          </div>
          <Link
            to="/product/axonring-sizing-kit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-full transition-all whitespace-nowrap"
          >
            Get the Kit — $10 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Three ways to size */}
      <h2 className="text-2xl font-bold text-white mb-6">Three ways to find your size</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-14">
        {[
          { icon: Package, title: '1. Sizing Kit', desc: 'The accurate way. Try physical sizers on the finger you\'ll wear AxonRing on, over a full day.' },
          { icon: CircleDot, title: '2. Match a ring you own', desc: 'Measure the inside diameter of a ring that fits that finger and match it to the chart below.' },
          { icon: Ruler, title: '3. Measure your finger', desc: 'Wrap a strip of paper snugly around your finger, mark the overlap, and measure the length in mm against the circumference column.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
            <Icon className="w-6 h-6 text-rose-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Size chart */}
      <h2 id="size-chart" className="text-2xl font-bold text-white mb-6">AxonRing size chart</h2>
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 mb-14">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-6 py-4">US Size</th>
              <th className="px-6 py-4">Inside Diameter</th>
              <th className="px-6 py-4">Inside Circumference</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map(row => (
              <tr key={row.us} className="border-t border-zinc-800/60">
                <td className="px-6 py-4 font-semibold text-white">{row.us}</td>
                <td className="px-6 py-4 text-zinc-300">{row.diameter}</td>
                <td className="px-6 py-4 text-zinc-300">{row.circumference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fit tips */}
      <h2 className="text-2xl font-bold text-white mb-6">Fit tips from the AxonRing team</h2>
      <div className="space-y-4 mb-14">
        {[
          { icon: Hand, title: 'Index or middle finger, non-dominant hand', desc: 'Sensor accuracy is best on the index or middle finger. Avoid the finger you wear other rings against — metal-on-metal contact can scratch the finish.' },
          { icon: Moon, title: 'Size at the end of the day', desc: 'Fingers are smallest in the morning and largest in the evening. A ring sized in the evening fits comfortably around the clock.' },
          { icon: Thermometer, title: 'Snug, not tight', desc: 'The ring should slide on easily, resist a little at the knuckle, and rotate freely without sliding off when your hand is relaxed and pointing down.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Wrong size safety net */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Ordered the wrong size?</h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-4">
          Free size exchanges within 30 days — see our <Link to="/returns" className="text-rose-400 hover:text-rose-300">returns policy</Link>.
          Still unsure? <Link to="/faq#contact" className="text-rose-400 hover:text-rose-300">Contact us</Link> and we'll help you choose.
        </p>
      </div>
    </SupportShell>
  );
}
