// The three core aspects. Chosen by answering "How do you solve your problems?"
// Aspect is the fiction of your gear and gates the available classes.
// See .claude/skills/mazes-rules/SKILL.md.

export type Aspect = 'Sword' | 'Shadow' | 'Sorcery'

export interface AspectInfo {
  id: Aspect
  /** The "I solve problems…" line. */
  prompt: string
  description: string
}

export const ASPECTS: AspectInfo[] = [
  {
    id: 'Sword',
    prompt: '…by the edge of my SWORD.',
    description:
      'A martial character — warrior, mercenary, or soldier of fortune. Weapons and armor; power from combat skill.',
  },
  {
    id: 'Shadow',
    prompt: '…from the embrace of the SHADOWS.',
    description:
      'Stealth, subterfuge, and skills. Light weapons and tools; power from specialization.',
  },
  {
    id: 'Sorcery',
    prompt: '…with my eldritch SORCERY.',
    description:
      'Capital-M Magic and mysterious powers. Spells, items, or magical lineage; Stars are your core.',
  },
]

const BY_ID: Record<Aspect, AspectInfo> = Object.fromEntries(
  ASPECTS.map((a) => [a.id, a]),
) as Record<Aspect, AspectInfo>

export function getAspect(id: Aspect): AspectInfo {
  return BY_ID[id]
}
