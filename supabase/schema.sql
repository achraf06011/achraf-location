-- Atlas Drive — reservations table.
-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.

create extension if not exists btree_gist;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  vehicle_slug text not null,
  vehicle_name text not null,
  customer_name text not null,
  customer_phone text not null,
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  pickup_location text not null default 'agence',
  pickup_custom text,
  dropoff_location text not null default 'agence',
  dropoff_custom text,
  extras jsonb not null default '[]'::jsonb,
  pack_id text,
  car_prep jsonb,
  flight_info jsonb,
  total numeric not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_phone_created_idx
  on public.reservations (customer_phone, created_at);

-- A vehicle can never hold two active (pending/confirmed) reservations on overlapping
-- dates, even if two clients submit at the exact same moment.
alter table public.reservations drop constraint if exists reservations_no_overlap;
alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (
    vehicle_slug with =,
    daterange(start_date, end_date, '[]') with &&
  ) where (status in ('pending', 'confirmed'));

-- Only the server (service role key) reads/writes this table.
alter table public.reservations enable row level security;
