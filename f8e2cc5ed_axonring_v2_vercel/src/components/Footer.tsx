import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Shield, Truck, RotateCcw, Lock, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubError('');
    try {
      await fetch('https://tek-agent-65076290.base44.app/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
    } catch { setSubError('Something went wrong. Try again.'); return; }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-black border-t border-zinc-800">
      {/* Trust badges */}
      <div className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'On all orders' },
              { icon: Shield, label: '2-Year Warranty', desc: 'Full coverage' },
              { icon: RotateCcw, label: '30-Day Returns', desc: 'No questions asked' },
              { icon: Lock, label: 'Secure Payment', desc: 'SSL encrypted' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Join the Ring Revolution</h3>
            <p className="text-zinc-400 mb-6">Get exclusive access to new releases, special offers, and tech updates.</p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="font-medium">Welcome to the AxonRing family!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <button type="submit" className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-white" />
              </div>
              <span className="text-lg font-bold text-white">AXON<span className="text-rose-400">RING</span></span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">The world's most advanced NFC smart ring. Luxury meets technology.</p>
          </div>

          {[
            {
              title: 'Shop',
              links: [
                { label: 'All Rings', to: '/collections/all-rings' },
                { label: 'Standard', to: '/collections/standard' },
                { label: 'Pro', to: '/collections/pro' },
                { label: 'Elite', to: '/collections/elite' },
                { label: 'New Arrivals', to: '/collections/new-arrivals' },
              ],
            },
            {
              title: 'Technology',
              links: [
                { label: 'NFC Payments', to: '/#how-it-works' },
                { label: 'Health Tracking', to: '/#how-it-works' },
                { label: 'Smart Home', to: '/#how-it-works' },
                { label: 'Compatibility', to: '/#how-it-works' },
              ],
            },
            {
              title: 'Support',
              links: [
                { label: 'Size Guide', to: '/#size-guide' },
                { label: 'FAQ', to: '/#faq' },
                { label: 'Shipping', to: '/#shipping' },
                { label: 'Returns', to: '/#returns' },
                { label: 'Contact Us', to: '/#contact' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', to: '/#about' },
                { label: 'Careers', to: '/#careers' },
                { label: 'Press', to: '/#press' },
                { label: 'Privacy Policy', to: '/#privacy' },
                { label: 'Terms of Service', to: '/#terms' },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-zinc-500 hover:text-rose-400 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} AxonRing. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex gap-2">
              {['Visa', 'MC', 'Amex', 'Apple Pay'].map(p => (
                <span key={p} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-500 font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
