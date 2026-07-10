import { Wizard } from '../../../app/wizard/Wizard'
import { mazesWizard } from './config'
import type { CharacterDraft } from '../../rules/character'

export function CharacterWizard(props: {
  onExit: () => void
  onSaved: () => void
  editing?: { id: string; draft: CharacterDraft }
  characterCount: number
}) {
  return <Wizard config={mazesWizard} {...props} />
}
