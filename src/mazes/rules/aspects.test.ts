import { describe, it, expect } from 'vitest'
import { ASPECTS, getAspect, type Aspect } from './aspects'

describe('aspects', () => {
  it('defines the three core aspects', () => {
    expect(ASPECTS.map((a) => a.id)).toEqual(['Sword', 'Shadow', 'Sorcery'])
  })

  it('gives each aspect a "how do you solve problems" prompt', () => {
    expect(getAspect('Sword').prompt.toUpperCase()).toContain('SWORD')
    expect(getAspect('Shadow').prompt.toUpperCase()).toContain('SHADOW')
    expect(getAspect('Sorcery').prompt.toUpperCase()).toContain('SORCERY')
  })

  it('looks up by id', () => {
    const id: Aspect = 'Shadow'
    expect(getAspect(id).id).toBe('Shadow')
  })
})
