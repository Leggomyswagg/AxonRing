import { CommerceError, isCheckoutUrl, readCommerceConfig } from './config.js';
import { createCjClient } from './cj.js';
import { CATALOG_QUERY, CHECKOUT_MUTATION, createShopifyClient } from './shopify.js';

const normalSize = value => String(value).trim().replace(/^US\s*/i, '');
const policyKeys = ['shippingPolicy', 'refundPolicy', 'privacyPolicy', 'termsOfService'];

function inspectVariant(mapping, node) {
  const size = node?.selectedOptions?.find(option => /^(?:ring |us )?size$/i.test(option.name));
  const rule = node?.quantityRule;
  if (node?.__typename !== 'ProductVariant' || node.id !== mapping.shopifyVariantId ||
      node.product?.id !== mapping.shopifyProductId || !size ||
      normalSize(size.value) !== mapping.size || node.requiresShipping !== true ||
      node.requiresComponents !== false || !Number.isInteger(node.quantityAvailable) ||
      node.quantityAvailable < 0 || !Number.isInteger(rule?.minimum) || rule.minimum < 1 ||
      !Number.isInteger(rule?.increment) || rule.increment < 1 ||
      !(rule.maximum === null || (Number.isInteger(rule.maximum) && rule.maximum >= rule.minimum)) ||
      typeof node.price?.amount !== 'string' || !/^\d+(?:\.\d+)?$/.test(node.price.amount) ||
      !(Number(node.price.amount) > 0) || !Number.isFinite(Number(node.price.amount)) ||
      !/^[A-Z]{3}$/.test(node.price.currencyCode)) {
    throw new CommerceError('variant_configuration_mismatch');
  }
  const maxQuantity = Math.min(5, node.quantityAvailable, rule.maximum ?? 5);
  const minimum = Math.ceil(rule.minimum / rule.increment) * rule.increment;
  return {
    id: mapping.id, productKey: mapping.productKey, size: mapping.size,
    amount: node.price.amount, currency: node.price.currencyCode,
    minimum, maximum: maxQuantity, increment: rule.increment,
    available: node.availableForSale === true && node.currentlyNotInStock === false &&
      minimum <= maxQuantity,
  };
}

function inspectPolicies(shop, config) {
  const policies = {};
  for (const key of policyKeys) {
    const policy = shop?.[key];
    if (typeof policy?.body !== 'string' || !policy.body.trim() || !isCheckoutUrl(policy.url, config)) {
      throw new CommerceError('purchase_policies_unavailable');
    }
    policies[key] = policy.url;
  }
  return policies;
}

function parseLines(body, config) {
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      Object.keys(body).some(key => key !== 'lines') || !Array.isArray(body.lines) ||
      !body.lines.length || body.lines.length > 8) throw new CommerceError('invalid_checkout_request', 400);
  const seen = new Set();
  return body.lines.map(line => {
    if (!line || typeof line !== 'object' || Array.isArray(line) ||
        Object.keys(line).some(key => !['id', 'quantity'].includes(key)) ||
        typeof line.id !== 'string' || seen.has(line.id) ||
        !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 5) {
      throw new CommerceError('invalid_checkout_request', 400);
    }
    const mapping = config.variants.find(variant => variant.id === line.id);
    if (!mapping) throw new CommerceError('invalid_checkout_request', 400);
    seen.add(line.id);
    return { mapping, quantity: line.quantity };
  });
}

export function createCommerceService({ env = process.env, fetchImpl = globalThis.fetch, cjClient } = {}) {
  let supplier = cjClient;
  function clients(config) {
    supplier ??= createCjClient({ env, fetchImpl });
    return { shopify: createShopifyClient({ config, env, fetchImpl }), supplier };
  }
  return {
    async catalog() {
      const config = readCommerceConfig(env);
      if (!config) return { ready: false, variants: [], policies: null };
      const { shopify, supplier } = clients(config);
      const data = await shopify.query(CATALOG_QUERY, { ids: config.variants.map(item => item.shopifyVariantId) });
      if (!Array.isArray(data.nodes)) throw new CommerceError('invalid_storefront_response');
      const policies = inspectPolicies(data.shop, config);
      const variants = config.variants.map(mapping => inspectVariant(mapping,
        data.nodes.find(node => node?.id === mapping.shopifyVariantId)));
      if (await supplier.verifyConnections(config.variants) !== true) {
        throw new CommerceError('supplier_unavailable');
      }
      if (new Set(variants.map(variant => variant.currency)).size !== 1) {
        throw new CommerceError('variant_currency_mismatch');
      }
      return { ready: true, variants, policies };
    },
    async checkout(body, buyerIp) {
      const config = readCommerceConfig(env);
      if (!config) throw new CommerceError('purchases_unavailable');
      const requested = parseLines(body, config);
      const { shopify, supplier } = clients(config);
      const data = await shopify.query(CATALOG_QUERY, {
        ids: requested.map(line => line.mapping.shopifyVariantId),
      }, buyerIp);
      if (!Array.isArray(data.nodes)) throw new CommerceError('invalid_storefront_response');
      inspectPolicies(data.shop, config);
      for (const { mapping, quantity } of requested) {
        const variant = inspectVariant(mapping, data.nodes.find(node => node?.id === mapping.shopifyVariantId));
        if (!variant.available || quantity < variant.minimum || quantity > variant.maximum ||
            quantity % variant.increment !== 0) throw new CommerceError('inventory_changed', 409);
        if (await supplier.verifyConnection(mapping) !== true) {
          throw new CommerceError('supplier_unavailable');
        }
      }
      const lines = requested.map(({ mapping, quantity }) => ({ merchandiseId: mapping.shopifyVariantId, quantity }));
      const checkout = await shopify.query(CHECKOUT_MUTATION, { input: { lines } }, buyerIp);
      const payload = checkout.cartCreate;
      if (!payload || !Array.isArray(payload.userErrors) || !Array.isArray(payload.warnings)) {
        throw new CommerceError('invalid_storefront_response');
      }
      if (payload.userErrors.length || payload.warnings.length) throw new CommerceError('checkout_changed', 409);
      const cart = payload.cart;
      const actual = cart?.lines?.nodes;
      if (!isCheckoutUrl(cart?.checkoutUrl, config) || !Array.isArray(actual) || actual.length !== lines.length ||
          cart.totalQuantity !== lines.reduce((sum, line) => sum + line.quantity, 0) ||
          lines.some(line => actual.filter(item => item.merchandise?.id === line.merchandiseId &&
            item.quantity === line.quantity).length !== 1)) {
        throw new CommerceError('checkout_changed', 409);
      }
      return { checkoutUrl: cart.checkoutUrl };
    },
  };
}
