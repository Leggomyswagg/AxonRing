(() => {
  const cards = [...document.querySelectorAll('[data-product-key]')];
  const money = variant => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: variant.currency,
  }).format(Number(variant.amount));

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(path, { ...options, cache: 'no-store', signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Online purchases are temporarily unavailable.');
      return data;
    } finally { clearTimeout(timeout); }
  }

  function unavailable(card) {
    card.querySelector('[data-purchase-status]').textContent =
      'Online purchases are temporarily unavailable. Ask us about sizing and availability.';
    card.querySelector('[data-live-price]').textContent = 'Availability on request';
    card.querySelector('.purchase-form').hidden = true;
  }

  function buildCard(card, catalog) {
    const variants = catalog.variants.filter(variant => variant.productKey === card.dataset.productKey)
      .sort((left, right) => Number(left.size) - Number(right.size));
    const available = variants.filter(variant => variant.available);
    if (!available.length) return unavailable(card);
    const form = card.querySelector('.purchase-form');
    const status = card.querySelector('[data-purchase-status]');
    const price = card.querySelector('[data-live-price]');
    const size = form.querySelector('[name=size]');
    const quantity = form.querySelector('[name=quantity]');
    const button = form.querySelector('[type=submit]');
    const minimumPrice = available.reduce((lowest, variant) => Number(variant.amount) < Number(lowest.amount) ? variant : lowest);
    price.textContent = `From ${money(minimumPrice)}`;
    for (const variant of variants) {
      const option = document.createElement('option');
      option.value = variant.id;
      option.textContent = `US ${variant.size}${variant.available ? '' : ' — unavailable'}`;
      option.disabled = !variant.available;
      size.appendChild(option);
    }
    for (const link of card.querySelectorAll('[data-purchase-policy]')) {
      link.href = catalog.policies[link.dataset.purchasePolicy];
      link.hidden = false;
    }
    const selected = () => variants.find(variant => variant.id === size.value && variant.available);
    size.addEventListener('change', () => {
      const variant = selected();
      button.disabled = !variant;
      quantity.disabled = !variant;
      if (!variant) return;
      quantity.min = variant.minimum;
      quantity.max = variant.maximum;
      quantity.step = variant.increment;
      quantity.value = variant.minimum;
      price.textContent = money(variant);
      status.textContent = 'Shipping, taxes, and your final total are shown at secure checkout.';
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const variant = selected();
      if (!variant || button.disabled || !form.reportValidity()) return;
      button.disabled = true;
      status.textContent = 'Checking availability…';
      let navigating = false;
      try {
        const data = await request('/api/checkout', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lines: [{ id: variant.id, quantity: Number(quantity.value) }] }),
        });
        const checkout = new URL(data.checkoutUrl);
        if (checkout.protocol !== 'https:') throw new Error('Checkout is temporarily unavailable.');
        status.textContent = 'Opening secure checkout…';
        navigating = true;
        window.location.assign(checkout.href);
      } catch (error) {
        status.textContent = error.name === 'AbortError' ?
          'The connection timed out. Please try again.' : error.message;
      } finally { if (!navigating) button.disabled = false; }
    });
    form.hidden = false;
    status.textContent = 'Choose your ring size to continue to secure checkout.';
  }

  request('/api/catalog').then(catalog => {
    if (!catalog.ready || !Array.isArray(catalog.variants) || !catalog.policies) {
      cards.forEach(unavailable);
      return;
    }
    cards.forEach(card => buildCard(card, catalog));
  }).catch(() => cards.forEach(unavailable));
})();
