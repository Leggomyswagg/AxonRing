-- ── AxonRing storefront backend ──
-- Replaces the Base44 /reviews and /subscribe functions.
-- Everything here is reachable with the browser publishable key, so each table
-- is locked down with RLS *and* explicit column grants: Supabase grants the
-- anon/authenticated roles broad table privileges by default, so we revoke
-- first and re-grant only what the storefront actually needs.

-- ── reviews ──────────────────────────────────────────────────────────
create table public.reviews (
  id                uuid primary key default gen_random_uuid(),
  product_id        text        not null,
  reviewer_name     text        not null,
  reviewer_email    text,
  rating            smallint    not null check (rating between 1 and 5),
  title             text,
  body              text,
  verified_purchase boolean     not null default false,
  helpful_count     integer     not null default 0,
  approved          boolean     not null default true,
  created_at        timestamptz not null default now()
);

create index reviews_product_created_idx on public.reviews (product_id, created_at desc);

alter table public.reviews enable row level security;

revoke all on public.reviews from anon, authenticated;

-- reviewer_email is deliberately NOT in the select list: shoppers submit it,
-- but it must never be readable with the publishable key.
grant select (id, product_id, reviewer_name, rating, title, body,
              verified_purchase, helpful_count, created_at)
  on public.reviews to anon, authenticated;

grant insert (product_id, reviewer_name, reviewer_email, rating, title, body)
  on public.reviews to anon, authenticated;

create policy "approved reviews are public"
  on public.reviews for select to anon, authenticated
  using (approved);

create policy "anyone may submit a review"
  on public.reviews for insert to anon, authenticated
  with check (true);

-- Helpful votes: no UPDATE grant is issued, so the only way to touch
-- helpful_count is through this function, which can only ever increment it.
create function public.increment_review_helpful(review_id uuid)
  returns void
  language sql
  security definer
  set search_path = public
as $$
  update public.reviews
     set helpful_count = helpful_count + 1
   where id = review_id and approved;
$$;

grant execute on function public.increment_review_helpful(uuid) to anon, authenticated;

-- ── subscribers ──────────────────────────────────────────────────────
create table public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text        not null unique,
  source     text,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

revoke all on public.subscribers from anon, authenticated;

-- Insert-only on purpose: there is no select grant and no select policy, so
-- the publishable key cannot be used to read the mailing list back out.
grant insert (email, source) on public.subscribers to anon, authenticated;

create policy "anyone may subscribe"
  on public.subscribers for insert to anon, authenticated
  with check (true);

-- ── orders ───────────────────────────────────────────────────────────
-- Created now so the schema is complete, but unused until checkout moves off
-- Base44. No grants and no policies: only service_role (which bypasses RLS)
-- can read or write this table.
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text        not null unique,
  payment_intent_id text        unique,
  customer_email    text        not null,
  customer_name     text,
  address           text,
  city              text,
  state             text,
  zip               text,
  country           text,
  items             jsonb       not null default '[]'::jsonb,
  subtotal          numeric(10,2),
  shipping          numeric(10,2),
  tax               numeric(10,2),
  discount          numeric(10,2),
  total             numeric(10,2) not null,
  status            text        not null default 'paid',
  created_at        timestamptz not null default now()
);

create index orders_email_created_idx on public.orders (customer_email, created_at desc);

alter table public.orders enable row level security;

revoke all on public.orders from anon, authenticated;
