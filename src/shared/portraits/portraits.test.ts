import { describe, it, expect } from 'vitest'
import { portraitUrl, PORTRAIT_COUNT, randomPortraits } from './portraits'

describe('portraits', () => {
  it('always offers exactly 16 portraits', () => {
    expect(PORTRAIT_COUNT).toBe(16)
  })

  it('draws a random bucket of exactly PORTRAIT_COUNT portraits', () => {
    expect(randomPortraits()).toHaveLength(PORTRAIT_COUNT)
    expect(new Set(randomPortraits().map((p) => p.seed)).size).toBe(PORTRAIT_COUNT)
  })

  it('builds a deterministic SVG data URI for a seed', () => {
    const url = portraitUrl('Aldric')
    expect(url).toBe(portraitUrl('Aldric'))
    expect(url.startsWith('data:image/svg+xml')).toBe(true)
  })

  it('produces distinct portraits for distinct seeds', () => {
    expect(portraitUrl('Aldric')).not.toBe(portraitUrl('Brenna'))
  })

  it('draws unique urls within a random bucket', () => {
    const bucket = randomPortraits()
    expect(new Set(bucket.map((p) => p.url)).size).toBe(bucket.length)
  })
})
