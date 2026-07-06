// The 24 example classes from the corebook. A class is a name (Adjective +
// Noun) that acts as an edge, plus 3 edges: one "always" edge and two questions.
// See .claude/skills/mazes-rules/SKILL.md.

import type { Aspect } from './aspects'

export interface ClassOption {
  edgeId: string
  /** Flavor label to display instead of the plain edge name (e.g. "Sworn Swords"). */
  label?: string
  /** A sub-choice the class fixes for you (e.g. magic school "Summoning"). */
  presetSubChoice?: string
}

export interface ClassEdge {
  edgeId: string
  label?: string
  presetSubChoice?: string
}

export interface ClassQuestion {
  prompt: string
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
      { prompt: 'As a dangerous fighter, are you…', options: [{ edgeId: 'agile' }, { edgeId: 'accurate' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'hale' }, { edgeId: 'fast' }, { edgeId: 'strong' }] },
    ],
  },
  {
    id: 'jaded-sellsword',
    name: 'The Jaded Sellsword',
    aspect: 'Sword',
    always: { edgeId: 'well-armed' },
    questions: [
      { prompt: 'As a mercenary soldier, do you have…', options: [{ edgeId: 'rank' }, { edgeId: 'wealth' }] },
      {
        prompt: 'Are you…',
        options: [
          { edgeId: 'lucky' },
          { edgeId: 'veteran' },
          { edgeId: 'retainers', label: 'Sworn Swords', presetSubChoice: 'Sworn Swords' },
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
      { prompt: 'As a road-weary archer, are you…', options: [{ edgeId: 'travelled' }, { edgeId: 'quiet' }] },
      {
        prompt: 'Are you…',
        options: [{ edgeId: 'naturewise' }, { edgeId: 'tough' }, { edgeId: 'familiar', label: 'Beast' }],
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
        prompt: 'As a hunter of vicious monsters, are you…',
        options: [{ edgeId: 'mazewise' }, { edgeId: 'retainers', label: 'Loyal Hounds', presetSubChoice: 'Loyal Hounds' }],
      },
      { prompt: 'Are you…', options: [{ edgeId: 'cunning' }, { edgeId: 'dexterous' }, { edgeId: 'strong' }] },
    ],
  },
  {
    id: 'outcast-bugbear',
    name: 'The Outcast Bugbear',
    aspect: 'Sword',
    always: { edgeId: 'bugbear' },
    questions: [
      { prompt: 'As a lone monster, are you…', options: [{ edgeId: 'deadly' }, { edgeId: 'armored' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'strong' }, { edgeId: 'tough' }, { edgeId: 'travelled' }] },
    ],
  },
  {
    id: 'reluctant-hero',
    name: 'The Reluctant Hero',
    aspect: 'Sword',
    always: { edgeId: 'young' },
    questions: [
      { prompt: 'As the chosen one, do you have a…', options: [{ edgeId: 'magic-weapon' }, { edgeId: 'magic-item' }] },
      { prompt: 'Do others say that you are…', options: [{ edgeId: 'beautiful' }, { edgeId: 'charming' }, { edgeId: 'lucky' }] },
    ],
  },
  {
    id: 'savage-barbarian',
    name: 'The Savage Barbarian',
    aspect: 'Sword',
    always: { edgeId: 'tough' },
    questions: [
      { prompt: 'As a lone hero, are you…', options: [{ edgeId: 'deadly' }, { edgeId: 'strong' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'ardent' }, { edgeId: 'hale' }, { edgeId: 'naturewise' }] },
    ],
  },
  {
    id: 'valiant-dragoon',
    name: 'The Valiant Dragoon',
    aspect: 'Sword',
    always: { edgeId: 'armored' },
    questions: [
      {
        prompt: 'As a heavily armored soldier, are you…',
        options: [{ edgeId: 'deadly' }, { edgeId: 'retainers', label: 'Shieldbearers', presetSubChoice: 'Shieldbearers' }],
      },
      { prompt: 'Are you…', options: [{ edgeId: 'ardent' }, { edgeId: 'strong' }, { edgeId: 'intimidating' }] },
    ],
  },

  // ----- Shadow -----
  {
    id: 'adventurous-smallfolk',
    name: 'The Adventurous Smallfolk',
    aspect: 'Shadow',
    always: { edgeId: 'smallfolk' },
    questions: [
      { prompt: 'As a small and stout adventurer, are you…', options: [{ edgeId: 'animalwise' }, { edgeId: 'shapeshift', label: 'Shapeshifter' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'charming' }, { edgeId: 'quiet' }, { edgeId: 'friends' }] },
    ],
  },
  {
    id: 'cursed-tomb-robber',
    name: 'The Cursed Tomb Robber',
    aspect: 'Shadow',
    always: { edgeId: 'mazewise' },
    questions: [
      {
        prompt: 'As a crypt explorer, are you…',
        options: [{ edgeId: 'gearwise' }, { edgeId: 'retainers', label: 'Torchbearers', presetSubChoice: 'Torchbearers' }],
      },
      { prompt: 'Are you…', options: [{ edgeId: 'cunning' }, { edgeId: 'dexterous' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'excellent-vagabond',
    name: 'The Excellent Vagabond',
    aspect: 'Shadow',
    always: { edgeId: 'travelled' },
    questions: [
      { prompt: 'As a wandering jack, are you…', options: [{ edgeId: 'charming' }, { edgeId: 'cunning' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'fast' }, { edgeId: 'lucky' }, { edgeId: 'friends' }] },
    ],
  },
  {
    id: 'filthy-urchin',
    name: 'The Filthy Urchin',
    aspect: 'Shadow',
    always: { edgeId: 'quiet' },
    questions: [
      { prompt: 'As a penniless beggar, are you…', options: [{ edgeId: 'streetwise' }, { edgeId: 'dexterous' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'agile' }, { edgeId: 'fast' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'nighthawk-assassin',
    name: 'The Nighthawk Assassin',
    aspect: 'Shadow',
    always: { edgeId: 'deadly' },
    questions: [
      { prompt: 'As a hard killer, are you…', options: [{ edgeId: 'accurate' }, { edgeId: 'quiet' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'agile' }, { edgeId: 'fast' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'puzzling-locksmith',
    name: 'The Puzzling Locksmith',
    aspect: 'Shadow',
    always: { edgeId: 'gearwise' },
    questions: [
      { prompt: 'As a door cracker and riddler, are you carrying…', options: [{ edgeId: 'tools' }, { edgeId: 'learned' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'streetwise' }, { edgeId: 'keen' }, { edgeId: 'quiet' }] },
    ],
  },
  {
    id: 'talented-thief',
    name: 'The Talented Thief',
    aspect: 'Shadow',
    always: { edgeId: 'streetwise' },
    questions: [
      { prompt: 'As a scofflaw and a footpad, are you…', options: [{ edgeId: 'accurate' }, { edgeId: 'quiet' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'agile' }, { edgeId: 'charming' }, { edgeId: 'keen' }] },
    ],
  },
  {
    id: 'zealous-cultist',
    name: 'The Zealous Cultist',
    aspect: 'Shadow',
    always: { edgeId: 'lorewise' },
    questions: [
      {
        prompt: 'As a seeker of dark knowledge, do you have…',
        options: [
          { edgeId: 'retainers', label: 'Mad Followers', presetSubChoice: 'Mad Followers' },
          { edgeId: 'familiar', label: 'a dark Familiar' },
        ],
      },
      { prompt: 'Are you…', options: [{ edgeId: 'intimidating' }, { edgeId: 'old' }, { edgeId: 'rank' }] },
    ],
  },

  // ----- Sorcery -----
  {
    id: 'blazing-magician',
    name: 'The Blazing Magician',
    aspect: 'Sorcery',
    always: { edgeId: 'magic' },
    questions: [
      { prompt: 'As a channeler of raw power, are you…', options: [{ edgeId: 'accurate' }, { edgeId: 'armored' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'ardent' }, { edgeId: 'strong' }, { edgeId: 'tough' }] },
    ],
  },
  {
    id: 'guild-mage',
    name: 'The Guild Mage',
    aspect: 'Sorcery',
    always: { edgeId: 'magic' },
    questions: [
      { prompt: 'As an arcane conjuror, do you have a…', options: [{ edgeId: 'familiar' }, { edgeId: 'magic-item' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'learned' }, { edgeId: 'travelled' }, { edgeId: 'naturewise' }] },
    ],
  },
  {
    id: 'haunted-librarian',
    name: 'The Haunted Librarian',
    aspect: 'Sorcery',
    always: { edgeId: 'lorewise' },
    questions: [
      {
        prompt: 'As a seeker of dark secrets, do you practice…',
        options: [
          { edgeId: 'magic', label: 'Forbidden Magic' },
          { edgeId: 'magic-item', label: 'Accursed Relic', presetSubChoice: 'Accursed Relic' },
        ],
      },
      { prompt: 'Are you…', options: [{ edgeId: 'intimidating' }, { edgeId: 'keen' }, { edgeId: 'wealth' }] },
    ],
  },
  {
    id: 'infernal-summoner',
    name: 'The Infernal Summoner',
    aspect: 'Sorcery',
    always: { edgeId: 'magic', label: 'Summoning', presetSubChoice: 'Summoning' },
    questions: [
      { prompt: 'As a diabolist, are you…', options: [{ edgeId: 'lorewise' }, { edgeId: 'familiar' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'ardent' }, { edgeId: 'beautiful' }, { edgeId: 'learned' }] },
    ],
  },
  {
    id: 'last-ilf',
    name: 'The Last Ilf',
    aspect: 'Sorcery',
    always: { edgeId: 'ilf' },
    questions: [
      { prompt: 'As one of the forgotten, do you…', options: [{ edgeId: 'magic' }, { edgeId: 'magic-weapon' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'beautiful' }, { edgeId: 'cunning' }, { edgeId: 'quiet' }] },
    ],
  },
  {
    id: 'quack-alchemist',
    name: 'The Quack Alchemist',
    aspect: 'Sorcery',
    always: { edgeId: 'magic-item', label: 'Potions', presetSubChoice: 'Potions' },
    questions: [
      { prompt: 'As a charlatan and snake oil seller, are you…', options: [{ edgeId: 'lorewise' }, { edgeId: 'naturewise' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'dexterous' }, { edgeId: 'keen' }, { edgeId: 'learned' }] },
    ],
  },
  {
    id: 'underground-druid',
    name: 'The Underground Druid',
    aspect: 'Sorcery',
    always: { edgeId: 'shapeshift' },
    questions: [
      { prompt: 'As a servant of the underground world, are you…', options: [{ edgeId: 'naturewise' }, { edgeId: 'mazewise' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'strong' }, { edgeId: 'keen' }, { edgeId: 'deadly' }] },
    ],
  },
  {
    id: 'wise-witch',
    name: 'The Wise Witch',
    aspect: 'Sorcery',
    always: { edgeId: 'magic' },
    questions: [
      { prompt: 'As a soothsayer, are you…', options: [{ edgeId: 'lorewise' }, { edgeId: 'naturewise' }] },
      { prompt: 'Are you…', options: [{ edgeId: 'cunning' }, { edgeId: 'learned' }, { edgeId: 'familiar' }] },
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
