// State machine for the Rauks character-creation wizard: the draft plus the
// current step. Lowering the Competence trait trims over-budget skills.

import type { TraitKey } from '../../rules/traits'
import { emptyDraft, canAdvance, type CharacterDraft } from '../../rules/character'

export const STEPS = ['traits', 'skills', 'identity', 'recap'] as const
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
  | { type: 'setTrait'; key: TraitKey; value: number }
  | { type: 'toggleSkill'; id: string }
  | { type: 'setName'; name: string }
  | { type: 'setOrigin'; origin: string }
  | { type: 'setImperial'; value: boolean }
  | { type: 'setSex'; sex: string }
  | { type: 'setBirthDate'; birthDate: string }
  | { type: 'setRauksorg'; rauksorg: string }
  | { type: 'setDescription'; description: string }
  | { type: 'setImage'; imageUri: string }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; stepIndex: number }
  | { type: 'reset' }

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  const { draft } = state

  switch (action.type) {
    case 'setTrait': {
      const traits = { ...draft.traits, [action.key]: action.value }
      // Lowering Competence below the selected count trims extra skills.
      let skillIds = draft.skillIds
      if (action.key === 'competence' && skillIds.length > action.value) {
        skillIds = skillIds.slice(0, action.value)
      }
      return { ...state, draft: { ...draft, traits, skillIds } }
    }

    case 'toggleSkill': {
      const has = draft.skillIds.includes(action.id)
      if (has) {
        return {
          ...state,
          draft: { ...draft, skillIds: draft.skillIds.filter((id) => id !== action.id) },
        }
      }
      // Adding is a no-op once the Competence budget is full.
      if (draft.skillIds.length >= draft.traits.competence) return state
      return { ...state, draft: { ...draft, skillIds: [...draft.skillIds, action.id] } }
    }

    case 'setName':
      return { ...state, draft: { ...draft, name: action.name } }
    case 'setOrigin':
      return { ...state, draft: { ...draft, origin: action.origin } }
    case 'setImperial':
      return { ...state, draft: { ...draft, imperial: action.value } }
    case 'setSex':
      return { ...state, draft: { ...draft, sex: action.sex } }
    case 'setBirthDate':
      return { ...state, draft: { ...draft, birthDate: action.birthDate } }
    case 'setRauksorg':
      return { ...state, draft: { ...draft, rauksorg: action.rauksorg } }
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
