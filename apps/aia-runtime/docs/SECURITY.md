# AxonRing-AIA secret boundary

- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it through `NEXT_PUBLIC_*`, `VITE_*`, browser bundles, logs, telemetry attributes, model prompts, tool arguments, embeddings, or agent memory.
- Client code uses the Supabase anon/publishable key plus the authenticated user's JWT and is constrained by RLS.
- Privileged execution runs only in trusted server/worker environments.
- Prompts receive capability identifiers and scoped data, never credentials. Tool adapters resolve credentials after authorization.
- Any externally consequential tool action must pass authorization policy; high-impact actions require a persisted approval whose action digest matches the exact proposed action.
- Logs/telemetry must redact authorization headers, cookies, API keys, access/refresh tokens and prompt fields that can contain secrets.
