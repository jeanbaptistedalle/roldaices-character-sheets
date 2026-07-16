import { Wizard } from '../../../app/wizard/Wizard'
import type { StoredDraft } from '../../../app/wizard/draftStorage'
import { rauksWizard } from './config'
import type { CharacterDraft } from '../../rules/character'

export function CharacterWizard(props: {
  systemId: string
  onExit: () => void
  onSaved: () => void
  editing?: { id: string; draft: CharacterDraft }
  resume?: StoredDraft<CharacterDraft>
  characterCount: number
}) {
  return <Wizard config={rauksWizard} {...props} />
}
