import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CartDrawer />

      <div className="pt-28 lg:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-zinc-500 mb-10">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-zinc-800 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-zinc-500 mb-8">Discover the future of wearable technology</p>
              <Link to="/collections/all-rings" className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-5 p-5 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-24 h-24 lg:w-28 lg:h-28 object-cover rounded-xl" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                      {item.variant_title && <p className="text-sm text-zinc-500 mt-0.5">Size {item.variant_title}</p>}
                      <p className="text-lg font-bold text-rose-400 mt-2">${(item.price / 100).toFixed(2)}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="inline-flex items-center border border-zinc-700 rounded-lg">
                          <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)} className="p-2 hover:bg-zinc-800 rounded-l-lg transition-colors">
                            <Minus className="w-3.5 h-3.5 text-zinc-400" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)} className="p-2 hover:bg-zinc-800 rounded-r-lg transition-colors">
                            <Plus className="w-3.5 h-3.5 text-zinc-400" />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
                        </button>
                        <p className="ml-auto text-lg font-bold text-white">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-36 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-white font-medium">${(cartTotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Shipping</span>
                      <span className="text-emerald-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Tax</span>
                      <span className="text-zinc-500">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-3 flex justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-xl font-bold text-white">${(cartTotal / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link
                    to="/checkout"
                    className="block w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-center font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/20"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link to="/collections/all-rings" className="flex items-center justify-center gap-2 mt-4 text-sm text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
