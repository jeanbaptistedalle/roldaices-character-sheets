// Generic wizard state machine shared across TTRPG systems. Navigation
// (next/back/goto/reset) lives here; each system supplies a draftReducer for
// its own set* actions plus the step descriptors that drive the UI.

import type { Dispatch, ReactNode } from 'react'

export interface WizardState<Draft> {
  draft: Draft
  stepIndex: number
}

export type NavAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; stepIndex: number }
  | { type: 'reset' }

export interface WizardStepCtx<Draft, Action> {
  draft: Draft
  dispatch: Dispatch<Action | NavAction>
  atLimit: boolean
  onSaved: () => void
  editId?: string
}

export interface WizardStep<Draft, Action> {
  key: string
  label: string
  canAdvance: (draft: Draft) => boolean
  render: (ctx: WizardStepCtx<Draft, Action>) => ReactNode
  /** Terminal step (recap): back-only nav, no Next button. */
  terminal?: boolean
}

export interface WizardConfig<Draft, Action> {
  emptyDraft: () => Draft
  /**
   * Reduces the draft for a system's own actions. The generic reducer owns
   * navigation, so `'next'`, `'back'`, `'goto'`, and `'reset'` are reserved
   * NavAction `type` values — a system's Action union must not reuse them, or
   * those actions would be routed to navigation and never reach draftReducer.
   */
  draftReducer: (draft: Draft, action: Action) => Draft
  steps: WizardStep<Draft, Action>[]
}

export function makeWizardReducer<Draft, Action>(
  config: WizardConfig<Draft, Action>,
) {
  const { draftReducer, emptyDraft, steps } = config
  const lastIndex = steps.length - 1

  return function reducer(
    state: WizardState<Draft>,
    action: Action | NavAction,
  ): WizardState<Draft> {
    switch ((action as NavAction).type) {
      case 'next': {
        if (!steps[state.stepIndex].canAdvance(state.draft)) return state
        return { ...state, stepIndex: Math.min(state.stepIndex + 1, lastIndex) }
      }
      case 'back':
        return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) }
      case 'goto':
        return {
          ...state,
          stepIndex: Math.max(
            0,
            Math.min((action as { stepIndex: number }).stepIndex, lastIndex),
          ),
        }
      case 'reset':
        return { draft: emptyDraft(), stepIndex: 0 }
      default:
        return { ...state, draft: draftReducer(state.draft, action as Action) }
    }
  }
}

export function makeInitWizardState<Draft>(emptyDraft: () => Draft) {
  return (draft: Draft = emptyDraft(), stepIndex = 0): WizardState<Draft> => ({
    draft,
    stepIndex,
  })
}
