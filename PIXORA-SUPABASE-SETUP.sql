-- PIXORA Supabase setup
-- Run in Supabase Dashboard > SQL Editor. Uses owner-only access for uploads.
create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  category text not null default 'Other',
  description text not null default '',
  price_inr integer not null default 0 check (price_inr >= 0),
  file_path text not null,
  original_filename text not null,
  created_at timestamptz not null default now()
);
alter table public.designs enable row level security;
drop policy if exists "Creators can read own designs" on public.designs;
create policy "Creators can read own designs" on public.designs for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Creators can insert own designs" on public.designs;
create policy "Creators can insert own designs" on public.designs for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Creators can update own designs" on public.designs;
create policy "Creators can update own designs" on public.designs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Creators can delete own designs" on public.designs;
create policy "Creators can delete own designs" on public.designs for delete to authenticated using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('design-files', 'design-files', false, 26214400, array['image/jpeg','image/png','image/svg+xml','application/pdf','application/octet-stream'])
on conflict (id) do update set public = false, file_size_limit = 26214400;

drop policy if exists "Users upload files to own folder" on storage.objects;
create policy "Users upload files to own folder" on storage.objects for insert to authenticated
with check (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users read own design files" on storage.objects;
create policy "Users read own design files" on storage.objects for select to authenticated
using (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users update own design files" on storage.objects;
create policy "Users update own design files" on storage.objects for update to authenticated
using (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users delete own design files" on storage.objects;
create policy "Users delete own design files" on storage.objects for delete to authenticated
using (bucket_id = 'design-files' and (storage.foldername(name))[1] = auth.uid()::text);
