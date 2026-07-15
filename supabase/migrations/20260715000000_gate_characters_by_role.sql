-- Gate character writes by role. A 'guest' may go through the whole creation
-- wizard (an unsaved draft) but may NOT persist: only 'user'/'moderator'/'admin'
-- can insert or update characters. This is the real gate — the UI hides the save
-- button for guests, but RLS enforces it even if the client is bypassed.
--
-- Reading and deleting your own rows stays open to any role (a guest has none
-- anyway); only the write path is restricted.
--
-- Written idempotently (drop-if-exists + create-or-replace) so CI can re-run
-- `supabase db push` without erroring.

-- Is the current caller allowed to persist characters? SECURITY DEFINER so the
-- role lookup bypasses RLS on profiles (a plain subquery would be blocked by the
-- read-own-row policy for anyone but the caller, and here it's the caller's own
-- row, but we keep it definer for consistency with is_admin()).
create or replace function public.is_privileged()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('user', 'moderator', 'admin')
  );
$$;

-- Replace the single blanket "for all" policy from the initial migration with
-- per-command policies so writes can carry the role check while reads/deletes
-- stay open to the owner.
drop policy if exists "own characters" on public.characters;
drop policy if exists "read own characters" on public.characters;
drop policy if exists "delete own characters" on public.characters;
drop policy if exists "insert own characters when privileged" on public.characters;
drop policy if exists "update own characters when privileged" on public.characters;

create policy "read own characters" on public.characters
  for select
  using (auth.uid() = user_id);

create policy "delete own characters" on public.characters
  for delete
  using (auth.uid() = user_id);

create policy "insert own characters when privileged" on public.characters
  for insert
  with check (auth.uid() = user_id and public.is_privileged());

create policy "update own characters when privileged" on public.characters
  for update
  using (auth.uid() = user_id and public.is_privileged())
  with check (auth.uid() = user_id and public.is_privileged());
