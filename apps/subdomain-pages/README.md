# AxonRing Subdomain Pages

12 subdomain landing pages for axonring.com, organized by category.

## Structure

Each subdomain lives in its own folder. To deploy one:

1. Create a new Vercel project pointing to the folder (e.g. `/shop`)
2. Add the matching custom domain (e.g. `shop.axonring.com`) in Vercel settings
3. Point IONOS DNS via CNAME: `shop` → `cname.vercel-dns.com`

## Subdomains

### Customer-Facing
- `shop/` — shop.axonring.com (Live — links to main site collections)
- `support/` — support.axonring.com (Live — links to main site FAQ)
- `app/` — app.axonring.com (Coming Soon — email capture)
- `community/` — community.axonring.com (Coming Soon)
- `blog/` — blog.axonring.com (Coming Soon)
- `learn/` — learn.axonring.com (Coming Soon)

### Technical / Developer
- `api/` — api.axonring.com (Coming Soon)
- `developers/` — developers.axonring.com (Coming Soon)
- `status/` — status.axonring.com (Coming Soon)

### Operations
- `track/` — track.axonring.com (Coming Soon)
- `returns/` — returns.axonring.com (Coming Soon)
- `account/` — account.axonring.com (Coming Soon)

## Email Capture

All "Coming Soon" pages have a working email form. The form currently logs
client-side only — wire it to a real endpoint when ready (Mailchimp, ConvertKit,
Resend, custom API, etc.) by editing the `<script>` at the bottom of each
index.html.

## Design

All pages match the axonring.com luxury aesthetic — Cormorant Garamond serif,
gold/cream palette, grain overlay, editorial spacing.
