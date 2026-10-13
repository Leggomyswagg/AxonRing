import test from 'node:test';
import assert from 'node:assert/strict';
import { createCommerceService } from '../server/commerce.js';
import { CommerceError, readCommerceConfig } from '../server/config.js';
import { checkCheckoutRequest, publicError } from '../server/http.js';

const mapping = {
  id: 'core-7', productKey: 'core', size: '7',
  shopifyProductId: 'gid://shopify/Product/101',
  shopifyVariantId: 'gid://shopify/ProductVariant/201',
  cjProductId: 'fixture-cj-product', cjVariantId: 'fixture-cj-variant',
};
const domain = 'axonring-fixture.myshopify.com';
const policies = Object.fromEntries(['shippingPolicy', 'refundPolicy', 'privacyPolicy', 'termsOfService']
  .map(key => [key, { body: 'Fixture policy text', url: `https://${domain}/policies/${key}` }]));

function fixture(options = {}) {
  const env = {
    AXONRING_COMMERCE_ENABLED: 'true', SHOPIFY_STORE_DOMAIN: domain,
    SHOPIFY_STOREFRONT_PRIVATE_TOKEN: 'fixture-private-token',
    CJ_SHOP_ID: 'fixture-shop', CJ_ACCESS_TOKEN: 'fixture-cj-token',
    AXONRING_CJ_VARIANTS: JSON.stringify([mapping]), ...options.env,
  };
  const node = {
    __typename: 'ProductVariant', id: mapping.shopifyVariantId, title: 'US 7',
    product: { id: mapping.shopifyProductId, title: 'AxonRing Core', handle: 'axonring-core' },
    selectedOptions: [{ name: 'Ring Size', value: 'US 7' }],
    price: { amount: '149.00', currencyCode: 'USD' },
    availableForSale: true, currentlyNotInStock: false, quantityAvailable: 3,
    requiresShipping: true, requiresComponents: false,
    quantityRule: { minimum: 1, maximum: null, increment: 1 }, ...options.node,
  };
  const calls = [];
  const checks = [];
  const cjClient = {
    verifyConnections: async items => { checks.push(['batch', items]); return true; },
    verifyConnection: async item => { checks.push(['single', item]); return true; },
    ...options.cjClient,
  };
  const fetchImpl = async (url, request) => {
    const operation = JSON.parse(request.body);
    calls.push({ url, request, operation });
    if (options.providerFailure) return { ok: false };
    if (operation.query.includes('query AxonRingCatalog')) {
      return { ok: true, json: async () => ({ data: { nodes: [node], shop: options.shop ?? policies } }) };
    }
    const lines = operation.variables.input.lines;
    return { ok: true, json: async () => ({ data: {
      cartCreate: options.cartCreate ?? {
        userErrors: [], warnings: [], cart: {
          checkoutUrl: `https://${domain}/cart/c/fixture`,
          totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
          lines: { nodes: lines.map(line => ({ quantity: line.quantity, merchandise: { id: line.merchandiseId } })) },
        },
      },
    } }) };
  };
  return { env, calls, checks, service: createCommerceService({ env, fetchImpl, cjClient }) };
}

const status = expected => error => error instanceof CommerceError && error.status === expected;

test('unconfigured storefront makes no provider calls and offers no purchase', async () => {
  const { service, calls, checks } = fixture({ env: { AXONRING_COMMERCE_ENABLED: 'false' } });
  assert.deepEqual(await service.catalog(), { ready: false, variants: [], policies: null });
  await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 1 }] }), status(503));
  assert.equal(calls.length, 0);
  assert.equal(checks.length, 0);
});

test('catalogue uses merchant prices and verifies the exact supplier mapping', async () => {
  const { service, checks } = fixture();
  const catalog = await service.catalog();
  assert.equal(catalog.ready, true);
  assert.equal(catalog.variants[0].amount, '149.00');
  assert.equal(catalog.variants[0].maximum, 3);
  assert.equal(catalog.variants[0].available, true);
  assert.deepEqual(checks, [['batch', [mapping]]]);
  assert.equal(JSON.stringify(catalog).includes(mapping.cjVariantId), false);
  assert.equal(JSON.stringify(catalog).includes('fixture-private-token'), false);
});

test('checkout rechecks stock and CJ mapping before creating a hosted cart', async () => {
  const { service, calls, checks } = fixture();
  const response = await service.checkout({ lines: [{ id: 'core-7', quantity: 2 }] }, '192.0.2.1');
  assert.equal(response.checkoutUrl, `https://${domain}/cart/c/fixture`);
  assert.deepEqual(checks, [['single', mapping]]);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].request.headers['Shopify-Storefront-Buyer-IP'], '192.0.2.1');
  assert.deepEqual(calls[1].operation.variables.input.lines,
    [{ merchandiseId: mapping.shopifyVariantId, quantity: 2 }]);
});

test('client prices, foreign variants, duplicate lines and invalid quantities are rejected before network access', async () => {
  for (const body of [
    { lines: [{ id: 'core-7', quantity: 1, price: 0 }] },
    { lines: [{ id: 'foreign', quantity: 1 }] },
    { lines: [{ id: 'core-7', quantity: 1 }, { id: 'core-7', quantity: 1 }] },
    { lines: [{ id: 'core-7', quantity: 0 }] },
    { lines: [{ id: 'core-7', quantity: 1.5 }] },
    { lines: [{ id: 'core-7', quantity: 6 }] },
    { lines: [], checkoutUrl: 'https://other.example' },
  ]) {
    const { service, calls, checks } = fixture();
    await assert.rejects(service.checkout(body), status(400));
    assert.equal(calls.length, 0);
    assert.equal(checks.length, 0);
  }
});

test('missing inventory, mismatched sizes/products, bundles and unpriced variants fail closed', async () => {
  for (const node of [
    { quantityAvailable: null },
    { selectedOptions: [{ name: 'Size', value: '8' }] },
    { product: { id: 'gid://shopify/Product/999' } },
    { requiresShipping: false },
    { requiresComponents: true },
    { price: { amount: '0', currencyCode: 'USD' } },
  ]) {
    const { service, calls, checks } = fixture({ node });
    await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 1 }] }), status(503));
    assert.equal(calls.length, 1);
    assert.equal(checks.length, 0);
  }
});

test('out of stock, backorder and quantity changes prevent cart creation', async () => {
  for (const node of [{ quantityAvailable: 0 }, { currentlyNotInStock: true }, { availableForSale: false }, { quantityAvailable: 1 }]) {
    const { service, calls, checks } = fixture({ node });
    await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 2 }] }), status(409));
    assert.equal(calls.length, 1);
    assert.equal(checks.length, 0);
  }
});

test('retail quantity rules require valid multiples and expose the smallest supported quantity', async () => {
  const { service, calls } = fixture({ node: { quantityRule: { minimum: 1, maximum: 5, increment: 2 }, quantityAvailable: 5 } });
  assert.equal((await service.catalog()).variants[0].minimum, 2);
  await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 3 }] }), status(409));
  assert.equal(calls.length, 2);
});

test('missing or foreign purchase policy links prevent customer checkout', async () => {
  for (const policy of [{ body: '', url: policies.refundPolicy.url }, { body: 'Text', url: 'https://unrelated.example/returns' }]) {
    const { service, checks } = fixture({ shop: { ...policies, refundPolicy: policy } });
    await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 1 }] }), status(503));
    assert.equal(checks.length, 0);
  }
});

test('supplier failure or a false verification result cannot create a cart', async () => {
  for (const verify of [async () => false, async () => { throw new Error('fixture-provider-error'); }]) {
    const { service, calls } = fixture({ cjClient: { verifyConnection: verify } });
    await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 1 }] }));
    assert.equal(calls.length, 1);
  }
});

test('silent cart adjustment, warnings and an untrusted checkout redirect are rejected', async () => {
  for (const payload of [
    { userErrors: [], warnings: [{ code: 'QUANTITY_NOT_ENOUGH' }], cart: {} },
    { userErrors: [{ code: 'INVALID' }], warnings: [], cart: {} },
    { userErrors: [], warnings: [], cart: { checkoutUrl: 'https://unrelated.example/checkout', totalQuantity: 1, lines: { nodes: [{ quantity: 1, merchandise: { id: mapping.shopifyVariantId } }] } } },
    { userErrors: [], warnings: [], cart: { checkoutUrl: `https://${domain}/cart/c/fixture`, totalQuantity: 2, lines: { nodes: [{ quantity: 2, merchandise: { id: mapping.shopifyVariantId } }] } } },
  ]) {
    const { service } = fixture({ cartCreate: payload });
    await assert.rejects(service.checkout({ lines: [{ id: 'core-7', quantity: 1 }] }), status(409));
  }
});

test('ambiguous variant configuration is rejected', () => {
  const { env } = fixture();
  assert.throws(() => readCommerceConfig({ ...env, AXONRING_CJ_VARIANTS: JSON.stringify([mapping, mapping]) }), status(503));
  assert.throws(() => readCommerceConfig({ ...env, SHOPIFY_STORE_DOMAIN: 'https://other.example' }), status(503));
});

test('checkout accepts only same-site JSON and validates malformed bodies', () => {
  const request = { headers: { origin: 'https://axonring.com', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body: { lines: [] } };
  assert.equal(checkCheckoutRequest(request).buyerIp, '192.0.2.1');
  assert.throws(() => checkCheckoutRequest({ ...request, headers: { ...request.headers, origin: 'https://other.example' } }), status(400));
  assert.throws(() => checkCheckoutRequest({ ...request, headers: { ...request.headers, 'content-type': 'text/plain' } }), status(400));
  assert.throws(() => checkCheckoutRequest({ ...request, body: '{bad json' }), status(400));
});

test('public errors never expose provider payloads or secrets', () => {
  let output;
  const res = { setHeader() {}, end(body) { output = body; } };
  publicError(res, new Error('fixture-private-token provider raw error'));
  assert.equal(res.statusCode, 503);
  assert.equal(output.includes('fixture-private-token'), false);
  assert.equal(output.includes('provider raw'), false);
});
