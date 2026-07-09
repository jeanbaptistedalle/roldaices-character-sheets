import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../shared/supabase'

// Data-layer seam for the profiles table (see characters.ts). One row per user
// who has ever signed in, carrying an app-level `role`. Row creation and role
// changes are server-side only (a signup trigger and admin-only RLS); the client
// can only ever read its own row. Never trust the role read here for security —
// it's for display/UX. The database enforces role-gated limits itself via RLS.

export type UserRole = 'guest' | 'user' | 'moderator' | 'admin'

export interface ProfileRecord {
  id: string
  email: string | null
  role: UserRole
  createdAt: string
  lastSeenAt: string
}

// Row shape as stored in Postgres (snake_case).
interface ProfileRow {
  id: string
  email: string | null
  role: UserRole
  created_at: string
  last_seen_at: string
}

function toRecord(row: ProfileRow): ProfileRecord {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
  }
}

/**
 * The current user's profile, or null if nobody is signed in. RLS guarantees a
 * signed-in caller can only ever read their own row. Throws if the query fails.
 */
export async function getCurrentProfile(
  client: SupabaseClient = supabase,
): Promise<ProfileRecord | null> {
  const { data: auth, error: authError } = await client.auth.getUser()
  if (authError) throw authError
  const user = auth.user
  if (!user) return null

  const { data, error } = await client
    .from('profiles')
    .select()
    .eq('id', user.id)
    .maybeSingle()

  if (error) throw error
  return data ? toRecord(data as ProfileRow) : null
}

/**
 * The current user's role, or null if nobody is signed in. Convenience wrapper
 * over getCurrentProfile for the common case (role-gated UI). Display only —
 * the server enforces role limits regardless of what the client believes.
 */
export async function getCurrentUserRole(
  client: SupabaseClient = supabase,
): Promise<UserRole | null> {
  const profile = await getCurrentProfile(client)
  return profile?.role ?? null
}
