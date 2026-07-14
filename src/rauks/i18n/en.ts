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
      rauksorgPlaceholder: 'The Rauks unit this character belongs to',
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
  // French-native — see the rauks-rules skill). English below is a translated
  // DRAFT flagged for user review. Keyed on the stable domain id from
  // src/rauks/rules/*.ts — never on the rendered text. See
  // .claude/skills/rauks-rules/SKILL.md.
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
  },
}
