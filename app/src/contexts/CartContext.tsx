import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Product } from '@/data/products';
import { analytics } from '@/hooks/useAnalytics';

const SUBSCRIBE_URL       = 'https://tek-agent-65076290.base44.app/functions/subscribe';
const ABANDONED_CART_KEY  = 'axonring_cart_snapshot';
const ABANDON_TIMEOUT_MS  = 15 * 60 * 1000; // 15 minutes of inactivity = abandoned

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items,       setItems]       = useState<CartItem[]>([]);
  const [isCartOpen,  setIsCartOpen]  = useState(false);
  const abandonTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedAbandon             = useRef(false);

  // ── Persist cart to sessionStorage so it survives page refresh ──
  useEffect(() => {
    const saved = sessionStorage.getItem(ABANDONED_CART_KEY);
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      sessionStorage.setItem(ABANDONED_CART_KEY, JSON.stringify(items));
    } else {
      sessionStorage.removeItem(ABANDONED_CART_KEY);
    }
  }, [items]);

  // ── Abandoned cart detection ──
  // After 15 min of inactivity with items in cart, fire the GA4 event
  // and ping the subscribe endpoint to capture email if known
  const scheduleAbandonCheck = useCallback((currentItems: CartItem[], total: number) => {
    if (abandonTimer.current) clearTimeout(abandonTimer.current);
    hasTrackedAbandon.current = false;

    if (currentItems.length === 0) return;

    abandonTimer.current = setTimeout(() => {
      if (hasTrackedAbandon.current) return;
      hasTrackedAbandon.current = true;

      // GA4 event
      analytics.abandonCart(total, currentItems.reduce((s, i) => s + i.quantity, 0));

      // If we have an email from localStorage (set at checkout step 1), ping backend
      const savedEmail = localStorage.getItem('axonring_checkout_email');
      if (savedEmail) {
        fetch(SUBSCRIBE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: savedEmail, source: 'abandoned_cart' }),
        }).catch(() => {});
      }
    }, ABANDON_TIMEOUT_MS);
  }, []);

  // Cancel abandon timer when cart is cleared (purchase completed)
  const cancelAbandonTimer = useCallback(() => {
    if (abandonTimer.current) clearTimeout(abandonTimer.current);
    hasTrackedAbandon.current = false;
  }, []);

  const addToCart = useCallback((product: Product, size: string, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      const next = existing
        ? prev.map(i => i.product.id === product.id && i.size === size ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { product, quantity, size }];

      const total = next.reduce((s, i) => s + i.product.price * i.quantity, 0);
      scheduleAbandonCheck(next, total);
      return next;
    });

    analytics.addToCart(product, quantity);
    setIsCartOpen(true);
  }, [scheduleAbandonCheck]);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems(prev => {
      const item = prev.find(i => i.product.id === productId && i.size === size);
      if (item) analytics.removeFromCart(item.product);
      const next = prev.filter(i => !(i.product.id === productId && i.size === size));
      if (next.length === 0) cancelAbandonTimer();
      return next;
    });
  }, [cancelAbandonTimer]);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId, size); return; }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.size === size ? { ...i, quantity } : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    cancelAbandonTimer();
    sessionStorage.removeItem(ABANDONED_CART_KEY);
    localStorage.removeItem('axonring_checkout_email');
    setItems([]);
  }, [cancelAbandonTimer]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};
