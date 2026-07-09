import { describe, it, expect, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getCurrentProfile, getCurrentUserRole } from './profiles'

const ROW = {
  id: 'user-1',
  email: 'grit@example.com',
  role: 'user' as const,
  created_at: '2026-07-09T00:00:00Z',
  last_seen_at: '2026-07-09T00:00:00Z',
}

function mockClient(opts: {
  user?: { id: string } | null
  row?: unknown
  error?: unknown
}) {
  const maybeSingle = vi
    .fn()
    .mockResolvedValue({ data: 'row' in opts ? opts.row : ROW, error: opts.error ?? null })
  const eq = vi.fn(() => ({ maybeSingle }))
  const select = vi.fn(() => ({ eq }))
  const from = vi.fn(() => ({ select }))

  const user = 'user' in opts ? opts.user : { id: 'user-1' }
  const auth = {
    getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
  }

  const client = { from, auth } as unknown as SupabaseClient
  return { client, from, eq, maybeSingle }
}

describe('getCurrentProfile', () => {
  it('reads the current user row and maps it', async () => {
    const { client, from, eq } = mockClient({})
    const profile = await getCurrentProfile(client)

    expect(from).toHaveBeenCalledWith('profiles')
    expect(eq).toHaveBeenCalledWith('id', 'user-1')
    expect(profile).toEqual({
      id: 'user-1',
      email: 'grit@example.com',
      role: 'user',
      createdAt: '2026-07-09T00:00:00Z',
      lastSeenAt: '2026-07-09T00:00:00Z',
    })
  })

  it('returns null when nobody is signed in', async () => {
    const { client, from } = mockClient({ user: null })
    expect(await getCurrentProfile(client)).toBeNull()
    expect(from).not.toHaveBeenCalled()
  })

  it('returns null when the user has no profile row', async () => {
    const { client } = mockClient({ row: null })
    expect(await getCurrentProfile(client)).toBeNull()
  })

  it('throws when the query fails', async () => {
    const { client } = mockClient({ error: new Error('boom') })
    await expect(getCurrentProfile(client)).rejects.toThrow('boom')
  })
})

describe('getCurrentUserRole', () => {
  it('returns the role of the current user', async () => {
    const { client } = mockClient({})
    expect(await getCurrentUserRole(client)).toBe('user')
  })

  it('returns null when nobody is signed in', async () => {
    const { client } = mockClient({ user: null })
    expect(await getCurrentUserRole(client)).toBeNull()
  })
})
