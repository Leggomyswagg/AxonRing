-- Supabase advisor hardening for AxonRing-AIA
create schema if not exists extensions;
alter extension vector set schema extensions;

drop policy if exists "own agent runs" on public.agent_runs;
create policy "own agent runs" on public.agent_runs for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "own agent steps" on public.agent_steps;
create policy "own agent steps" on public.agent_steps for all to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())))
with check (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())));

drop policy if exists "own tool calls" on public.tool_calls;
create policy "own tool calls" on public.tool_calls for select to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())));

drop policy if exists "own approvals read" on public.approvals;
create policy "own approvals read" on public.approvals for select to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())));

drop policy if exists "own approvals decide" on public.approvals;
create policy "own approvals decide" on public.approvals for update to authenticated
using (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())))
with check (exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())));

drop policy if exists "own evaluations" on public.evaluation_results;
create policy "own evaluations" on public.evaluation_results for select to authenticated
using (run_id is null or exists(select 1 from public.agent_runs r where r.id=run_id and r.user_id=(select auth.uid())));

drop policy if exists "own embeddings" on public.agent_embeddings;
create policy "own embeddings" on public.agent_embeddings for all to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));

create index if not exists approvals_decided_by_idx on public.approvals(decided_by);
create index if not exists approvals_requested_by_idx on public.approvals(requested_by);
create index if not exists approvals_step_id_idx on public.approvals(step_id);
create index if not exists tool_calls_step_id_idx on public.tool_calls(step_id);
