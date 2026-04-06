import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import { Lock, ShoppingBag, ArrowLeft, Truck, Shield, Check } from 'lucide-react';
import { analytics } from '@/hooks/useAnalytics';

// ── Base44 backend endpoints ──
const BASE44_API = 'https://tek-agent-65076290.base44.app/functions';

// ── Use YOUR live Stripe publishable key here ──
const stripePromise = loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ');

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

// ── Tax rates by US state (approximate) ──
const TAX_RATES: Record<string, number> = {
  CA: 0.0725, NY: 0.08, TX: 0.0625, FL: 0.06, WA: 0.065,
  IL: 0.0625, PA: 0.06, OH: 0.0575, GA: 0.04, MI: 0.06,
};

function PaymentForm({ onSuccess }: { onSuccess: (piId: string) => void }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed. Please try again.');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step,            setStep]            = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [clientSecret,    setClientSecret]    = useState('');
  const [paymentError,    setPaymentError]    = useState('');
  const [orderNumber,     setOrderNumber]     = useState('');
  const [isInitializing,  setIsInitializing]  = useState(false);
  const [discountCode,    setDiscountCode]    = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPct,     setDiscountPct]     = useState(0);
  const [discountError,   setDiscountError]   = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    name: '', email: '', address: '', city: '', state: '', zip: '', country: 'US',
  });

  // ── Dynamic shipping & tax ──
  const shipping  = cartTotal >= 199 ? 0 : 14.99;
  const taxRate   = TAX_RATES[shippingAddress.state] || 0;
  const tax       = parseFloat((cartTotal * taxRate).toFixed(2));
  const discountAmount = parseFloat(((cartTotal * discountPct) / 100).toFixed(2));
  const grandTotal = parseFloat((cartTotal + shipping + tax - discountAmount).toFixed(2));

  const isShippingValid = shippingAddress.name && shippingAddress.email &&
    shippingAddress.address && shippingAddress.city && shippingAddress.state && shippingAddress.zip;

  // ── Discount code validation ──
  const VALID_CODES: Record<string, number> = { WELCOME10: 10, AXON15: 15, VIP20: 20 };

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    if (VALID_CODES[code]) {
      setDiscountPct(VALID_CODES[code]);
      setDiscountApplied(true);
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code');
      setDiscountApplied(false);
      setDiscountPct(0);
    }
  };

  // ── Step 1 → Step 2: Create Payment Intent via Base44 ──
  const handleContinueToPayment = async () => {
    if (!isShippingValid) return;

    // Save email for abandoned cart recovery
    localStorage.setItem('axonring_checkout_email', shippingAddress.email);
    analytics.beginCheckout(grandTotal, cart.map(i => ({
      id: i.product_id, name: i.name, price: i.price, quantity: i.quantity,
    })));

    setIsInitializing(true);
    setPaymentError('');

    try {
      const res  = await fetch(`${BASE44_API}/createPaymentIntent`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:        grandTotal,
          currency:      'usd',
          customerEmail: shippingAddress.email,
          customerName:  shippingAddress.name,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || 'Failed to initialize payment');
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err: any) {
      setPaymentError(err.message || 'Unable to initialize payment. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  // ── Step 2 → Step 3: Payment confirmed → Save order via Base44 ──
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const res  = await fetch(`${BASE44_API}/saveOrder`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          customerEmail: shippingAddress.email,
          customerName:  shippingAddress.name,
          address:       shippingAddress.address,
          city:          shippingAddress.city,
          state:         shippingAddress.state,
          zip:           shippingAddress.zip,
          country:       shippingAddress.country,
          items: cart.map(i => ({
            productId: i.product_id,
            name:      i.name,
            size:      i.variant_title || '',
            quantity:  i.quantity,
            price:     i.price,
          })),
          subtotal:   cartTotal,
          shipping,
          tax,
          grandTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save order');

      const num = data.orderNumber || 'AXR-' + Date.now().toString(36).toUpperCase();
      setOrderNumber(num);

      analytics.purchase(num, grandTotal, cart.map(i => ({
        id: i.product_id, name: i.name, price: i.price, quantity: i.quantity,
      })));

      clearCart();
      setStep('success');
    } catch (err: any) {
      setPaymentError('Payment succeeded but order saving failed. Please contact hello@axonring.com');
    }
  };

  const inputClass = "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors";

  // ── Success screen ──
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="pt-36 pb-20 text-center max-w-lg mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-zinc-400 mb-2">Thank you, {shippingAddress.name.split(' ')[0]}!</p>
          <p className="text-zinc-500 text-sm mb-6">Order <span className="text-rose-400 font-mono">{orderNumber}</span> — confirmation sent to {shippingAddress.email}</p>
          <Link
            to="/collections/all-rings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty cart ──
  if (cart.length === 0 && step === 'shipping') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <CartDrawer />
        <div className="pt-36 text-center px-4">
          <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/collections/all-rings" className="text-rose-400 hover:text-rose-300 font-medium">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />

      <div className="pt-28 lg:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link to="/cart" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>

          {/* Step indicators */}
          <div className="flex items-center gap-4 mb-10">
            {(['shipping', 'payment'] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                {idx > 0 && <div className="w-12 h-px bg-zinc-800 mx-2" />}
                <div className={`flex items-center gap-2 ${step === s ? 'text-rose-400' : step === 'payment' && s === 'shipping' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-rose-500 text-white' : step === 'payment' && s === 'shipping' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {step === 'payment' && s === 'shipping' ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className="text-sm font-medium capitalize">{s}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* ── Form column ── */}
            <div className="lg:col-span-3">

              {/* Shipping step */}
              {step === 'shipping' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Full Name *"  value={shippingAddress.name}    onChange={e => setShippingAddress(p => ({ ...p, name: e.target.value }))}    className={inputClass} />
                      <input placeholder="Email *" type="email" value={shippingAddress.email} onChange={e => setShippingAddress(p => ({ ...p, email: e.target.value }))}   className={inputClass} />
                    </div>
                    <input placeholder="Street Address *" value={shippingAddress.address} onChange={e => setShippingAddress(p => ({ ...p, address: e.target.value }))}  className={inputClass} />
                    <div className="grid grid-cols-3 gap-4">
                      <input placeholder="City *"    value={shippingAddress.city}  onChange={e => setShippingAddress(p => ({ ...p, city: e.target.value }))}   className={inputClass} />
                      <select value={shippingAddress.state} onChange={e => setShippingAddress(p => ({ ...p, state: e.target.value }))} className={inputClass}>
                        <option value="">State *</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input placeholder="ZIP *"     value={shippingAddress.zip}   onChange={e => setShippingAddress(p => ({ ...p, zip: e.target.value }))}    className={inputClass} />
                    </div>

                    {/* Discount code */}
                    <div className="pt-2">
                      <label className="text-sm font-semibold text-white mb-2 block">Discount Code</label>
                      <div className="flex gap-2">
                        <input
                          placeholder="e.g. WELCOME10"
                          value={discountCode}
                          onChange={e => { setDiscountCode(e.target.value); setDiscountError(''); setDiscountApplied(false); setDiscountPct(0); }}
                          className={inputClass + ' flex-1'}
                          disabled={discountApplied}
                        />
                        <button
                          type="button"
                          onClick={applyDiscount}
                          disabled={discountApplied || !discountCode.trim()}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                          {discountApplied ? '✓ Applied' : 'Apply'}
                        </button>
                      </div>
                      {discountApplied && <p className="text-emerald-400 text-xs mt-1">🎉 {discountPct}% discount applied!</p>}
                      {discountError && <p className="text-red-400 text-xs mt-1">{discountError}</p>}
                    </div>

                    {paymentError && <p className="text-red-400 text-sm">{paymentError}</p>}

                    <button
                      onClick={handleContinueToPayment}
                      disabled={!isShippingValid || isInitializing}
                      className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isInitializing ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing payment...</>
                      ) : (
                        <><Lock className="w-4 h-4" /> Continue to Payment</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment step */}
              {step === 'payment' && clientSecret && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Payment</h2>
                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#f43f5e' } } }}>
                      <PaymentForm onSuccess={handlePaymentSuccess} />
                    </Elements>
                  </div>
                  {paymentError && <p className="text-red-400 text-sm mt-3">{paymentError}</p>}
                  <button onClick={() => setStep('shipping')} className="mt-4 text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to shipping
                  </button>
                </div>
              )}
            </div>

            {/* ── Order summary ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <h3 className="text-lg font-bold mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3 items-center">
                      {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-zinc-800 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        {item.variant_title && <p className="text-xs text-zinc-500">{item.variant_title}</p>}
                        <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-white flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400 font-medium' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {tax > 0 && <div className="flex justify-between text-zinc-400"><span>Tax ({(taxRate * 100).toFixed(1)}%)</span><span>${tax.toFixed(2)}</span></div>}
                  <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-zinc-800">
                    <span>Total</span><span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {[
                    { icon: Truck,  text: shipping === 0 ? 'Free shipping applied!' : 'Free shipping on orders over $199' },
                    { icon: Shield, text: '2-year warranty on all rings'       },
                    { icon: Lock,   text: 'SSL encrypted & PCI-compliant'      },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-zinc-500">
                      <Icon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
