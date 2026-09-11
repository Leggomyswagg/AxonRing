import { Link } from 'react-router-dom';
import SupportShell from './SupportShell';

export default function TermsPage() {
  return (
    <SupportShell
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="Last updated: July 2026"
    >
      <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:text-white prose-a:text-rose-400">
        <p>
          These terms govern your use of axonring.com and your purchase of AxonRing products. By placing an order you
          agree to these terms.
        </p>

        <h2>Orders & payment</h2>
        <ul>
          <li>All prices are in US dollars. Applicable sales tax and shipping are shown at checkout before you pay.</li>
          <li>Payments are processed securely by Stripe. Installment options, where offered at checkout, are provided by the relevant payment provider under their own terms.</li>
          <li>We may cancel and refund any order we cannot fulfill (e.g. pricing errors or stock issues) — you'll be notified promptly.</li>
        </ul>

        <h2>No subscription</h2>
        <p>
          AxonRing products do not require a subscription. All device features available at the time of purchase are
          included in the purchase price. Optional future services, if ever offered, will always be opt-in and will never
          remove features you already have.
        </p>

        <h2>Returns, exchanges & warranty</h2>
        <p>
          Returns and size exchanges are accepted within 30 days of delivery, and every ring carries a 2-year limited
          warranty against manufacturing defects, as described in{' '}
          <Link to="/returns">Returns &amp; Warranty</Link>. That policy is part of these terms.
        </p>

        <h2>Not a medical device</h2>
        <p>
          AxonRing provides wellness insights — it is not a medical device and is not intended to diagnose, treat, cure,
          or prevent any disease. Never rely on AxonRing readings for medical decisions; consult a healthcare
          professional.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the site — including scraping at disruptive volume, attempting to breach security,
          submitting fraudulent reviews, or infringing others' rights. Product reviews you submit may be displayed on the
          site with your first name; you grant us a license to display them.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All site content — product designs, text, images, and the AxonRing name and logo — is owned by AxonRing or its
          licensors and may not be reproduced without permission.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, AxonRing's total liability for any claim arising from a purchase is
          limited to the amount you paid for the product. Nothing in these terms limits liability that cannot be limited
          by law, including for personal injury caused by negligence.
        </p>

        <h2>Changes & contact</h2>
        <p>
          We may update these terms from time to time; the "last updated" date above reflects the current version.
          Questions: <a href="mailto:support@axonring.com">support@axonring.com</a> or see the <Link to="/faq">FAQ</Link>.
        </p>
      </div>
    </SupportShell>
  );
}
