import { type Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { PortraitPicker } from '../../../../shared/portraits'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { StepShell } from '../ui'

const inputClass =
  'mt-1 w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none disabled:opacity-50'

export function IdentityStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const { t } = useTranslation('rauks')
  return (
    <StepShell
      eyebrow={t('steps.identity.eyebrow')}
      title={t('steps.identity.title')}
      intro={t('steps.identity.intro')}
    >
      <div className="mx-auto max-w-xl space-y-6">
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
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">
            {t('steps.identity.originLabel')}
          </span>
          <input
            type="text"
            value={draft.imperial ? t('steps.identity.imperialValue') : draft.origin ?? ''}
            disabled={draft.imperial}
            onChange={(e) => dispatch({ type: 'setOrigin', origin: e.target.value })}
            placeholder={t('steps.identity.originPlaceholder')}
            className={inputClass}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(draft.imperial)}
            onChange={(e) => dispatch({ type: 'setImperial', value: e.target.checked })}
            className="h-4 w-4 rounded border-border bg-surface-inset accent-accent"
          />
          <span className="text-sm text-ink-secondary">{t('steps.identity.imperialLabel')}</span>
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-ink-secondary">
              {t('steps.identity.sexLabel')}
            </span>
            <input
              type="text"
              value={draft.sex ?? ''}
              onChange={(e) => dispatch({ type: 'setSex', sex: e.target.value })}
              placeholder={t('steps.identity.sexPlaceholder')}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink-secondary">
              {t('steps.identity.birthDateLabel')}
            </span>
            <input
              type="text"
              value={draft.birthDate ?? ''}
              onChange={(e) => dispatch({ type: 'setBirthDate', birthDate: e.target.value })}
              placeholder={t('steps.identity.birthDatePlaceholder')}
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">
            {t('steps.identity.rauksorgLabel')}
          </span>
          <input
            type="text"
            value={draft.rauksorg ?? ''}
            onChange={(e) => dispatch({ type: 'setRauksorg', rauksorg: e.target.value })}
            placeholder={t('steps.identity.rauksorgPlaceholder')}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">
            {t('steps.identity.descriptionLabel')}
          </span>
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => dispatch({ type: 'setDescription', description: e.target.value })}
            placeholder={t('steps.identity.descriptionPlaceholder')}
            rows={4}
            className={inputClass + ' resize-y'}
          />
        </label>

        <div>
          <span className="text-sm font-semibold text-ink-secondary">
            {t('steps.identity.traitsAndTrauma.label')}
          </span>
          <p className="mt-1 text-xs text-ink-muted">{t('steps.identity.traitsAndTrauma.hint')}</p>
          <div className="mt-3 space-y-2">
            {draft.traitsAndTrauma.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    dispatch({ type: 'setTraitAndTrauma', index, value: e.target.value })
                  }
                  placeholder={t(`steps.identity.traitsAndTrauma.placeholder${index}` as any)}
                  className={inputClass + ' flex-1'}
                />
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'removeTraitAndTrauma', index })}
                  aria-label={t('steps.identity.traitsAndTrauma.removeAria')}
                  className="shrink-0 rounded-lg border border-border px-3 py-2 text-ink-secondary hover:border-accent/50"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {draft.traitsAndTrauma.length < 4 && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'addTraitAndTrauma' })}
              className="mt-3 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-ink-secondary hover:border-accent/50"
            >
              {t('steps.identity.traitsAndTrauma.add')}
            </button>
          )}
        </div>

        <PortraitPicker
          value={draft.imageUri ?? ''}
          onChange={(imageUri) => dispatch({ type: 'setImage', imageUri })}
        />
      </div>
    </StepShell>
  )
}
