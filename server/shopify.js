import { CommerceError } from './config.js';

export const CATALOG_QUERY = `query AxonRingCatalog($ids: [ID!]!) {
  nodes(ids: $ids) {
    __typename
    ... on ProductVariant {
      id title availableForSale currentlyNotInStock quantityAvailable
      requiresShipping requiresComponents
      quantityRule { minimum maximum increment }
      price { amount currencyCode }
      selectedOptions { name value }
      product { id title handle }
    }
  }
  shop {
    shippingPolicy { body url }
    refundPolicy { body url }
    privacyPolicy { body url }
    termsOfService { body url }
  }
}`;

export const CHECKOUT_MUTATION = `mutation AxonRingCheckout($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      checkoutUrl totalQuantity
      lines(first: 32) {
        nodes { quantity merchandise { ... on ProductVariant { id } } }
      }
    }
    userErrors { field message code }
    warnings { code message target }
  }
}`;

export function createShopifyClient({ config, env = process.env, fetchImpl = globalThis.fetch }) {
  return {
    async query(query, variables, buyerIp) {
      const headers = {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN,
      };
      if (buyerIp) headers['Shopify-Storefront-Buyer-IP'] = buyerIp;
      let response;
      try {
        response = await fetchImpl(`https://${config.storeDomain}/api/2026-10/graphql.json`, {
          method: 'POST', headers, body: JSON.stringify({ query, variables }),
          signal: AbortSignal.timeout(8000),
        });
      } catch { throw new CommerceError('storefront_unavailable'); }
      if (!response.ok) throw new CommerceError('storefront_unavailable');
      let body;
      try { body = await response.json(); }
      catch { throw new CommerceError('invalid_storefront_response'); }
      if (!body?.data || body.errors?.length) throw new CommerceError('invalid_storefront_response');
      return body.data;
    },
  };
}
