import { describe, it, expect } from 'vitest'
import { mazesWizard } from './config'
import { makeWizardReducer, makeInitWizardState } from '../../../app/wizard/WizardState'
import { emptyDraft } from '../../rules/character'

describe('mazesWizard config', () => {
  it('exposes the six steps in order, with identity before recap', () => {
    expect(mazesWizard.steps.map((s) => s.key)).toEqual([
      'role',
      'aspect',
      'class',
      'edges',
      'identity',
      'recap',
    ])
  })

  it('advances past the role step only once a role is chosen', () => {
    const reducer = makeWizardReducer(mazesWizard)
    const start = makeInitWizardState(emptyDraft)()
    expect(reducer(start, { type: 'next' }).stepIndex).toBe(0)
    const withRole = { ...start, draft: { ...start.draft, role: 'Fighter' as const } }
    expect(reducer(withRole, { type: 'next' }).stepIndex).toBe(1)
  })
})
