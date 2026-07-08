import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../shared/supabase'

// The data-layer seam. All Supabase table access goes through here — components
// never touch supabase-js. Generic across TTRPG systems: identity fields are
// columns, the system-specific payload rides in `data` (jsonb). Callers cast
// `data` to their own type.

export interface CharacterRecord {
  id: string
  systemId: string
  name: string
  description: string | null
  imageUri: string | null
  data: unknown
  createdAt: string
}

export interface NewCharacter {
  systemId: string
  name: string
  description?: string
  imageUri?: string
  data: unknown
}

export interface CharacterUpdate {
  name: string
  description?: string
  imageUri?: string
  data: unknown
}

// Row shape as stored in Postgres (snake_case).
interface CharacterRow {
  id: string
  system_id: string
  name: string
  description: string | null
  image_uri: string | null
  data: unknown
  created_at: string
}

function toRecord(row: CharacterRow): CharacterRecord {
  return {
    id: row.id,
    systemId: row.system_id,
    name: row.name,
    description: row.description,
    imageUri: row.image_uri,
    data: row.data,
    createdAt: row.created_at,
  }
}

/**
 * Insert a character for the current user. Throws if nobody is signed in or the
 * insert fails. RLS also enforces ownership server-side; the explicit user-id
 * fetch just lets us fail early with a clear message.
 */
export async function saveCharacter(
  input: NewCharacter,
  client: SupabaseClient = supabase,
): Promise<CharacterRecord> {
  const { data: auth, error: authError } = await client.auth.getUser()
  if (authError) throw authError
  const user = auth.user
  if (!user) throw new Error('Must be signed in to save a character.')

  const { data, error } = await client
    .from('characters')
    .insert({
      user_id: user.id,
      system_id: input.systemId,
      name: input.name,
      description: input.description ?? null,
      image_uri: input.imageUri ?? null,
      data: input.data,
    })
    .select()
    .single()

  if (error) throw error
  return toRecord(data as CharacterRow)
}

/**
 * Overwrite an existing character by id. `system_id` is immutable. Ownership is
 * enforced server-side by Row Level Security. Throws if the update fails.
 */
export async function updateCharacter(
  id: string,
  input: CharacterUpdate,
  client: SupabaseClient = supabase,
): Promise<CharacterRecord> {
  const { data, error } = await client
    .from('characters')
    .update({
      name: input.name,
      description: input.description ?? null,
      image_uri: input.imageUri ?? null,
      data: input.data,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return toRecord(data as CharacterRow)
}

/**
 * Delete a character by id. Ownership is enforced server-side by Row Level
 * Security — a user can only delete their own rows. Throws if the delete fails.
 */
export async function deleteCharacter(
  id: string,
  client: SupabaseClient = supabase,
): Promise<void> {
  const { error } = await client.from('characters').delete().eq('id', id)
  if (error) throw error
}

/** The current user's characters for one system, newest first. */
export async function listCharacters(
  systemId: string,
  client: SupabaseClient = supabase,
): Promise<CharacterRecord[]> {
  const { data, error } = await client
    .from('characters')
    .select()
    .eq('system_id', systemId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CharacterRow[]).map(toRecord)
}
