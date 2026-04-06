import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { analytics } from '@/hooks/useAnalytics';

const BASE44_API          = 'https://tek-agent-65076290.base44.app/functions';
const ABANDONED_TIMEOUT   = 15 * 60 * 1000; // 15 minutes

export interface CartItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  name: string;
  variant_title?: string;
  sku?: string;
  price: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('ecom_cart') || '[]'); }
    catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const abandonTimer                = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedAbandon           = useRef(false);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('ecom_cart', JSON.stringify(cart));
  }, [cart]);

  // ── Abandoned cart detection ──
  const scheduleAbandonCheck = useCallback((currentCart: CartItem[], total: number) => {
    if (abandonTimer.current) clearTimeout(abandonTimer.current);
    hasTrackedAbandon.current = false;
    if (currentCart.length === 0) return;

    abandonTimer.current = setTimeout(() => {
      if (hasTrackedAbandon.current) return;
      hasTrackedAbandon.current = true;
      analytics.abandonCart(total, currentCart.reduce((s, i) => s + i.quantity, 0));

      const savedEmail = localStorage.getItem('axonring_checkout_email');
      if (savedEmail) {
        fetch(`${BASE44_API}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: savedEmail, source: 'abandoned_cart' }),
        }).catch(() => {});
      }
    }, ABANDONED_TIMEOUT);
  }, []);

  const cancelAbandonTimer = useCallback(() => {
    if (abandonTimer.current) clearTimeout(abandonTimer.current);
    hasTrackedAbandon.current = false;
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product_id === item.product_id && i.variant_id === item.variant_id);
      const next = idx >= 0
        ? prev.map((i, n) => n === idx ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { ...item, quantity }];
      const total = next.reduce((s, i) => s + i.price * i.quantity, 0);
      scheduleAbandonCheck(next, total);
      return next;
    });
    analytics.addToCart({ id: item.product_id, name: item.name, price: item.price, category: '' }, quantity);
    setIsCartOpen(true);
  }, [scheduleAbandonCheck]);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart(prev => {
      const item = prev.find(i => i.product_id === productId && i.variant_id === variantId);
      if (item) analytics.removeFromCart({ id: item.product_id, name: item.name, price: item.price });
      const next = prev.filter(i => !(i.product_id === productId && i.variant_id === variantId));
      if (next.length === 0) cancelAbandonTimer();
      return next;
    });
  }, [cancelAbandonTimer]);

  const updateQuantity = useCallback((productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId, variantId); return; }
    setCart(prev => prev.map(i =>
      i.product_id === productId && i.variant_id === variantId ? { ...i, quantity } : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    cancelAbandonTimer();
    localStorage.removeItem('ecom_cart');
    localStorage.removeItem('axonring_checkout_email');
    setCart([]);
  }, [cancelAbandonTimer]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
