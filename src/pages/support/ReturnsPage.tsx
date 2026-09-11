import { Link } from 'react-router-dom';
import { RotateCcw, Repeat, ShieldCheck } from 'lucide-react';
import SupportShell from './SupportShell';

export default function ReturnsPage() {
  return (
    <SupportShell
      eyebrow="Peace of Mind"
      title="Returns & Warranty"
      subtitle="30 days to change your mind, free size exchanges, and a 2-year warranty on every ring."
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: RotateCcw, title: '30-day returns', desc: 'Return any ring within 30 days of delivery for a full refund — no questions asked.' },
          { icon: Repeat, title: 'Free size exchanges', desc: 'Wrong size? We ship the new size free and include a prepaid return label for the original.' },
          { icon: ShieldCheck, title: '2-year warranty', desc: 'Covers manufacturing defects in sensors, battery, charging, and NFC hardware. Elite adds a lifetime finish guarantee.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
            <Icon className="w-6 h-6 text-rose-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-white prose-a:text-rose-400">
        <h2>How to start a return or exchange</h2>
        <ol>
          <li>Email <a href="mailto:support@axonring.com">support@axonring.com</a> with your order number within 30 days of delivery.</li>
          <li>We'll send a prepaid return label within one business day.</li>
          <li>Refunds are issued to the original payment method within 5 business days of the ring arriving back at our warehouse. Size exchanges ship as soon as the return is scanned by the carrier — you don't have to wait for it to arrive.</li>
        </ol>

        <h2>Return conditions</h2>
        <ul>
          <li>Rings should be returned with the charger and original packaging.</li>
          <li>Normal wear from the trial period is completely fine — we expect you to actually wear the ring.</li>
          <li>Sizing Kits don't need to be returned; keep or recycle the sizers.</li>
        </ul>

        <h2>Warranty claims</h2>
        <p>
          If your ring develops a fault within 2 years — sensor failure, battery no longer holding charge, charging or NFC
          issues — contact support with your order number and a short description. We'll repair or replace it free of
          charge. The warranty doesn't cover loss, theft, or damage from misuse (e.g. crushing or prying the ring).
        </p>

        <p>
          Questions about fit before you order? Start with the <Link to="/size-guide">Size Guide</Link>.
        </p>
      </div>
    </SupportShell>
  );
}
