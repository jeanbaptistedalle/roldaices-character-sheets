import { describe, it, expect } from 'vitest'
import {
  emptyDraft,
  resolveEdges,
  edgesComplete,
  isDraftComplete,
  buildCharacter,
  canAdvance,
  type CharacterDraft,
} from './character'

function draftFor(classId: string): CharacterDraft {
  return { ...emptyDraft(), role: 'Fighter', aspect: 'Sword', classId }
}

describe('resolveEdges', () => {
  it('always includes the class always-edge, plus answered questions', () => {
    const draft: CharacterDraft = { ...draftFor('monster-slayer'), answers: [0, 2] }
    const resolved = resolveEdges(draft)
    expect(resolved.map((r) => r.edge.id)).toEqual(['well-armed', 'mazewise', 'strong'])
  })

  it('omits unanswered question slots', () => {
    const draft: CharacterDraft = { ...draftFor('monster-slayer'), answers: [1, undefined] }
    const resolved = resolveEdges(draft)
    expect(resolved.map((r) => r.slot)).toEqual(['always', 'q0'])
    // option index 1 of q0 is retainers, pre-set to "Loyal Hounds"
    expect(resolved[1].edge.id).toBe('retainers')
    expect(resolved[1].subChoice).toBe('Loyal Hounds')
    expect(resolved[1].needsSubChoice).toBe(false)
  })

  it('flags a required sub-choice that has not been made', () => {
    // Blazing Magician always has Magic (needs domain/school) with no preset.
    const draft: CharacterDraft = {
      ...emptyDraft(),
      role: 'Paragon',
      aspect: 'Sorcery',
      classId: 'blazing-magician',
      answers: [0, 0],
    }
    const magic = resolveEdges(draft).find((r) => r.edge.id === 'magic')!
    expect(magic.needsSubChoice).toBe(true)
    expect(edgesComplete(draft)).toBe(false)
  })

  it('treats a pre-set magic school as satisfied', () => {
    const draft: CharacterDraft = {
      ...emptyDraft(),
      role: 'Paragon',
      aspect: 'Sorcery',
      classId: 'infernal-summoner',
      answers: [0, 0],
    }
    const magic = resolveEdges(draft).find((r) => r.edge.id === 'magic')!
    expect(magic.subChoice).toBe('Summoning')
    expect(magic.needsSubChoice).toBe(false)
    expect(edgesComplete(draft)).toBe(true)
  })

  it('becomes complete once a required sub-choice is supplied', () => {
    const draft: CharacterDraft = {
      ...emptyDraft(),
      role: 'Paragon',
      aspect: 'Sorcery',
      classId: 'blazing-magician',
      answers: [0, 0],
      subChoices: { always: 'Forge' },
    }
    expect(edgesComplete(draft)).toBe(true)
  })
})

describe('buildCharacter', () => {
  it('derives die, hearts, stars and the three edges', () => {
    const draft: CharacterDraft = { ...draftFor('monster-slayer'), answers: [0, 2] }
    const character = buildCharacter(draft)
    expect(character.role.dieLabel).toBe('d8')
    expect(character.role.hearts).toBe(8)
    expect(character.role.stars).toBe(2)
    expect(character.className).toBe('The Monster Slayer')
    expect(character.edges.map((e) => e.edge.id)).toEqual(['well-armed', 'mazewise', 'strong'])
  })
})

describe('step validation', () => {
  it('gates each step on its own required choice', () => {
    const d0 = emptyDraft()
    expect(canAdvance(d0, 'role')).toBe(false)
    const d1: CharacterDraft = { ...d0, role: 'Fighter' }
    expect(canAdvance(d1, 'role')).toBe(true)
    expect(canAdvance(d1, 'aspect')).toBe(false)
    const d2: CharacterDraft = { ...d1, aspect: 'Sword' }
    expect(canAdvance(d2, 'class')).toBe(false)
    const d3: CharacterDraft = { ...d2, classId: 'monster-slayer' }
    expect(canAdvance(d3, 'class')).toBe(true)
    expect(canAdvance(d3, 'edges')).toBe(false)
    const d4: CharacterDraft = { ...d3, answers: [0, 2] }
    expect(canAdvance(d4, 'edges')).toBe(true)
    // Identity gates on a name.
    expect(canAdvance(d4, 'identity')).toBe(false)
    expect(isDraftComplete(d4)).toBe(false)
    const d5: CharacterDraft = { ...d4, name: 'Ironwolf' }
    expect(canAdvance(d5, 'identity')).toBe(true)
    expect(isDraftComplete(d5)).toBe(true)
  })

  it('treats a whitespace-only name as no name', () => {
    const draft: CharacterDraft = {
      ...emptyDraft(),
      role: 'Fighter',
      aspect: 'Sword',
      classId: 'monster-slayer',
      answers: [0, 2],
      name: '   ',
    }
    expect(canAdvance(draft, 'identity')).toBe(false)
    expect(isDraftComplete(draft)).toBe(false)
  })
})

describe('identity', () => {
  it('carries name, description, and portrait into the built character', () => {
    const draft: CharacterDraft = {
      ...emptyDraft(),
      role: 'Fighter',
      aspect: 'Sword',
      classId: 'monster-slayer',
      answers: [0, 2],
      name: 'Ironwolf',
      description: 'A grizzled hunter of the deep mazes.',
      imageUri: 'https://example.test/portrait.svg',
    }
    const character = buildCharacter(draft)
    expect(character.name).toBe('Ironwolf')
    expect(character.description).toBe('A grizzled hunter of the deep mazes.')
    expect(character.imageUri).toBe('https://example.test/portrait.svg')
  })
})
