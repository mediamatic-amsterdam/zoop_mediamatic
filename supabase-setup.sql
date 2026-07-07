-- ─────────────────────────────────────────
-- Zoöp Logbook — Supabase setup
-- Run this once in your project's SQL Editor (Supabase Dashboard → SQL Editor → New query).
-- ─────────────────────────────────────────

-- Table. Column names double as the CSV header format for future imports —
-- see logbook-import-template.csv. Supabase's Table Editor can import a CSV
-- with these exact headers directly, no code required.
create table if not exists public.logbook_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  entry_date date not null,
  entry_time time,
  weather text,
  observations text,
  notes text,
  media_type text,   -- 'image' | 'audio' | 'video' | 'drawing' | null
  media_url text,     -- public URL, filled in after upload to storage
  media_path text      -- storage object path, used to delete the file later
);

-- Storage bucket for photos/audio/video/drawings attached to entries.
insert into storage.buckets (id, name, public)
values ('logbook-media', 'logbook-media', true)
on conflict (id) do nothing;

-- Open access (no login system on the site — matches today's local-only behavior).
-- Anyone who can reach the site can read, add, and delete entries and media.
alter table public.logbook_entries enable row level security;

create policy "logbook public read" on public.logbook_entries
  for select using (true);

create policy "logbook public insert" on public.logbook_entries
  for insert with check (true);

create policy "logbook public delete" on public.logbook_entries
  for delete using (true);

create policy "logbook media public read" on storage.objects
  for select using (bucket_id = 'logbook-media');

create policy "logbook media public upload" on storage.objects
  for insert with check (bucket_id = 'logbook-media');

create policy "logbook media public delete" on storage.objects
  for delete using (bucket_id = 'logbook-media');
