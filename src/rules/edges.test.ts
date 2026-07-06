import { describe, it, expect } from 'vitest'
import {
  EDGES,
  getEdge,
  requiresSubChoice,
  DOMAINS,
  FRIENDS_PLACES,
} from './edges'

describe('edges', () => {
  it('has unique ids and non-empty names/descriptions', () => {
    const ids = EDGES.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of EDGES) {
      expect(e.name.length).toBeGreaterThan(0)
      expect(e.description.length).toBeGreaterThan(0)
    }
  })

  it('classifies edges into their type', () => {
    expect(getEdge('well-armed').type).toBe('Combat')
    expect(getEdge('cunning').type).toBe('Attribute')
    expect(getEdge('magic').type).toBe('Magic')
    expect(getEdge('mazewise').type).toBe('Wise')
    expect(getEdge('friends').type).toBe('Society')
    expect(getEdge('bugbear').type).toBe('Lineage')
    expect(getEdge('veteran').type).toBe('Advance')
  })

  it('marks the edges that need a required player sub-choice', () => {
    expect(requiresSubChoice('magic')).toBe(true) // domain or school
    expect(requiresSubChoice('familiar')).toBe(true) // domain
    expect(requiresSubChoice('friends')).toBe(true) // place
  })

  it('does not force a sub-choice on flavor-named or plain edges', () => {
    expect(requiresSubChoice('magic-item')).toBe(false) // optional name
    expect(requiresSubChoice('retainers')).toBe(false) // optional name
    expect(requiresSubChoice('tough')).toBe(false)
    expect(requiresSubChoice('bugbear')).toBe(false)
  })

  it('exposes the five domains and four friends places', () => {
    expect(DOMAINS).toEqual(['Night', 'Forge', 'Sea', 'Sky', 'Earth'])
    expect(FRIENDS_PLACES).toEqual([
      'High Places',
      'Low Places',
      'Wild Places',
      'Dark Places',
    ])
  })
})
