import { describe, it, expect } from 'vitest'
import { RESOLUTIONS, getResolution, hittableTargets } from './resolutions'

describe('resolutions', () => {
  it('defines the four core resolutions with their fixed target numbers', () => {
    expect(getResolution('Books').targets).toEqual([2, 3])
    expect(getResolution('Boots').targets).toEqual([3, 4, 5])
    expect(getResolution('Blades').targets).toEqual([4, 5, 6, 7])
    expect(getResolution('Bones').targets).toEqual([5, 6, 7, 8, 9])
  })

  it('lists the four core resolutions in sheet order', () => {
    expect(RESOLUTIONS.map((r) => r.id)).toEqual(['Books', 'Boots', 'Blades', 'Bones'])
  })

  it('restricts hittable targets to faces the die can roll', () => {
    // A d4 can hit Books (2,3) but never Bones (needs 5+).
    expect(hittableTargets('Books', 4)).toEqual([2, 3])
    expect(hittableTargets('Bones', 4)).toEqual([])
    // A d8 hits all of Blades.
    expect(hittableTargets('Blades', 8)).toEqual([4, 5, 6, 7])
    // A d6 hits Bones only on 5 and 6.
    expect(hittableTargets('Bones', 6)).toEqual([5, 6])
  })
})
