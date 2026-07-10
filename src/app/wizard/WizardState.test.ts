import { describe, it, expect } from 'vitest'
import {
  makeWizardReducer,
  makeInitWizardState,
  type WizardConfig,
  type WizardState,
} from './WizardState'

interface Draft {
  name: string
}
type Action = { type: 'setName'; name: string }

const config: WizardConfig<Draft, Action> = {
  emptyDraft: () => ({ name: '' }),
  draftReducer: (draft, action) =>
    action.type === 'setName' ? { ...draft, name: action.name } : draft,
  i18nNs: 'mazes',
  steps: [
    { key: 'a', label: 'A', canAdvance: (d) => d.name !== '', render: () => null },
    { key: 'b', label: 'B', canAdvance: () => true, render: () => null, terminal: true },
  ],
}

const reducer = makeWizardReducer(config)
const init = makeInitWizardState(config.emptyDraft)
const start: WizardState<Draft> = init()

describe('makeWizardReducer', () => {
  it('delegates unknown actions to the draft reducer', () => {
    const s = reducer(start, { type: 'setName', name: 'Zed' })
    expect(s.draft.name).toBe('Zed')
    expect(s.stepIndex).toBe(0)
  })

  it('blocks next until the current step can advance', () => {
    expect(reducer(start, { type: 'next' }).stepIndex).toBe(0)
    const ready = reducer(start, { type: 'setName', name: 'Zed' })
    expect(reducer(ready, { type: 'next' }).stepIndex).toBe(1)
  })

  it('does not advance past the last step', () => {
    const atEnd: WizardState<Draft> = { draft: { name: 'Zed' }, stepIndex: 1 }
    expect(reducer(atEnd, { type: 'next' }).stepIndex).toBe(1)
  })

  it('goes back without underflowing', () => {
    expect(reducer(start, { type: 'back' }).stepIndex).toBe(0)
    expect(reducer({ draft: { name: '' }, stepIndex: 1 }, { type: 'back' }).stepIndex).toBe(0)
  })

  it('clamps goto to the valid range', () => {
    expect(reducer(start, { type: 'goto', stepIndex: 9 }).stepIndex).toBe(1)
    expect(reducer(start, { type: 'goto', stepIndex: -3 }).stepIndex).toBe(0)
  })

  it('resets to an empty draft at step 0', () => {
    const dirty: WizardState<Draft> = { draft: { name: 'Zed' }, stepIndex: 1 }
    expect(reducer(dirty, { type: 'reset' })).toEqual({ draft: { name: '' }, stepIndex: 0 })
  })
})

describe('makeInitWizardState', () => {
  it('returns an empty draft at step 0 by default', () => {
    expect(init()).toEqual({ draft: { name: '' }, stepIndex: 0 })
  })

  it('seeds a supplied draft at a given step', () => {
    expect(init({ name: 'Zed' }, 1)).toEqual({ draft: { name: 'Zed' }, stepIndex: 1 })
  })
})
