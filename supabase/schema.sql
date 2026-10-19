create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  tech_stack text[] default '{}',
  image_url text,
  demo_url text,
  repo_url text,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Anyone can view projects" on public.projects;
create policy "Anyone can view projects"
  on public.projects
  for select
  to public
  using (true);

drop policy if exists "Authenticated users can insert projects" on public.projects;
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

drop policy if exists "Anyone can send messages" on public.messages;
create policy "Anyone can send messages"
  on public.messages
  for insert
  to public
  with check (true);

drop policy if exists "Authenticated users can view messages" on public.messages;
create policy "Authenticated users can view messages"
  on public.messages
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can update messages" on public.messages;
create policy "Authenticated users can update messages"
  on public.messages
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete messages" on public.messages;
create policy "Authenticated users can delete messages"
  on public.messages
  for delete
  to authenticated
  using (true);
