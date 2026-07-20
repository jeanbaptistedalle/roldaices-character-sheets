// The six Rauks traits and the point-buy rules. See
// .claude/skills/rauks-rules/SKILL.md. Labels/identifiers are English.

export type TraitKey =
  | 'physical' | 'perception' | 'mental' | 'charisma' // roll traits
  | 'competence' | 'rerolls'                          // budget traits

export type Traits = Record<TraitKey, number>

export type TraitGroup = 'roll' | 'budget'

export interface TraitInfo {
  key: TraitKey
  label: string
  description: string
  group: TraitGroup
}

export const TRAIT_TOTAL = 18
export const TRAIT_MIN = 1
export const TRAIT_MAX = 4
/** The normal floor; a trait may go below this to 1, but only one may. */
export const NORMAL_MIN = 2

export const TRAITS: TraitInfo[] = [
  { key: 'physical', label: 'Physical', group: 'roll',
    description: 'Strength, endurance, agility, and melee fighting.' },
  { key: 'perception', label: 'Perception', group: 'roll',
    description: 'Senses, reflexes, dexterity, stealth, and ranged shooting.' },
  { key: 'mental', label: 'Mental', group: 'roll',
    description: 'Knowledge, logic, first aid, tinkering, and investigation.' },
  { key: 'charisma', label: 'Charisma', group: 'roll',
    description: 'Persuade, charm, lie, intimidate, and read intentions.' },
  { key: 'competence', label: 'Competence', group: 'budget',
    description: '= number of Skills you may pick.' },
  { key: 'rerolls', label: 'Rerolls', group: 'budget',
    description: '= reroll tokens and their recovery.' },
]

const TRAITS_BY_KEY: Record<TraitKey, TraitInfo> = Object.fromEntries(
  TRAITS.map((t) => [t.key, t]),
) as Record<TraitKey, TraitInfo>

export function getTrait(key: TraitKey): TraitInfo {
  return TRAITS_BY_KEY[key]
}

export function emptyTraits(): Traits {
  return { physical: 2, perception: 2, mental: 2, charisma: 2, competence: 2, rerolls: 2 }
}

export function sumTraits(t: Traits): number {
  return TRAITS.reduce((sum, { key }) => sum + t[key], 0)
}

/** Reroll tokens granted by the `rerolls` trait: 2 per point, minus 1. */
export function rerollTokens(rerolls: number): number {
  return 2 * rerolls - 1
}

export function pointsRemaining(t: Traits): number {
  return TRAIT_TOTAL - sumTraits(t)
}

export function countAtOne(t: Traits): number {
  return TRAITS.reduce((n, { key }) => (t[key] === 1 ? n + 1 : n), 0)
}

export function traitsComplete(t: Traits): boolean {
  const inRange = TRAITS.every(({ key }) => t[key] >= TRAIT_MIN && t[key] <= TRAIT_MAX)
  return inRange && countAtOne(t) <= 1 && sumTraits(t) === TRAIT_TOTAL
}

export function canIncrement(t: Traits, key: TraitKey): boolean {
  return t[key] < TRAIT_MAX && pointsRemaining(t) > 0
}

export function canDecrement(t: Traits, key: TraitKey): boolean {
  const value = t[key]
  if (value <= TRAIT_MIN) return false
  // Dropping from 2 to 1 is only allowed when no other trait is already 1.
  if (value === NORMAL_MIN) return countAtOne(t) === 0
  return true
}
