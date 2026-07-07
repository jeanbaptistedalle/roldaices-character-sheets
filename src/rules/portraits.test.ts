import { describe, it, expect } from 'vitest'
import { PORTRAIT_SEEDS, portraitUrl, PORTRAITS } from './portraits'

describe('portraits', () => {
  it('offers a gallery of at least a dozen seeds', () => {
    expect(PORTRAIT_SEEDS.length).toBeGreaterThanOrEqual(12)
    expect(new Set(PORTRAIT_SEEDS).size).toBe(PORTRAIT_SEEDS.length)
  })

  it('builds a deterministic https DiceBear URL that encodes the seed', () => {
    const url = portraitUrl('Aldric')
    expect(url).toBe(portraitUrl('Aldric'))
    expect(url.startsWith('https://')).toBe(true)
    expect(url).toContain('dicebear.com')
    expect(url).toContain('seed=Aldric')
  })

  it('url-encodes seeds with spaces', () => {
    expect(portraitUrl('Grey Wolf')).toContain('seed=Grey%20Wolf')
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
