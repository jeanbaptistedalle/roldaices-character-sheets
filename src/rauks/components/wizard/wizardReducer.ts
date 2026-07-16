// Draft transitions for the Rauks wizard: only the set* actions. Navigation and
// step ordering live generically (src/app/wizard) and in config.tsx. Lowering
// the Competence trait trims over-budget skills.

import type { TraitKey } from '../../rules/traits'
import { MAX_TRAITS_AND_TRAUMA, type CharacterDraft } from '../../rules/character'

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
  | { type: 'addTraitAndTrauma' }
  | { type: 'setTraitAndTrauma'; index: number; value: string }
  | { type: 'removeTraitAndTrauma'; index: number }

export function draftReducer(draft: CharacterDraft, action: WizardAction): CharacterDraft {
  switch (action.type) {
    case 'setTrait': {
      const traits = { ...draft.traits, [action.key]: action.value }
      // Lowering Competence below the selected count trims extra skills.
      let skillIds = draft.skillIds
      if (action.key === 'competence' && skillIds.length > action.value) {
        skillIds = skillIds.slice(0, action.value)
      }
      return { ...draft, traits, skillIds }
    }

    case 'toggleSkill': {
      const has = draft.skillIds.includes(action.id)
      if (has) {
        return { ...draft, skillIds: draft.skillIds.filter((id) => id !== action.id) }
      }
      // Adding is a no-op once the Competence budget is full.
      if (draft.skillIds.length >= draft.traits.competence) return draft
      return { ...draft, skillIds: [...draft.skillIds, action.id] }
    }

    case 'setName':
      return { ...draft, name: action.name }
    case 'setOrigin':
      return { ...draft, origin: action.origin }
    case 'setImperial':
      return { ...draft, imperial: action.value }
    case 'setSex':
      return { ...draft, sex: action.sex }
    case 'setBirthDate':
      return { ...draft, birthDate: action.birthDate }
    case 'setRauksorg':
      return { ...draft, rauksorg: action.rauksorg }
    case 'setDescription':
      return { ...draft, description: action.description }
    case 'setImage':
      return { ...draft, imageUri: action.imageUri }

    case 'addTraitAndTrauma': {
      if (draft.traitsAndTrauma.length >= MAX_TRAITS_AND_TRAUMA) return draft
      return { ...draft, traitsAndTrauma: [...draft.traitsAndTrauma, ''] }
    }
    case 'setTraitAndTrauma': {
      const traitsAndTrauma = draft.traitsAndTrauma.map((v, i) =>
        i === action.index ? action.value : v,
      )
      return { ...draft, traitsAndTrauma }
    }
    case 'removeTraitAndTrauma': {
      const traitsAndTrauma = draft.traitsAndTrauma.filter((_, i) => i !== action.index)
      return { ...draft, traitsAndTrauma }
    }
  }
}
