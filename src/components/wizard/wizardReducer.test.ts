import { describe, it, expect } from 'vitest'
import { STEPS, initialWizardState, wizardReducer, type WizardState } from './wizardReducer'

function stateAt(partial: Partial<WizardState['draft']>, stepIndex = 0): WizardState {
  return { draft: { ...initialWizardState.draft, ...partial }, stepIndex }
}

describe('wizardReducer', () => {
  it('sets the role', () => {
    const s = wizardReducer(initialWizardState, { type: 'setRole', role: 'Fighter' })
    expect(s.draft.role).toBe('Fighter')
  })

  it('resets class and edges when the aspect changes', () => {
    const start = stateAt({ aspect: 'Sword', classId: 'monster-slayer', answers: [0, 1] })
    const s = wizardReducer(start, { type: 'setAspect', aspect: 'Sorcery' })
    expect(s.draft.aspect).toBe('Sorcery')
    expect(s.draft.classId).toBeUndefined()
    expect(s.draft.answers).toEqual([undefined, undefined])
  })

  it('keeps downstream intact when the same aspect is re-selected', () => {
    const start = stateAt({ aspect: 'Sword', classId: 'monster-slayer', answers: [0, 1] })
    const s = wizardReducer(start, { type: 'setAspect', aspect: 'Sword' })
    expect(s.draft.classId).toBe('monster-slayer')
  })

  it('resets answers when the class changes', () => {
    const start = stateAt({ aspect: 'Sword', classId: 'monster-slayer', answers: [0, 1] })
    const s = wizardReducer(start, { type: 'setClass', classId: 'jaded-sellsword' })
    expect(s.draft.classId).toBe('jaded-sellsword')
    expect(s.draft.answers).toEqual([undefined, undefined])
  })

  it('clears a slot sub-choice when its answer changes', () => {
    const start: WizardState = {
      draft: {
        ...initialWizardState.draft,
        aspect: 'Sorcery',
        classId: 'guild-mage',
        answers: [0, 0],
        subChoices: { q0: 'Forge' },
      },
      stepIndex: 3,
    }
    const s = wizardReducer(start, { type: 'setAnswer', index: 0, option: 1 })
    expect(s.draft.answers[0]).toBe(1)
    expect(s.draft.subChoices.q0).toBeUndefined()
  })

  it('advances only when the current step is satisfied', () => {
    // Step 0 (role) with no role selected: next is a no-op.
    expect(wizardReducer(initialWizardState, { type: 'next' }).stepIndex).toBe(0)
    const withRole = stateAt({ role: 'Fighter' }, 0)
    expect(wizardReducer(withRole, { type: 'next' }).stepIndex).toBe(1)
  })

  it('goes back without underflowing', () => {
    expect(wizardReducer(initialWizardState, { type: 'back' }).stepIndex).toBe(0)
    const s = wizardReducer(stateAt({}, 2), { type: 'back' })
    expect(s.stepIndex).toBe(1)
  })

  it('resets to the initial state', () => {
    const start = stateAt({ role: 'Fighter', aspect: 'Sword', classId: 'monster-slayer' }, 3)
    const s = wizardReducer(start, { type: 'reset' })
    expect(s).toEqual(initialWizardState)
  })

  it('exposes the five steps in order', () => {
    expect(STEPS).toEqual(['role', 'aspect', 'class', 'edges', 'recap'])
  })
})
