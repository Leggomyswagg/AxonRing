import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-semibold text-white">Your Cart</h2>
            <span className="text-sm text-zinc-500">({cartCount})</span>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <ShoppingBag className="w-16 h-16 text-zinc-700 mb-4" />
            <p className="text-zinc-400 text-lg mb-2">Your cart is empty</p>
            <p className="text-zinc-600 text-sm mb-6">Discover the future of wearable technology</p>
            <button onClick={() => setIsCartOpen(false)} className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                    {item.variant_title && (
                      <p className="text-xs text-zinc-500 mt-0.5">Size {item.variant_title}</p>
                    )}
                    <p className="text-sm font-bold text-rose-400 mt-1">${(item.price / 100).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                        className="p-1 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                      <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                        className="p-1 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product_id, item.variant_id)}
                        className="ml-auto p-1 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-zinc-500 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-lg font-bold text-white">${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Free Shipping
              </p>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-center font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/20"
              >
                Checkout — ${(cartTotal / 100).toFixed(2)}
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="block w-full py-3 border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-center font-medium rounded-xl transition-colors"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
