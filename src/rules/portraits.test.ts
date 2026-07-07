import { describe, it, expect } from 'vitest'
import {
  PORTRAIT_SEEDS,
  portraitUrl,
  PORTRAITS,
  PORTRAIT_COUNT,
  randomPortraits,
} from './portraits'

describe('portraits', () => {
  it('always offers exactly 16 seeds, all unique', () => {
    expect(PORTRAIT_COUNT).toBe(16)
    expect(PORTRAIT_SEEDS).toHaveLength(16)
    expect(new Set(PORTRAIT_SEEDS).size).toBe(PORTRAIT_SEEDS.length)
  })

  it('always exposes exactly 16 portraits, one per seed, all unique', () => {
    expect(PORTRAITS).toHaveLength(16)
    expect(PORTRAITS).toHaveLength(PORTRAIT_COUNT)
    expect(PORTRAITS).toHaveLength(PORTRAIT_SEEDS.length)
    expect(new Set(PORTRAITS.map((p) => p.url)).size).toBe(16)
  })

  it('draws a random bucket of exactly 16 portraits', () => {
    expect(randomPortraits()).toHaveLength(16)
    expect(new Set(randomPortraits().map((p) => p.seed)).size).toBe(16)
  })

  it('builds a deterministic SVG data URI for a seed', () => {
    const url = portraitUrl('Aldric')
    expect(url).toBe(portraitUrl('Aldric'))
    expect(url.startsWith('data:image/svg+xml')).toBe(true)
  })

  it('produces distinct portraits for distinct seeds', () => {
    expect(portraitUrl('Aldric')).not.toBe(portraitUrl('Brenna'))
  })

  it('exposes a PORTRAITS list matching the seeds, with unique urls', () => {
    expect(PORTRAITS).toHaveLength(PORTRAIT_SEEDS.length)
    expect(PORTRAITS.map((p) => p.seed)).toEqual(PORTRAIT_SEEDS)
    for (const p of PORTRAITS) {
      expect(p.url).toBe(portraitUrl(p.seed))
    }
    expect(new Set(PORTRAITS.map((p) => p.url)).size).toBe(PORTRAITS.length)
  })
})
