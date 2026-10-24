# Repository consolidation — 2026-10-24

## Canonical source

`Leggomyswagg/AxonRing` is the canonical repository. AxonRing.com continues to deploy the root website.

## Kept

- Current production website and approved interactive experiences.
- AxonRing AIA runtime, security docs, migrations and evaluation sources.
- DB360 dashboard source.
- Publisher OS product research, retained under `docs/incubator/` until there is an implementation.
- Subdomain pages that contain distinct support, account, learning, developer, tracking or returns experiences.

## Excluded from the clean branch

- Home-directory files and caches accidentally committed to the old AxonRing tree.
- Duplicate files with `(1)` and `(2)` suffixes.
- Deployment archives, zip/tar bundles and generated dependency caches.
- Superseded standalone marketing sites from AxonRing.com, AxonRing.online and axonring-fixed.
- Empty placeholder repositories.
- Publisher OS workspace configuration that referenced application and package directories that did not exist.

Original repositories remain intact as rollback sources until this branch is validated and merged. After merge they can be archived; deletion is unnecessary.
