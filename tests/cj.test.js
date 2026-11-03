import assert from 'node:assert/strict';
import test from 'node:test';
import { CjVerificationError, createCjClient } from '../server/cj.js';

// All identifiers and credentials in this file are mock fixtures. No live calls.
const env = {
  CJ_SHOP_ID: 'mock-shop-1',
  CJ_ACCESS_TOKEN: 'mock-access-token',
  SHOPIFY_STORE_DOMAIN: 'mock-store.myshopify.com',
};
const mapping = {
  shopifyProductId: 'gid://shopify/Product/90071992547409931',
  shopifyVariantId: 'gid://shopify/ProductVariant/90071992547409932',
  cjProductId: 'mock-cj-product-1',
  cjVariantId: 'mock-cj-variant-1',
};
const shop = {
  id: env.CJ_SHOP_ID, status: 1, type: 'shopify', syncInventory: 1,
  platformStoreDomain: env.SHOPIFY_STORE_DOMAIN,
};
const record = {
  shopId: env.CJ_SHOP_ID,
  platformProductId: '90071992547409931',
  platformVariantId: '90071992547409932',
  cjProductId: mapping.cjProductId,
  cjVariantId: mapping.cjVariantId,
};
const success = (data) => new Response(JSON.stringify({ code: 200, result: true, data }), {
  headers: { 'Content-Type': 'application/json' },
});

function harness({
  config = env, shops = [shop], records = [record], connectionData,
  responseFor, clientOptions = {},
} = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    const parsed = new URL(url);
    const call = { url: parsed, options, startedAt: Date.now() };
    calls.push(call);
    if (responseFor) {
      const response = await responseFor(call, calls);
      if (response !== undefined) return response;
    }
    if (parsed.pathname.endsWith('/authentication/getAccessToken')) {
      return success({
        accessToken: 'mock-issued-token',
        accessTokenExpiryDate: new Date(Date.now() + 86_400_000).toISOString(),
      });
    }
    if (parsed.pathname.endsWith('/shop/getShops')) return success(shops);
    assert.equal(parsed.pathname, '/api2.0/v1/product/conn/connection');
    if (connectionData !== undefined) return success(connectionData);
    const list = records.filter((row) => row.platformProductId === parsed.searchParams.get('platformProductId')
      && (!parsed.searchParams.has('platformVariantId')
        || row.platformVariantId === parsed.searchParams.get('platformVariantId')));
    return success({ total: list.length, list });
  };
  const client = createCjClient({
    env: config, fetchImpl, requestIntervalMs: 0,
    requestTimeoutMs: 1000, verificationTimeoutMs: 4000, ...clientOptions,
  });
  return { client, calls };
}

async function rejectsCode(promise, code) {
  await assert.rejects(promise, (error) => {
    assert.ok(error instanceof CjVerificationError);
    assert.equal(error.code, code);
    assert.equal(typeof error.retryable, 'boolean');
    return true;
  });
}

test('verifies authorized Shopify shop and exact CJ connection without losing ID precision', async () => {
  const { client, calls } = harness();
  assert.equal(await client.verifyConnection(mapping), true);
  assert.equal(calls.length, 2);
  const [authorization, connection] = calls;
  assert.equal(authorization.url.pathname, '/api2.0/v1/shop/getShops');
  assert.equal(connection.url.searchParams.get('shopId'), env.CJ_SHOP_ID);
  assert.equal(connection.url.searchParams.get('platformProductId'), record.platformProductId);
  assert.equal(connection.url.searchParams.get('platformVariantId'), record.platformVariantId);
  assert.equal(connection.url.searchParams.get('page'), '1');
  assert.equal(connection.url.searchParams.get('pageSize'), '100');
  for (const call of calls) {
    assert.equal(call.url.origin, 'https://developers.cjdropshipping.com');
    assert.equal(call.options.method, 'GET');
    assert.equal(call.options.headers['CJ-Access-Token'], env.CJ_ACCESS_TOKEN);
    assert.equal(call.options.body, undefined);
    assert.equal(call.options.redirect, 'error');
    assert.equal(call.options.cache, 'no-store');
  }
});

test('compares a returned store URL using its normalized domain', async () => {
  const { client } = harness({
    shops: [{ ...shop, platformStoreDomain: undefined, storeUrl: 'https://MOCK-STORE.myshopify.com/' }],
  });
  assert.equal(await client.verifyConnection(mapping), true);
});

test('accepts documented shop response without an undocumented domain field', async () => {
  const { client } = harness({ shops: [{ ...shop, platformStoreDomain: undefined }] });
  assert.equal(await client.verifyConnection(mapping), true);
});

test('blocks wrong account/shop, expired authorization, wrong platform, and inventory sync disabled', async (t) => {
  const cases = [
    ['wrong shop', [{ ...shop, id: 'mock-other-shop' }], 'CJ_SHOP_NOT_AUTHORIZED'],
    ['missing shop', [], 'CJ_SHOP_NOT_AUTHORIZED'],
    ['duplicate shop', [shop, shop], 'CJ_SHOP_NOT_AUTHORIZED'],
    ...[0, 2, 3, 4, 5, '1'].map((status) => [`status ${status}`, [{ ...shop, status }], 'CJ_SHOP_NOT_AUTHORIZED']),
    ['wrong platform', [{ ...shop, type: 'api' }], 'CJ_SHOP_NOT_AUTHORIZED'],
    ['no inventory sync', [{ ...shop, syncInventory: 0 }], 'CJ_INVENTORY_SYNC_DISABLED'],
    ['wrong domain', [{ ...shop, platformStoreDomain: 'another-store.myshopify.com' }], 'CJ_SHOP_MISMATCH'],
    ['malformed domain', [{ ...shop, platformStoreDomain: 'not a domain' }], 'CJ_SHOP_MISMATCH'],
    ['conflicting domains', [{ ...shop, shopDomain: 'another-store.myshopify.com' }], 'CJ_SHOP_MISMATCH'],
  ];
  for (const [name, shops, code] of cases) {
    await t.test(name, async () => {
      const { client, calls } = harness({ shops });
      await rejectsCode(client.verifyConnection(mapping), code);
      assert.equal(calls.length, 1, 'never query connections before shop authorization succeeds');
    });
  }
});

test('requires a configured store domain when CJ supplies one', async () => {
  const { client, calls } = harness({ config: { ...env, SHOPIFY_STORE_DOMAIN: undefined } });
  await rejectsCode(client.verifyConnection(mapping), 'CJ_SHOP_MISMATCH');
  assert.equal(calls.length, 1);
});

test('blocks incomplete, malformed, or duplicate mappings before any upstream call', async (t) => {
  const cases = [
    undefined, {}, { ...mapping, cjProductId: '' }, { ...mapping, cjVariantId: undefined },
    { ...mapping, cjVariantId: 'mock variant' },
    { ...mapping, shopifyProductId: '90071992547409931' },
    { ...mapping, shopifyVariantId: 'gid://shopify/Product/90071992547409932' },
    { ...mapping, shopifyVariantId: 'gid://shopify/ProductVariant/0' },
  ];
  for (const [index, item] of cases.entries()) {
    await t.test(`invalid mapping ${index}`, async () => {
      const { client, calls } = harness();
      await rejectsCode(client.verifyConnection(item), 'CJ_MAPPING_INVALID');
      assert.equal(calls.length, 0);
    });
  }
  const { client, calls } = harness();
  await rejectsCode(client.verifyConnections([]), 'CJ_MAPPING_INVALID');
  await rejectsCode(client.verifyConnections([mapping, mapping]), 'CJ_MAPPING_INVALID');
  await rejectsCode(client.verifyConnections(Array(33).fill(mapping)), 'CJ_MAPPING_INVALID');
  assert.equal(calls.length, 0);
});

test('missing or invalid server configuration fails closed without network access', async (t) => {
  const cases = [
    {}, { ...env, CJ_SHOP_ID: undefined }, { ...env, CJ_ACCESS_TOKEN: undefined },
    { ...env, CJ_ACCESS_TOKEN: 'mock\nunsafe-token' },
    { ...env, SHOPIFY_STORE_DOMAIN: 'https://mock-store.myshopify.com/admin' },
  ];
  for (const [index, config] of cases.entries()) {
    await t.test(`invalid configuration ${index}`, async () => {
      const { client, calls } = harness({ config });
      await rejectsCode(client.verifyConnection(mapping), 'CJ_CONFIGURATION_ERROR');
      assert.equal(calls.length, 0);
    });
  }
});

test('rejects missing, wrong, or ambiguous exact variant connections', async (t) => {
  const cases = [
    ['not connected', { total: 0, list: [] }, 'CJ_CONNECTION_MISSING'],
    ...[
      ['shopId', 'mock-other-shop'], ['platformProductId', '100'],
      ['platformVariantId', '101'], ['platformVariantId', 90071992547409932],
      ['cjProductId', 'mock-other-product'], ['cjVariantId', 'mock-other-variant'],
      ['cjVariantId', undefined],
    ].map(([field, value]) => [`wrong ${field}`, { total: 1, list: [{ ...record, [field]: value }] }, 'CJ_CONNECTION_MISMATCH']),
    ['duplicate record', { total: 2, list: [record, record] }, 'CJ_CONNECTION_AMBIGUOUS'],
    ['partial page', { total: 101, list: [record] }, 'CJ_UPSTREAM_INVALID_RESPONSE'],
    ['missing total', { list: [record] }, 'CJ_UPSTREAM_INVALID_RESPONSE'],
    ['negative total', { total: -1, list: [] }, 'CJ_UPSTREAM_INVALID_RESPONSE'],
    ['invalid list', { total: 1, list: null }, 'CJ_UPSTREAM_INVALID_RESPONSE'],
  ];
  for (const [name, connectionData, code] of cases) {
    await t.test(name, async () => {
      const { client } = harness({ connectionData });
      await rejectsCode(client.verifyConnection(mapping), code);
    });
  }
});

test('batches catalogue variants by product in three read-only calls for two products', async () => {
  const sameProduct = { ...mapping, shopifyVariantId: 'gid://shopify/ProductVariant/102', cjVariantId: 'mock-cj-variant-2' };
  const otherProduct = {
    ...mapping, shopifyProductId: 'gid://shopify/Product/200',
    shopifyVariantId: 'gid://shopify/ProductVariant/201',
    cjProductId: 'mock-cj-product-2', cjVariantId: 'mock-cj-variant-3',
  };
  const records = [record,
    { ...record, platformVariantId: '102', cjVariantId: sameProduct.cjVariantId },
    { ...record, platformProductId: '200', platformVariantId: '201',
      cjProductId: otherProduct.cjProductId, cjVariantId: otherProduct.cjVariantId },
  ];
  const { client, calls } = harness({ records });
  assert.equal(await client.verifyConnections([mapping, sameProduct, otherProduct]), true);
  assert.equal(calls.length, 3);
  const lookups = calls.filter((call) => call.url.pathname.endsWith('/product/conn/connection'));
  assert.equal(lookups.length, 2);
  assert.ok(lookups.every((call) => !call.url.searchParams.has('platformVariantId')));
  assert.deepEqual(lookups.map((call) => call.url.searchParams.get('platformProductId')).sort(),
    [record.platformProductId, '200'].sort());
});

test('batch verification fails if even one requested variant is missing or mismatched', async () => {
  const another = { ...mapping, shopifyVariantId: 'gid://shopify/ProductVariant/102', cjVariantId: 'mock-cj-variant-2' };
  const missing = harness();
  await rejectsCode(missing.client.verifyConnections([mapping, another]), 'CJ_CONNECTION_MISSING');
  const conflicting = harness({ records: [record, { ...record, platformVariantId: '102', cjVariantId: 'mock-wrong-variant' }] });
  await rejectsCode(conflicting.client.verifyConnections([mapping, another]), 'CJ_CONNECTION_MISMATCH');
});

test('caches only shop authorization: every checkout freshly queries the selected connection', async () => {
  let connected = true;
  const { client, calls } = harness({ responseFor: ({ url }) => {
    if (url.pathname.endsWith('/product/conn/connection')) {
      return success(connected ? { total: 1, list: [record] } : { total: 0, list: [] });
    }
  } });
  assert.equal(await client.verifyConnection(mapping), true);
  connected = false;
  await rejectsCode(client.verifyConnection(mapping), 'CJ_CONNECTION_MISSING');
  assert.equal(calls.filter((call) => call.url.pathname.endsWith('/shop/getShops')).length, 1);
  assert.equal(calls.filter((call) => call.url.pathname.endsWith('/product/conn/connection')).length, 2);
});

test('shop authorization cache expires and revoked authorization blocks subsequent checkout', async () => {
  let clock = Date.now();
  let authorized = true;
  const { client, calls } = harness({
    clientOptions: { now: () => clock },
    responseFor: ({ url }) => url.pathname.endsWith('/shop/getShops')
      ? success([{ ...shop, status: authorized ? 1 : 4 }]) : undefined,
  });
  assert.equal(await client.verifyConnection(mapping), true);
  authorized = false;
  clock += 30_001;
  await rejectsCode(client.verifyConnection(mapping), 'CJ_SHOP_NOT_AUTHORIZED');
  assert.equal(calls.length, 3);
});

test('retrieves tokens using the documented API-key payload and shares token/shop requests', async () => {
  const config = { ...env, CJ_ACCESS_TOKEN: undefined, CJ_API_KEY: 'mock-user@api@mock-key' };
  const { client, calls } = harness({ config });
  assert.deepEqual(await Promise.all([client.verifyConnection(mapping), client.verifyConnection(mapping)]), [true, true]);
  const authCalls = calls.filter((call) => call.url.pathname.endsWith('/authentication/getAccessToken'));
  assert.equal(authCalls.length, 1);
  assert.equal(authCalls[0].options.method, 'POST');
  assert.deepEqual(JSON.parse(authCalls[0].options.body), { apiKey: config.CJ_API_KEY });
  assert.equal(authCalls[0].options.headers['CJ-Access-Token'], undefined);
  assert.equal(calls.filter((call) => call.url.pathname.endsWith('/shop/getShops')).length, 1);
  assert.equal(calls.filter((call) => call.url.pathname.endsWith('/product/conn/connection')).length, 2);
  assert.ok(calls.slice(1).every((call) => call.options.headers['CJ-Access-Token'] === 'mock-issued-token'));
});

test('prefers an explicitly configured access token instead of silently changing accounts', async () => {
  const { client, calls } = harness({ config: { ...env, CJ_API_KEY: 'mock-unrelated-key' } });
  assert.equal(await client.verifyConnection(mapping), true);
  assert.ok(calls.every((call) => !call.url.pathname.endsWith('/authentication/getAccessToken')));
});

test('renews cached API-key token before its documented expiry', async () => {
  let clock = Date.now();
  let tokenCount = 0;
  const { client, calls } = harness({
    config: { ...env, CJ_ACCESS_TOKEN: undefined, CJ_API_KEY: 'mock-key' },
    clientOptions: { now: () => clock },
    responseFor: ({ url }) => {
      if (url.pathname.endsWith('/authentication/getAccessToken')) {
        tokenCount += 1;
        return success({ accessToken: `mock-token-${tokenCount}`, accessTokenExpiryDate: new Date(clock + 60_000).toISOString() });
      }
    },
  });
  assert.equal(await client.verifyConnection(mapping), true);
  clock += 31_000;
  assert.equal(await client.verifyConnection(mapping), true);
  assert.equal(tokenCount, 2);
  assert.equal(calls.at(-1).options.headers['CJ-Access-Token'], 'mock-token-2');
});

test('authentication failure invalidates warm credentials without retrying the failed checkout', async () => {
  let tokenCount = 0;
  let rejectConnection = false;
  const { client, calls } = harness({
    config: { ...env, CJ_ACCESS_TOKEN: undefined, CJ_API_KEY: 'mock-key' },
    responseFor: ({ url }) => {
      if (url.pathname.endsWith('/authentication/getAccessToken')) {
        tokenCount += 1;
        return success({ accessToken: `mock-token-${tokenCount}`, accessTokenExpiryDate: new Date(Date.now() + 86_400_000).toISOString() });
      }
      if (rejectConnection && url.pathname.endsWith('/product/conn/connection')) {
        return new Response(JSON.stringify({ code: 1600001, result: false }));
      }
    },
  });
  assert.equal(await client.verifyConnection(mapping), true);
  rejectConnection = true;
  await rejectsCode(client.verifyConnection(mapping), 'CJ_AUTH_FAILED');
  assert.equal(calls.length, 4, 'failed verification is never retried');
  rejectConnection = false;
  assert.equal(await client.verifyConnection(mapping), true);
  assert.equal(tokenCount, 2);
  assert.equal(calls.filter((call) => call.url.pathname.endsWith('/shop/getShops')).length, 2);
  assert.equal(calls.at(-1).options.headers['CJ-Access-Token'], 'mock-token-2');
});

test('invalid token responses stop verification before shop/product reads', async (t) => {
  const cases = [
    null, { accessToken: 'mock-token' },
    { accessToken: 'mock-token', accessTokenExpiryDate: 'invalid-date' },
    { accessToken: 'mock-token', accessTokenExpiryDate: '2099' },
    { accessToken: 'mock-token', accessTokenExpiryDate: new Date(Date.now() - 1000).toISOString() },
  ];
  for (const [index, data] of cases.entries()) {
    await t.test(`invalid token ${index}`, async () => {
      const { client, calls } = harness({
        config: { ...env, CJ_ACCESS_TOKEN: undefined, CJ_API_KEY: 'mock-key' },
        responseFor: () => success(data),
      });
      await rejectsCode(client.verifyConnection(mapping), 'CJ_AUTH_FAILED');
      assert.equal(calls.length, 1);
    });
  }
});

test('HTTP, business-result, and malformed-response failures always fail closed', async (t) => {
  const cases = [
    ['HTTP auth', () => new Response('mock secret', { status: 401 }), 'CJ_AUTH_FAILED'],
    ['HTTP unavailable', () => new Response('mock secret', { status: 503 }), 'CJ_UPSTREAM_UNAVAILABLE'],
    ['HTTP rate limit', () => new Response('mock secret', { status: 429 }), 'CJ_UPSTREAM_RATE_LIMITED'],
    ['business auth', () => new Response(JSON.stringify({ code: 1600001, result: false, message: 'mock secret' })), 'CJ_AUTH_FAILED'],
    ['business false', () => new Response(JSON.stringify({ code: 200, result: false, data: [shop] })), 'CJ_UPSTREAM_REJECTED'],
    ['contradictory success', () => new Response(JSON.stringify({ code: 200, result: true, success: false, data: [shop] })), 'CJ_UPSTREAM_REJECTED'],
    ['business rate limit', () => new Response(JSON.stringify({ code: 1600200, result: false })), 'CJ_UPSTREAM_RATE_LIMITED'],
    ['missing result', () => new Response(JSON.stringify({ code: 200, data: [shop] })), 'CJ_UPSTREAM_INVALID_RESPONSE'],
    ['invalid JSON', () => new Response('not JSON'), 'CJ_UPSTREAM_INVALID_RESPONSE'],
    ['oversized JSON', () => new Response('x'.repeat(512 * 1024 + 1)), 'CJ_UPSTREAM_INVALID_RESPONSE'],
  ];
  for (const [name, response, code] of cases) {
    await t.test(name, async () => {
      const { client, calls } = harness({ responseFor: response });
      await rejectsCode(client.verifyConnection(mapping), code);
      assert.equal(calls.length, 1);
    });
  }
});

test('provider bodies and transport errors never appear in typed error messages or properties', async () => {
  const secret = 'mock-private-credential-should-never-be-returned';
  for (const responseFor of [
    () => new Response(JSON.stringify({ code: 1600001, result: false, message: secret, data: { accessToken: secret } })),
    () => { throw new Error(`fetch failed with ${secret}`); },
  ]) {
    const { client } = harness({ responseFor });
    await assert.rejects(client.verifyConnection(mapping), (error) => {
      assert.ok(error instanceof CjVerificationError);
      assert.ok(!`${error.message}${error.stack}${JSON.stringify(error)}`.includes(secret));
      assert.equal(error.cause, undefined);
      return true;
    });
  }
});

test('times out even if an injected fetch does not honor AbortSignal', async () => {
  const { client, calls } = harness({
    responseFor: () => new Promise(() => {}),
    clientOptions: { requestTimeoutMs: 20, verificationTimeoutMs: 100 },
  });
  await rejectsCode(client.verifyConnection(mapping), 'CJ_UPSTREAM_TIMEOUT');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.signal.aborted, true);
});

test('the response body is covered by the network deadline', async () => {
  const { client, calls } = harness({
    responseFor: () => ({ ok: true, text: () => new Promise(() => {}) }),
    clientOptions: { requestTimeoutMs: 20, verificationTimeoutMs: 100 },
  });
  await rejectsCode(client.verifyConnection(mapping), 'CJ_UPSTREAM_TIMEOUT');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.signal.aborted, true);
});

test('a failed batch cancels remaining queued product lookups', async () => {
  const anotherProduct = {
    ...mapping, shopifyProductId: 'gid://shopify/Product/200',
    shopifyVariantId: 'gid://shopify/ProductVariant/201',
  };
  const { client, calls } = harness({
    clientOptions: { requestIntervalMs: 20 },
    connectionData: { total: 1, list: [{ ...record, cjVariantId: 'mock-wrong-variant' }] },
  });
  await rejectsCode(client.verifyConnections([mapping, anotherProduct]), 'CJ_CONNECTION_MISMATCH');
  assert.equal(calls.length, 2, 'second product never leaves the queue after first product fails');
});

test('spaces concurrent request starts and drops queued requests after the verification deadline', async () => {
  const spacing = harness({ clientOptions: { requestIntervalMs: 25 } });
  assert.equal(await spacing.client.verifyConnection(mapping), true);
  assert.ok(spacing.calls[1].startedAt - spacing.calls[0].startedAt >= 25);
  const deadline = harness({ clientOptions: { requestIntervalMs: 100, verificationTimeoutMs: 20 } });
  await rejectsCode(deadline.client.verifyConnection(mapping), 'CJ_UPSTREAM_TIMEOUT');
  assert.equal(deadline.calls.length, 1, 'expired connection never leaves the queue');
});

test('preserves request spacing when the transport performs synchronous startup work', async () => {
  const starts = [];
  const client = createCjClient({
    env, requestIntervalMs: 25, verificationTimeoutMs: 1000,
    fetchImpl: (url) => {
      // Simulate setup before the first transport request actually starts.
      // This exceeds the interval and exposes scheduling-time reservations.
      if (!starts.length) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 35);
      starts.push(Date.now());
      return Promise.resolve(success(new URL(url).pathname.endsWith('/shop/getShops')
        ? [shop] : { total: 1, list: [record] }));
    },
  });
  assert.equal(await client.verifyConnection(mapping), true);
  assert.equal(starts.length, 2);
  assert.ok(starts[1] - starts[0] >= 25, 'actual transport starts retain the full interval');
});

test('releases the request queue after a synchronous transport failure', async () => {
  const starts = [];
  const client = createCjClient({
    env, requestIntervalMs: 25, verificationTimeoutMs: 1000,
    fetchImpl: (url) => {
      starts.push(Date.now());
      if (starts.length === 1) throw new Error('mock transport failure');
      return Promise.resolve(success(new URL(url).pathname.endsWith('/shop/getShops')
        ? [shop] : { total: 1, list: [record] }));
    },
  });
  await rejectsCode(client.verifyConnection(mapping), 'CJ_UPSTREAM_UNAVAILABLE');
  assert.equal(await client.verifyConnection(mapping), true);
  assert.equal(starts.length, 3);
  assert.ok(starts[1] - starts[0] >= 25, 'failed transports still respect the request interval');
});
