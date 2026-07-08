// Turns a Mazes character between the wizard draft and the stored payload.
// The `data` jsonb column holds ids only (no labels/snapshot) so renaming a
// label later never rewrites saved rows. Identity (name/description/imageUri)
// is stored in table columns, not here.

import type { CharacterRecord } from '../api'
import { emptyDraft, type CharacterDraft, type EdgeSlot } from './rules/character'
import type { Role } from './rules/roles'
import { getAspect, type Aspect } from './rules/aspects'
import { getClass, type ClassEdge, type ClassOption } from './rules/classes'

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

/**
 * Inverse of `draftToData`: rebuild a wizard draft from a stored record so a
 * saved character can be reopened for editing. Identity comes from the record's
 * columns; the mechanical ids come from `record.data`.
 */
export function dataToDraft(record: CharacterRecord): CharacterDraft {
  const data = record.data as MazesData
  const draft: CharacterDraft = {
    ...emptyDraft(),
    role: data.role,
    aspect: data.aspect,
    classId: data.classId,
    name: record.name,
    description: record.description ?? undefined,
    imageUri: record.imageUri ?? undefined,
  }
  if (!data.classId) return draft

  const def = getClass(data.classId)
  const [always, q0, q1] = data.edges

  if (always.edgeId !== def.always.edgeId) {
    throw new Error(`No option with edgeId "${always.edgeId}" in class ${def.id}`)
  }
  restoreSubChoice(draft, 'always', def.always, always)

  const answers: CharacterDraft['answers'] = [undefined, undefined]
  const stored: [StoredEdge, StoredEdge] = [q0, q1]
  const slots: EdgeSlot[] = ['q0', 'q1']
  def.questions.forEach((question, i) => {
    const index = question.options.findIndex((o) => o.edgeId === stored[i].edgeId)
    if (index === -1) {
      throw new Error(`No option with edgeId "${stored[i].edgeId}" in class ${def.id}`)
    }
    answers[i] = index
    restoreSubChoice(draft, slots[i], question.options[index], stored[i])
  })
  draft.answers = answers
  return draft
}

/**
 * Put a stored sub-choice back into the draft only when the class option does
 * not preset one — preset sub-choices are re-derived by `resolveSlot`, so
 * storing them in the draft would be redundant (and drift on a label rename).
 */
function restoreSubChoice(
  draft: CharacterDraft,
  slot: EdgeSlot,
  option: ClassEdge | ClassOption,
  stored: StoredEdge,
): void {
  if (!option.presetSubChoice && stored.subChoice) {
    draft.subChoices[slot] = stored.subChoice
  }
}
