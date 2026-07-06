// State machine for the character-creation wizard: the draft plus the current
// step, with downstream resets when an upstream choice changes.

import type { Role } from '../../rules/roles'
import type { Aspect } from '../../rules/aspects'
import type { EdgeSlot } from '../../rules/character'
import { emptyDraft, canAdvance, type CharacterDraft } from '../../rules/character'

export const STEPS = ['role', 'aspect', 'class', 'edges', 'recap'] as const
export type Step = (typeof STEPS)[number]

export interface WizardState {
  draft: CharacterDraft
  stepIndex: number
}

export const initialWizardState: WizardState = {
  draft: emptyDraft(),
  stepIndex: 0,
}

export type WizardAction =
  | { type: 'setRole'; role: Role }
  | { type: 'setAspect'; aspect: Aspect }
  | { type: 'setClass'; classId: string }
  | { type: 'setAnswer'; index: 0 | 1; option: number }
  | { type: 'setSubChoice'; slot: EdgeSlot; value: string }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; stepIndex: number }
  | { type: 'reset' }

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  const { draft } = state

  switch (action.type) {
    case 'setRole':
      return { ...state, draft: { ...draft, role: action.role } }

    case 'setAspect': {
      if (draft.aspect === action.aspect) return state
      // Aspect gates the class list — clear everything downstream.
      return {
        ...state,
        draft: {
          ...draft,
          aspect: action.aspect,
          classId: undefined,
          answers: [undefined, undefined],
          subChoices: {},
        },
      }
    }

    case 'setClass': {
      if (draft.classId === action.classId) return state
      return {
        ...state,
        draft: {
          ...draft,
          classId: action.classId,
          answers: [undefined, undefined],
          subChoices: {},
        },
      }
    }

    case 'setAnswer': {
      const answers: CharacterDraft['answers'] = [...draft.answers]
      answers[action.index] = action.option
      // The chosen edge changed, so drop any sub-choice tied to this slot.
      const slot: EdgeSlot = action.index === 0 ? 'q0' : 'q1'
      const subChoices = { ...draft.subChoices }
      delete subChoices[slot]
      return { ...state, draft: { ...draft, answers, subChoices } }
    }

    case 'setSubChoice':
      return {
        ...state,
        draft: {
          ...draft,
          subChoices: { ...draft.subChoices, [action.slot]: action.value },
        },
      }

    case 'next': {
      const step = STEPS[state.stepIndex]
      if (!canAdvance(draft, step)) return state
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, STEPS.length - 1) }
    }

    case 'back':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) }

    case 'goto':
      return {
        ...state,
        stepIndex: Math.max(0, Math.min(action.stepIndex, STEPS.length - 1)),
      }

    case 'reset':
      return initialWizardState
  }
}
