import { describe, it, expect, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { signInWithDiscord, signInWithEmail, signOut } from './actions'

function mockClient() {
  const auth = {
    signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signInWithOtp: vi.fn().mockResolvedValue({ data: {}, error: null }),
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

  it('signInWithEmail sends a magic link (OTP) for the given email', () => {
    const client = mockClient()
    signInWithEmail(client, 'player@example.com')
    expect(client.auth.signInWithOtp).toHaveBeenCalledTimes(1)
    expect(client.auth.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'player@example.com' }),
    )
  })

  it('signOut calls the client sign-out', () => {
    const client = mockClient()
    signOut(client)
    expect(client.auth.signOut).toHaveBeenCalledTimes(1)
  })
})
