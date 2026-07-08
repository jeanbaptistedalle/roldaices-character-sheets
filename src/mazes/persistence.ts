// Turns a Mazes character between the wizard draft and the stored payload.
// The `data` jsonb column holds ids only (no labels/snapshot) so renaming a
// label later never rewrites saved rows. Identity (name/description/imageUri)
// is stored in table columns, not here.

import type { CharacterDraft, EdgeSlot } from './rules/character'
import { getRole, type Role } from './rules/roles'
import { getAspect, type Aspect } from './rules/aspects'
import { getClass } from './rules/classes'

/** The Mazes-specific payload persisted in `characters.data`. */
export interface MazesData {
  role?: Role
  aspect?: Aspect
  classId?: string
  answers: [number | undefined, number | undefined]
  subChoices: Partial<Record<EdgeSlot, string>>
}

/** Strip identity, keep the mechanical ids — what we store in `data`. */
export function draftToData(draft: CharacterDraft): MazesData {
  return {
    role: draft.role,
    aspect: draft.aspect,
    classId: draft.classId,
    answers: draft.answers,
    subChoices: draft.subChoices,
  }
}

/** A one-line summary for list rows, e.g. "d8 Fighter · Sword · The Jaded Sellsword". */
export function summarize(data: MazesData): string {
  const parts: string[] = []
  if (data.role) {
    parts.push(`${getRole(data.role).dieLabel} ${data.role}`)
  }
  if (data.aspect) {
    parts.push(getAspect(data.aspect).id)
  }
  if (data.classId) {
    parts.push(getClass(data.classId).name)
  }
  return parts.join(' · ')
}
