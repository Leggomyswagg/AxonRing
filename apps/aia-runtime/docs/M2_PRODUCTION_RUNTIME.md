# M2 — Production Agent Runtime

M2 promotes the durable execution foundation into a reference production path.

## Execution contract

1. Every run enters through `executeAgentRun`.
2. Model calls pass through `executeModel` and OpenTelemetry.
3. Consequential tool actions require a persisted approval gate before execution.
4. Tool calls pass through `executeTool` and are persisted with an idempotency key.
5. Durable steps checkpoint successful outputs and skip them on replay.
6. Transient failures use bounded retries; terminal failures trigger reverse-order compensation.
7. Service-role credentials remain server-only.

## Validation

CI exercises bounded retry behavior, idempotent replay, reverse-order compensation, unauthorized-action blocking, type checking, and the existing evaluation suite.

A live Supabase smoke test is intentionally separate from PR CI because it requires production credentials. Run that test only in a protected environment with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` supplied as server-side secrets.
