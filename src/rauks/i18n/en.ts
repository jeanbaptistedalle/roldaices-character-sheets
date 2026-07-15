export const rauksEn = {
  name: 'Rauks',
  publisher: 'Thibaut & Quentin Constant',
  tagline: 'Play an elite investigator-knight of the World Empire.',
  home: {
    title: 'Rauks Character Sheets',
    subtitle:
      'Build a Rauks: an elite investigator-knight of the World Empire. Assign your traits, choose your skills, and take the contract.',
  },
  rerollSuffix_one: 'reroll',
  rerollSuffix_other: 'rerolls',
  steps: {
    traits: {
      label: 'Traits',
      eyebrow: 'Step 1',
      title: 'Assign your traits',
      intro: 'Each trait runs 1–4 (2 is normal). Spend all 18 points. One trait may drop to 1.',
      groupRoll: 'Roll traits',
      groupBudget: 'Budget traits',
      pointsRemaining_one: '{{count}} point remaining',
      pointsRemaining_other: '{{count}} points remaining',
      decreaseAria: 'Decrease {{trait}}',
      increaseAria: 'Increase {{trait}}',
    },
    skills: {
      label: 'Skills',
      eyebrow: 'Step 2',
      title: 'Choose your skills',
      intro: 'Your Competence trait sets how many skills you may pick — no more, no fewer.',
      counter: '{{picked}} / {{budget}} skills',
      gear: 'Gear: {{gear}}',
    },
    identity: {
      label: 'Identity',
      eyebrow: 'Step 3',
      title: 'Fill in the passport',
      intro: 'A name is required; the rest of the passport is up to you.',
      nameLabel: 'Name',
      namePlaceholder: 'e.g. Arakel Sarif',
      originLabel: 'Origin',
      originPlaceholder: 'City or culture of origin',
      imperialLabel: 'Imperial origin (no city — the Empire itself)',
      imperialValue: 'Imperial',
      sexLabel: 'Sex',
      sexPlaceholder: 'Declarative',
      birthDateLabel: 'Birth date',
      birthDatePlaceholder: 'Imperial calendar, e.g. 3rd of the 2nd month',
      rauksorgLabel: 'Rauksorg',
      rauksorgPlaceholder: 'e.g. Lille',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'A short description, backstory, or notable quirk…',
    },
    recap: {
      label: 'Recap',
      eyebrow: 'Step 4',
      titleFallback: 'Your character',
      introSkill_one: '{{count}} skill',
      introSkill_other: '{{count}} skills',
      skillsHeading: 'Skills',
      equipmentLabel: 'Standard equipment:',
      standardEquipment:
        'Tactical harness, bespoke Rauks pressure revolver, passport, wallet, tactical watch, and a notebook.',
      saveCharacter: 'Save character',
      saveChanges: 'Save changes',
      saving: 'Saving…',
      loginToSave: 'Log in to save',
      limitReached: 'Character limit reached',
      startOver: 'Start over',
      saveError: "Couldn't save your character. Try again.",
      limitMessage:
        "You've reached the limit of {{max}} characters. Delete one before saving a new character.",
    },
  },
  // Rules vocabulary. French is the authoritative source (the game is
  // French-native — see the rauks-rules skill). English below was reviewed
  // against the rulebook (JDR - Rauksorg - V4). A few labels intentionally
  // diverge from a literal translation for clarity: `competence` → "Skills"
  // (the trait caps how many Skills you hold), `forensics-expert` → the bare FR
  // "Expert", and `born-lucky` renders the FR slang "le cul bordé de nouilles".
  // Keyed on the stable domain id from src/rauks/rules/*.ts — never on the
  // rendered text. See .claude/skills/rauks-rules/SKILL.md.
  terms: {
    // Keys mirror each characteristic's TraitKey exactly so render sites can
    // key off it directly (t(`terms.characteristics.${info.key}`)).
    characteristics: {
      physical: 'Physical',
      perception: 'Perception',
      mental: 'Mental',
      charisma: 'Charisma',
      // Deliberately "Skills" (not "Competence"): this characteristic sets
      // how many Skills the character may hold, and the recap view names it
      // that way — unify on one term instead of two English words for the
      // same trait.
      competence: 'Skills',
      rerolls: 'Rerolls',
    },
    // Difficulty-color dice. Not yet wired to a render site (no dice-roll UI
    // built), included so the term exists once that lands.
    dice: {
      bleu: 'Blue',
      orange: 'Orange',
      rouge: 'Red',
      noir: 'Black',
    },
    // The five skill categories (Skill.category) — a different casing/key set
    // than `characteristics` above, since "Physical" (category) and
    // "physical" (characteristic id) are distinct keys.
    skillCategories: {
      Physical: 'Physical',
      Perception: 'Perception',
      Mental: 'Mental',
      Social: 'Social',
      Karma: 'Karma',
    },
    // Skill names by id, from src/rauks/rules/skills.ts.
    skills: {
      gorilla: 'Gorilla',
      athlete: 'Athlete',
      'death-cheater': 'Death Cheater',
      'rauks-maga': 'Rauks-Maga',
      'weapon-master': 'Weapon Master',
      'sixth-sense': 'Sixth Sense',
      mongoose: 'Mongoose',
      'sleight-of-hand': 'Sleight of Hand',
      shadow: 'Shadow',
      gunslinger: 'Gunslinger',
      marksman: 'Marksman',
      anticipation: 'Anticipation',
      'master-tactician': 'Master Tactician',
      'forensics-expert': 'Forensics Expert',
      'rauks-medicine': 'Rauks Medicine',
      pharmacologist: 'Pharmacologist',
      lawyer: 'Lawyer',
      engineer: 'Engineer',
      tracker: 'Tracker',
      trapper: 'Trapper',
      coordinator: 'Coordinator',
      hypnosis: 'Hypnosis',
      'fatal-beauty': 'Fatal Beauty',
      profiler: 'Profiler',
      'natural-authority': 'Natural Authority',
      'dog-handler': 'Dog Handler',
      acting: 'Acting',
      'immaculate-reputation': 'Immaculate Reputation',
      'born-lucky': 'Born Lucky',
    },
    // Group resource, not per-character. Not yet wired to a render site.
    karma: 'Karma',
    // Trait descriptions — mirror rules/traits.ts. Rendered on the Traits step.
    traitDescriptions: {
      physical: 'Strength, endurance, agility, and melee fighting.',
      perception: 'Senses, reflexes, dexterity, stealth, and ranged shooting.',
      mental: 'Knowledge, logic, first aid, tinkering, and investigation.',
      charisma: 'Persuade, charm, lie, intimidate, and read intentions.',
      competence: '= number of Skills you may pick.',
      rerolls: '= reroll tokens and their recovery.',
    },
    // Skill descriptions — mirror rules/skills.ts. Rendered on the Skills step.
    skillDescriptions: {
      gorilla:
        'Gorilla-like strength: force doors, throw heavy objects, brutal high-damage attacks. Very intimidating.',
      athlete:
        'Extreme-sports mobility — parkour, climbing, swimming, glider. Outruns or catches anyone. From turn 2, a bonus action at end of each turn on an increasingly hard Physical roll.',
      'death-cheater':
        'Exceptional physiology control. Once per combat, resist a neutralization and stay conscious; the wound fully applies after combat.',
      'rauks-maga':
        'Rauks hand-to-hand: fast strikes, non-lethal submissions, ground fighting, chokes. Also lets you use the pressure weapon lethally in melee (impossible without it).',
      'weapon-master':
        'Blade mastery: creates a lethal zone — anyone entering the combat circle can be struck automatically via an opposition roll, difficulty rising as more enter.',
      'sixth-sense':
        'Hyper-senses plus a true sixth sense: feel danger, locate people through walls. Information can be cryptic; cannot be used for social reads.',
      mongoose:
        "Near-superhuman reflexes: a start-of-combat bonus action on a successful roll; can force initiative over another character's declared action in any scene.",
      'sleight-of-hand':
        "Prestidigitation and elite pickpocketing — take or plant objects, sabotage a foe's gear or weapon — plus lockpicking.",
      shadow:
        "Stealth and speed: escape watchers' vigilance; in combat, move to break line-of-sight even after attacking.",
      gunslinger:
        'Rapid fire: three shots in one turn, each at +1 difficulty rank. Roll all three dice at once and reroll any at will.',
      marksman: 'Long-range precision: disarm, ricochet, or shoot between allies.',
      anticipation:
        'Once per session, cancel one or more events (deemed anticipated and not yet occurred) to retry an approach. Narrative fixed by criticals or luck rolls persists; rerolls spent during it are lost.',
      'master-tactician':
        "Defensive expert: always gets an opposition roll versus ranged attacks; finds weak points to amplify allies' or own attacks.",
      'forensics-expert': 'Criminology: fingerprints, ballistics, and scientific evidence.',
      'rauks-medicine':
        'Heal grave wounds, prevent sequelae, sometimes resuscitate; prevents trait loss; can autopsy for cause of death.',
      pharmacologist:
        'Craft anesthetics, poisons, and stimulants (liquid, solid, or gas) during a lull; rudimentary explosives; science and chemistry expert.',
      lawyer:
        "Reads a city's legal order to exploit it, finds loopholes and forgotten old rules, and is good at getting a suspect convicted.",
      engineer: 'Expert tinkerer: mechanics, electronics, and applied science.',
      tracker: 'Track a person or group and hunt a trail; strong at wilderness survival.',
      trapper:
        'Set, disarm, and spot traps — tripwires, snares, pits, explosive traps. Traps are indiscriminate and may catch innocents.',
      coordinator:
        'Builds a local auxiliary network (3–10 helpers, more in big cities) for messages, information, observation, moving goods, and light defense.',
      hypnosis:
        'Aggressive hypnosis: suggestions, deep sleep, suppress pain, weaken will, or alter memory. The hardest effects may need a luck roll; it can look like an assault to witnesses.',
      'fatal-beauty': 'Stunning beauty and seduction techniques. Adults-only content.',
      profiler:
        "Read a person's honesty, character, and methods after observation; infer a perpetrator from clues. A master interrogator.",
      'natural-authority':
        "Commanding presence: directs assisting NPCs and can raise a civilian crowd; can impose actions on group members and spend own rerolls to reroll allies' rolls. Strong intimidation.",
      'dog-handler':
        'A trained Rauks dog with the master\'s traits but dog-only actions; complex commands need Dog Handler rolls; the "Rauks!" result always fails for the dog. Fragile and irreplaceable mid-adventure.',
      acting:
        'Impersonation and disguise — swap a hidden disguise in seconds, even in a crowd. A natural liar.',
      'immaculate-reputation':
        'Renowned: +1 over the group Karma on reputation rolls (never above 4); people remember only their exploits.',
      'born-lucky': 'Incredibly lucky: +1 over the group Karma on luck rolls (never above 4).',
    },
    // Gear granted by certain skills — mirror rules/skills.ts. Rendered on the
    // Skills step and the Recap.
    skillGear: {
      'weapon-master': 'A sabre.',
      marksman: 'A black-powder precision rifle and 5 cartridges (~300m).',
      'forensics-expert': 'An instant camera and a fingerprint kit.',
      'rauks-medicine': 'A Rauks medical kit.',
      pharmacologist: 'A pharmacology kit and two free preparations at start.',
      trapper: 'Nylon cables and a folding shovel.',
      acting: 'An all-purpose disguise.',
    },
  },
}

export default rauksEn
