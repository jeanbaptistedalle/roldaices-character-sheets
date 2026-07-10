import { describe, it, expect } from 'vitest'
import { rauksWizard } from './config'
import { makeWizardReducer, makeInitWizardState } from '../../../app/wizard/WizardState'
import { emptyDraft } from '../../rules/character'

describe('rauksWizard config', () => {
  it('exposes the four steps in order', () => {
    expect(rauksWizard.steps.map((s) => s.key)).toEqual([
      'traits',
      'skills',
      'identity',
      'recap',
    ])
  })

  it('advances past traits only once 18 points are spent', () => {
    const reducer = makeWizardReducer(rauksWizard)
    const start = makeInitWizardState(emptyDraft)()
    // Default all-2 traits sum to 12 -> next is a no-op.
    expect(reducer(start, { type: 'next' }).stepIndex).toBe(0)
    const ready = {
      ...start,
      draft: {
        ...start.draft,
        traits: { physical: 4, perception: 3, mental: 3, charisma: 3, competence: 3, rerolls: 2 },
      },
    }
    expect(reducer(ready, { type: 'next' }).stepIndex).toBe(1)
  })
})
