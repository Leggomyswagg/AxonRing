# AxonRing-AIA

Production-oriented agent architecture for AxonRing.

## Durable execution baseline
- Supabase-backed run/step checkpoints and idempotency records
- limited retry policy (default 3, hard cap 5) and reverse-order compensating actions
- persisted approvals for consequential actions
- RLS on structured execution records and embeddings
- server-only service-role boundary
- OpenTelemetry wrapper for every model/tool adapter
- evaluation gates for accuracy, unauthorized actions, repeatability, cost, and latency

Apply `supabase/migrations/202609190001_durable_agent_runtime.sql`, then wire every provider/tool adapter through `tracedCall` and the durable workflow runner. Production adapters should persist tool-call authorization, trace/span IDs, cost, latency and evaluation results.
