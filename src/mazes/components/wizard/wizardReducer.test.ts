import { describe, it, expect } from 'vitest'
import { draftReducer, type WizardAction } from './wizardReducer'
import { emptyDraft, type CharacterDraft } from '../../rules/character'

function draftWith(partial: Partial<CharacterDraft>): CharacterDraft {
  return { ...emptyDraft(), ...partial }
}

function reduce(draft: CharacterDraft, action: WizardAction): CharacterDraft {
  return draftReducer(draft, action)
}

describe('draftReducer', () => {
  it('sets the role', () => {
    expect(reduce(emptyDraft(), { type: 'setRole', role: 'Fighter' }).role).toBe('Fighter')
  })

  it('resets class and edges when the aspect changes', () => {
    const start = draftWith({ aspect: 'Sword', classId: 'monster-slayer', answers: [0, 1] })
    const d = reduce(start, { type: 'setAspect', aspect: 'Sorcery' })
    expect(d.aspect).toBe('Sorcery')
    expect(d.classId).toBeUndefined()
    expect(d.answers).toEqual([undefined, undefined])
  })

  it('keeps downstream intact when the same aspect is re-selected', () => {
    const start = draftWith({ aspect: 'Sword', classId: 'monster-slayer', answers: [0, 1] })
    expect(reduce(start, { type: 'setAspect', aspect: 'Sword' }).classId).toBe('monster-slayer')
  })

  it('resets answers when the class changes', () => {
    const start = draftWith({ aspect: 'Sword', classId: 'monster-slayer', answers: [0, 1] })
    const d = reduce(start, { type: 'setClass', classId: 'jaded-sellsword' })
    expect(d.classId).toBe('jaded-sellsword')
    expect(d.answers).toEqual([undefined, undefined])
  })

  it('clears a slot sub-choice when its answer changes', () => {
    const start = draftWith({
      aspect: 'Sorcery',
      classId: 'guild-mage',
      answers: [0, 0],
      subChoices: { q0: 'Forge' },
    })
    const d = reduce(start, { type: 'setAnswer', index: 0, option: 1 })
    expect(d.answers[0]).toBe(1)
    expect(d.subChoices.q0).toBeUndefined()
  })

  it('sets identity fields', () => {
    let d = reduce(emptyDraft(), { type: 'setName', name: 'Ironwolf' })
    d = reduce(d, { type: 'setDescription', description: 'A grizzled hunter.' })
    d = reduce(d, { type: 'setImage', imageUri: 'https://example.test/p.svg' })
    expect(d.name).toBe('Ironwolf')
    expect(d.description).toBe('A grizzled hunter.')
    expect(d.imageUri).toBe('https://example.test/p.svg')
  })

  it('keeps identity fields when the aspect or class changes', () => {
    const start = draftWith({
      aspect: 'Sword',
      classId: 'monster-slayer',
      answers: [0, 1],
      name: 'Ironwolf',
      description: 'A grizzled hunter.',
      imageUri: 'https://example.test/p.svg',
    })
    expect(reduce(start, { type: 'setAspect', aspect: 'Sorcery' }).name).toBe('Ironwolf')
    expect(reduce(start, { type: 'setClass', classId: 'jaded-sellsword' }).name).toBe('Ironwolf')
  })
})
