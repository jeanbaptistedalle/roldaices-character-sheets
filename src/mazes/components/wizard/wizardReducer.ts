// State machine for the character-creation wizard: the draft plus the current
// step, with downstream resets when an upstream choice changes.

import type { Role } from '../../rules/roles'
import type { Aspect } from '../../rules/aspects'
import type { EdgeSlot } from '../../rules/character'
import { emptyDraft, canAdvance, type CharacterDraft } from '../../rules/character'

export const STEPS = ['role', 'aspect', 'class', 'edges', 'identity', 'recap'] as const
export type Step = (typeof STEPS)[number]

export interface WizardState {
  draft: CharacterDraft
  stepIndex: number
}

export const initialWizardState: WizardState = {
  draft: emptyDraft(),
  stepIndex: 0,
}

/** Build a starting state, optionally seeded from an existing draft (edit mode). */
export function initWizardState(
  draft: CharacterDraft = emptyDraft(),
  stepIndex = 0,
): WizardState {
  return { draft, stepIndex }
}

export type WizardAction =
  | { type: 'setRole'; role: Role }
  | { type: 'setAspect'; aspect: Aspect }
  | { type: 'setClass'; classId: string }
  | { type: 'setAnswer'; index: 0 | 1; option: number }
  | { type: 'setSubChoice'; slot: EdgeSlot; value: string }
  | { type: 'setName'; name: string }
  | { type: 'setDescription'; description: string }
  | { type: 'setImage'; imageUri: string }
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

    case 'setName':
      return { ...state, draft: { ...draft, name: action.name } }

    case 'setDescription':
      return { ...state, draft: { ...draft, description: action.description } }

    case 'setImage':
      return { ...state, draft: { ...draft, imageUri: action.imageUri } }

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
