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
  it('sets a trait value', () => {
    expect(reduce(emptyDraft(), { type: 'setTrait', key: 'physical', value: 4 }).traits.physical).toBe(4)
  })

  it('trims extra skills when competence drops below the selected count', () => {
    const start = draftWith({
      traits: { ...emptyDraft().traits, competence: 3 },
      skillIds: ['gorilla', 'shadow', 'lawyer'],
    })
    const d = reduce(start, { type: 'setTrait', key: 'competence', value: 2 })
    expect(d.traits.competence).toBe(2)
    expect(d.skillIds).toEqual(['gorilla', 'shadow'])
  })

  it('does not trim skills when a non-competence trait changes', () => {
    const start = draftWith({
      traits: { ...emptyDraft().traits, competence: 3 },
      skillIds: ['gorilla', 'shadow', 'lawyer'],
    })
    expect(reduce(start, { type: 'setTrait', key: 'physical', value: 4 }).skillIds).toEqual([
      'gorilla',
      'shadow',
      'lawyer',
    ])
  })

  it('toggles a skill on, and off again', () => {
    let d = reduce(emptyDraft(), { type: 'toggleSkill', id: 'gorilla' })
    expect(d.skillIds).toEqual(['gorilla'])
    d = reduce(d, { type: 'toggleSkill', id: 'gorilla' })
    expect(d.skillIds).toEqual([])
  })

  it('ignores adding a skill when already at the competence budget', () => {
    const start = draftWith({
      traits: { ...emptyDraft().traits, competence: 2 },
      skillIds: ['gorilla', 'shadow'],
    })
    expect(reduce(start, { type: 'toggleSkill', id: 'lawyer' }).skillIds).toEqual([
      'gorilla',
      'shadow',
    ])
  })

  it('sets imperial and identity fields', () => {
    let d = reduce(emptyDraft(), { type: 'setImperial', value: true })
    d = reduce(d, { type: 'setName', name: 'Arakel' })
    d = reduce(d, { type: 'setOrigin', origin: 'Vhalto' })
    d = reduce(d, { type: 'setSex', sex: 'F' })
    d = reduce(d, { type: 'setBirthDate', birthDate: '3/2/6' })
    d = reduce(d, { type: 'setRauksorg', rauksorg: 'Orsk-7' })
    expect(d).toMatchObject({
      imperial: true,
      name: 'Arakel',
      origin: 'Vhalto',
      sex: 'F',
      birthDate: '3/2/6',
      rauksorg: 'Orsk-7',
    })
  })

  it('sets remainingRerolls, clamped between 0 and the pool from the rerolls trait', () => {
    const start = draftWith({ traits: { ...emptyDraft().traits, rerolls: 2 } }) // pool = 5
    expect(reduce(start, { type: 'setRemainingRerolls', value: 3 }).remainingRerolls).toBe(3)
    expect(reduce(start, { type: 'setRemainingRerolls', value: -1 }).remainingRerolls).toBe(0)
    expect(reduce(start, { type: 'setRemainingRerolls', value: 9 }).remainingRerolls).toBe(5)
  })

  it('shrinks a saved remainingRerolls if lowering the rerolls trait drops it below the pool', () => {
    const start = draftWith({
      traits: { ...emptyDraft().traits, rerolls: 2 }, // pool = 5
      remainingRerolls: 5,
    })
    const d = reduce(start, { type: 'setTrait', key: 'rerolls', value: 1 }) // pool = 3
    expect(d.remainingRerolls).toBe(3)
  })

  it('adds, edits, and removes traits & trauma entries, capped at 4', () => {
    let d = emptyDraft()
    d = reduce(d, { type: 'addTraitAndTrauma' })
    d = reduce(d, { type: 'setTraitAndTrauma', index: 0, value: 'A limp from Vhalto' })
    expect(d.traitsAndTrauma).toEqual(['A limp from Vhalto'])

    for (let i = 0; i < 5; i++) d = reduce(d, { type: 'addTraitAndTrauma' })
    expect(d.traitsAndTrauma).toHaveLength(4)

    d = reduce(d, { type: 'removeTraitAndTrauma', index: 0 })
    expect(d.traitsAndTrauma).toEqual(['', '', ''])
  })
})
