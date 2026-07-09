import { describe, it, expect } from 'vitest'
import { STEPS, initialWizardState, initWizardState, wizardReducer, type WizardState } from './wizardReducer'
import { emptyDraft, type CharacterDraft } from '../../rules/character'

function stateAt(partial: Partial<CharacterDraft>, stepIndex = 0): WizardState {
  return { draft: { ...emptyDraft(), ...partial }, stepIndex }
}

describe('wizardReducer', () => {
  it('exposes the four steps in order', () => {
    expect(STEPS).toEqual(['traits', 'skills', 'identity', 'recap'])
  })

  it('sets a trait value', () => {
    const s = wizardReducer(initialWizardState, { type: 'setTrait', key: 'physical', value: 4 })
    expect(s.draft.traits.physical).toBe(4)
  })

  it('trims extra skills when competence drops below the selected count', () => {
    const start = stateAt({
      traits: { ...emptyDraft().traits, competence: 3 },
      skillIds: ['gorilla', 'shadow', 'lawyer'],
    })
    const s = wizardReducer(start, { type: 'setTrait', key: 'competence', value: 2 })
    expect(s.draft.traits.competence).toBe(2)
    expect(s.draft.skillIds).toEqual(['gorilla', 'shadow']) // last one trimmed
  })

  it('does not trim skills when a non-competence trait changes', () => {
    const start = stateAt({
      traits: { ...emptyDraft().traits, competence: 3 },
      skillIds: ['gorilla', 'shadow', 'lawyer'],
    })
    const s = wizardReducer(start, { type: 'setTrait', key: 'physical', value: 4 })
    expect(s.draft.skillIds).toEqual(['gorilla', 'shadow', 'lawyer'])
  })

  it('toggles a skill on, and off again', () => {
    let s = wizardReducer(initialWizardState, { type: 'toggleSkill', id: 'gorilla' })
    expect(s.draft.skillIds).toEqual(['gorilla'])
    s = wizardReducer(s, { type: 'toggleSkill', id: 'gorilla' })
    expect(s.draft.skillIds).toEqual([])
  })

  it('ignores adding a skill when already at the competence budget', () => {
    const start = stateAt({
      traits: { ...emptyDraft().traits, competence: 2 },
      skillIds: ['gorilla', 'shadow'],
    })
    const s = wizardReducer(start, { type: 'toggleSkill', id: 'lawyer' })
    expect(s.draft.skillIds).toEqual(['gorilla', 'shadow']) // unchanged
  })

  it('sets imperial and identity fields', () => {
    let s = wizardReducer(initialWizardState, { type: 'setImperial', value: true })
    expect(s.draft.imperial).toBe(true)
    s = wizardReducer(s, { type: 'setName', name: 'Arakel' })
    s = wizardReducer(s, { type: 'setOrigin', origin: 'Vhalto' })
    s = wizardReducer(s, { type: 'setSex', sex: 'F' })
    s = wizardReducer(s, { type: 'setBirthDate', birthDate: '3/2/6' })
    s = wizardReducer(s, { type: 'setRauksorg', rauksorg: 'Orsk-7' })
    expect(s.draft).toMatchObject({
      name: 'Arakel', origin: 'Vhalto', sex: 'F', birthDate: '3/2/6', rauksorg: 'Orsk-7',
    })
  })

  it('advances only when the step is satisfied, and goes back without underflow', () => {
    // traits sum 12 at start -> next is a no-op.
    expect(wizardReducer(initialWizardState, { type: 'next' }).stepIndex).toBe(0)
    const ready = stateAt({
      traits: { physical: 4, perception: 3, mental: 3, charisma: 3, competence: 3, rerolls: 2 },
    })
    expect(wizardReducer(ready, { type: 'next' }).stepIndex).toBe(1)
    expect(wizardReducer(initialWizardState, { type: 'back' }).stepIndex).toBe(0)
  })

  it('resets to the initial state', () => {
    const start = stateAt({ name: 'Arakel' }, 2)
    expect(wizardReducer(start, { type: 'reset' })).toEqual(initialWizardState)
  })
})

describe('initWizardState', () => {
  it('returns the empty initial state by default', () => {
    expect(initWizardState()).toEqual(initialWizardState)
  })

  it('seeds a supplied draft at a given step', () => {
    const draft = { ...emptyDraft(), name: 'Arakel' }
    const state = initWizardState(draft, STEPS.indexOf('recap'))
    expect(state.draft).toEqual(draft)
    expect(state.stepIndex).toBe(STEPS.indexOf('recap'))
  })
})
