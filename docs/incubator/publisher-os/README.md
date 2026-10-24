# AxonRing AI Publisher

AI-native publishing platform for turning manuscripts into professionally edited, designed, marketed, and publication-ready digital products.

## MVP: AI Ebook Production Pipeline v1.0

### Inputs
- Book title
- Chapter files
- Brand guidelines
- Target audience

### Outputs
- Edited chapters
- SEO metadata
- Design instructions
- Marketing assets
- Publishing checklist

## Architecture

- `apps/web` — product UI
- `packages/ai` — AI orchestration and schemas
- `packages/database` — database contracts
- `packages/publishing` — document/export pipeline
- `packages/marketing` — marketing asset schemas
- `packages/ui` — shared UI components
- `workflows/yepcode` — YepCode automation contracts
- `supabase` — database migrations and server functions
- `docs` — product and architecture documentation

## Development

This repository uses pnpm workspaces and Turborepo.

## Product principle

Build a reliable publishing workflow first. Add advanced automation, billing, collaboration, analytics, and marketplace integrations only after the core manuscript-to-publication pipeline is stable.
