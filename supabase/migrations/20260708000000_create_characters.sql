-- Characters are shared across TTRPG systems in one table. Identity fields that
-- every system has (name/description/portrait) are real columns; everything
-- system-specific lives in the `data` jsonb column. We store ids only in
-- `data` (no denormalized labels) so renaming a label later never rewrites rows.

create table public.characters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  system_id   text not null,
  name        text not null,
  description text,
  image_uri   text,
  data        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Access control lives here, not in the client: logged out, the browser sends
-- only the anon publishable key, so auth.uid() is null and `with check` rejects
-- inserts. A user can only ever read/write their own rows.
alter table public.characters enable row level security;

create policy "own characters" on public.characters
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- The one query we run: a user's characters for a given system.
create index characters_user_system_idx on public.characters (user_id, system_id);
