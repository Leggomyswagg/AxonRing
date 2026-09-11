-- Explicitly document the browser-role denial. The service role bypasses RLS;
-- anon and authenticated still have no table grants.
drop policy if exists "orders are service only" on public.orders;
create policy "orders are service only"
  on public.orders for all to anon, authenticated
  using (false)
  with check (false);
