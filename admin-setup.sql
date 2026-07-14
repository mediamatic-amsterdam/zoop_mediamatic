-- ─────────────────────────────────────────
-- Zoöp Admin Content — Supabase setup
-- Run this once in your project's SQL Editor (Supabase Dashboard → SQL Editor → New query).
-- Creates the tables admin.html reads and writes: intro text, goals, and
-- interventions. Folders, the logbook, and images are intentionally not
-- part of this — those stay git/code-only.
-- ─────────────────────────────────────────

-- Intro page text (and any other one-off site copy), as simple key/value pairs.
create table if not exists public.site_content (
  key text primary key,
  value text not null default ''
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,   -- e.g. "01" — controls display order, editable
  name text not null,
  short_name text not null,
  description text not null
);

create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  name text not null,
  progress int not null default 0,
  period text not null default '',
  body text not null default '',
  indicators jsonb not null default '[]'::jsonb,
  sort_order int not null default 0
);

-- Public read (the site needs this to render for every visitor).
-- Writes require a logged-in admin session.
alter table public.site_content enable row level security;
alter table public.goals enable row level security;
alter table public.interventions enable row level security;

create policy "site_content public read" on public.site_content for select using (true);
create policy "site_content admin insert" on public.site_content for insert with check (auth.role() = 'authenticated');
create policy "site_content admin update" on public.site_content for update using (auth.role() = 'authenticated');
create policy "site_content admin delete" on public.site_content for delete using (auth.role() = 'authenticated');

create policy "goals public read" on public.goals for select using (true);
create policy "goals admin insert" on public.goals for insert with check (auth.role() = 'authenticated');
create policy "goals admin update" on public.goals for update using (auth.role() = 'authenticated');
create policy "goals admin delete" on public.goals for delete using (auth.role() = 'authenticated');

create policy "interventions public read" on public.interventions for select using (true);
create policy "interventions admin insert" on public.interventions for insert with check (auth.role() = 'authenticated');
create policy "interventions admin update" on public.interventions for update using (auth.role() = 'authenticated');
create policy "interventions admin delete" on public.interventions for delete using (auth.role() = 'authenticated');
