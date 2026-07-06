import { describe, it, expect } from 'vitest'
import { CLASSES, getClass, classesByAspect } from './classes'
import { getEdge } from './edges'
import { ASPECTS } from './aspects'

describe('classes', () => {
  it('defines 24 classes with unique ids', () => {
    expect(CLASSES).toHaveLength(24)
    const ids = CLASSES.map((c) => c.id)
    expect(new Set(ids).size).toBe(24)
  })

  it('has eight classes per aspect', () => {
    for (const aspect of ASPECTS) {
      expect(classesByAspect(aspect.id)).toHaveLength(8)
    }
  })

  it('gives every class an always-edge and exactly two questions', () => {
    for (const c of CLASSES) {
      expect(c.always.edgeId).toBeTruthy()
      expect(c.questions).toHaveLength(2)
      expect(c.questions[0].options.length).toBe(2)
      expect(c.questions[1].options.length).toBeGreaterThanOrEqual(2)
      expect(c.questions[1].options.length).toBeLessThanOrEqual(3)
    }
  })

  it('references only edge ids that exist', () => {
    for (const c of CLASSES) {
      expect(() => getEdge(c.always.edgeId)).not.toThrow()
      for (const q of c.questions) {
        for (const opt of q.options) {
          expect(() => getEdge(opt.edgeId)).not.toThrow()
        }
      }
    }
  })

  it('models the Monster Slayer faithfully', () => {
    const ms = getClass('monster-slayer')
    expect(ms.name).toBe('The Monster Slayer')
    expect(ms.aspect).toBe('Sword')
    expect(ms.always.edgeId).toBe('well-armed')
    expect(ms.questions[0].options.map((o) => o.edgeId)).toEqual(['mazewise', 'retainers'])
    expect(ms.questions[1].options.map((o) => o.edgeId)).toEqual([
      'cunning',
      'dexterous',
      'strong',
    ])
  })

  it('pre-sets the Infernal Summoner magic school to Summoning', () => {
    const summoner = getClass('infernal-summoner')
    expect(summoner.always.edgeId).toBe('magic')
    expect(summoner.always.presetSubChoice).toBe('Summoning')
  })
})
