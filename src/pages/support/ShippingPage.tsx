import { Link } from 'react-router-dom';
import { Truck, Globe, PackageCheck } from 'lucide-react';
import SupportShell from './SupportShell';

export default function ShippingPage() {
  return (
    <SupportShell
      eyebrow="Delivery"
      title="Shipping"
      subtitle="Every order ships tracked and insured from our US warehouse."
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: Truck, title: 'Free over $199', desc: 'Free standard shipping on orders of $199+. Orders under $199 ship for a flat $14.99.' },
          { icon: PackageCheck, title: '2–5 business days', desc: 'Orders placed before 2pm ET ship the same business day. Standard delivery takes 2–5 business days in the US.' },
          { icon: Globe, title: 'Tracked & insured', desc: 'Every package includes tracking and full insurance against loss or damage in transit.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
            <Icon className="w-6 h-6 text-rose-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-white prose-a:text-rose-400">
        <h2>Rates & timing</h2>
        <ul>
          <li><strong>Standard (2–5 business days):</strong> free on orders $199+, otherwise $14.99.</li>
          <li><strong>Order processing:</strong> orders placed before 2pm ET on a business day are processed the same day; otherwise the next business day.</li>
          <li><strong>Sizing Kits:</strong> ship free via standard mail, typically arriving in 3–7 business days.</li>
        </ul>

        <h2>Tracking</h2>
        <p>
          You'll receive a tracking link by email as soon as your order ships. If your tracking hasn't updated for more than
          3 business days, contact us and we'll investigate with the carrier.
        </p>

        <h2>Address changes & issues</h2>
        <p>
          Need to change your shipping address? Contact us as soon as possible — we can update the address any time before
          the order ships. For lost or damaged deliveries, we'll ship a replacement at no cost once the claim is confirmed.
        </p>

        <p>
          Questions? See the <Link to="/faq">FAQ</Link> or <Link to="/faq#contact">contact support</Link>.
        </p>
      </div>
    </SupportShell>
  );
}
