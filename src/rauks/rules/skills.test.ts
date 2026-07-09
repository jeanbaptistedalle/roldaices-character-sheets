import { describe, it, expect } from 'vitest'
import { SKILLS, SKILL_CATEGORIES, getSkill, skillsByCategory } from './skills'

describe('skills', () => {
  it('has unique ids', () => {
    const ids = SKILLS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses only the five known categories', () => {
    for (const s of SKILLS) {
      expect(SKILL_CATEGORIES).toContain(s.category)
    }
  })

  it('includes the two Karma skills', () => {
    const karma = SKILLS.filter((s) => s.category === 'Karma').map((s) => s.id)
    expect(karma).toEqual(['immaculate-reputation', 'born-lucky'])
  })

  it('looks a skill up by id and throws on an unknown id', () => {
    expect(getSkill('gorilla').name).toBe('Gorilla')
    expect(() => getSkill('nope')).toThrow()
  })

  it('groups skills by category in display order, covering every skill', () => {
    const groups = skillsByCategory()
    expect(groups.map((g) => g.category)).toEqual(SKILL_CATEGORIES)
    const total = groups.reduce((n, g) => n + g.skills.length, 0)
    expect(total).toBe(SKILLS.length)
  })
})
