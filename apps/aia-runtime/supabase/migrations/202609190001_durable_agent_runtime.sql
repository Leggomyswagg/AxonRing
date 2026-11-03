-- AxonRing AIA durable agent execution schema
create extension if not exists pgcrypto;
create extension if not exists vector;

create type public.agent_run_status as enum ('queued','running','waiting_approval','succeeded','failed','compensating','compensated','cancelled');
create type public.agent_step_status as enum ('pending','running','succeeded','failed','skipped','compensating','compensated');
create type public.approval_status as enum ('pending','approved','rejected','expired');

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  agent_name text not null,
  workflow_version text not null,
  idempotency_key text not null,
  status public.agent_run_status not null default 'queued',
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  checkpoint jsonb not null default '{}'::jsonb,
  trace_id text,
  error jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, agent_name, idempotency_key)
);

create table public.agent_steps (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.agent_runs(id) on delete cascade,
  step_key text not null,
  status public.agent_step_status not null default 'pending',
  attempt smallint not null default 0 check (attempt >= 0),
  max_attempts smallint not null default 3 check (max_attempts between 1 and 5),
  idempotency_key text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  checkpoint jsonb not null default '{}'::jsonb,
  compensation jsonb,
  error jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_id, step_key),
  unique (run_id, idempotency_key)
);

create table public.tool_calls (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.agent_runs(id) on delete cascade,
  step_id uuid references public.agent_steps(id) on delete cascade,
  tool_name text not null,
  idempotency_key text not null,
  request jsonb not null default '{}'::jsonb,
  response jsonb,
  authorized boolean not null default false,
  attempt smallint not null default 1 check (attempt between 1 and 5),
  trace_id text,
  span_id text,
  latency_ms integer check (latency_ms >= 0),
  cost_usd numeric(12,6) check (cost_usd >= 0),
  error jsonb,
  created_at timestamptz not null default now(),
  unique (run_id, idempotency_key)
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.agent_runs(id) on delete cascade,
  step_id uuid references public.agent_steps(id) on delete cascade,
  requested_by uuid not null default auth.uid() references auth.users(id),
  decided_by uuid references auth.users(id),
  action text not null,
  action_digest text not null,
  status public.approval_status not null default 'pending',
  rationale text,
  expires_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_id, action_digest)
);

create table public.evaluation_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.agent_runs(id) on delete cascade,
  suite_version text not null,
  metric text not null check (metric in ('accuracy','unauthorized_action_rate','repeated_run_consistency','cost','latency')),
  score double precision not null,
  threshold double precision,
  passed boolean,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Embeddings are isolated records; raw secrets/prompt credentials must never be embedded.
create table public.agent_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  namespace text not null,
  source_id text not null,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, namespace, source_id)
);

create index agent_runs_user_created_idx on public.agent_runs(user_id, created_at desc);
create index agent_steps_run_idx on public.agent_steps(run_id);
create index tool_calls_run_idx on public.tool_calls(run_id);
create index approvals_run_status_idx on public.approvals(run_id, status);
create index evaluation_results_run_idx on public.evaluation_results(run_id);
create index agent_embeddings_user_namespace_idx on public.agent_embeddings(user_id, namespace);

alter table public.agent_runs enable row level security;
alter table public.agent_steps enable row level security;
alter table public.tool_calls enable row level security;
alter table public.approvals enable row level security;
alter table public.evaluation_results enable row level security;
alter table public.agent_embeddings enable row level security;

create policy "own agent runs" on public.agent_runs for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own agent steps" on public.agent_steps for all to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()))
with check (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()));

create policy "own tool calls" on public.tool_calls for select to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()));

create policy "own approvals read" on public.approvals for select to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()));
create policy "own approvals decide" on public.approvals for update to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()))
with check (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()));

create policy "own evaluations" on public.evaluation_results for select to authenticated
using (run_id is null or exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=auth.uid()));

create policy "own embeddings" on public.agent_embeddings for all to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Defense in depth: browser roles cannot write execution audit records.
revoke insert, update, delete on public.tool_calls from anon, authenticated;
revoke insert, update, delete on public.evaluation_results from anon, authenticated;
revoke all on public.agent_runs, public.agent_steps, public.tool_calls, public.approvals, public.evaluation_results, public.agent_embeddings from anon;
grant select, insert, update on public.agent_runs, public.agent_steps to authenticated;
grant select, update on public.approvals to authenticated;
grant select on public.tool_calls, public.evaluation_results to authenticated;
grant select, insert, update, delete on public.agent_embeddings to authenticated;
