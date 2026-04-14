import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Shield, Check } from 'lucide-react';

const SUBSCRIBE_URL = 'https://tek-agent-65076290.base44.app/functions/subscribe';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [email,      setEmail]      = useState('');
  const [status,     setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg,  setStatusMsg]  = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;

    setStatus('loading');
    try {
      const res  = await fetch(SUBSCRIBE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, source: 'footer' }),
      });
      const data = await res.json();

      if (data.alreadySubscribed) {
        setStatusMsg("You're already on the list — we'll be in touch!");
        setStatus('success');
      } else if (data.success) {
        setStatusMsg('Welcome to AxonRing! Check your inbox for a special offer.');
        setStatus('success');
        setEmail('');
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch {
      setStatusMsg('Something went wrong. Please try again.');
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const footerLinks = {
    Shop: [
      { label: 'All Smart Rings',     page: 'shop' },
      { label: 'Essential Collection', page: 'shop' },
      { label: 'Premium Collection',   page: 'shop' },
      { label: 'Luxury Collection',    page: 'shop' },
    ],
    Company: [
      { label: 'Our Story',      page: 'about' },
      { label: 'NFC Technology', page: 'nfc'   },
      { label: 'Careers',        page: 'about' },
      { label: 'Press',          page: 'about' },
    ],
    Support: [
      { label: 'Help Center',          page: 'home' },
      { label: 'Shipping Info',        page: 'home' },
      { label: 'Returns & Exchanges',  page: 'home' },
      { label: 'Size Guide',           page: 'home' },
    ],
    Legal: [
      { label: 'Privacy Policy',  page: 'home' },
      { label: 'Terms of Service',page: 'home' },
      { label: 'Cookie Policy',   page: 'home' },
    ],
  };

  return (
    <footer className="bg-[hsl(220,25%,5%)] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Newsletter */}
        <div className="relative rounded-2xl overflow-hidden p-8 sm:p-12 mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join the NFC Revolution</h3>
              <p className="text-gray-400 max-w-md">
                Get exclusive offers, early access to new products, and NFC tips delivered to your inbox.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 lg:w-72 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : status === 'success' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                  </span>
                </button>
              </form>
              {statusMsg && (
                <p className={`mt-2 text-xs ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {statusMsg}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">AXON</span><span className="text-cyan-400">RING</span>
              </span>
            </button>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Pioneering NFC smart ring technology. Tap into the future of wearable connectivity.
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-cyan-400" /><span>San Francisco, CA 94105</span></div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-cyan-400" /><span>1-800-AXONRING</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-cyan-400" /><span>hello@axonring.com</span></div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, i) => (
                  <li key={i}>
                    <button onClick={() => setCurrentPage(link.page)} className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; 2026 AxonRing Smart Wearables. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-600 mr-2">Accepted Payments:</span>
            {['Visa', 'MC', 'Amex', 'PayPal', 'Apple Pay', 'GPay'].map(method => (
              <div key={method} className="px-2 py-1 text-[9px] font-bold text-gray-500 bg-white/5 rounded border border-white/5">
                {method}
              </div>
            ))}
            <div className="flex items-center gap-1 ml-2">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[10px] text-green-500 font-medium">Secure</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
