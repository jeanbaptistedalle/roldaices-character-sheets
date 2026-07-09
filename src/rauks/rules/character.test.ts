import { describe, it, expect } from 'vitest'
import {
  emptyDraft, skillsComplete, hasName, isDraftComplete, canAdvance,
  buildCharacter, type CharacterDraft,
} from './character'

/** A complete, valid draft: traits sum to 18, competence 3, 3 skills, named. */
function completeDraft(): CharacterDraft {
  return {
    traits: { physical: 4, perception: 3, mental: 3, charisma: 3, competence: 3, rerolls: 2 },
    skillIds: ['gorilla', 'shadow', 'lawyer'],
    name: 'Arakel',
  }
}

describe('character', () => {
  it('starts empty: all traits 2, no skills', () => {
    const d = emptyDraft()
    expect(d.traits.physical).toBe(2)
    expect(d.skillIds).toEqual([])
  })

  it('skillsComplete requires exactly competence-many skills', () => {
    const d = completeDraft()
    expect(skillsComplete(d)).toBe(true)
    expect(skillsComplete({ ...d, skillIds: ['gorilla', 'shadow'] })).toBe(false) // 2 < 3
    expect(skillsComplete({ ...d, skillIds: ['gorilla', 'shadow', 'lawyer', 'engineer'] })).toBe(false) // 4 > 3
  })

  it('hasName trims whitespace', () => {
    expect(hasName({ ...completeDraft(), name: '   ' })).toBe(false)
    expect(hasName({ ...completeDraft(), name: ' A ' })).toBe(true)
  })

  it('isDraftComplete requires traits, skills, and a name', () => {
    expect(isDraftComplete(completeDraft())).toBe(true)
    expect(isDraftComplete({ ...completeDraft(), name: '' })).toBe(false)
    expect(isDraftComplete(emptyDraft())).toBe(false)
  })

  it('canAdvance gates each step', () => {
    const d = completeDraft()
    expect(canAdvance(emptyDraft(), 'traits')).toBe(false) // sums 12
    expect(canAdvance(d, 'traits')).toBe(true)
    expect(canAdvance({ ...d, skillIds: [] }, 'skills')).toBe(false)
    expect(canAdvance(d, 'skills')).toBe(true)
    expect(canAdvance({ ...d, name: '' }, 'identity')).toBe(false)
    expect(canAdvance(d, 'recap')).toBe(true)
  })

  it('buildCharacter resolves traits in order and skills by id', () => {
    const c = buildCharacter(completeDraft())
    expect(c.traits.map((t) => t.info.key)).toEqual([
      'physical', 'perception', 'mental', 'charisma', 'competence', 'rerolls',
    ])
    expect(c.traits[0].value).toBe(4)
    expect(c.skills.map((s) => s.id)).toEqual(['gorilla', 'shadow', 'lawyer'])
    expect(c.name).toBe('Arakel')
  })

  it('buildCharacter throws on an incomplete draft', () => {
    expect(() => buildCharacter(emptyDraft())).toThrow()
  })
})
