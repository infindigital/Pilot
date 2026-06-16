-- Reel Learning Vault — database schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query →
-- paste → Run.

-- 1. Table: one row per learning item, owned by a user, item payload as jsonb.
create table if not exists public.items (
  id          text primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Helpful index for the per-user, newest-first listing.
create index if not exists items_user_created_idx
  on public.items (user_id, created_at desc);

-- 2. Row Level Security: every user can only see and modify their own rows.
alter table public.items enable row level security;

-- Drop existing policies first so this script is safe to re-run.
drop policy if exists "items_select_own" on public.items;
drop policy if exists "items_insert_own" on public.items;
drop policy if exists "items_update_own" on public.items;
drop policy if exists "items_delete_own" on public.items;

create policy "items_select_own"
  on public.items for select
  using (auth.uid() = user_id);

create policy "items_insert_own"
  on public.items for insert
  with check (auth.uid() = user_id);

create policy "items_update_own"
  on public.items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "items_delete_own"
  on public.items for delete
  using (auth.uid() = user_id);
