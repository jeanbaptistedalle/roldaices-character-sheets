import { describe, it, expect } from 'vitest'
import { SYSTEMS } from './registry'

describe('SYSTEMS registry', () => {
  it('contains the Mazes system', () => {
    expect(SYSTEMS.some((s) => s.id === 'mazes')).toBe(true)
  })

  it('includes the Rauks system with a stable id', () => {
    const rauks = SYSTEMS.find((s) => s.id === 'rauks')
    expect(rauks).toBeDefined()
    expect(rauks?.name).toBe('Rauks')
    expect(typeof rauks?.Entry).toBe('function')
  })

  it('has unique ids', () => {
    const ids = SYSTEMS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every system has a name, publisher, tagline, and Entry', () => {
    for (const s of SYSTEMS) {
      expect(s.name).toBeTruthy()
      expect(s.publisher).toBeTruthy()
      expect(s.tagline).toBeTruthy()
      expect(s.Entry).toBeTypeOf('function')
    }
  })
})
