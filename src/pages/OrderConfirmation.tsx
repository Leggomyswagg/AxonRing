import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { CheckCircle, Package, Truck, ArrowRight, Mail } from 'lucide-react';

// This page is shown when navigated to directly (e.g. from email links).
// The main checkout success screen is inline in CheckoutPage.
// Both share the same confirmation UI.

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId        = searchParams.get('orderId');
  const orderNum       = searchParams.get('orderNumber');
  const email          = searchParams.get('email');

  const displayId = orderNum || (orderId ? orderId.slice(0, 8).toUpperCase() : null);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />

      <div className="pt-28 lg:pt-36 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Success icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Order Confirmed!</h1>
          <p className="text-lg text-zinc-400 mb-2">Thank you for choosing AxonRing</p>

          {displayId && (
            <p className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-400 mb-2 font-mono">
              Order <span className="text-rose-400 font-bold">{displayId}</span>
            </p>
          )}

          {email && (
            <p className="flex items-center justify-center gap-2 text-sm text-zinc-500 mt-2 mb-10">
              <Mail className="w-4 h-4" />
              Confirmation sent to <span className="text-zinc-300">{email}</span>
            </p>
          )}

          {!email && <div className="mb-10" />}

          {/* Timeline */}
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6">What Happens Next</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4">
              {[
                { icon: CheckCircle, label: 'Order Placed',  desc: 'Payment confirmed',    active: true  },
                { icon: Package,     label: 'Processing',    desc: '1–2 business days',    active: false },
                { icon: Truck,       label: 'Shipped',       desc: 'Free express delivery', active: false },
              ].map(({ icon: Icon, label, desc, active }, i) => (
                <div key={label} className="flex items-center gap-3">
                  {i > 0 && <div className="hidden sm:block w-8 h-px bg-zinc-700 flex-shrink-0" />}
                  <div className={`flex items-center gap-3 ${!active && 'opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-zinc-800 border border-zinc-700'}`}>
                      <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-zinc-500">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/collections/all-rings"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all"
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-white font-semibold rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
