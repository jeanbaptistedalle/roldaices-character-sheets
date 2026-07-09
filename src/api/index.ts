// Public surface of the data-layer seam. Components import from here.
export {
  saveCharacter,
  updateCharacter,
  listCharacters,
  deleteCharacter,
  type CharacterRecord,
  type NewCharacter,
  type CharacterUpdate,
} from './characters'

export {
  getCurrentProfile,
  getCurrentUserRole,
  type ProfileRecord,
  type UserRole,
} from './profiles'
