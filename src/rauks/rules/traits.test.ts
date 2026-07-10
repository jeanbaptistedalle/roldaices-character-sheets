// src/rauks/rules/traits.test.ts
import { describe, it, expect } from 'vitest'
import {
  TRAITS, TRAIT_TOTAL, getTrait, emptyTraits, sumTraits, pointsRemaining,
  countAtOne, traitsComplete, canIncrement, canDecrement, rerollTokens, type Traits,
} from './traits'

const T = (overrides: Partial<Traits> = {}): Traits => ({ ...emptyTraits(), ...overrides })

describe('traits', () => {
  it('defines six traits in order, split into roll and budget groups', () => {
    expect(TRAITS.map((t) => t.key)).toEqual([
      'physical', 'perception', 'mental', 'charisma', 'competence', 'rerolls',
    ])
    expect(TRAITS.filter((t) => t.group === 'roll').map((t) => t.key)).toEqual([
      'physical', 'perception', 'mental', 'charisma',
    ])
    expect(TRAITS.filter((t) => t.group === 'budget').map((t) => t.key)).toEqual([
      'competence', 'rerolls',
    ])
  })

  it('has English labels and a description for every trait', () => {
    for (const t of TRAITS) {
      expect(t.label).toMatch(/^[A-Z][A-Za-z ]+$/)
      expect(t.description.length).toBeGreaterThan(0)
    }
    expect(getTrait('competence').label).toBe('Competence')
  })

  it('starts every trait at 2 with 6 points left to spend', () => {
    const t = emptyTraits()
    expect(Object.values(t)).toEqual([2, 2, 2, 2, 2, 2])
    expect(sumTraits(t)).toBe(12)
    expect(pointsRemaining(t)).toBe(TRAIT_TOTAL - 12)
  })

  it('is complete only when values sum to 18 within 1..4 and at most one is 1', () => {
    expect(traitsComplete(T({ physical: 4, perception: 4, mental: 4, charisma: 2 }))).toBe(true) // 4+4+4+2+2+2=18
    expect(traitsComplete(emptyTraits())).toBe(false) // sums 12
    expect(traitsComplete(T({ physical: 4, perception: 4, mental: 4, charisma: 4 }))).toBe(false) // sums 20
    // Two traits at 1 is illegal even if the sum is 18.
    const twoOnes = T({ physical: 1, perception: 1, mental: 4, charisma: 4, competence: 4, rerolls: 4 }) // 1+1+4+4+4+4=18
    expect(countAtOne(twoOnes)).toBe(2)
    expect(traitsComplete(twoOnes)).toBe(false)
    // One trait at 1 is legal.
    const oneOne = T({ physical: 1, perception: 3, mental: 4, charisma: 4, competence: 4, rerolls: 2 }) // 1+3+4+4+4+2=18
    expect(traitsComplete(oneOne)).toBe(true)
  })

  it('gates increment on the max and remaining points', () => {
    expect(canIncrement(emptyTraits(), 'physical')).toBe(true)
    expect(canIncrement(T({ physical: 4 }), 'physical')).toBe(false) // at max
    const spent = T({ physical: 4, perception: 4, mental: 4, charisma: 4 }) // sum 20, remaining -2
    expect(canIncrement(spent, 'rerolls')).toBe(false)
  })

  it('gates decrement on the floor and the one-at-one rule', () => {
    expect(canDecrement(T({ physical: 3 }), 'physical')).toBe(true) // 3 -> 2
    expect(canDecrement(T({ physical: 1 }), 'physical')).toBe(false) // already at min
    // physical at 2 can drop to 1 only if no other trait is already 1.
    expect(canDecrement(T({ physical: 2 }), 'physical')).toBe(true)
    expect(canDecrement(T({ physical: 2, perception: 1 }), 'physical')).toBe(false)
    // a trait above 2 can always drop (lands at >= 2).
    expect(canDecrement(T({ physical: 3, perception: 1 }), 'physical')).toBe(true)
  })

  it('computes reroll tokens as 1 + 2 × the rerolls value', () => {
    expect(rerollTokens(1)).toBe(3)
    expect(rerollTokens(2)).toBe(5)
    expect(rerollTokens(3)).toBe(7)
    expect(rerollTokens(4)).toBe(9)
  })
})
