// The Rauks skills (the rules call them "compétences"), grouped by the trait
// used to roll them. English ids/names/descriptions. See
// .claude/skills/rauks-rules/SKILL.md.

export type SkillCategory = 'Physical' | 'Perception' | 'Mental' | 'Social' | 'Karma'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  description: string
  gear?: string
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Physical', 'Perception', 'Mental', 'Social', 'Karma',
]

export const SKILLS: Skill[] = [
  // Physical
  { id: 'gorilla', name: 'Gorilla', category: 'Physical',
    description: 'Gorilla-like strength: force doors, throw heavy objects, brutal high-damage attacks. Very intimidating.' },
  { id: 'athlete', name: 'Athlete', category: 'Physical',
    description: 'Extreme-sports mobility — parkour, climbing, swimming, glider. Outruns or catches anyone. From turn 2, a bonus action at end of each turn on an increasingly hard Physical roll.' },
  { id: 'death-cheater', name: 'Death Cheater', category: 'Physical',
    description: 'Exceptional physiology control. Once per combat, resist a neutralization and stay conscious; the wound fully applies after combat.' },
  { id: 'rauks-maga', name: 'Rauks-Maga', category: 'Physical',
    description: 'Rauks hand-to-hand: fast strikes, non-lethal submissions, ground fighting, chokes. Also lets you use the pressure weapon lethally in melee (impossible without it).' },
  { id: 'weapon-master', name: 'Weapon Master', category: 'Physical',
    description: 'Blade mastery: creates a lethal zone — anyone entering the combat circle can be struck automatically via an opposition roll, difficulty rising as more enter.',
    gear: 'A sabre.' },
  // Perception
  { id: 'sixth-sense', name: 'Sixth Sense', category: 'Perception',
    description: 'Hyper-senses plus a true sixth sense: feel danger, locate people through walls. Information can be cryptic; cannot be used for social reads.' },
  { id: 'mongoose', name: 'Mongoose', category: 'Perception',
    description: 'Near-superhuman reflexes: a start-of-combat bonus action on a successful roll; can force initiative over another character\'s declared action in any scene.' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', category: 'Perception',
    description: 'Prestidigitation and elite pickpocketing — take or plant objects, sabotage a foe\'s gear or weapon — plus lockpicking.' },
  { id: 'shadow', name: 'Shadow', category: 'Perception',
    description: 'Stealth and speed: escape watchers\' vigilance; in combat, move to break line-of-sight even after attacking.' },
  { id: 'gunslinger', name: 'Gunslinger', category: 'Perception',
    description: 'Rapid fire: three shots in one turn, each at +1 difficulty rank. Roll all three dice at once and reroll any at will.' },
  { id: 'marksman', name: 'Marksman', category: 'Perception',
    description: 'Long-range precision: disarm, ricochet, or shoot between allies.',
    gear: 'A black-powder precision rifle and 5 cartridges (~300m).' },
  // Mental
  { id: 'anticipation', name: 'Anticipation', category: 'Mental',
    description: 'Once per session, cancel one or more events (deemed anticipated and not yet occurred) to retry an approach. Narrative fixed by criticals or luck rolls persists; rerolls spent during it are lost.' },
  { id: 'master-tactician', name: 'Master Tactician', category: 'Mental',
    description: 'Defensive expert: always gets an opposition roll versus ranged attacks; finds weak points to amplify allies\' or own attacks.' },
  { id: 'forensics-expert', name: 'Forensics Expert', category: 'Mental',
    description: 'Criminology: fingerprints, ballistics, and scientific evidence.',
    gear: 'An instant camera and a fingerprint kit.' },
  { id: 'rauks-medicine', name: 'Rauks Medicine', category: 'Mental',
    description: 'Heal grave wounds, prevent sequelae, sometimes resuscitate; prevents trait loss; can autopsy for cause of death.',
    gear: 'A Rauks medical kit.' },
  { id: 'pharmacologist', name: 'Pharmacologist', category: 'Mental',
    description: 'Craft anesthetics, poisons, and stimulants (liquid, solid, or gas) during a lull; rudimentary explosives; science and chemistry expert.',
    gear: 'A pharmacology kit and two free preparations at start.' },
  { id: 'lawyer', name: 'Lawyer', category: 'Mental',
    description: 'Reads a city\'s legal order to exploit it, finds loopholes and forgotten old rules, and is good at getting a suspect convicted.' },
  { id: 'engineer', name: 'Engineer', category: 'Mental',
    description: 'Expert tinkerer: mechanics, electronics, and applied science.' },
  { id: 'tracker', name: 'Tracker', category: 'Mental',
    description: 'Track a person or group and hunt a trail; strong at wilderness survival.' },
  { id: 'trapper', name: 'Trapper', category: 'Mental',
    description: 'Set, disarm, and spot traps — tripwires, snares, pits, explosive traps. Traps are indiscriminate and may catch innocents.',
    gear: 'Nylon cables and a folding shovel.' },
  // Social
  { id: 'coordinator', name: 'Coordinator', category: 'Social',
    description: 'Builds a local auxiliary network (3–10 helpers, more in big cities) for messages, information, observation, moving goods, and light defense.' },
  { id: 'hypnosis', name: 'Hypnosis', category: 'Social',
    description: 'Aggressive hypnosis: suggestions, deep sleep, suppress pain, weaken will, or alter memory. The hardest effects may need a luck roll; it can look like an assault to witnesses.' },
  { id: 'fatal-beauty', name: 'Fatal Beauty', category: 'Social',
    description: 'Stunning beauty and seduction techniques. Adults-only content.' },
  { id: 'profiler', name: 'Profiler', category: 'Social',
    description: 'Read a person\'s honesty, character, and methods after observation; infer a perpetrator from clues. A master interrogator.' },
  { id: 'natural-authority', name: 'Natural Authority', category: 'Social',
    description: 'Commanding presence: directs assisting NPCs and can raise a civilian crowd; can impose actions on group members and spend own rerolls to reroll allies\' rolls. Strong intimidation.' },
  { id: 'dog-handler', name: 'Dog Handler', category: 'Social',
    description: 'A trained Rauks dog with the master\'s traits but dog-only actions; complex commands need Dog Handler rolls; the "Rauks!" result always fails for the dog. Fragile and irreplaceable mid-adventure.' },
  { id: 'acting', name: 'Acting', category: 'Social',
    description: 'Impersonation and disguise — swap a hidden disguise in seconds, even in a crowd. A natural liar.',
    gear: 'An all-purpose disguise.' },
  // Karma
  { id: 'immaculate-reputation', name: 'Immaculate Reputation', category: 'Karma',
    description: 'Renowned: +1 over the group Karma on reputation rolls (never above 4); people remember only their exploits.' },
  { id: 'born-lucky', name: 'Born Lucky', category: 'Karma',
    description: 'Incredibly lucky: +1 over the group Karma on luck rolls (never above 4).' },
]

const SKILLS_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
)

export function getSkill(id: string): Skill {
  const skill = SKILLS_BY_ID[id]
  if (!skill) throw new Error(`Unknown skill id: ${id}`)
  return skill
}

export function skillsByCategory(): { category: SkillCategory; skills: Skill[] }[] {
  return SKILL_CATEGORIES.map((category) => ({
    category,
    skills: SKILLS.filter((s) => s.category === category),
  }))
}
