import { rauksEn } from './en'

export const rauksFr: typeof rauksEn = {
  name: 'Rauks',
  publisher: 'Thibaut & Quentin Constant',
  tagline: 'Incarnez un chevalier-enquêteur d’élite de l’Empire du Monde.',
  home: {
    title: 'Feuilles de personnage Rauks',
    subtitle:
      'Créez un Rauks : un chevalier-enquêteur d’élite de l’Empire du Monde. Répartissez vos caractéristiques, choisissez vos compétences, et acceptez le contrat.',
  },
  rerollSuffix_one: 'relance',
  rerollSuffix_other: 'relances',
  steps: {
    traits: {
      label: 'Caractéristiques',
      eyebrow: 'Étape 1',
      title: 'Répartissez vos caractéristiques',
      intro:
        'Chaque caractéristique va de 1 à 4 (2 est la valeur normale). Répartissez la totalité des 18 points. Une seule caractéristique peut descendre à 1.',
      groupRoll: 'Caractéristiques de jet',
      groupBudget: 'Caractéristiques de budget',
      pointsRemaining_one: '{{count}} point restant',
      pointsRemaining_other: '{{count}} points restants',
      decreaseAria: 'Diminuer {{trait}}',
      increaseAria: 'Augmenter {{trait}}',
    },
    skills: {
      label: 'Compétences',
      eyebrow: 'Étape 2',
      title: 'Choisissez vos compétences',
      intro:
        'Votre caractéristique de Compétence détermine le nombre de compétences que vous pouvez choisir — ni plus, ni moins.',
      counter: '{{picked}} / {{budget}} compétences',
      gear: 'Équipement : {{gear}}',
    },
    identity: {
      label: 'Identité',
      eyebrow: 'Étape 3',
      title: 'Remplissez le passeport',
      intro: 'Le nom est obligatoire ; le reste du passeport est libre.',
      nameLabel: 'Nom',
      namePlaceholder: 'ex. Arakel Sarif',
      originLabel: 'Origine',
      originPlaceholder: 'Ville ou culture d’origine',
      imperialLabel: 'Origine impériale (pas de ville — l’Empire lui-même)',
      imperialValue: 'Impérial',
      sexLabel: 'Sexe',
      sexPlaceholder: 'Déclaratif',
      birthDateLabel: 'Date de naissance',
      birthDatePlaceholder: 'Calendrier impérial, ex. 3e jour du 2e mois',
      rauksorgLabel: 'Rauksorg',
      rauksorgPlaceholder: 'L’unité Rauks à laquelle appartient ce personnage',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Une courte description, un passé, ou un trait particulier…',
    },
    recap: {
      label: 'Récapitulatif',
      eyebrow: 'Étape 4',
      titleFallback: 'Votre personnage',
      introSkill_one: '{{count}} compétence',
      introSkill_other: '{{count}} compétences',
      skillsHeading: 'Compétences',
      equipmentLabel: 'Équipement standard :',
      standardEquipment:
        'Harnais tactique, revolver à air comprimé Rauks sur mesure, passeport, portefeuille, montre tactique et un carnet.',
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
