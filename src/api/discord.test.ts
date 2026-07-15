import { describe, it, expect, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { syncDiscordMembership } from './discord'

function mockClient(resp: { data: unknown; error: unknown }) {
  const functions = { invoke: vi.fn().mockResolvedValue(resp) }
  return { functions } as unknown as SupabaseClient & { functions: typeof functions }
}

describe('syncDiscordMembership', () => {
  it('invokes the discord-membership function with the provider token', async () => {
    const client = mockClient({
      data: { role: 'user', promoted: true },
      error: null,
    })
    const result = await syncDiscordMembership('provider-tok', client)
    expect(client.functions.invoke).toHaveBeenCalledWith('discord-membership', {
      body: { providerToken: 'provider-tok' },
    })
    expect(result).toEqual({ role: 'user', promoted: true })
  })

  it('throws if the function returns an error', async () => {
    const client = mockClient({ data: null, error: new Error('boom') })
    await expect(syncDiscordMembership('tok', client)).rejects.toThrow('boom')
  })
})
