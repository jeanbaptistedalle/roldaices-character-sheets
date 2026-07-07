// The Mazes edge list, grouped by the seven edge types.
// See .claude/skills/mazes-rules/SKILL.md.

export type EdgeType =
  | 'Attribute'
  | 'Combat'
  | 'Magic'
  | 'Society'
  | 'Wise'
  | 'Lineage'
  | 'Advance'

/**
 * Kind of sub-choice an edge may carry.
 * - 'domain'          : pick one of DOMAINS (required)
 * - 'school-or-domain': pick a magic Domain or a School (required)
 * - 'place'           : pick a FRIENDS_PLACES value (required)
 * - 'name'            : free-text flavor name (optional)
 */
export type SubChoiceKind = 'domain' | 'school-or-domain' | 'place' | 'name'

export interface EdgeInfo {
  id: string
  name: string
  type: EdgeType
  description: string
  subChoice?: SubChoiceKind
}

export const DOMAINS = ['Night', 'Forge', 'Sea', 'Sky', 'Earth'] as const
export const FRIENDS_PLACES = [
  'High Places',
  'Low Places',
  'Wild Places',
  'Dark Places',
] as const

/** Sub-choice kinds the player MUST resolve (unless the class pre-sets them). */
const REQUIRED_SUBCHOICES: SubChoiceKind[] = ['domain', 'school-or-domain', 'place']

export const EDGES: EdgeInfo[] = [
  // Attributes
  { id: 'ardent', name: 'Ardent', type: 'Attribute', description: 'Resolute, strong-willed, resists pain and temptation.' },
  { id: 'agile', name: 'Agile', type: 'Attribute', description: 'Control of the body, flexibility, and balance.' },
  { id: 'beautiful', name: 'Beautiful', type: 'Attribute', description: 'Physically handsome and alluring.' },
  { id: 'charming', name: 'Charming', type: 'Attribute', description: 'Likable, friendly, interesting to talk with.' },
  { id: 'cunning', name: 'Cunning', type: 'Attribute', description: 'Mentally slippery, fast, strategic, and sly.' },
  { id: 'dexterous', name: 'Dexterous', type: 'Attribute', description: 'Deft, sleight of hand, strong hand-eye coordination.' },
  { id: 'fast', name: 'Fast', type: 'Attribute', description: 'Physically fast, fleet of foot, quick to react.' },
  { id: 'hale', name: 'Hale', type: 'Attribute', description: 'Healthy and hardy; advantage on all Healing saves.' },
  { id: 'intimidating', name: 'Intimidating', type: 'Attribute', description: 'A formidable, overawing, threatening demeanor.' },
  { id: 'keen', name: 'Keen', type: 'Attribute', description: 'Alert, sharp eyes and ears, great senses.' },
  { id: 'lucky', name: 'Lucky', type: 'Attribute', description: 'Advantaged on Chaos rolls; ties break in your favor.' },
  { id: 'old', name: 'Old', type: 'Attribute', description: 'Old and wise: advantage on experience/history; disadvantage on Boots/Blades.' },
  { id: 'quiet', name: 'Quiet', type: 'Attribute', description: 'Stealthy and balanced; sneaks and stays unseen.' },
  { id: 'strong', name: 'Strong', type: 'Attribute', description: 'Physically strong; advantage lifting or breaking things.' },
  { id: 'young', name: 'Young', type: 'Attribute', description: 'Young and untested: advantage on physical feats; disadvantage on experience/combat.' },

  // Combat
  { id: 'accurate', name: 'Accurate', type: 'Combat', description: 'Advantage fighting at range; expert marksman.' },
  { id: 'armored', name: 'Armored', type: 'Combat', description: 'Advantage resisting damage and defending.' },
  { id: 'deadly', name: 'Deadly', type: 'Combat', description: 'Advantage when rolling damage.' },
  { id: 'precise', name: 'Precise', type: 'Combat', description: 'Advantage in melee; controlled and in control.' },
  { id: 'tough', name: 'Tough', type: 'Combat', description: 'Takes a hit; advantage on Death’s Door and Healing saves.' },
  { id: 'well-armed', name: 'Well-Armed', type: 'Combat', description: 'Bristling with weapons; spend a Star to change armament.' },

  // Magic (choose a Domain: Night/Forge/Sea/Sky/Earth)
  { id: 'familiar', name: 'Familiar', type: 'Magic', description: 'A magical retainer bonded to you.', subChoice: 'domain' },
  { id: 'magic', name: 'Magic', type: 'Magic', description: 'You cast spells or channel magical forces.', subChoice: 'school-or-domain' },
  { id: 'magic-item', name: 'Magic Item', type: 'Magic', description: 'A specific powerful item that grants advantage.', subChoice: 'name' },
  { id: 'magic-weapon', name: 'Magic Weapon', type: 'Magic', description: 'A single named magical weapon with a story.', subChoice: 'name' },
  { id: 'shapeshift', name: 'Shapeshift', type: 'Magic', description: 'Turn into another form; your die changes with the shape.' },

  // Society
  { id: 'friends', name: 'Friends', type: 'Society', description: 'Contacts willing to help or inform you.', subChoice: 'place' },
  { id: 'rank', name: 'Rank', type: 'Society', description: 'A title and its respect; +1 Lifestyle tier.', subChoice: 'name' },
  { id: 'retainers', name: 'Retainers', type: 'Society', description: 'People who follow you; you roll for them.', subChoice: 'name' },
  { id: 'tools', name: 'Tools', type: 'Society', description: 'Specific focused tools without spending Treasure.' },
  { id: 'wealth', name: 'Wealth', type: 'Society', description: 'Wealth beyond what you carry; +1 Lifestyle tier.' },

  // 'Wises
  { id: 'animalwise', name: 'Animalwise', type: 'Wise', description: 'Speak the language of beasts and wild fae.' },
  { id: 'gearwise', name: 'Gearwise', type: 'Wise', description: 'Gears, clockwork, traps, and locks.' },
  { id: 'learned', name: 'Learned', type: 'Wise', description: 'Well educated, well read, deep understanding.' },
  { id: 'lorewise', name: 'Lorewise', type: 'Wise', description: 'Ancient and mysterious things; ritual magic.' },
  { id: 'mazewise', name: 'Mazewise', type: 'Wise', description: 'Familiar with mazes; never without a torch.' },
  { id: 'naturewise', name: 'Naturewise', type: 'Wise', description: 'The natural world, animals, and beasts.' },
  { id: 'streetwise', name: 'Streetwise', type: 'Wise', description: 'Crime and life on the hard streets.' },
  { id: 'travelled', name: 'Travelled', type: 'Wise', description: 'Wise about the ways of the world and its people.' },

  // Lineages
  { id: 'bugbear', name: 'Bugbear', type: 'Lineage', description: 'Hulking bearlike humanoid; sees in the dark.' },
  { id: 'ilf', name: 'Ilf', type: 'Lineage', description: 'Remnant of the elf nations, touched by an element.' },
  { id: 'smallfolk', name: 'Smallfolk', type: 'Lineage', description: 'Proud small folk; can speak with animals.' },

  // Advances (reachable at creation only where a class grants one)
  { id: 'veteran', name: 'Veteran', type: 'Advance', description: 'Shake off a condition once; a free refresh.' },
]

const BY_ID: Record<string, EdgeInfo> = Object.fromEntries(
  EDGES.map((e) => [e.id, e]),
)

export function getEdge(id: string): EdgeInfo {
  const edge = BY_ID[id]
  if (!edge) throw new Error(`Unknown edge id: ${id}`)
  return edge
}

/** True if the edge needs a required player sub-choice (domain/school/place). */
export function requiresSubChoice(id: string): boolean {
  const kind = getEdge(id).subChoice
  return kind !== undefined && REQUIRED_SUBCHOICES.includes(kind)
}
