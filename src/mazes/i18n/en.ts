export const mazesEn = {
  name: 'Mazes',
  publisher: '9th Level Games',
  tagline: 'A zero-prep introduction to fantasy roleplaying.',
  home: {
    title: 'Mazes Character Sheets',
    subtitlePrefix: 'Build a character for ',
    subtitleName: 'Mazes',
    subtitleSuffix:
      ', a zero-prep fantasy roleplaying game. Assign your dice, pick your role, and step into the maze.',
  },
  steps: {
    role: {
      label: 'Role',
      eyebrow: 'Step 1',
      title: 'Choose your role',
      intro: 'Your role is your die. Pick based on what you want to do in the game.',
    },
    aspect: {
      label: 'Aspect',
      eyebrow: 'Step 2',
      title: 'Choose your aspect',
      intro:
        'How do you solve your problems? Your aspect shapes your gear and the classes open to you.',
    },
    class: {
      label: 'Class',
      eyebrow: 'Step 3',
      title: 'Choose your class',
      intro: '{{aspect}} classes. Your class is a descriptive name and grants your three edges.',
    },
    edges: {
      // TODO: 'edges' label is a provisional common-word translation ("Atouts") —
      // confirm against the official Dédales term in Task 8.
      label: 'Edges',
      eyebrow: 'Step 4',
      title: 'Resolve your edges',
      intro: "Answer {{className}}'s questions to lock in your three edges.",
      setLabel: 'Set:',
      nameOptional: 'Name it (optional):',
      namePlaceholder: 'Name your {{edge}}',
      choosePlace: 'Choose a place:',
      chooseDomain: 'Choose a domain:',
      required: '(required)',
      orNameSchool: '…or name a school instead:',
      schoolPlaceholder: 'e.g. Necromancy',
    },
    identity: {
      label: 'Identity',
      eyebrow: 'Step 5',
      title: 'Name your character',
      intro: 'Give your character an identity. A name is required; the rest is up to you.',
      nameLabel: 'Name',
      namePlaceholder: 'e.g. Ironwolf',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'A short description, backstory, or notable quirk…',
    },
    recap: {
      label: 'Recap',
      eyebrow: 'Step 6',
      titleFallback: 'Your character',
      whatHits: 'What your {{die}} hits',
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
}
