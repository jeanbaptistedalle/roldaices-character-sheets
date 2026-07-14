import { type Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import type { CharacterDraft } from '../../../rules/character'
import {
  TRAITS, pointsRemaining, canIncrement, canDecrement, rerollTokens, type TraitInfo,
} from '../../../rules/traits'
import type { WizardAction } from '../wizardReducer'
import { StepShell, cn } from '../ui'

export function TraitsStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const { t } = useTranslation('rauks')
  const remaining = pointsRemaining(draft.traits)
  const groups: { group: TraitInfo['group']; title: string }[] = [
    { group: 'roll', title: t('steps.traits.groupRoll') },
    { group: 'budget', title: t('steps.traits.groupBudget') },
  ]

  return (
    <StepShell
      eyebrow={t('steps.traits.eyebrow')}
      title={t('steps.traits.title')}
      intro={t('steps.traits.intro')}
    >
      <div className="mx-auto max-w-xl space-y-8">
        <div
          data-testid="points-remaining"
          className={cn(
            'rounded-lg border px-4 py-3 text-center text-sm font-semibold',
            remaining === 0
              ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-300'
              : 'border-amber-800/60 bg-amber-950/20 text-amber-300',
          )}
        >
          {t('steps.traits.pointsRemaining', { count: remaining })}
        </div>

        {groups.map(({ group, title }) => (
          <div key={group}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
              {title}
            </h3>
            <div className="space-y-3">
              {TRAITS.filter((t) => t.group === group).map((t) => (
                <Stepper
                  key={t.key}
                  info={t}
                  value={draft.traits[t.key]}
                  canInc={canIncrement(draft.traits, t.key)}
                  canDec={canDecrement(draft.traits, t.key)}
                  onInc={() => dispatch({ type: 'setTrait', key: t.key, value: draft.traits[t.key] + 1 })}
                  onDec={() => dispatch({ type: 'setTrait', key: t.key, value: draft.traits[t.key] - 1 })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </StepShell>
  )
}

function Stepper({
  info,
  value,
  canInc,
  canDec,
  onInc,
  onDec,
}: {
  info: TraitInfo
  value: number
  canInc: boolean
  canDec: boolean
  onInc: () => void
  onDec: () => void
}) {
  const { t } = useTranslation('rauks')
  const label = t(`terms.characteristics.${info.key}`)
  return (
    <div className="flex items-center gap-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-stone-100">{label}</div>
        <div className="text-sm text-stone-500">{t(`terms.traitDescriptions.${info.key}`)}</div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          <StepButton
            label={t('steps.traits.decreaseAria', { trait: label })}
            disabled={!canDec}
            onClick={onDec}
          >
            −
          </StepButton>
          <span className="w-6 text-center text-2xl font-bold text-amber-400">{value}</span>
          <StepButton
            label={t('steps.traits.increaseAria', { trait: label })}
            disabled={!canInc}
            onClick={onInc}
          >
            +
          </StepButton>
        </div>
        {info.key === 'rerolls' && (
          <div
            data-testid="reroll-total"
            className="text-xs text-stone-500"
          >
            <span className="font-semibold text-amber-400">{rerollTokens(value)}</span>{' '}
            {t('rerollSuffix', { count: rerollTokens(value) })}
          </div>
        )}
      </div>
    </div>
  )
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg border text-xl font-bold transition-colors',
        disabled
          ? 'cursor-not-allowed border-stone-800 text-stone-700'
          : 'border-stone-700 text-stone-100 hover:border-amber-600/50 hover:text-amber-400',
      )}
    >
      {children}
    </button>
  )
}
