import { describe, it, expect } from 'vitest'
import type { User } from '@supabase/supabase-js'
import { displayNameOf, avatarUrlOf } from './userDisplay'

function user(meta: Record<string, unknown>, email?: string): User {
  return { user_metadata: meta, email } as unknown as User
}

describe('displayNameOf', () => {
  it('prefers full_name', () => {
    expect(displayNameOf(user({ full_name: 'Grit', user_name: 'grit99' }, 'g@x.com'))).toBe('Grit')
  })
  it('falls back to user_name', () => {
    expect(displayNameOf(user({ user_name: 'grit99' }, 'g@x.com'))).toBe('grit99')
  })
  it('falls back to email', () => {
    expect(displayNameOf(user({}, 'g@x.com'))).toBe('g@x.com')
  })
  it('falls back to Account when nothing is set', () => {
    expect(displayNameOf(user({}))).toBe('Account')
  })
  it('returns Account for null', () => {
    expect(displayNameOf(null)).toBe('Account')
  })
})

describe('avatarUrlOf', () => {
  it('returns the avatar_url when present', () => {
    expect(avatarUrlOf(user({ avatar_url: 'http://x/a.png' }))).toBe('http://x/a.png')
  })
  it('returns undefined when absent', () => {
    expect(avatarUrlOf(user({}))).toBeUndefined()
    expect(avatarUrlOf(null)).toBeUndefined()
  })
})
