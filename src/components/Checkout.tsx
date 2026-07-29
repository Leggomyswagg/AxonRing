import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ArrowLeft, Shield, Lock, CreditCard, Check, Truck } from 'lucide-react';
import analytics from '@/hooks/useAnalytics';

// ── Replace with your Stripe publishable key ──
const stripePromise = loadStripe('pk_live_REPLACE_WITH_YOUR_PUBLISHABLE_KEY');

// ── Base44 backend URLs ──
const CREATE_INTENT_URL = 'https://tek-agent-65076290.base44.app/functions/createPaymentIntent';
const SAVE_ORDER_URL    = 'https://tek-agent-65076290.base44.app/functions/saveOrder';

// ─────────────────────────────────────────────
// Inner form — must be inside <Elements>
// ─────────────────────────────────────────────
interface PaymentFormProps {
  form: Record<string, string>;
  items: any[];
  totalPrice: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  onSuccess: (orderNumber: string) => void;
  onBack: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  form, items, totalPrice, shipping, tax, grandTotal, onSuccess, onBack,
}) => {
  const stripe    = useStripe();
  const elements  = useElements();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on Base44 backend
      const intentRes = await fetch(CREATE_INTENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'usd',
          customerEmail: form.email,
          customerName: `${form.firstName} ${form.lastName}`,
        }),
      });
      const intentData = await intentRes.json();
      if (!intentRes.ok || intentData.error) throw new Error(intentData.error || 'Failed to initialize payment');

      // 2. Confirm card payment via Stripe
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error('Card element not found');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardEl,
            billing_details: {
              name:  `${form.firstName} ${form.lastName}`,
              email: form.email,
              address: {
                line1:       form.address,
                city:        form.city,
                state:       form.state,
                postal_code: form.zip,
                country:     form.country,
              },
            },
          },
        }
      );

      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent?.status !== 'succeeded') throw new Error('Payment was not completed');

      // 3. Save order to Base44
      const orderRes = await fetch(SAVE_ORDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          customerEmail:   form.email,
          customerName:    `${form.firstName} ${form.lastName}`,
          address:  form.address,
          city:     form.city,
          state:    form.state,
          zip:      form.zip,
          country:  form.country,
          items:    items.map(i => ({
            productId: i.product.id,
            name:      i.product.name,
            size:      i.size,
            quantity:  i.quantity,
            price:     i.product.price,
          })),
          subtotal:   totalPrice,
          shipping,
          tax,
          grandTotal,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) throw new Error(orderData.error || 'Failed to save order');

      onSuccess(orderData.orderNumber);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2">Card Details</label>
        <div className="px-4 py-4 bg-white/5 border border-white/10 rounded-lg focus-within:border-cyan-400 transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize:        '15px',
                  color:           '#ffffff',
                  fontFamily:      'ui-sans-serif, system-ui, sans-serif',
                  '::placeholder': { color: '#6b7280' },
                  iconColor:       '#22d3ee',
                },
                invalid: { color: '#f87171' },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>Your payment is secured by Stripe. We never store your card details.</span>
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-wide"
      >
        {loading ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
      </button>
    </form>
  );
};

// ─────────────────────────────────────────────
// Main Checkout component
// ─────────────────────────────────────────────
interface CheckoutProps { onBack: () => void; }

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { items, totalPrice, clearCart } = useCart();
  const [step,        setStep]        = useState<'info' | 'payment' | 'success'>('info');
  const [orderNumber, setOrderNumber] = useState('');
  const [form,        setForm]        = useState({
    email: '', firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping   = totalPrice >= 199 ? 0 : 14.99;
  const tax        = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!form.email.includes('@')) e.email     = 'Valid email required';
    if (!form.firstName)           e.firstName = 'Required';
    if (!form.lastName)            e.lastName  = 'Required';
    if (!form.address)             e.address   = 'Required';
    if (!form.city)                e.city      = 'Required';
    if (!form.zip)                 e.zip       = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInfo()) {
      localStorage.setItem('axonring_checkout_email', form.email);
      analytics.beginCheckout(grandTotal, items.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })));
      setStep('payment');
    }
  };

  const handleSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    analytics.purchase(orderNum, grandTotal, items.map(i => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })));
    setStep('success');
    clearCart();
  };

  // ── Success screen ──
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Order Confirmed!</h2>
          <p className="text-gray-400 mb-2">Thank you, {form.firstName}. Your payment was successful.</p>
          <p className="text-sm text-gray-500 mb-8">Order #{orderNumber} · Confirmation sent to {form.email}</p>
          <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm mb-8">
            <Truck className="w-4 h-4" />
            <span>Estimated delivery: 5–7 business days</span>
          </div>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const InputField = ({ label, field, type = 'text', placeholder = '' }: {
    label: string; field: string; type?: string; placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={(form as any)[field]}
        onChange={e => updateField(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition-colors ${errors[field] ? 'border-red-500' : 'border-white/10'}`}
      />
      {errors[field] && <p className="text-xs text-red-400 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(220,25%,6%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        {/* Step indicators */}
        <div className="flex items-center gap-4 mb-10">
          {['Information', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  (i === 0 && step === 'info') || (i === 1 && step === 'payment')
                    ? 'bg-cyan-500 text-white'
                    : i === 0 && step === 'payment' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-500'
                }`}>
                  {i === 0 && step === 'payment' ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${
                  (i === 0 && step === 'info') || (i === 1 && step === 'payment') ? 'text-white' : 'text-gray-500'
                }`}>{s}</span>
              </div>
              {i < 1 && <div className="flex-1 h-px bg-white/10" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-3">

            {/* Step 1 — Shipping info */}
            {step === 'info' && (
              <form onSubmit={handleSubmitInfo} className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-4">Shipping Information</h2>
                <InputField label="Email Address" field="email" type="email" placeholder="you@example.com" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" field="firstName" />
                  <InputField label="Last Name"  field="lastName"  />
                </div>
                <InputField label="Street Address" field="address" placeholder="123 Main St" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="City" field="city" />
                  <InputField label="State / Province" field="state" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="ZIP / Postal Code" field="zip" />
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Country</label>
                    <select
                      value={form.country}
                      onChange={e => updateField('country', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all text-sm tracking-wide"
                >
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* Step 2 — Payment */}
            {step === 'payment' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Payment</h2>
                  <button
                    onClick={() => setStep('info')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    ← Edit info
                  </button>
                </div>

                {/* Shipping summary */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-5 text-sm text-gray-400">
                  <p className="text-white font-medium">{form.firstName} {form.lastName}</p>
                  <p>{form.address}, {form.city}, {form.state} {form.zip}</p>
                  <p>{form.email}</p>
                </div>

                <Elements stripe={stripePromise}>
                  <PaymentForm
                    form={form}
                    items={items}
                    totalPrice={totalPrice}
                    shipping={shipping}
                    tax={tax}
                    grandTotal={grandTotal}
                    onSuccess={handleSuccess}
                    onBack={onBack}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-2">
            <div className="bg-white/3 border border-white/10 rounded-xl p-6 sticky top-8">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" /> Order Summary
              </h3>

              <div className="space-y-3 mb-5">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <p className="text-white font-medium">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">Size {item.size} · Qty {item.quantity}</p>
                    </div>
                    <span className="text-gray-300">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-400">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                  <span>Total</span><span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                {[
                  { icon: Shield, text: 'SSL 256-bit encryption' },
                  { icon: Lock,   text: 'PCI DSS compliant checkout' },
                  { icon: Truck,  text: 'Free shipping over $199' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon className="w-3 h-3 text-cyan-400" /><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
