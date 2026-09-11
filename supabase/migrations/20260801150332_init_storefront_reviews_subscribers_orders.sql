-- ── AxonRing storefront backend ──
-- Replaces the Base44 /reviews and /subscribe functions.
-- Everything here is reachable with the browser publishable key, so each table
-- is locked down with RLS *and* explicit column grants: Supabase grants the
-- anon/authenticated roles broad table privileges by default, so we revoke
-- first and re-grant only what the storefront actually needs.

-- ── reviews ──────────────────────────────────────────────────────────
create table public.reviews (
  id                uuid primary key default gen_random_uuid(),
  product_id        text        not null check (char_length(product_id) between 1 and 120),
  reviewer_name     text        not null check (char_length(reviewer_name) between 1 and 80),
  reviewer_email    text        not null check (char_length(reviewer_email) between 3 and 254),
  rating            smallint    not null check (rating between 1 and 5),
  title             text        not null check (char_length(title) between 1 and 160),
  body              text        check (body is null or char_length(body) <= 3000),
  verified_purchase boolean     not null default false,
  helpful_count     integer     not null default 0 check (helpful_count >= 0),
  approved          boolean     not null default false,
  created_at        timestamptz not null default now()
);

create index reviews_product_created_idx on public.reviews (product_id, created_at desc);
create unique index reviews_product_email_uidx on public.reviews (product_id, lower(reviewer_email));

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

create policy "anyone may submit a review for moderation"
  on public.reviews for insert to anon, authenticated
  with check (approved = false and verified_purchase = false and helpful_count = 0);

-- Helpful voting remains disabled until it can run behind a rate-limited
-- server endpoint. Never expose a SECURITY DEFINER counter RPC to anon users.

-- ── subscribers ──────────────────────────────────────────────────────
create table public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text        not null check (char_length(email) between 3 and 254),
  source     text        check (source is null or char_length(source) <= 120),
  created_at timestamptz not null default now()
);

create unique index subscribers_email_uidx on public.subscribers (lower(email));

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
