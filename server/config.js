export class CommerceError extends Error {
  constructor(code, status = 503) {
    super(code);
    this.name = 'CommerceError';
    this.code = code;
    this.status = status;
  }
}

export function readCommerceConfig(env = process.env) {
  if (env.AXONRING_COMMERCE_ENABLED !== 'true') return null;
  const storeDomain = env.SHOPIFY_STORE_DOMAIN?.trim().toLowerCase();
  if (!storeDomain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(storeDomain)) {
    throw new CommerceError('invalid_store_configuration');
  }
  if (!env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim() || !env.CJ_SHOP_ID?.trim() ||
      !(env.CJ_API_KEY?.trim() || env.CJ_ACCESS_TOKEN?.trim())) {
    throw new CommerceError('missing_provider_configuration');
  }
  const checkoutHosts = new Set([storeDomain, 'checkout.shopify.com']);
  if (env.SHOPIFY_CHECKOUT_DOMAIN) {
    const host = env.SHOPIFY_CHECKOUT_DOMAIN.trim().toLowerCase();
    if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(host)) {
      throw new CommerceError('invalid_checkout_configuration');
    }
    checkoutHosts.add(host);
  }
  let variants;
  try { variants = JSON.parse(env.AXONRING_CJ_VARIANTS || '[]'); }
  catch { throw new CommerceError('invalid_variant_configuration'); }
  if (!Array.isArray(variants) || variants.length < 1 || variants.length > 32) {
    throw new CommerceError('invalid_variant_configuration');
  }
  const ids = new Set();
  const merchandise = new Set();
  const choices = new Set();
  const products = new Map();
  for (const mapping of variants) {
    if (!mapping || typeof mapping !== 'object' ||
        typeof mapping.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(mapping.id) ||
        !['core', 'prestige'].includes(mapping.productKey) ||
        typeof mapping.size !== 'string' || !/^\d{1,2}(?:\.5)?$/.test(mapping.size) ||
        Number(mapping.size) < 1 || Number(mapping.size) > 20 ||
        !/^gid:\/\/shopify\/Product\/[1-9]\d*$/.test(mapping.shopifyProductId) ||
        !/^gid:\/\/shopify\/ProductVariant\/[1-9]\d*$/.test(mapping.shopifyVariantId) ||
        typeof mapping.cjProductId !== 'string' || !mapping.cjProductId.trim() ||
        typeof mapping.cjVariantId !== 'string' || !mapping.cjVariantId.trim() ||
        ids.has(mapping.id) || merchandise.has(mapping.shopifyVariantId) ||
        choices.has(`${mapping.productKey}:${mapping.size}`) ||
        (products.has(mapping.productKey) && products.get(mapping.productKey) !== mapping.shopifyProductId)) {
      throw new CommerceError('invalid_variant_configuration');
    }
    ids.add(mapping.id);
    merchandise.add(mapping.shopifyVariantId);
    choices.add(`${mapping.productKey}:${mapping.size}`);
    products.set(mapping.productKey, mapping.shopifyProductId);
  }
  return { storeDomain, checkoutHosts, variants };
}

export function isCheckoutUrl(value, config) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      !url.port && config.checkoutHosts.has(url.hostname);
  } catch { return false; }
}
