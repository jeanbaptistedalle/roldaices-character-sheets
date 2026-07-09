-- One row per user who has ever signed in. `auth.users` is Supabase-managed and
-- we don't add columns to it; instead we mirror the users we care about into
-- this public table and hang app-level data (role) off it. A trigger keeps it
-- in sync so the app never has to remember to create the row.
--
-- Roles: new users land as 'guest'. An admin later promotes them to 'user'
-- (or beyond). Role gates things like the per-user character limit, enforced
-- server-side so the client can never bypass it.

create type public.user_role as enum ('guest', 'user', 'moderator', 'admin');

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  role         public.user_role not null default 'guest',
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- Auto-create a profile the first time a user is created in auth.users. Runs as
-- SECURITY DEFINER because the trigger fires in the auth schema's context and
-- must reach across into public. `on conflict do nothing` keeps it idempotent.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who already signed in before this migration.
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- Is the current caller an admin? A plain subquery on public.profiles inside a
-- profiles policy would recurse (the policy would re-check itself). SECURITY
-- DEFINER runs the lookup with RLS bypassed, breaking the cycle.
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

-- Everyone (guest, user, admin) can read their own row — that's how the client
-- learns its own role. Nobody reads anyone else's row except through admin
-- tooling that runs with elevated rights.
create policy "read own profile" on public.profiles
  for select
  using (auth.uid() = id);

-- Only admins may change profiles. There is deliberately NO insert/update/delete
-- policy for guest or user: RLS denies by default, so they cannot touch profiles
-- at all (including their own role). Inserts happen only via handle_new_user,
-- which runs SECURITY DEFINER and bypasses these policies.
create policy "admin updates profiles" on public.profiles
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Seed the first admin. Nobody can promote anyone until one admin exists, so this
-- must be done here (or by hand via the service role in the SQL editor).
update public.profiles set role = 'admin'
where email = 'jean-baptiste.dalle@stereograph.fr';
