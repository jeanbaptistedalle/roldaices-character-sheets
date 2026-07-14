// The 24 example classes from the corebook. A class is a name (Adjective +
// Noun) that acts as an edge, plus 3 edges: one "always" edge and two questions.
// See .claude/skills/mazes-rules/SKILL.md.
//
// User-facing display text is localized, keyed on the stable ids below (never
// on rendered English). Render sites resolve:
//   - class name      -> t(`terms.classes.<id>`)
//   - question prompt -> t(`terms.classQuestions.<id>.<0|1>`)
//   - flavor label    -> t(`terms.classFlavor.<flavorKey>`)
// `name` is kept as the authoritative English source (used by the list-row
// summary and tests). `presetSubChoice` is the stored/logic value; its
// localized display comes from `flavorKey`.

import type { Aspect } from './aspects'

export interface ClassOption {
  edgeId: string
  /**
   * i18n flavor-label key (`terms.classFlavor.<flavorKey>`) shown instead of the
   * plain edge name (e.g. "Sworn Swords" for a `retainers` edge).
   */
  flavorKey?: string
  /** A sub-choice the class fixes for you (e.g. magic school "Summoning"). */
  presetSubChoice?: string
}

export interface ClassEdge {
  edgeId: string
  flavorKey?: string
  presetSubChoice?: string
}

export interface ClassQuestion {
  options: ClassOption[]
}

export interface ClassDef {
  id: string
  name: string
  aspect: Aspect
  /** The edge every member of the class always has. */
  always: ClassEdge
  /** Exactly two questions, each resolving to one edge. */
  questions: [ClassQuestion, ClassQuestion]
}

export const CLASSES: ClassDef[] = [
  // ----- Sword -----
  {
    id: 'dangerous-bravo',
    name: 'The Dangerous Bravo',
    aspect: 'Sword',
    always: { edgeId: 'precise' },
    questions: [
      { options: [{ edgeId: 'agile' }, { edgeId: 'accurate' }] },
      { options: [{ edgeId: 'hale' }, { edgeId: 'fast' }, { edgeId: 'strong' }] },
    ],
  },
  {
    id: 'jaded-sellsword',
    name: 'The Jaded Sellsword',
    aspect: 'Sword',
    always: { edgeId: 'well-armed' },
    questions: [
      { options: [{ edgeId: 'rank' }, { edgeId: 'wealth' }] },
      {
        options: [
          { edgeId: 'lucky' },
          { edgeId: 'veteran' },
          { edgeId: 'retainers', flavorKey: 'sworn-swords', presetSubChoice: 'Sworn Swords' },
        ],
      },
    ],
  },
  {
    id: 'knockabout-ranger',
    name: 'The Knockabout Ranger',
    aspect: 'Sword',
    always: { edgeId: 'accurate' },
    questions: [
      { options: [{ edgeId: 'travelled' }, { edgeId: 'quiet' }] },
      {
        options: [{ edgeId: 'naturewise' }, { edgeId: 'tough' }, { edgeId: 'familiar', flavorKey: 'beast' }],
      },
    ],
  },
  {
    id: 'monster-slayer',
    name: 'The Monster Slayer',
    aspect: 'Sword',
    always: { edgeId: 'well-armed' },
    questions: [
      {
        options: [{ edgeId: 'mazewise' }, { edgeId: 'retainers', flavorKey: 'loyal-hounds', presetSubChoice: 'Loyal Hounds' }],
      },
      { options: [{ edgeId: 'cunning' }, { edgeId: 'dexterous' }, { edgeId: 'strong' }] },
    ],
  },
  {
    id: 'outcast-bugbear',
    name: 'The Outcast Bugbear',
    aspect: 'Sword',
    always: { edgeId: 'bugbear' },
    questions: [
      { options: [{ edgeId: 'deadly' }, { edgeId: 'armored' }] },
      { options: [{ edgeId: 'strong' }, { edgeId: 'tough' }, { edgeId: 'travelled' }] },
    ],
  },
  {
    id: 'reluctant-hero',
    name: 'The Reluctant Hero',
    aspect: 'Sword',
    always: { edgeId: 'young' },
    questions: [
      { options: [{ edgeId: 'magic-weapon' }, { edgeId: 'magic-item' }] },
      { options: [{ edgeId: 'beautiful' }, { edgeId: 'charming' }, { edgeId: 'lucky' }] },
    ],
  },
  {
    id: 'savage-barbarian',
    name: 'The Savage Barbarian',
    aspect: 'Sword',
    always: { edgeId: 'tough' },
    questions: [
      { options: [{ edgeId: 'deadly' }, { edgeId: 'strong' }] },
      { options: [{ edgeId: 'ardent' }, { edgeId: 'hale' }, { edgeId: 'naturewise' }] },
    ],
  },
  {
    id: 'valiant-dragoon',
    name: 'The Valiant Dragoon',
    aspect: 'Sword',
    always: { edgeId: 'armored' },
    questions: [
      {
        options: [{ edgeId: 'deadly' }, { edgeId: 'retainers', flavorKey: 'shieldbearers', presetSubChoice: 'Shieldbearers' }],
      },
      { options: [{ edgeId: 'ardent' }, { edgeId: 'strong' }, { edgeId: 'intimidating' }] },
    ],
  },

  // ----- Shadow -----
  {
    id: 'adventurous-smallfolk',
    name: 'The Adventurous Smallfolk',
    aspect: 'Shadow',
    always: { edgeId: 'smallfolk' },
    questions: [
      { options: [{ edgeId: 'animalwise' }, { edgeId: 'shapeshift', flavorKey: 'shapeshifter' }] },
      { options: [{ edgeId: 'charming' }, { edgeId: 'quiet' }, { edgeId: 'friends' }] },
    ],
  },
  {
    id: 'cursed-tomb-robber',
    name: 'The Cursed Tomb Robber',
    aspect: 'Shadow',
    always: { edgeId: 'mazewise' },
    questions: [
      {
        options: [{ edgeId: 'gearwise' }, { edgeId: 'retainers', flavorKey: 'torchbearers', presetSubChoice: 'Torchbearers' }],
      },
      { options: [{ edgeId: 'cunning' }, { edgeId: 'dexterous' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'excellent-vagabond',
    name: 'The Excellent Vagabond',
    aspect: 'Shadow',
    always: { edgeId: 'travelled' },
    questions: [
      { options: [{ edgeId: 'charming' }, { edgeId: 'cunning' }] },
      { options: [{ edgeId: 'fast' }, { edgeId: 'lucky' }, { edgeId: 'friends' }] },
    ],
  },
  {
    id: 'filthy-urchin',
    name: 'The Filthy Urchin',
    aspect: 'Shadow',
    always: { edgeId: 'quiet' },
    questions: [
      { options: [{ edgeId: 'streetwise' }, { edgeId: 'dexterous' }] },
      { options: [{ edgeId: 'agile' }, { edgeId: 'fast' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'nighthawk-assassin',
    name: 'The Nighthawk Assassin',
    aspect: 'Shadow',
    always: { edgeId: 'deadly' },
    questions: [
      { options: [{ edgeId: 'accurate' }, { edgeId: 'quiet' }] },
      { options: [{ edgeId: 'agile' }, { edgeId: 'fast' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'puzzling-locksmith',
    name: 'The Puzzling Locksmith',
    aspect: 'Shadow',
    always: { edgeId: 'gearwise' },
    questions: [
      { options: [{ edgeId: 'tools' }, { edgeId: 'learned' }] },
      { options: [{ edgeId: 'streetwise' }, { edgeId: 'keen' }, { edgeId: 'quiet' }] },
    ],
  },
  {
    id: 'talented-thief',
    name: 'The Talented Thief',
    aspect: 'Shadow',
    always: { edgeId: 'streetwise' },
    questions: [
      { options: [{ edgeId: 'accurate' }, { edgeId: 'quiet' }] },
      { options: [{ edgeId: 'agile' }, { edgeId: 'charming' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'zealous-cultist',
    name: 'The Zealous Cultist',
    aspect: 'Shadow',
    always: { edgeId: 'lorewise' },
    questions: [
      {
        options: [
          { edgeId: 'retainers', flavorKey: 'mad-followers', presetSubChoice: 'Mad Followers' },
          { edgeId: 'familiar', flavorKey: 'dark-familiar' },
        ],
      },
      { options: [{ edgeId: 'intimidating' }, { edgeId: 'old' }, { edgeId: 'rank' }] },
    ],
  },

  // ----- Sorcery -----
  {
    id: 'blazing-magician',
    name: 'The Blazing Magician',
    aspect: 'Sorcery',
    always: { edgeId: 'magic' },
    questions: [
      { options: [{ edgeId: 'accurate' }, { edgeId: 'armored' }] },
      { options: [{ edgeId: 'ardent' }, { edgeId: 'strong' }, { edgeId: 'tough' }] },
    ],
  },
  {
    id: 'guild-mage',
    name: 'The Guild Mage',
    aspect: 'Sorcery',
    always: { edgeId: 'magic' },
    questions: [
      { options: [{ edgeId: 'familiar' }, { edgeId: 'magic-item' }] },
      { options: [{ edgeId: 'learned' }, { edgeId: 'travelled' }, { edgeId: 'naturewise' }] },
    ],
  },
  {
    id: 'haunted-librarian',
    name: 'The Haunted Librarian',
    aspect: 'Sorcery',
    always: { edgeId: 'lorewise' },
    questions: [
      {
        options: [
          { edgeId: 'magic', flavorKey: 'forbidden-magic' },
          { edgeId: 'magic-item', flavorKey: 'accursed-relic', presetSubChoice: 'Accursed Relic' },
        ],
      },
      { options: [{ edgeId: 'intimidating' }, { edgeId: 'keen' }, { edgeId: 'wealth' }] },
    ],
  },
  {
    id: 'infernal-summoner',
    name: 'The Infernal Summoner',
    aspect: 'Sorcery',
    always: { edgeId: 'magic', flavorKey: 'summoning', presetSubChoice: 'Summoning' },
    questions: [
      { options: [{ edgeId: 'lorewise' }, { edgeId: 'familiar' }] },
      { options: [{ edgeId: 'ardent' }, { edgeId: 'beautiful' }, { edgeId: 'learned' }] },
    ],
  },
  {
    id: 'last-ilf',
    name: 'The Last Ilf',
    aspect: 'Sorcery',
    always: { edgeId: 'ilf' },
    questions: [
      { options: [{ edgeId: 'magic' }, { edgeId: 'magic-weapon' }] },
      { options: [{ edgeId: 'beautiful' }, { edgeId: 'cunning' }, { edgeId: 'quiet' }] },
    ],
  },
  {
    id: 'quack-alchemist',
    name: 'The Quack Alchemist',
    aspect: 'Sorcery',
    always: { edgeId: 'magic-item', flavorKey: 'potions', presetSubChoice: 'Potions' },
    questions: [
      { options: [{ edgeId: 'lorewise' }, { edgeId: 'naturewise' }] },
      { options: [{ edgeId: 'dexterous' }, { edgeId: 'keen' }, { edgeId: 'learned' }] },
    ],
  },
  {
    id: 'underground-druid',
    name: 'The Underground Druid',
    aspect: 'Sorcery',
    always: { edgeId: 'shapeshift' },
    questions: [
      { options: [{ edgeId: 'naturewise' }, { edgeId: 'mazewise' }] },
      { options: [{ edgeId: 'strong' }, { edgeId: 'keen' }, { edgeId: 'deadly' }] },
    ],
  },
  {
    id: 'wise-witch',
    name: 'The Wise Witch',
    aspect: 'Sorcery',
    always: { edgeId: 'magic' },
    questions: [
      { options: [{ edgeId: 'lorewise' }, { edgeId: 'naturewise' }] },
      { options: [{ edgeId: 'cunning' }, { edgeId: 'learned' }, { edgeId: 'familiar' }] },
    ],
  },
]

const BY_ID: Record<string, ClassDef> = Object.fromEntries(
  CLASSES.map((c) => [c.id, c]),
)

export function getClass(id: string): ClassDef {
  const def = BY_ID[id]
  if (!def) throw new Error(`Unknown class id: ${id}`)
  return def
}

export function classesByAspect(aspect: Aspect): ClassDef[] {
  return CLASSES.filter((c) => c.aspect === aspect)
}
