// Turns a Rauks character between the wizard draft and the stored payload.
// The `data` jsonb column holds traits + skill ids + Rauks-specific identity;
// shared identity (name/description/imageUri) lives in table columns.

import type { CharacterRecord } from '../api'
import { emptyDraft, isDraftComplete, type CharacterDraft } from './rules/character'
import type { Traits } from './rules/traits'
import { getSkill } from './rules/skills'

export interface RauksData {
  traits: Traits
  skillIds: string[]
  origin?: string
  imperial?: boolean
  sex?: string
  birthDate?: string
  rauksorg?: string
  traitsAndTrauma?: string[]
  remainingRerolls?: number
}

export function draftToData(draft: CharacterDraft): RauksData {
  if (!isDraftComplete(draft)) {
    throw new Error('Cannot persist an incomplete character')
  }
  const data: RauksData = {
    traits: draft.traits,
    skillIds: draft.skillIds,
  }
  // Imperial origin has no city; don't persist a stale origin alongside it.
  if (draft.imperial) data.imperial = true
  else if (draft.origin?.trim()) data.origin = draft.origin.trim()
  if (draft.sex?.trim()) data.sex = draft.sex.trim()
  if (draft.birthDate?.trim()) data.birthDate = draft.birthDate.trim()
  if (draft.rauksorg?.trim()) data.rauksorg = draft.rauksorg.trim()
  const traitsAndTrauma = draft.traitsAndTrauma.map((v) => v.trim()).filter(Boolean)
  if (traitsAndTrauma.length > 0) data.traitsAndTrauma = traitsAndTrauma
  if (draft.remainingRerolls !== undefined) data.remainingRerolls = draft.remainingRerolls
  return data
}

export function dataToDraft(record: CharacterRecord): CharacterDraft {
  const data = record.data as RauksData
  return {
    ...emptyDraft(),
    traits: data.traits,
    skillIds: data.skillIds,
    origin: data.origin,
    imperial: data.imperial,
    sex: data.sex,
    birthDate: data.birthDate,
    rauksorg: data.rauksorg,
    traitsAndTrauma: data.traitsAndTrauma ?? [],
    remainingRerolls: data.remainingRerolls,
    name: record.name,
    description: record.description ?? undefined,
    imageUri: record.imageUri ?? undefined,
  }
}

/**
 * One-line list-row summary of the chosen skills, e.g. "Gorilla · Shadow · Lawyer".
 * Pass a translator (the `rauks` namespace `t`) to localize the skill names and the
 * empty label; without one it falls back to the English names from the rules.
 */
export function summarize(data: RauksData, t?: (key: string) => string): string {
  if (data.skillIds.length === 0) return t ? t('home.noSkills') : 'No skills'
  const name = t ? (id: string) => t(`terms.skills.${id}`) : (id: string) => getSkill(id).name
  return data.skillIds.map(name).join(' · ')
}
