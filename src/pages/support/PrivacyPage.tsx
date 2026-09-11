import { Link } from 'react-router-dom';
import SupportShell from './SupportShell';

export default function PrivacyPage() {
  return (
    <SupportShell
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Last updated: July 2026"
    >
      <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-white prose-a:text-rose-400">
        <p>
          AxonRing ("we", "us") respects your privacy. This policy explains what information we collect through
          axonring.com, how we use it, and the choices you have. Our position is simple: <strong>your data is yours</strong> —
          we don't sell personal information, and AxonRing devices work without any subscription that gates access to your
          own health data.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Order information:</strong> name, email, shipping address, and phone number when you place an order. Payment card details are processed directly by Stripe, our payment processor — we never see or store your full card number.</li>
          <li><strong>Account & communications:</strong> email address if you subscribe to our newsletter, leave a product review, or contact support.</li>
          <li><strong>Usage analytics:</strong> anonymous browsing events (pages viewed, products added to cart) collected via Google Analytics to improve the store. These are not tied to your health data.</li>
          <li><strong>Cart contents:</strong> stored locally in your browser so your cart persists between visits. If you begin checkout and provide an email, we may send you a reminder about items left in your cart.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To fulfill and deliver orders, process returns, and provide warranty service.</li>
          <li>To send transactional emails (order confirmation, shipping updates) and — only with your consent — marketing emails you can unsubscribe from at any time.</li>
          <li>To improve the store through aggregate, anonymized analytics.</li>
        </ul>

        <h2>Health data from the ring</h2>
        <p>
          Health measurements collected by an AxonRing device (heart rate, sleep, SpO2, ECG) are stored on your device and
          in your companion app account. They are never used for advertising, never sold, and never shared with third
          parties except at your explicit direction (e.g. exporting to another health platform).
        </p>

        <h2>Sharing</h2>
        <p>
          We share personal information only with service providers needed to run the store — payment processing (Stripe),
          shipping carriers, and email delivery — and only the minimum each needs. We do not sell or rent personal
          information to anyone.
        </p>

        <h2>Your choices & rights</h2>
        <ul>
          <li>Unsubscribe from marketing emails via the link in any email.</li>
          <li>Request a copy or deletion of your personal information by emailing <a href="mailto:privacy@axonring.com">privacy@axonring.com</a>. We respond within 30 days.</li>
          <li>Depending on where you live (e.g. California, EU/UK), you may have additional rights to access, correct, or delete your data — the same email address handles all such requests.</li>
        </ul>

        <h2>Retention & security</h2>
        <p>
          Order records are kept as long as required for tax and warranty purposes. All traffic to axonring.com is
          encrypted with TLS, and payments are handled by PCI-DSS-compliant processors.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions: <a href="mailto:privacy@axonring.com">privacy@axonring.com</a>. General questions: see the{' '}
          <Link to="/faq">FAQ</Link> or <Link to="/faq#contact">contact support</Link>.
        </p>
      </div>
    </SupportShell>
  );
}
