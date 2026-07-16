import { rauksEn } from './en'

export const rauksFr: typeof rauksEn = {
  name: 'Rauks',
  publisher: 'Thibaut & Quentin Constant',
  tagline: 'Incarnez un chevalier-enquêteur d’élite de l’Empire mondial.',
  home: {
    title: 'Feuilles de personnage Rauks',
    subtitle:
      'Créez un Rauks : un chevalier-enquêteur d’élite de l’Empire mondial. Répartissez vos caractéristiques, choisissez vos compétences, et acceptez le contrat.',
    noSkills: 'Aucune compétence',
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
      rauksorgPlaceholder: 'ex. Lille',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Une courte description, un passé, ou un trait particulier…',
      traitsAndTrauma: {
        label: 'Traits/trauma',
        hint: 'Les cicatrices, habitudes et marques que votre personnage accumule en jouant — une courte expression de deux ou trois mots. Un Rauks gagne en général un nouveau trait/trauma après chaque séance.',
        placeholder0: 'ex. Artisan potier émérite',
        placeholder1: 'ex. Mains tremblantes',
        placeholder2: 'ex. Héros populaire',
        placeholder3: 'ex. Terreur nocturne',
        add: 'Ajouter un trait/trauma',
        removeAria: 'Supprimer ce trait/trauma',
      },
    },
    recap: {
      label: 'Récapitulatif',
      eyebrow: 'Étape 4',
      titleFallback: 'Votre personnage',
      skillsHeading: 'Compétences',
      equipmentLabel: 'Équipement standard',
      standardEquipment: [
        'Revolver à air comprimé Rauks sur mesure',
        'Harnais tactique',
        'Passeport',
        'Portefeuille',
        'Montre tactique',
        'Carnet',
      ],
      saveCharacter: 'Enregistrer le personnage',
      saveChanges: 'Enregistrer les modifications',
      saving: 'Enregistrement…',
      loginToSave: 'Connectez-vous pour enregistrer',
      limitReached: 'Limite de personnages atteinte',
      awaitingValidation: 'Attendez qu’un admin valide votre compte',
      startOver: 'Recommencer',
      saveError: "Impossible d'enregistrer ce personnage. Réessayez.",
      limitMessage:
        "Vous avez atteint la limite de {{max}} personnages. Supprimez-en un avant d'en enregistrer un nouveau.",
      guestMessage:
        'Votre compte n’est pas encore validé, vous ne pouvez donc pas enregistrer de personnages. Rejoignez notre serveur Discord (ou demandez à un admin) pour obtenir l’accès.',
    },
  },
  // Vocabulaire des règles — français authentique, tiré de la compétence
  // rauks-rules (JDR - Rauksorg - V4 Karma et dé noir).
  terms: {
    characteristics: {
      physical: 'Physique',
      perception: 'Perception',
      mental: 'Mental',
      charisma: 'Charisme',
      competence: 'Compétences',
      rerolls: 'Relances',
    },
    dice: {
      bleu: 'Bleu',
      orange: 'Orange',
      rouge: 'Rouge',
      noir: 'Noir',
    },
    skillCategories: {
      Physical: 'Physique',
      Perception: 'Perception',
      Mental: 'Mental',
      Social: 'Social',
      Karma: 'Karma',
    },
    skills: {
      gorilla: 'Gorille',
      athlete: 'Athlète',
      'death-cheater': 'Trompe la Mort',
      'rauks-maga': 'Rauks-Maga',
      'weapon-master': "Maître d'arme",
      'sixth-sense': 'Sixième Sens',
      mongoose: 'Mangouste',
      'sleight-of-hand': 'Filouterie',
      shadow: 'Ombre',
      gunslinger: 'Pistolero',
      marksman: "Tireur d'élite",
      anticipation: 'Anticipation',
      'master-tactician': 'Maître Tacticien',
      'forensics-expert': 'Expert',
      'rauks-medicine': 'Médecine Rauks',
      pharmacologist: 'Pharmacologue',
      lawyer: 'Juriste',
      engineer: 'Ingénieur',
      tracker: 'Pistage',
      trapper: 'Spécialiste des Pièges',
      coordinator: 'Coordinateur',
      hypnosis: 'Hypnose',
      'fatal-beauty': 'Beauté fatale',
      profiler: 'Profiler',
      'natural-authority': 'Autorité naturelle',
      'dog-handler': 'Maître chien',
      acting: 'Comédie',
      'immaculate-reputation': 'Réputation immaculée',
      'born-lucky': 'Le cul bordé de nouilles',
    },
    karma: 'Karma',
    // Descriptions des caractéristiques — source : rulebook Rauksorg (V4).
    traitDescriptions: {
      physical: 'Force, endurance, résistance, agilité et combat au corps à corps.',
      perception: 'Sens, réflexes, dextérité, discrétion et tir à distance.',
      mental: 'Savoir, logique, secourisme, bricolage et investigation.',
      charisma: 'Persuader, charmer, mentir, intimider et cerner les intentions.',
      competence: '= nombre de compétences que vous pouvez choisir.',
      rerolls: '= jetons de relance et leur récupération.',
    },
    // Descriptions des compétences — source : rulebook Rauksorg (V4), Partie 2.
    skillDescriptions: {
      gorilla:
        'Force quasi-simiesque : enfonce les portes, projette des objets lourds, porte des attaques brutales à gros dégâts. Très intimidant.',
      athlete:
        'Mobilité de sportif extrême — parkour, escalade, natation, planeur. Distance ou rattrape n’importe qui. Dès le tour 2, une action bonus en fin de tour sur un jet de Physique de plus en plus dur.',
      'death-cheater':
        'Contrôle physiologique exceptionnel. Une fois par combat, résiste à une neutralisation et reste conscient ; la blessure s’applique pleinement après le combat.',
      'rauks-maga':
        'Corps à corps rauks : frappes rapides, soumissions non létales, combat au sol, étranglements. Permet aussi d’utiliser l’arme à pression au corps à corps de façon létale (impossible sans elle).',
      'weapon-master':
        'Maîtrise des lames : crée une zone de mort — quiconque entre dans son cercle de combat peut être frappé automatiquement via un jet d’opposition, la difficulté augmentant avec le nombre d’assaillants.',
      'sixth-sense':
        'Sens exacerbés et véritable sixième sens : ressent le danger, localise des personnes à travers les murs. Les informations peuvent être cryptiques ; inutilisable pour les lectures sociales.',
      mongoose:
        'Réflexes quasi surhumains : action bonus en début de combat sur un jet réussi ; peut forcer l’initiative sur l’action annoncée d’un autre personnage, dans n’importe quelle scène.',
      'sleight-of-hand':
        'Prestidigitation et pickpocket hors pair — subtilise ou glisse des objets, sabote le matériel ou l’arme d’un adversaire — et crochète les serrures.',
      shadow:
        'Discrétion et vitesse : échappe à la vigilance de ceux qui le surveillent ; en combat, se déplace pour briser la ligne de vue même après avoir attaqué.',
      gunslinger:
        'Tir rapide : trois tirs en un tour, chacun à +1 rang de difficulté. Lance les trois dés d’un coup et relance ceux qu’il veut.',
      marksman:
        'Précision à longue portée : désarme, fait ricocher, ou tire entre plusieurs alliés.',
      anticipation:
        'Une fois par session, annule un ou plusieurs événements (réputés anticipés et pas encore survenus) pour retenter une approche. La narration fixée par les critiques ou les jets de chance demeure ; les relances dépensées sont perdues.',
      'master-tactician':
        'Expert de la défense : bénéficie toujours d’un jet d’opposition face aux attaques à distance ; repère les points faibles pour amplifier ses attaques ou celles de ses alliés.',
      'forensics-expert': 'Criminologie : empreintes digitales, balistique et preuves scientifiques.',
      'rauks-medicine':
        'Soigne les blessures graves, évite les séquelles, parfois réanime ; empêche les pertes de caractéristiques ; peut autopsier pour déterminer la cause de la mort.',
      pharmacologist:
        'Fabrique anesthésiants, poisons et stimulants (liquides, solides ou gazeux) sur un temps mort ; explosifs rudimentaires ; expert en science et en chimie.',
      lawyer:
        'Analyse l’ordonnancement juridique d’une ville pour l’exploiter, trouve des failles et de vieilles règles oubliées, et excelle à faire condamner un suspect.',
      engineer: 'Bricoleur expert : mécanique, électronique et science appliquée.',
      tracker:
        'Suit les traces d’une personne ou d’un groupe et remonte une piste ; doué pour la survie en pleine nature.',
      trapper:
        'Pose, désamorce et repère les pièges — câbles tendus, collets, fosses, pièges explosifs. Un piège ne fait pas le tri et peut blesser un innocent.',
      coordinator:
        'Monte un réseau local d’auxiliaires (3 à 10 recrues, davantage dans les grandes villes) pour porter des messages, s’informer, observer, déplacer des marchandises ou assurer une défense légère.',
      hypnosis:
        'Hypnose agressive : suggestions, sommeil profond, suppression de la douleur, affaiblissement de la volonté ou altération de la mémoire. Les effets les plus puissants peuvent exiger un jet de chance ; peut passer pour une agression aux yeux des témoins.',
      'fatal-beauty': 'Beauté stupéfiante et techniques de séduction. Contenu réservé aux adultes.',
      profiler:
        'Après observation, cerne l’honnêteté, le caractère et les méthodes d’une personne ; déduit un coupable à partir d’indices. Maître de l’interrogatoire.',
      'natural-authority':
        'Présence qui commande : dirige les PNJ qui assistent le groupe et peut soulever une foule de civils ; peut imposer des actions aux membres du groupe et dépenser ses propres relances pour relancer les jets de ses alliés. Forte intimidation.',
      'dog-handler':
        'Un chien rauks dressé, doté des caractéristiques du maître mais limité à des actions de chien ; les ordres complexes exigent des jets de « maître chien » ; le résultat « Rauks! » est toujours un échec pour le chien. Fragile et irremplaçable en cours d’aventure.',
      acting:
        'Comédie et déguisement — change de déguisement caché en quelques secondes, même dans une foule. Menteur né.',
      'immaculate-reputation':
        'Renommé : +1 sur le Karma du groupe pour les jets de réputation (sans jamais dépasser 4) ; on ne retient que ses exploits.',
      'born-lucky':
        'Chance incroyable : +1 sur le Karma du groupe pour les jets de chance (sans jamais dépasser 4).',
    },
    // Équipement accordé par certaines compétences — source : rulebook (V4).
    skillGear: {
      'weapon-master': 'Un sabre.',
      marksman: 'Une carabine de précision à poudre noire et 5 cartouches (~300 m).',
      'forensics-expert': 'Un appareil photo à impression instantanée et un kit de relevé d’empreintes.',
      'rauks-medicine': 'Un kit de médecine Rauks.',
      pharmacologist: 'Un kit de pharmacologie et deux préparations offertes au départ.',
      trapper: 'Des câbles fins en nylon et une pelle pliable.',
      acting: 'Un déguisement passe-partout.',
    },
  },
}

export default rauksFr
