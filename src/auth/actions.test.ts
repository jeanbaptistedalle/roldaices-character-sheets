import { describe, it, expect, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { signInWithDiscord, signOut } from './actions'

function mockClient() {
  const auth = {
    signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  }
  return { auth } as unknown as SupabaseClient & { auth: typeof auth }
}

describe('auth actions', () => {
  it('signInWithDiscord requests the discord OAuth provider', () => {
    const client = mockClient()
    signInWithDiscord(client)
    expect(client.auth.signInWithOAuth).toHaveBeenCalledTimes(1)
    expect(client.auth.signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'discord' }),
    )
  })

  it('signInWithDiscord requests the guilds scope so membership can be checked', () => {
    const client = mockClient()
    signInWithDiscord(client)
    const options = client.auth.signInWithOAuth.mock.calls[0][0].options
    expect(options.scopes).toContain('guilds')
  })

  it('signInWithDiscord requests prompt=none to skip re-authorization for returning users', () => {
    const client = mockClient()
    signInWithDiscord(client)
    const options = client.auth.signInWithOAuth.mock.calls[0][0].options
    expect(options.queryParams).toEqual({ prompt: 'none' })
  })

  it('signOut calls the client sign-out', () => {
    const client = mockClient()
    signOut(client)
    expect(client.auth.signOut).toHaveBeenCalledTimes(1)
  })
})
