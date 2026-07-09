// The Rauks character draft the wizard builds, plus validation and the recap
// view. See .claude/skills/rauks-rules/SKILL.md and the design spec.

import { TRAITS, emptyTraits, getTrait, traitsComplete, type TraitInfo, type Traits } from './traits'
import { getSkill, type Skill } from './skills'

export interface CharacterDraft {
  traits: Traits
  skillIds: string[]
  // Identity (passport)
  name?: string
  origin?: string
  imperial?: boolean
  sex?: string
  birthDate?: string
  rauksorg?: string
  description?: string
  imageUri?: string
}

export type WizardStep = 'traits' | 'skills' | 'identity' | 'recap'

export interface BuiltTrait {
  info: TraitInfo
  value: number
}

export interface BuiltCharacter {
  traits: BuiltTrait[]
  skills: Skill[]
  name?: string
  origin?: string
  imperial?: boolean
  sex?: string
  birthDate?: string
  rauksorg?: string
  description?: string
  imageUri?: string
}

export function emptyDraft(): CharacterDraft {
  return { traits: emptyTraits(), skillIds: [] }
}

/** Exactly `competence`-many skills chosen. */
export function skillsComplete(draft: CharacterDraft): boolean {
  return draft.skillIds.length === draft.traits.competence
}

export function hasName(draft: CharacterDraft): boolean {
  return Boolean(draft.name?.trim())
}

export function isDraftComplete(draft: CharacterDraft): boolean {
  return traitsComplete(draft.traits) && skillsComplete(draft) && hasName(draft)
}

export function canAdvance(draft: CharacterDraft, step: WizardStep): boolean {
  switch (step) {
    case 'traits':
      return traitsComplete(draft.traits)
    case 'skills':
      return skillsComplete(draft)
    case 'identity':
      return hasName(draft)
    case 'recap':
      return true
  }
}

export function buildCharacter(draft: CharacterDraft): BuiltCharacter {
  if (!traitsComplete(draft.traits) || !skillsComplete(draft)) {
    throw new Error('Cannot build an incomplete character')
  }
  return {
    traits: TRAITS.map((info) => ({ info: getTrait(info.key), value: draft.traits[info.key] })),
    skills: draft.skillIds.map(getSkill),
    name: draft.name,
    origin: draft.origin,
    imperial: draft.imperial,
    sex: draft.sex,
    birthDate: draft.birthDate,
    rauksorg: draft.rauksorg,
    description: draft.description,
    imageUri: draft.imageUri,
  }
}
