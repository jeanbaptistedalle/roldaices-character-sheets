// The character draft the wizard builds, plus derivation and step validation.
// See .claude/skills/mazes-rules/SKILL.md and the wizard design spec.

import { getRole, type Role, type RoleInfo } from './roles'
import { getAspect, type Aspect, type AspectInfo } from './aspects'
import { getClass, type ClassDef, type ClassEdge } from './classes'
import { getEdge, requiresSubChoice, type EdgeInfo } from './edges'

/** Which question slots a class exposes, in order. */
export type EdgeSlot = 'always' | 'q0' | 'q1'

export interface CharacterDraft {
  role?: Role
  aspect?: Aspect
  classId?: string
  /** Chosen option index per question (length 2); undefined = unanswered. */
  answers: [number | undefined, number | undefined]
  /** Player-supplied sub-choice values, keyed by slot. */
  subChoices: Partial<Record<EdgeSlot, string>>
  // Identity — independent of the mechanical choices.
  name?: string
  description?: string
  imageUri?: string
}

export interface ResolvedEdge {
  slot: EdgeSlot
  edge: EdgeInfo
  /**
   * i18n flavor-label key (`terms.classFlavor.<flavorKey>`), if the class
   * defines one. When absent, callers display the edge's own term
   * (`terms.edges.<edge.id>`) — this module has no `t`.
   */
  flavorKey?: string
  /** Preset or player-supplied sub-choice, if any. */
  subChoice?: string
  /** True when the sub-choice is a class preset (not player-supplied). */
  presetSubChoice: boolean
  /** True if this edge needs a required sub-choice that isn't set yet. */
  needsSubChoice: boolean
}

export interface BuiltCharacter {
  role: RoleInfo
  aspect: AspectInfo
  classId: string
  className: string
  edges: ResolvedEdge[]
  name?: string
  description?: string
  imageUri?: string
}

export type WizardStep = 'role' | 'aspect' | 'class' | 'edges' | 'identity' | 'recap'

export function emptyDraft(): CharacterDraft {
  return { answers: [undefined, undefined], subChoices: {} }
}

/** Resolve a class-edge for a given slot into a ResolvedEdge. */
function resolveSlot(slot: EdgeSlot, classEdge: ClassEdge, draft: CharacterDraft): ResolvedEdge {
  const edge = getEdge(classEdge.edgeId)
  const subChoice = classEdge.presetSubChoice ?? draft.subChoices[slot]
  const needsSubChoice = requiresSubChoice(edge.id) && !subChoice
  return {
    slot,
    edge,
    flavorKey: classEdge.flavorKey,
    subChoice,
    presetSubChoice: Boolean(classEdge.presetSubChoice),
    needsSubChoice,
  }
}

/**
 * The character's edges so far: the always-edge plus any answered questions.
 * Unanswered question slots are omitted.
 */
export function resolveEdges(draft: CharacterDraft): ResolvedEdge[] {
  if (!draft.classId) return []
  const def: ClassDef = getClass(draft.classId)
  const resolved: ResolvedEdge[] = [resolveSlot('always', def.always, draft)]

  const slots: EdgeSlot[] = ['q0', 'q1']
  def.questions.forEach((question, i) => {
    const answer = draft.answers[i]
    if (answer !== undefined) {
      resolved.push(resolveSlot(slots[i], question.options[answer], draft))
    }
  })
  return resolved
}

/** True when both questions are answered and every required sub-choice is set. */
export function edgesComplete(draft: CharacterDraft): boolean {
  if (!draft.classId) return false
  if (draft.answers.some((a) => a === undefined)) return false
  return resolveEdges(draft).every((r) => !r.needsSubChoice)
}

/** A name with at least one non-whitespace character. */
export function hasName(draft: CharacterDraft): boolean {
  return Boolean(draft.name?.trim())
}

export function isDraftComplete(draft: CharacterDraft): boolean {
  return (
    Boolean(draft.role && draft.aspect && draft.classId) &&
    edgesComplete(draft) &&
    hasName(draft)
  )
}

/** Whether the wizard may advance past the given step. */
export function canAdvance(draft: CharacterDraft, step: WizardStep): boolean {
  switch (step) {
    case 'role':
      return Boolean(draft.role)
    case 'aspect':
      return Boolean(draft.aspect)
    case 'class':
      return Boolean(draft.classId)
    case 'edges':
      return edgesComplete(draft)
    case 'identity':
      return hasName(draft)
    case 'recap':
      return true
  }
}

/** Build the recap view of a completed draft. */
export function buildCharacter(draft: CharacterDraft): BuiltCharacter {
  if (!draft.role || !draft.aspect || !draft.classId) {
    throw new Error('Cannot build an incomplete character')
  }
  const def = getClass(draft.classId)
  return {
    role: getRole(draft.role),
    aspect: getAspect(draft.aspect),
    classId: def.id,
    className: def.name,
    edges: resolveEdges(draft),
    name: draft.name,
    description: draft.description,
    imageUri: draft.imageUri,
  }
}
