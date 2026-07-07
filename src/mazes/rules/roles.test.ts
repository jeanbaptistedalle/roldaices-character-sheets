import { describe, it, expect } from 'vitest'
import { ROLES, getRole, type Role } from './roles'

describe('roles', () => {
  it('defines all four roles', () => {
    const ids = ROLES.map((r) => r.id)
    expect(ids).toEqual(['Paragon', 'Vanguard', 'Fighter', 'Sentinel'])
  })

  it('maps each role to the correct die, hearts, and stars', () => {
    const expected: Record<Role, { die: number; hearts: number; stars: number }> = {
      Paragon: { die: 4, hearts: 4, stars: 4 },
      Vanguard: { die: 6, hearts: 6, stars: 3 },
      Fighter: { die: 8, hearts: 8, stars: 2 },
      Sentinel: { die: 10, hearts: 10, stars: 1 },
    }
    for (const [id, vals] of Object.entries(expected)) {
      const info = getRole(id as Role)
      expect(info.die).toBe(vals.die)
      expect(info.hearts).toBe(vals.hearts)
      expect(info.stars).toBe(vals.stars)
    }
  })

  it('sets hearts equal to the die crown (max face)', () => {
    for (const role of ROLES) {
      expect(role.hearts).toBe(role.die)
    }
  })

  it('labels the die as dN', () => {
    expect(getRole('Paragon').dieLabel).toBe('d4')
    expect(getRole('Sentinel').dieLabel).toBe('d10')
  })
})
