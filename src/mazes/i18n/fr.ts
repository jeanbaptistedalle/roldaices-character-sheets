import { mazesEn } from './en'

export const mazesFr: typeof mazesEn = {
  name: 'Dédales',
  publisher: 'Les XII singes',
  tagline: 'TODO', // official Dédales tagline — see Open items
  home: {
    title: 'Feuilles de personnage Dédales',
    subtitlePrefix: 'Créez un personnage pour ',
    subtitleName: 'Dédales',
    subtitleSuffix:
      ', un jeu de rôle fantastique zéro-préparation. Assignez vos dés, choisissez votre rôle, et plongez dans le labyrinthe.',
  },
  steps: {
    role: {
      label: 'Rôle',
      eyebrow: 'Étape 1',
      title: 'Choisissez votre rôle',
      intro:
        'Votre rôle, c’est votre dé. Choisissez-le selon ce que vous voulez faire en jeu.',
    },
    aspect: {
      label: 'Aspect',
      eyebrow: 'Étape 2',
      title: 'Choisissez votre aspect',
      intro:
        'Comment résolvez-vous vos problèmes ? Votre aspect détermine votre équipement et les classes qui vous sont ouvertes.',
    },
    class: {
      label: 'Classe',
      eyebrow: 'Étape 3',
      title: 'Choisissez votre classe',
      intro:
        'Classes {{aspect}}. Votre classe est un nom descriptif qui vous accorde vos trois atouts.',
    },
    edges: {
      // TODO: le libellé "Atouts" est une traduction courante provisoire —
      // à confirmer avec le terme officiel Dédales à la Tâche 8.
      label: 'Atouts',
      eyebrow: 'Étape 4',
      title: 'Choisissez vos atouts',
      intro: 'Répondez aux questions de {{className}} pour fixer vos trois atouts.',
      setLabel: 'Défini :',
      nameOptional: 'Nommez-le (facultatif) :',
      namePlaceholder: 'Nommez votre {{edge}}',
      choosePlace: 'Choisissez un lieu :',
      chooseDomain: 'Choisissez un domaine :',
      required: '(obligatoire)',
      orNameSchool: '…ou nommez une école à la place :',
      schoolPlaceholder: 'ex. Nécromancie',
    },
    identity: {
      label: 'Identité',
      eyebrow: 'Étape 5',
      title: 'Nommez votre personnage',
      intro: 'Donnez une identité à votre personnage. Le nom est obligatoire ; le reste est libre.',
      nameLabel: 'Nom',
      namePlaceholder: 'ex. Loupdefer',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Une courte description, un passé, ou un trait particulier…',
    },
    recap: {
      label: 'Récapitulatif',
      eyebrow: 'Étape 6',
      titleFallback: 'Votre personnage',
      whatHits: 'Ce que touche votre {{die}}',
      saveCharacter: 'Enregistrer le personnage',
      saveChanges: 'Enregistrer les modifications',
      saving: 'Enregistrement…',
      loginToSave: 'Connectez-vous pour enregistrer',
      limitReached: 'Limite de personnages atteinte',
      startOver: 'Recommencer',
      saveError: "Impossible d'enregistrer ce personnage. Réessayez.",
      limitMessage:
        "Vous avez atteint la limite de {{max}} personnages. Supprimez-en un avant d'en enregistrer un nouveau.",
    },
  },
}
