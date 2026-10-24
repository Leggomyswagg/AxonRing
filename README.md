# AxonRing

Canonical AxonRing product and operating-system monorepo.

## Structure

- Root and `public/`: production AxonRing.com marketing site.
- `apps/aia-runtime/`: durable AI-agent runtime and evaluations.
- `apps/db360/`: internal executive dashboard.
- `apps/publisher-os/`: publishing system product definition and workspace.
- `apps/subdomain-pages/`: preserved support, account, developer and commerce subdomain pages.
- `docs/`: architecture, consolidation decisions and operating notes.

## Production website

```bash
npm ci
npm run build
```

The root website remains independently deployable so the existing Vercel project does not need a root-directory change.
