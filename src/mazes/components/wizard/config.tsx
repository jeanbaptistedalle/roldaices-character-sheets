import { canAdvance, emptyDraft, type CharacterDraft } from '../../rules/character'
import type { WizardConfig } from '../../../app/wizard/WizardState'
import { draftReducer, type WizardAction } from './wizardReducer'
import { RoleStep } from './steps/RoleStep'
import { AspectStep } from './steps/AspectStep'
import { ClassStep } from './steps/ClassStep'
import { EdgesStep } from './steps/EdgesStep'
import { IdentityStep } from './steps/IdentityStep'
import { RecapStep } from './steps/RecapStep'

export const mazesWizard: WizardConfig<CharacterDraft, WizardAction> = {
  emptyDraft,
  draftReducer,
  steps: [
    {
      key: 'role',
      label: 'Role',
      canAdvance: (d) => canAdvance(d, 'role'),
      render: ({ draft, dispatch }) => <RoleStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'aspect',
      label: 'Aspect',
      canAdvance: (d) => canAdvance(d, 'aspect'),
      render: ({ draft, dispatch }) => <AspectStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'class',
      label: 'Class',
      canAdvance: (d) => canAdvance(d, 'class'),
      render: ({ draft, dispatch }) => <ClassStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'edges',
      label: 'Edges',
      canAdvance: (d) => canAdvance(d, 'edges'),
      render: ({ draft, dispatch }) => <EdgesStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'identity',
      label: 'Identity',
      canAdvance: (d) => canAdvance(d, 'identity'),
      render: ({ draft, dispatch }) => <IdentityStep draft={draft} dispatch={dispatch} />,
    },
    {
      key: 'recap',
      label: 'Recap',
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
