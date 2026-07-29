// ── GA4 Analytics Hook ──
// Wraps window.trackEvent (set in index.html) for typed, safe usage throughout the app.

declare global {
  interface Window {
    trackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
  }
}

function track(eventName: string, params?: Record<string, unknown>) {
  try {
    window.trackEvent?.(eventName, params);
  } catch {
    // Silently ignore if GA4 is blocked (ad blockers etc.)
  }
}

export const analytics = {
  // Page / navigation
  pageView: (page: string) =>
    track('page_view', { page_title: `AxonRing — ${page}`, page_location: window.location.href }),

  // Product
  viewItem: (product: { id: string; name: string; price: number; category: string }) =>
    track('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, item_category: product.category }],
    }),

  addToCart: (product: { id: string; name: string; price: number; category: string }, quantity: number) =>
    track('add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity, item_category: product.category }],
    }),

  removeFromCart: (product: { id: string; name: string; price: number }) =>
    track('remove_from_cart', {
      currency: 'USD',
      value: product.price,
      items: [{ item_id: product.id, item_name: product.name, price: product.price }],
    }),

  beginCheckout: (total: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) =>
    track('begin_checkout', {
      currency: 'USD',
      value: total,
      items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
    }),

  purchase: (orderNumber: string, total: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) =>
    track('purchase', {
      transaction_id: orderNumber,
      currency: 'USD',
      value: total,
      items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
    }),

  // Email
  subscribe: (source: string) =>
    track('generate_lead', { source }),

  // Search
  search: (term: string) =>
    track('search', { search_term: term }),

  // Abandoned cart (custom event)
  abandonCart: (total: number, itemCount: number) =>
    track('abandoned_cart', { currency: 'USD', value: total, item_count: itemCount }),
};

export default analytics;
