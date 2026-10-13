import { Buffer } from 'node:buffer';

const API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const MAX_MAPPINGS = 32;
const MAX_PENDING_REQUESTS = 32;
const MAX_RESPONSE_BYTES = 512 * 1024;
const TOKEN_EXPIRY_MARGIN_MS = 30_000;
const DOMAIN_FIELDS = [
  'platformStoreDomain', 'platformDomain', 'storeDomain', 'shopDomain',
  'shopifyDomain', 'shopifyShopDomain', 'domain',
  'platformStoreUrl', 'platformUrl', 'storeUrl', 'shopUrl', 'url',
];
const ERRORS = {
  CJ_CONFIGURATION_ERROR: ['Supplier verification is not configured.', false],
  CJ_MAPPING_INVALID: ['Supplier product mapping is incomplete or invalid.', false],
  CJ_AUTH_FAILED: ['Supplier authentication could not be verified.', false],
  CJ_SHOP_NOT_AUTHORIZED: ['Supplier shop authorization could not be verified.', false],
  CJ_SHOP_MISMATCH: ['Supplier shop domain does not match the configured store.', false],
  CJ_INVENTORY_SYNC_DISABLED: ['Supplier inventory synchronization is not enabled.', false],
  CJ_CONNECTION_MISSING: ['Supplier product connection could not be verified.', false],
  CJ_CONNECTION_MISMATCH: ['Supplier product connection does not match the configured variant.', false],
  CJ_CONNECTION_AMBIGUOUS: ['Supplier product connection is ambiguous.', false],
  CJ_UPSTREAM_INVALID_RESPONSE: ['Supplier returned an unverifiable response.', false],
  CJ_UPSTREAM_REJECTED: ['Supplier rejected the verification request.', false],
  CJ_UPSTREAM_RATE_LIMITED: ['Supplier verification is temporarily rate limited.', true],
  CJ_UPSTREAM_UNAVAILABLE: ['Supplier verification is temporarily unavailable.', true],
  CJ_UPSTREAM_TIMEOUT: ['Supplier verification timed out.', true],
};
const AUTH_CODES = new Set([
  1600001, 1600002, 1600003, 1600004, 1600005, 1600006, 1600007, 1600008,
  1600031, 1601000,
]);

// Messages are fixed: never retain provider text, request bodies, or credentials.
export class CjVerificationError extends Error {
  constructor(code) {
    const safeCode = Object.hasOwn(ERRORS, code) ? code : 'CJ_UPSTREAM_UNAVAILABLE';
    super(ERRORS[safeCode][0]);
    this.name = 'CjVerificationError';
    this.code = safeCode;
    this.retryable = ERRORS[safeCode][1];
  }
}

const fail = (code) => { throw new CjVerificationError(code); };
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isId = (value, max) => typeof value === 'string'
  && value.length > 0 && value.length <= max && /^[A-Za-z0-9_-]+$/.test(value);

function shopifyId(value, kind, requireGid = false) {
  if (typeof value !== 'string') return null;
  const match = value.match(new RegExp(`^gid://shopify/${kind}/([1-9][0-9]{0,19})$`));
  if (match) return match[1];
  return !requireGid && /^[1-9][0-9]{0,19}$/.test(value) ? value : null;
}

function normalizeDomain(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const text = value.trim();
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
      || url.port || url.search || url.hash || url.pathname !== '/') return null;
    return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(url.hostname)
      ? url.hostname.toLowerCase() : null;
  } catch {
    return null;
  }
}

function normalizeMappings(mappings) {
  if (!Array.isArray(mappings) || mappings.length === 0 || mappings.length > MAX_MAPPINGS) {
    fail('CJ_MAPPING_INVALID');
  }
  const seen = new Set();
  return mappings.map((mapping) => {
    if (!isObject(mapping)) fail('CJ_MAPPING_INVALID');
    const productId = shopifyId(mapping.shopifyProductId, 'Product', true);
    const variantId = shopifyId(mapping.shopifyVariantId, 'ProductVariant', true);
    if (!productId || !variantId || !isId(mapping.cjProductId, 50)
      || !isId(mapping.cjVariantId, 50) || seen.has(variantId)) fail('CJ_MAPPING_INVALID');
    seen.add(variantId);
    return { productId, variantId, cjProductId: mapping.cjProductId, cjVariantId: mapping.cjVariantId };
  });
}

function abortable(promise, signal) {
  return new Promise((resolve, reject) => {
    const cleanup = () => signal.removeEventListener('abort', onAbort);
    const onAbort = () => {
      cleanup();
      reject(new CjVerificationError('CJ_UPSTREAM_TIMEOUT'));
    };
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: true });
    Promise.resolve(promise).then(
      (value) => { cleanup(); resolve(value); },
      (error) => { cleanup(); reject(error); },
    );
  });
}

async function readResponse(response) {
  if (!response.body?.getReader) {
    const text = await response.text();
    if (Buffer.byteLength(text, 'utf8') > MAX_RESPONSE_BYTES) fail('CJ_UPSTREAM_INVALID_RESPONSE');
    return text;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parts = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES) {
        void reader.cancel().catch(() => {});
        fail('CJ_UPSTREAM_INVALID_RESPONSE');
      }
      parts.push(decoder.decode(value, { stream: true }));
    }
    parts.push(decoder.decode());
    return parts.join('');
  } finally {
    reader.releaseLock();
  }
}

function verifyShop(data, settings) {
  if (!Array.isArray(data)) fail('CJ_UPSTREAM_INVALID_RESPONSE');
  const shops = data.filter((shop) => isObject(shop) && shop.id === settings.shopId);
  if (shops.length !== 1 || shops[0].status !== 1
    || typeof shops[0].type !== 'string' || shops[0].type.toLowerCase() !== 'shopify') {
    fail('CJ_SHOP_NOT_AUTHORIZED');
  }
  const shop = shops[0];
  if (shop.syncInventory !== 1) fail('CJ_INVENTORY_SYNC_DISABLED');
  // getShops currently does not document a domain field. Check it when supplied;
  // the shop display name, tracking URL, and logo URL are not store identities.
  for (const field of DOMAIN_FIELDS) {
    if (shop[field] === undefined || shop[field] === null || shop[field] === '') continue;
    if (!settings.storeDomain || normalizeDomain(shop[field]) !== settings.storeDomain) {
      fail('CJ_SHOP_MISMATCH');
    }
  }
}

function verifyPage(data, mappings, settings, variantFilter) {
  if (!isObject(data) || !Number.isSafeInteger(data.total) || data.total < 0
    || !Array.isArray(data.list) || data.list.length > 100
    || data.total !== data.list.length) fail('CJ_UPSTREAM_INVALID_RESPONSE');
  const connections = new Map();
  for (const row of data.list) {
    if (!isObject(row) || row.shopId !== settings.shopId
      || shopifyId(row.platformProductId, 'Product') !== mappings[0].productId) {
      fail('CJ_CONNECTION_MISMATCH');
    }
    const variantId = shopifyId(row.platformVariantId, 'ProductVariant');
    if (!variantId || (variantFilter && variantId !== mappings[0].variantId)) {
      fail('CJ_CONNECTION_MISMATCH');
    }
    if (connections.has(variantId)) fail('CJ_CONNECTION_AMBIGUOUS');
    connections.set(variantId, row);
  }
  for (const mapping of mappings) {
    const row = connections.get(mapping.variantId);
    if (!row) fail('CJ_CONNECTION_MISSING');
    if (row.cjProductId !== mapping.cjProductId || row.cjVariantId !== mapping.cjVariantId) {
      fail('CJ_CONNECTION_MISMATCH');
    }
  }
}

/** Node/server only. No product writes, order creation, or supplier payments. */
export function createCjClient({
  env = process.env,
  fetchImpl = globalThis.fetch,
  requestIntervalMs = 1000,
  requestTimeoutMs = 8000,
  verificationTimeoutMs = 20_000,
  shopCacheMs = 30_000,
  now = Date.now,
} = {}) {
  let settings;
  let cachedToken;
  let tokenFlight;
  let shopCache;
  let shopFlight;
  let nextRequestAt = 0;
  let queueTimer;
  const queue = [];

  function getSettings() {
    if (settings) return settings;
    const read = (key) => typeof env?.[key] === 'string' ? env[key].trim() : '';
    const accessToken = read('CJ_ACCESS_TOKEN');
    const apiKey = read('CJ_API_KEY');
    const shopId = read('CJ_SHOP_ID');
    const storeDomainText = read('SHOPIFY_STORE_DOMAIN');
    const storeDomain = normalizeDomain(storeDomainText);
    const isSecret = (value) => value.length > 0 && value.length <= 200 && !/\s/.test(value);
    if (!isId(shopId, 40) || (!accessToken && !apiKey)
      || (accessToken ? !isSecret(accessToken) : !isSecret(apiKey))
      || (storeDomainText && !storeDomain) || typeof fetchImpl !== 'function'
      || typeof now !== 'function'
      || !Number.isFinite(requestIntervalMs) || requestIntervalMs < 0 || requestIntervalMs > 10_000
      || !Number.isFinite(requestTimeoutMs) || requestTimeoutMs <= 0 || requestTimeoutMs > 60_000
      || !Number.isFinite(verificationTimeoutMs) || verificationTimeoutMs <= 0 || verificationTimeoutMs > 60_000
      || !Number.isFinite(shopCacheMs) || shopCacheMs < 0 || shopCacheMs > 30_000) {
      fail('CJ_CONFIGURATION_ERROR');
    }
    settings = { shopId, storeDomain, accessToken, apiKey };
    return settings;
  }

  function drain() {
    clearTimeout(queueTimer);
    if (!queue.length) return;
    const delay = Math.max(0, nextRequestAt - now());
    if (delay > 0) {
      queueTimer = setTimeout(drain, delay);
      return;
    }
    const job = queue.shift();
    job.cleanup();
    nextRequestAt = now() + requestIntervalMs;
    job.resolve();
    drain();
  }

  function waitForTurn(signal) {
    if (signal.aborted) return Promise.reject(new CjVerificationError('CJ_UPSTREAM_TIMEOUT'));
    if (queue.length >= MAX_PENDING_REQUESTS) {
      return Promise.reject(new CjVerificationError('CJ_UPSTREAM_RATE_LIMITED'));
    }
    return new Promise((resolve, reject) => {
      const job = { resolve, cleanup: () => signal.removeEventListener('abort', onAbort) };
      const onAbort = () => {
        const index = queue.indexOf(job);
        if (index !== -1) queue.splice(index, 1);
        job.cleanup();
        reject(new CjVerificationError('CJ_UPSTREAM_TIMEOUT'));
        drain();
      };
      signal.addEventListener('abort', onAbort, { once: true });
      queue.push(job);
      drain();
    });
  }

  async function request(path, { token, body, signal } = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener('abort', abort, { once: true });
    let timer = setTimeout(abort, verificationTimeoutMs);
    try {
      await waitForTurn(controller.signal);
      if (controller.signal.aborted) fail('CJ_UPSTREAM_TIMEOUT');
      clearTimeout(timer);
      timer = setTimeout(abort, requestTimeoutMs);
      const operation = (async () => {
        const response = await fetchImpl(`${API_BASE}${path}`, {
          method: body ? 'POST' : 'GET',
          headers: {
            Accept: 'application/json',
            ...(token ? { 'CJ-Access-Token': token } : {}),
            ...(body ? { 'Content-Type': 'application/json' } : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
          signal: controller.signal,
          redirect: 'error',
          cache: 'no-store',
        });
        if (!response?.ok) {
          if (response?.status === 401 || response?.status === 403) fail('CJ_AUTH_FAILED');
          if (response?.status === 429) fail('CJ_UPSTREAM_RATE_LIMITED');
          fail(response?.status >= 500 ? 'CJ_UPSTREAM_UNAVAILABLE' : 'CJ_UPSTREAM_REJECTED');
        }
        const text = await readResponse(response);
        let payload;
        try { payload = JSON.parse(text); } catch { fail('CJ_UPSTREAM_INVALID_RESPONSE'); }
        if (!isObject(payload) || !Number.isSafeInteger(payload.code)
          || typeof payload.result !== 'boolean') fail('CJ_UPSTREAM_INVALID_RESPONSE');
        if (payload.code !== 200 || payload.result !== true || payload.success === false) {
          if (AUTH_CODES.has(payload.code)) fail('CJ_AUTH_FAILED');
          if (payload.code === 1600200) fail('CJ_UPSTREAM_RATE_LIMITED');
          if (payload.code === 1600000 || payload.code === 1600301) fail('CJ_UPSTREAM_UNAVAILABLE');
          fail('CJ_UPSTREAM_REJECTED');
        }
        return payload.data;
      })();
      return await abortable(operation, controller.signal);
    } catch (error) {
      if (error instanceof CjVerificationError) {
        if (error.code === 'CJ_AUTH_FAILED') { cachedToken = null; shopCache = null; }
        throw error;
      }
      fail(controller.signal.aborted ? 'CJ_UPSTREAM_TIMEOUT' : 'CJ_UPSTREAM_UNAVAILABLE');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  }

  async function getToken(config) {
    if (config.accessToken) return config.accessToken;
    if (cachedToken && cachedToken.expiresAt > now() + TOKEN_EXPIRY_MARGIN_MS) return cachedToken.value;
    if (!tokenFlight) {
      tokenFlight = (async () => {
        const data = await request('/authentication/getAccessToken', { body: { apiKey: config.apiKey } });
        const expiresAt = typeof data?.accessTokenExpiryDate === 'string'
          && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(data.accessTokenExpiryDate)
          ? Date.parse(data.accessTokenExpiryDate) : NaN;
        if (!isObject(data) || typeof data.accessToken !== 'string' || !data.accessToken
          || data.accessToken.length > 200 || /\s/.test(data.accessToken)
          || !Number.isFinite(expiresAt) || expiresAt <= now() + TOKEN_EXPIRY_MARGIN_MS) {
          fail('CJ_AUTH_FAILED');
        }
        cachedToken = { value: data.accessToken, expiresAt };
        return cachedToken.value;
      })().finally(() => { tokenFlight = null; });
    }
    return tokenFlight;
  }

  async function getShop(config, token) {
    if (shopCache?.token === token && shopCache.expiresAt > now()) return;
    if (!shopFlight || shopFlight.token !== token) {
      const flight = { token };
      flight.promise = (async () => {
        verifyShop(await request('/shop/getShops', { token }), config);
        shopCache = { token, expiresAt: now() + shopCacheMs };
      })().finally(() => { if (shopFlight === flight) shopFlight = null; });
      shopFlight = flight;
    }
    await shopFlight.promise;
  }

  async function verify(mappings, variantFilter) {
    const normalized = normalizeMappings(mappings);
    const config = getSettings();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), verificationTimeoutMs);
    try {
      const token = await abortable(getToken(config), controller.signal);
      await abortable(getShop(config, token), controller.signal);
      const groups = new Map();
      for (const mapping of normalized) {
        if (!groups.has(mapping.productId)) groups.set(mapping.productId, []);
        groups.get(mapping.productId).push(mapping);
      }
      await Promise.all([...groups.values()].map(async (group) => {
        const params = new URLSearchParams({
          shopId: config.shopId, platformProductId: group[0].productId,
          ...(variantFilter ? { platformVariantId: group[0].variantId } : {}),
          page: '1', pageSize: '100',
        });
        const data = await request(`/product/conn/connection?${params}`, { token, signal: controller.signal });
        verifyPage(data, group, config, variantFilter);
      }));
      return true;
    } finally {
      clearTimeout(timer);
      // Also cancel remaining batch requests after any one verification fails.
      controller.abort();
    }
  }

  return {
    verifyConnection: (mapping) => verify([mapping], true),
    verifyConnections: (mappings) => verify(mappings, false),
  };
}
