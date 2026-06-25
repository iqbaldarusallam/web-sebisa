-- Sebisa Project CMS + Transaksi MVP
-- Jalankan di Supabase SQL Editor saat project Supabase sudah dibuat.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text,
  normal_price integer,
  promo_price integer,
  features text,
  duration text,
  badge_type text not null default 'discount',
  badge_text text,
  is_published boolean not null default true,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services add column if not exists normal_price integer;
alter table public.services add column if not exists promo_price integer;
alter table public.services add column if not exists features text;
alter table public.services add column if not exists duration text;
alter table public.services add column if not exists badge_type text not null default 'discount';
alter table public.services add column if not exists badge_text text;
alter table public.services add column if not exists base_price integer;
alter table public.services add column if not exists compare_at_price integer;
alter table public.services add column if not exists duration_label text;
alter table public.services add column if not exists badge_label text;
alter table public.services add column if not exists is_popular boolean not null default false;

update public.services
set
  promo_price = coalesce(promo_price, base_price),
  normal_price = coalesce(normal_price, compare_at_price),
  duration = coalesce(duration, duration_label),
  badge_text = coalesce(badge_text, badge_label),
  badge_type = case
    when coalesce(is_popular, false) then 'popular'
    when coalesce(badge_label, badge_text) is not null then 'custom'
    else coalesce(nullif(badge_type, ''), 'discount')
  end
where
  promo_price is null
  or normal_price is null
  or duration is null
  or badge_text is null
  or badge_type is null
  or coalesce(is_popular, false);

alter table public.services drop column if exists base_price;
alter table public.services drop column if exists compare_at_price;
alter table public.services drop column if exists duration_label;
alter table public.services drop column if exists badge_label;
alter table public.services drop column if exists is_popular;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  image_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_items drop column if exists project_url;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  comment text not null,
  rating numeric(2, 1),
  is_published boolean not null default true,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials drop column if exists image_url;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  division text not null,
  position text not null,
  description text not null,
  image_url text,
  is_published boolean not null default true,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  logo_url text,
  website_url text,
  is_published boolean not null default true,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null default '',
  product text not null default '',
  whatsapp text not null default '',
  email text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  brand text not null,
  service_name text not null,
  whatsapp text not null,
  email text,
  notes text,
  amount integer not null,
  status text not null default 'pending_payment',
  payment_status text not null default 'pending',
  payment_method text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders drop column if exists product;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_code text not null references public.orders(order_code) on delete cascade,
  provider text not null default 'midtrans',
  payment_status text not null default 'pending',
  snap_token text,
  redirect_url text,
  amount integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_code text not null,
  provider text not null,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists services_published_sort_idx on public.services (is_published, sort_order);
drop index if exists services_one_popular_per_category_idx;
create unique index if not exists services_one_popular_per_category_idx
  on public.services ((coalesce(category, 'uncategorized')))
  where badge_type = 'popular';
create index if not exists admin_users_email_active_idx on public.admin_users (email, is_active);
create index if not exists portfolio_published_sort_idx on public.portfolio_items (is_published, sort_order);
create index if not exists portfolio_category_idx on public.portfolio_items (category) where is_published = true;
create index if not exists testimonials_published_sort_idx on public.testimonials (is_published, sort_order);
create index if not exists team_published_sort_idx on public.team_members (is_published, sort_order);
create index if not exists client_logos_published_sort_idx on public.client_logos (is_published, sort_order);
create index if not exists orders_status_created_idx on public.orders (status, created_at desc);
create index if not exists orders_order_code_idx on public.orders (order_code);
create index if not exists payment_events_order_code_idx on public.payment_events (order_code);

alter table public.admin_users enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.client_logos enable row level security;
alter table public.contact_messages enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;

drop policy if exists "Public can read published services" on public.services;
create policy "Public can read published services"
  on public.services for select
  using (is_published = true);

drop policy if exists "Public can read published portfolio" on public.portfolio_items;
create policy "Public can read published portfolio"
  on public.portfolio_items for select
  using (is_published = true);

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
  on public.testimonials for select
  using (is_published = true);

drop policy if exists "Public can read published team" on public.team_members;
create policy "Public can read published team"
  on public.team_members for select
  using (is_published = true);

drop policy if exists "Public can read published client logos" on public.client_logos;
create policy "Public can read published client logos"
  on public.client_logos for select
  using (is_published = true);

-- Admin operations use service role key from Next.js server code, which bypasses RLS.
-- Do not expose SUPABASE_SECRET_KEY / service role key to the browser.


-- Behind The Scenes (BTS)
create table if not exists public.bts_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  video_url text not null,
  thumbnail_url text,
  is_published boolean not null default true,
  sort_order integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bts_published_sort_idx on public.bts_items (is_published, sort_order);
alter table public.bts_items enable row level security;

drop policy if exists "Public can read published bts" on public.bts_items;
create policy "Public can read published bts"
  on public.bts_items for select
  using (is_published = true);
