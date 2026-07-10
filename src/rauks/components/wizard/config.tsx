import { canAdvance, emptyDraft, type CharacterDraft } from '../../rules/character'
import type { WizardConfig } from '../../../app/wizard/WizardState'
import { draftReducer, type WizardAction } from './wizardReducer'
import { TraitsStep } from './steps/TraitsStep'
import { SkillsStep } from './steps/SkillsStep'
import { IdentityStep } from './steps/IdentityStep'
import { RecapStep } from './steps/RecapStep'

export const rauksWizard: WizardConfig<CharacterDraft, WizardAction> = {
  emptyDraft,
  draftReducer,
  i18nNs: 'rauks',
  steps: [
    {
      key: 'traits',
      label: 'steps.traits.label',
      canAdvance: (d) => canAdvance(d, 'traits'),
      render: ({ draft, dispatch }) => <TraitsStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'skills',
      label: 'steps.skills.label',
      canAdvance: (d) => canAdvance(d, 'skills'),
      render: ({ draft, dispatch }) => <SkillsStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'identity',
      label: 'steps.identity.label',
      canAdvance: (d) => canAdvance(d, 'identity'),
      render: ({ draft, dispatch }) => <IdentityStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'recap',
      label: 'steps.recap.label',
      terminal: true,
      canAdvance: () => true,
      render: ({ draft, dispatch, onSaved, editId, atLimit }) => (
        <RecapStep
          draft={draft}
          dispatch={dispatch}
          onSaved={onSaved}
          editId={editId}
          atLimit={atLimit}
        />
      ),
    },
  ],
}
