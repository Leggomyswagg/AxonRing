# AxonRing.com purchase and supplier readiness

This change prepares the purchase flow in `Leggomyswagg/AxonRing`, the repository serving the live `axonring.com` domain through the Vercel `axon-ring` project. `Leggomyswagg/AxonRing.com` is a separate older storefront; it is not the current production source.

Live commerce is **disabled by default**. The connected Shopify account currently rejects API access, and no CJ account credentials or approved product/size mappings are available in this task. The existing Supabase request intake remains the route for sizing, research, and Founding Member submissions.

The product scope is passive NFC rings. [SUPPLIER_OPTIONS.md](SUPPLIER_OPTIONS.md) compares alternate fulfillment and manufacturer leads, with an unsent sourcing brief and sample checks. No alternative supplier is connected or approved, and the current product claims still need confirmation against an exact physical sample.

## Implemented flow

1. The browser requests `/api/catalog` and displays actual Shopify variant prices, size options, quantity rules, and inventory only after the configured CJ shop and every listed supplier connection verify.
2. A shopper chooses a supported size. `/api/checkout` rechecks the variant's product, size, physical-shipping requirement, stock, quantity, purchase policies, and exact CJ connection. Client prices and foreign or duplicate variants are rejected.
3. Shopify creates a hosted checkout cart. Its returned lines and quantities must exactly match the requested items; errors, quantity adjustments, warnings, and untrusted checkout URLs prevent redirection.
4. Shopify handles address collection, shipping/taxes, payment, and the order confirmation. CJ's native Shopify connector handles the subsequent supplier order workflow after merchant-approved settlement and fulfillment configuration.

Creating a cart does not collect a payment or create a paid order. This code does not create, confirm, pay, or mark any CJ order fulfilled. Supplier connection checks do not establish live stock, settlement, or shipment on their own.

## Configure the actual merchant accounts

- Restore the existing Shopify account's usable plan/API access. Confirm its actual `*.myshopify.com` domain and create a server-only private Storefront token with product, inventory, and checkout access.
- Install/authorize CJ's official Shopify app for that store and select the actual supplier products. Connect each size variant and the correct inventory/fulfillment location. See [CJ_CONFIGURATION.md](CJ_CONFIGURATION.md) for exact adapter checks and documented merchant gates.
- Configure `.env.example` variables directly as server-side Vercel variables. Do not use `VITE_` prefixes for secrets or place them in browser code. Set `AXONRING_CJ_VARIANTS` from actual Shopify and CJ IDs; the code contains no active sample products.
- Keep `AXONRING_COMMERCE_ENABLED=false` until the gates below have evidence. Use a separate sandbox/test configuration for checkout tests.
- Keep `axonring.com` on this Vercel storefront. Use the store's native Shopify domain or a correctly configured dedicated Shopify checkout domain. If Shopify returns a custom checkout/policy host, configure that exact host in `SHOPIFY_CHECKOUT_DOMAIN`.

## Required before enabling purchases

| Gate | Actual evidence to record |
| --- | --- |
| Product and fit | Approved CJ product/variant for every offered size; actual chip, finish, packaging, fit, and compatibility match the listing. The current NFC claims require supplier confirmation. |
| Stock | CJ inventory sync and Shopify inventory tracking work for the correct warehouse/location; selling past zero is disabled. |
| Pricing and margin | Actual product, shipping, tax, supplier, and handling costs support the configured retail prices. |
| Purchase policies | Real shipping, refund, privacy, and terms policies are published in Shopify and their links work. The API withholds checkout if any are missing. |
| Payments | Shopify checkout and the merchant's payment account can accept intended customer payments; a merchant-approved test confirms totals and confirmation behavior. |
| Paid orders | The native CJ connector receives and matches a paid Shopify order to the intended variant and shipping address. |
| Supplier settlement | The merchant approves funding and manual/automatic supplier payment rules. Customer payment alone does not pay CJ. |
| Fulfillment | Approved settlement results in the intended shipment, with tracking and fulfillment updates returned to Shopify. |
| Support | Owner-approved customer support, cancellation, return, refund, unpaid-order, inventory-lag, and shipping-exception handling are in place. |

No live order or supplier payment was performed in this task. These account and fulfillment gates cannot be inferred from mocked tests or a successful build.

## Validation

```sh
npm run test:commerce
npm run build
```

The combined automated suite currently has 93 passing checks, covering supplier authorization/mappings, merchant prices, stock changes, size/product mismatches, cart adjustments, request validation, and safe failure behavior. CJ request spacing is measured after the transport is invoked; regression cases cover synchronous startup delays and transport failure recovery. Desktop and mobile Chromium checks pass with mocked providers, including unavailable stock, checkout payloads, blocked browser storage, and retry after a failed request submission. No real order or customer record is created by these checks.

The older shipped Shopify helper is missing its exact `2026-10` schema/version data. The operations pass independent compatibility validation against Shopify's official `2026-04` schema and were reviewed in the current `2026-10` references. The native Shopify MCP validator subsequently validated both Storefront operations against its supplied schema, without returning a version stamp. Exact `2026-10` authenticated staging remains pending; a fresh merchant identity read still reports `operation_not_allowed`. GitHub Actions runs the mocked suite and production build on pull requests and `main` changes.

Official references:

- [Shopify Storefront API 2026-10](https://shopify.dev/docs/api/storefront/2026-10)
- [Create a cart](https://shopify.dev/docs/api/storefront/2026-10/mutations/cartCreate)
- [Product variants and stock](https://shopify.dev/docs/api/storefront/2026-10/objects/ProductVariant)
- [CJ Shopify connection](https://blog.cjdropshipping.com/detail/how-to-connect-shopify-shops-to-app-cjdropshipping-com)
- [CJ order synchronization and fulfillment](https://developers.cjdropshipping.com/en/api/start/Orders-Synchronization-Processing.html)
