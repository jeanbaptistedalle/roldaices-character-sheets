// The four core resolutions and their fixed target numbers. These are the same
// for every die; the die size only changes how often you hit them.
// See .claude/skills/mazes-rules/SKILL.md.

export type Resolution = 'Books' | 'Boots' | 'Blades' | 'Bones'

export interface ResolutionInfo {
  id: Resolution
  /** Fixed faces that succeed, regardless of die. */
  targets: number[]
  description: string
}

export const RESOLUTIONS: ResolutionInfo[] = [
  { id: 'Books', targets: [2, 3], description: 'Knowledge, perception, senses' },
  { id: 'Boots', targets: [3, 4, 5], description: 'Movement and athletics' },
  { id: 'Blades', targets: [4, 5, 6, 7], description: 'Any violent action' },
  { id: 'Bones', targets: [5, 6, 7, 8, 9], description: 'Resolve, strength, endurance' },
]

const BY_ID: Record<Resolution, ResolutionInfo> = Object.fromEntries(
  RESOLUTIONS.map((r) => [r.id, r]),
) as Record<Resolution, ResolutionInfo>

export function getResolution(id: Resolution): ResolutionInfo {
  return BY_ID[id]
}

/** Target faces a given die can actually roll (targets that are <= die). */
export function hittableTargets(id: Resolution, die: number): number[] {
  return getResolution(id).targets.filter((t) => t <= die)
}
