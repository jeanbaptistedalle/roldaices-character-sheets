import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../shared/supabase'
import type { UserRole } from './profiles'

// Data-layer seam for the Discord membership check. Components/auth never call
// the Edge Function directly — they go through here (mirrors characters.ts /
// profiles.ts). The `discord-membership` function reads the caller's Discord
// server list via their OAuth provider token and, if they belong to an allowed
// server, promotes their profile role from 'guest' to 'user' (promote-only —
// it never downgrades, and never touches user/moderator/admin). Enforcement of
// what a role may do lives in RLS, not here.

export interface MembershipResult {
  /** The profile role after the check (may be unchanged). */
  role: UserRole
  /** True if this call flipped the role from 'guest' to 'user'. */
  promoted: boolean
}

/**
 * Ask the server to (re)check the signed-in user's Discord server membership and
 * promote them if they qualify. Pass the OAuth `provider_token` from the session
 * — Supabase only exposes it right after a Discord sign-in, so call this on the
 * SIGNED_IN event. Throws if the function returns an error.
 */
export async function syncDiscordMembership(
  providerToken: string,
  client: SupabaseClient = supabase,
): Promise<MembershipResult> {
  const { data, error } = await client.functions.invoke('discord-membership', {
    body: { providerToken },
  })
  if (error) throw error
  return data as MembershipResult
}
