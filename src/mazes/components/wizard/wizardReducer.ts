// Draft transitions for the Mazes wizard: only the set* actions. Navigation
// and step ordering live generically (src/app/wizard) and in config.tsx.

import type { Role } from '../../rules/roles'
import type { Aspect } from '../../rules/aspects'
import type { EdgeSlot, CharacterDraft } from '../../rules/character'

export type WizardAction =
  | { type: 'setRole'; role: Role }
  | { type: 'setAspect'; aspect: Aspect }
  | { type: 'setClass'; classId: string }
  | { type: 'setAnswer'; index: 0 | 1; option: number }
  | { type: 'setSubChoice'; slot: EdgeSlot; value: string }
  | { type: 'setName'; name: string }
  | { type: 'setDescription'; description: string }
  | { type: 'setImage'; imageUri: string }

export function draftReducer(draft: CharacterDraft, action: WizardAction): CharacterDraft {
  switch (action.type) {
    case 'setRole':
      return { ...draft, role: action.role }

    case 'setAspect': {
      if (draft.aspect === action.aspect) return draft
      // Aspect gates the class list — clear everything downstream.
      return {
        ...draft,
        aspect: action.aspect,
        classId: undefined,
        answers: [undefined, undefined],
        subChoices: {},
      }
    }

    case 'setClass': {
      if (draft.classId === action.classId) return draft
      return {
        ...draft,
        classId: action.classId,
        answers: [undefined, undefined],
        subChoices: {},
      }
    }

    case 'setAnswer': {
      const answers: CharacterDraft['answers'] = [...draft.answers]
      answers[action.index] = action.option
      // The chosen edge changed, so drop any sub-choice tied to this slot.
      const slot: EdgeSlot = action.index === 0 ? 'q0' : 'q1'
      const subChoices = { ...draft.subChoices }
      delete subChoices[slot]
      return { ...draft, answers, subChoices }
    }

    case 'setSubChoice':
      return {
        ...draft,
        subChoices: { ...draft.subChoices, [action.slot]: action.value },
      }

    case 'setName':
      return { ...draft, name: action.name }

    case 'setDescription':
      return { ...draft, description: action.description }

    case 'setImage':
      return { ...draft, imageUri: action.imageUri }
  }
}
