import { describe, it, expect } from 'vitest'
import { SYSTEMS } from './registry'

describe('SYSTEMS registry', () => {
  it('contains the Mazes system', () => {
    expect(SYSTEMS.some((s) => s.id === 'mazes')).toBe(true)
  })

  it('includes the Rauks system with a stable id', () => {
    const rauks = SYSTEMS.find((s) => s.id === 'rauks')
    expect(rauks).toBeDefined()
    expect(rauks?.i18nNamespace).toBe('rauks')
    expect(typeof rauks?.Entry).toBe('function')
  })

  it('has unique ids', () => {
    const ids = SYSTEMS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every system has an id, i18nNamespace, and Entry', () => {
    for (const s of SYSTEMS) {
      expect(s.id).toBeTruthy()
      expect(s.i18nNamespace).toBeTruthy()
      expect(s.Entry).toBeTypeOf('function')
    }
  })

  it('exposes the expected i18n namespaces in order', () => {
    expect(SYSTEMS.map((s) => s.i18nNamespace)).toEqual(['mazes', 'rauks'])
  })
})
