# CJ supplier verification and Shopify fulfillment

AxonRing uses native Shopify checkout with CJ's Shopify integration supplying and fulfilling the configured variants. Importing a CJ item or charging a shopper does not establish a working fulfillment path. Keep checkout disabled until the merchant completes the configuration and operational checks below.

## Server configuration

Set these values in the server deployment environment. Never give CJ credentials a `VITE_` prefix, put them in client bundles, commit them, or log API request/response bodies.

| Variable | Required value |
| --- | --- |
| `CJ_SHOP_ID` | The Shopify shop ID returned by `/shop/getShops` for the same CJ account as the credential. An API-type shop is insufficient. |
| `CJ_API_KEY` | A server-only API key from the merchant's CJ account, used to retrieve an access token. Install CJ's API app and create/copy an API key using the steps in the authentication documentation. |
| `CJ_ACCESS_TOKEN` | An alternative server-only access token. If both credentials are set, this token takes precedence; rotate it before expiry or remove it to use API-key token retrieval. |
| `SHOPIFY_STORE_DOMAIN` | The actual Shopify store domain used by the backend, ordinarily the merchant's `*.myshopify.com` domain. Any store domain supplied by CJ must match it. |
| `AXONRING_CJ_VARIANTS` | The merchant-verified variant configuration consumed by the storefront backend. Each record must include the fields below. |

`AXONRING_CJ_VARIANTS` is a JSON array, with at most 32 variants across the Core and Prestige product groups. Its record shape is:

```json
{
  "id": "<unique storefront mapping ID>",
  "productKey": "core",
  "size": "<actual Shopify size option>",
  "shopifyProductId": "gid://shopify/Product/<actual numeric product ID>",
  "shopifyVariantId": "gid://shopify/ProductVariant/<actual numeric variant ID>",
  "cjProductId": "<actual CJ product ID>",
  "cjVariantId": "<actual CJ variant ID>"
}
```

This is a shape illustration with deliberately invalid placeholders. Obtain every product/variant ID from the merchant's actual connected catalog. Product IDs, variant IDs, and SKUs are different values; a CJ SKU cannot substitute for either CJ ID. Select `core` or `prestige` to match the existing storefront product and verify its design, material, size, and images against the actual supplier variant.

## Adapter contract

Import `createCjClient` from `server/cj.js` only in Node server code, and reuse one client per warm process:

```js
import { createCjClient, CjVerificationError } from './server/cj.js';

const cj = createCjClient({ env: process.env, fetchImpl: fetch });
// Mapping values must come from validated server configuration.
await cj.verifyConnections(mappings); // Whole catalog, grouped by Shopify product.
await cj.verifyConnection(selectedMapping); // Fresh exact-variant check at checkout.
```

Both methods return `true` only after verification. Failures throw `CjVerificationError` with fixed, sanitized `code`, `message`, and `retryable` properties. The storefront must withhold checkout on any failure and return a generic availability message; provider IDs and internal diagnostics belong only in server-side operator handling. Missing configuration is checked when verification runs, so importing the module is safe before credentials are configured.

The adapter makes the following checks:

1. `/shop/getShops` must include exactly one `CJ_SHOP_ID` under the token's account, with `status: 1`, `type: "shopify"`, and `syncInventory: 1`. Returned store domain/URL fields must match `SHOPIFY_STORE_DOMAIN`. CJ currently documents no domain field for this endpoint, so the shop's display name is not treated as domain evidence.
2. Shopify GIDs are converted to numeric ID strings without JavaScript number conversion. The CJ connection query always specifies the authorized shop and Shopify product; checkout also filters the exact Shopify variant.
3. Connection pages must be complete (`total` equals the number of returned records, at most 100), belong to the requested shop/product, contain no duplicate variant connections, and match every requested Shopify variant, CJ product, and CJ variant exactly. Incomplete pages fail closed without pagination or guessing.
4. HTTP failures, unsuccessful CJ business codes/results, invalid JSON, oversized responses, authentication failures, and missing mappings fail closed. There are no automatic retries or supplier fallback products.

Only successful shop authorization is cached, for at most 30 seconds; concurrent shop/token lookups share one in-flight request. Successful product connections are never cached by this adapter. Catalog batching needs one shop lookup and one connection lookup per Shopify product, plus a token lookup when necessary. Each checkout always performs a fresh selected-variant connection lookup.

API-key authentication sends the documented `POST /authentication/getAccessToken` body `{ "apiKey": "..." }`. The warm process retains only the returned access token and its documented expiry, refreshing before the 30-second expiry margin. CJ currently documents 180-day tokens and a 24-hour server token cache. Invalid or already expiring token responses block verification. An explicit access token has no locally supplied expiry; CJ validates it on each authenticated query.

The default client spaces request starts one second apart, uses an eight-second network/body deadline, limits the pending queue to 32 requests and responses to 512 KiB, and applies a 20-second verification deadline. The request options are injectable for mocked tests; production uses the defaults. This limiter is local to one client/process. If multiple serverless instances or other applications share the same CJ account, coordinate account-wide limits outside the adapter; CJ quota/rate-limit errors must continue to block checkout.

## Merchant launch gates

Record evidence for each gate before enabling live checkout:

| Gate | Evidence required |
| --- | --- |
| Store authorization | CJ's official Shopify app is installed and authorized for the actual AxonRing store. The shop is active, inventory sync is enabled, and the returned shop ID belongs to the merchant's token account. Required app permissions remain valid. |
| Supplier variants | Every sellable size has an exact CJ product/variant connection to the configured Shopify product/variant. The merchant has approved the product's specifications, listing claims, images, and supplier. |
| Inventory | CJ controls the appropriate Shopify inventory/fulfillment location. Inventory changes propagate correctly, stock is tracked, and Shopify denies purchases when inventory is unavailable. Confirm actual warehouse stock for each launch variant; a connection record and `syncInventory: 1` alone do not prove available inventory. |
| Shipping | Verify the fulfillment warehouse, supported destination countries, supplier shipping methods, realistic delivery/handling times, rates charged in Shopify, and shipping/return policies. Verify the full landed cost and margin. |
| Paid-order sync | CJ's Shopify connector imports paid, unfulfilled Shopify orders automatically and matches the configured variants and customer shipping details. Verify relevant order/fulfillment app settings; the shop's `fulfillmentStatus` label alone does not establish successful order ingestion. |
| Supplier settlement | The merchant has approved CJ funding, supplier payment responsibility, automatic/manual payment settings, and order approval rules. A Shopify shopper payment does not pay CJ. This adapter neither enables automatic payment nor creates, confirms, or pays supplier orders. |
| Fulfillment and tracking | A merchant-approved end-to-end test confirms CJ ingestion, the intended warehouse/shipping method, fulfillment after approved supplier settlement, and tracking/fulfillment updates back to Shopify. Use Shopify test payments only if the connector supports that flow. Any real supplier purchase needs the merchant's separate approval. |
| Operations | The merchant owns monitoring for failed/unpaid CJ orders, revoked shop authorization, inventory-sync lag, quota errors, shipping exceptions, cancellations, refunds, returns, and customer support. |

The automated suite uses only mocked credentials, shops, and products. It proves adapter behavior, not live CJ authorization, warehouse stock, paid-order synchronization, supplier settlement, delivery, or tracking. No live CJ order or payment is performed by this code or its tests.

## Validation and sources

Run the isolated adapter suite with:

```sh
node --test tests/cj.test.js
```

Official documentation checked on 2026-10-13:

- [CJ Shop API: shops and product connections](https://developers.cjdropshipping.com/en/api/api2/api/shop.html)
- [CJ authentication: API-key token retrieval and expiry](https://developers.cjdropshipping.com/en/api/api2/api/auth.html)
- [CJ access frequency restrictions](https://developers.cjdropshipping.com/en/api/start/limit.html)
- [CJ global business error codes](https://developers.cjdropshipping.com/en/api/api2/standard/ps-code.html)
