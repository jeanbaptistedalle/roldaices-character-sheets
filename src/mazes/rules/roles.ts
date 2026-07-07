// The four Mazes roles. A role IS a single die and sets Hearts and Stars.
// See .claude/skills/mazes-rules/SKILL.md.

export type Role = 'Paragon' | 'Vanguard' | 'Fighter' | 'Sentinel'

export interface RoleInfo {
  id: Role
  /** Number of faces on the role's die (also its crown / Hearts). */
  die: 4 | 6 | 8 | 10
  /** Human label, e.g. "d4". */
  dieLabel: string
  /** Hit points, equal to the die's crown. */
  hearts: number
  /** Special-power resource. */
  stars: number
  /** Which resolution the role shines at. */
  shinesAt: string
  /** One-line reason to pick this role. */
  blurb: string
  /** "Choose because you want to…" bullets. */
  wants: string[]
}

export const ROLES: RoleInfo[] = [
  {
    id: 'Paragon',
    die: 4,
    dieLabel: 'd4',
    hearts: 4,
    stars: 4,
    shinesAt: 'BOOKS',
    blurb: 'The expert. The smallest die, but it explodes the most.',
    wants: [
      'Be the best at a class ability',
      'Use your instincts and intelligence',
      'Investigate and use perception',
      'Rely on special abilities over basic combat',
    ],
  },
  {
    id: 'Vanguard',
    die: 6,
    dieLabel: 'd6',
    hearts: 6,
    stars: 3,
    shinesAt: 'BOOKS & BOOTS',
    blurb: 'The most active role — a good mix, always in the thick of it.',
    wants: [
      'Always be in the thick of it',
      'Be great at physical activities like running and climbing',
      'Be a decent fighter without being the best',
      'Blend special abilities and basic combat',
    ],
  },
  {
    id: 'Fighter',
    die: 8,
    dieLabel: 'd8',
    hearts: 8,
    stars: 2,
    shinesAt: 'BLADES',
    blurb: 'Here to smash faces. At their best when the battle starts.',
    wants: [
      'Stab it, kill it, set it on fire',
      'Be good at physical activities like climbing and swimming',
      'Survive a beating and dish out hurt',
      'Focus primarily on basic combat',
    ],
  },
  {
    id: 'Sentinel',
    die: 10,
    dieLabel: 'd10',
    hearts: 10,
    stars: 1,
    shinesAt: 'BONES',
    blurb: 'The shield that guards the party. Hard to stop, deals the most.',
    wants: [
      'Be safe and keep others safe',
      'Be strong and hearty',
      'Soak up damage and laugh at it',
      'Deal the most damage on the defensive',
    ],
  },
]

const ROLES_BY_ID: Record<Role, RoleInfo> = Object.fromEntries(
  ROLES.map((r) => [r.id, r]),
) as Record<Role, RoleInfo>

export function getRole(role: Role): RoleInfo {
  return ROLES_BY_ID[role]
}
