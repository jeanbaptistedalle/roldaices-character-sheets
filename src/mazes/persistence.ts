// Turns a Mazes character between the wizard draft and the stored payload.
// The `data` jsonb column holds ids only (no labels/snapshot) so renaming a
// label later never rewrites saved rows. Identity (name/description/imageUri)
// is stored in table columns, not here.

import type { CharacterDraft, EdgeSlot } from './rules/character'
import type { Role } from './rules/roles'
import { getAspect, type Aspect } from './rules/aspects'
import { getClass } from './rules/classes'

/** A stored edge: its stable id plus its sub-choice (domain, name, …) if any. */
export interface StoredEdge {
  edgeId: string
  subChoice?: string
}

/** The Mazes-specific payload persisted in `characters.data`. */
export interface MazesData {
  role?: Role
  aspect?: Aspect
  classId?: string
  /** The class's three edges in order: [always, question 1, question 2]. */
  edges: [StoredEdge, StoredEdge, StoredEdge]
}

/** Strip identity, keep the mechanical ids — what we store in `data`. */
export function draftToData(draft: CharacterDraft): MazesData {
  if (!draft.classId) throw new Error('Cannot persist a character without a class')
  const def = getClass(draft.classId)
  const [a0, a1] = draft.answers
  if (a0 === undefined || a1 === undefined) {
    throw new Error('Cannot persist a character with unanswered class questions')
  }
  return {
    role: draft.role,
    aspect: draft.aspect,
    classId: draft.classId,
    edges: [
      storedEdge(def.always, 'always', draft),
      storedEdge(def.questions[0].options[a0], 'q0', draft),
      storedEdge(def.questions[1].options[a1], 'q1', draft),
    ],
  }
}

/**
 * Build a StoredEdge from a class edge/option. Edge ids are stable and readable,
 * unlike positional indices which break if options are reordered. The sub-choice
 * is the class preset if any, else the player's answer for that slot.
 */
function storedEdge(
  source: { edgeId: string; presetSubChoice?: string },
  slot: EdgeSlot,
  draft: CharacterDraft,
): StoredEdge {
  const subChoice = source.presetSubChoice ?? draft.subChoices[slot]
  return subChoice ? { edgeId: source.edgeId, subChoice } : { edgeId: source.edgeId }
}

/** A one-line summary for list rows, e.g. "Fighter · Sword · The Jaded Sellsword". */
export function summarize(data: MazesData): string {
  const parts: string[] = []
  if (data.role) {
    parts.push(data.role)
  }
  if (data.aspect) {
    parts.push(getAspect(data.aspect).id)
  }
  if (data.classId) {
    parts.push(getClass(data.classId).name)
  }
  return parts.join(' · ')
}
