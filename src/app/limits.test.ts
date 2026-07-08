import { describe, expect, it } from 'vitest'
import { MAX_CHARACTERS_PER_SYSTEM, isAtLimit } from './limits'

describe('character limit', () => {
  it('caps at 5', () => {
    expect(MAX_CHARACTERS_PER_SYSTEM).toBe(5)
  })

  it('is at limit when creating and count reaches the max', () => {
    expect(isAtLimit(5, false)).toBe(true)
    expect(isAtLimit(6, false)).toBe(true)
  })

  it('is not at limit when creating below the max', () => {
    expect(isAtLimit(4, false)).toBe(false)
    expect(isAtLimit(0, false)).toBe(false)
  })

  it('never blocks edits regardless of count', () => {
    expect(isAtLimit(5, true)).toBe(false)
    expect(isAtLimit(99, true)).toBe(false)
  })
})
