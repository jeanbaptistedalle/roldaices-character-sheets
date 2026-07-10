import { useEffect, useMemo, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { isAtLimit, MAX_CHARACTERS_PER_SYSTEM } from '../limits'
import { getSystemT } from '../system'
import { ProgressSteps, cn } from './ui'
import {
  makeInitWizardState,
  makeWizardReducer,
  type WizardConfig,
} from './WizardState'

export interface WizardProps<Draft, Action> {
  config: WizardConfig<Draft, Action>
  onExit: () => void
  onSaved: () => void
  editing?: { id: string; draft: Draft }
  characterCount: number
}

export function Wizard<Draft, Action>({
  config,
  onExit,
  onSaved,
  editing,
  characterCount,
}: WizardProps<Draft, Action>) {
  const { t, i18n } = useTranslation('common')
  const stepT = getSystemT(i18n, config.i18nNs)
  const reducer = useMemo(() => makeWizardReducer(config), [config])
  const init = useMemo(() => makeInitWizardState(config.emptyDraft), [config])
  // Edit mode opens on the terminal (recap) step. Key off the `terminal` flag
  // rather than position so a config with a non-last terminal step still works.
  const terminalIndex = config.steps.findIndex((s) => s.terminal)
  const recapIndex = terminalIndex === -1 ? config.steps.length - 1 : terminalIndex
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    editing ? init(editing.draft, recapIndex) : init(),
  )
  const step = config.steps[state.stepIndex]

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [state.stepIndex])

  const isFirst = state.stepIndex === 0
  const isTerminal = Boolean(step.terminal)
  const canNext = step.canAdvance(state.draft)
  const atLimit = isAtLimit(characterCount, Boolean(editing))

  return (
    <div className="flex-1 bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="text-sm text-stone-500 transition-colors hover:text-amber-400"
          >
            {t('wizard.home')}
          </button>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/70">
            {t('wizard.heading')}
          </span>
          <span className="w-12" />
        </div>

        <ProgressSteps
          steps={config.steps.map((s) => ({
            key: s.key,
            // `label` is a plain `string` (it may be a real translation key,
            // e.g. for Mazes, or a literal fallback label a system hasn't
            // localized yet, e.g. Rauks) — too dynamic for the strictly
            // key-typed `stepT`, hence the escape hatch here.
            label: stepT(s.label as never),
          }))}
          current={state.stepIndex}
          onGoto={(stepIndex) => dispatch({ type: 'goto', stepIndex })}
        />

        {atLimit && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          >
            {t('wizard.atLimit', { max: MAX_CHARACTERS_PER_SYSTEM })}
          </div>
        )}

        {step.render({ draft: state.draft, dispatch, atLimit, onSaved, editId: editing?.id })}

        {!isTerminal && (
          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => dispatch({ type: 'back' })}
              disabled={isFirst}
              className={cn(
                'rounded-lg border px-6 py-2.5 font-semibold transition-colors',
                isFirst
                  ? 'invisible'
                  : 'border-stone-700 text-stone-200 hover:border-amber-600/50',
              )}
            >
              {t('wizard.back')}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'next' })}
              disabled={!canNext}
              className={cn(
                'rounded-lg px-8 py-2.5 font-semibold transition-colors',
                canNext
                  ? 'bg-amber-600 text-stone-950 hover:bg-amber-500'
                  : 'cursor-not-allowed bg-stone-800 text-stone-600',
              )}
            >
              {t('wizard.next')}
            </button>
          </div>
        )}
        {isTerminal && (
          <div className="mt-10 flex justify-start">
            <button
              type="button"
              onClick={() => dispatch({ type: 'back' })}
              className="rounded-lg border border-stone-700 px-6 py-2.5 font-semibold text-stone-200 hover:border-amber-600/50"
            >
              {t('wizard.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
