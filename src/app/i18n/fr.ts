import { appEn } from './en'

export const appFr: typeof appEn = {
  brand: "Roldaice's character sheets",
  header: {
    logIn: 'Connexion',
    logOut: 'Déconnexion',
    github: 'Voir le code source sur GitHub',
  },
  picker: {
    subtitle:
      'Créez des personnages pour vos jeux de rôle sur table. Choisissez un système pour commencer.',
    characterCount_one: '{{count}} personnage',
    characterCount_other: '{{count}} personnages',
  },
  login: {
    title: 'Connexion',
    close: 'Fermer',
    discord: 'Continuer avec Discord',
    discordHint:
      'L’accès est réservé aux membres de notre serveur Discord. Connectez-vous avec Discord — si vous en faites partie, votre compte est mis à niveau automatiquement. Sinon, un admin peut vous valider.',
    errorDiscord: 'Impossible de démarrer la connexion Discord. Réessayez.',
  },
  confirm: {
    confirm: 'Confirmer',
    cancel: 'Annuler',
    busy: 'En cours…',
  },
  profile: {
    back: '← Retour',
    charactersHeading: 'Personnages',
    limitNote:
      'Vous pouvez créer jusqu’à {{max}} personnages par jeu. Sélectionnez un jeu pour l’ouvrir.',
    loading: 'Chargement…',
    loadError: 'Échec du chargement du profil.',
    roles: {
      admin: 'Admin',
      moderator: 'Modérateur',
      user: 'Membre',
      guest: 'Invité',
    },
  },
  wizard: {
    home: '← Accueil',
    heading: 'Création de personnage',
    back: 'Retour',
    next: 'Suivant',
    atLimit:
      'Vous avez atteint la limite de {{max}} personnages. Vous ne pourrez pas enregistrer celui-ci — supprimez d’abord un personnage existant.',
  },
  systemHome: {
    backToSystems: '← Systèmes',
    createCharacter: 'Créer un personnage',
    yourCharacters: 'Vos personnages',
    loading: 'Chargement…',
    loadError: 'Impossible de charger vos personnages. Réessayez plus tard.',
    empty: 'Aucun personnage pour le moment — créez le premier.',
    deleteTitle: 'Supprimer le personnage',
    delete: 'Supprimer',
    deleting: 'Suppression…',
    deleteError: 'Impossible de supprimer ce personnage. Réessayez.',
    editAria: 'Modifier {{name}}',
    deleteAria: 'Supprimer {{name}}',
    deleteConfirmPrefix: 'Supprimer ',
    deleteConfirmSuffix: ' ? Cette action est irréversible.',
  },
  lang: {
    toggleAria: 'Changer de langue',
    en: 'EN',
    fr: 'FR',
  },
} as const

export default appFr
