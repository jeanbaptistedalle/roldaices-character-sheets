import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { ROLES } from '../../../rules/roles'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { SelectableCard, StepShell } from '../ui'

export function RoleStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const { t } = useTranslation('mazes')
  return (
    <StepShell
      eyebrow={t('steps.role.eyebrow')}
      title={t('steps.role.title')}
      intro={t('steps.role.intro')}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <SelectableCard
            key={role.id}
            selected={draft.role === role.id}
            onClick={() => dispatch({ type: 'setRole', role: role.id })}
            title={t(`terms.roles.${role.id}`)}
            badge={role.dieLabel}
          >
            <p className="text-stone-300">{role.blurb}</p>
            <ul className="mt-3 space-y-1 text-xs text-stone-500">
              {role.wants.map((want) => (
                <li key={want}>• {want}</li>
              ))}
            </ul>
          </SelectableCard>
        ))}
      </div>
    </StepShell>
  )
}
