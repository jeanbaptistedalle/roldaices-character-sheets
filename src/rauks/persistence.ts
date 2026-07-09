// Turns a Rauks character between the wizard draft and the stored payload.
// The `data` jsonb column holds traits + skill ids + Rauks-specific identity;
// shared identity (name/description/imageUri) lives in table columns.

import type { CharacterRecord } from '../api'
import { emptyDraft, isDraftComplete, type CharacterDraft } from './rules/character'
import type { Traits } from './rules/traits'

export interface RauksData {
  traits: Traits
  skillIds: string[]
  origin?: string
  imperial?: boolean
  sex?: string
  birthDate?: string
  rauksorg?: string
}

export function draftToData(draft: CharacterDraft): RauksData {
  if (!isDraftComplete(draft)) {
    throw new Error('Cannot persist an incomplete character')
  }
  const data: RauksData = {
    traits: draft.traits,
    skillIds: draft.skillIds,
  }
  if (draft.imperial) data.imperial = true
  if (draft.origin?.trim()) data.origin = draft.origin.trim()
  if (draft.sex?.trim()) data.sex = draft.sex.trim()
  if (draft.birthDate?.trim()) data.birthDate = draft.birthDate.trim()
  if (draft.rauksorg?.trim()) data.rauksorg = draft.rauksorg.trim()
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
    name: record.name,
    description: record.description ?? undefined,
    imageUri: record.imageUri ?? undefined,
  }
}

/** One-line list-row summary, e.g. "Imperial · 3 skills". */
export function summarize(data: RauksData): string {
  const origin = data.imperial ? 'Imperial' : data.origin?.trim() || 'Rauks'
  const n = data.skillIds.length
  return `${origin} · ${n} skill${n === 1 ? '' : 's'}`
}
