import { type Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { PortraitPicker } from '../../../../shared/portraits'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { StepShell } from '../ui'

export function IdentityStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const { t } = useTranslation('mazes')
  return (
    <StepShell
      eyebrow={t('steps.identity.eyebrow')}
      title={t('steps.identity.title')}
      intro={t('steps.identity.intro')}
    >
      <div className="mx-auto max-w-xl space-y-6">
        {/* Name */}
        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">
            {t('steps.identity.nameLabel')} <span className="text-accent">*</span>
          </span>
          <input
            type="text"
            value={draft.name ?? ''}
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
            placeholder={t('steps.identity.namePlaceholder')}
            autoFocus
            className="mt-1 w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">
            {t('steps.identity.descriptionLabel')}
          </span>
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => dispatch({ type: 'setDescription', description: e.target.value })}
            placeholder={t('steps.identity.descriptionPlaceholder')}
            rows={4}
            className="mt-1 w-full resize-y rounded-lg border border-border bg-surface-inset px-3 py-2 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </label>

        {/* Portrait gallery */}
        <PortraitPicker
          value={draft.imageUri ?? ''}
          onChange={(imageUri) => dispatch({ type: 'setImage', imageUri })}
        />
      </div>
    </StepShell>
  )
}
