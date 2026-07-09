import { useReducer } from 'react'
import type { CharacterDraft } from '../../rules/character'
import { canAdvance } from '../../rules/character'
import { isAtLimit, MAX_CHARACTERS_PER_SYSTEM } from '../../../app/limits'
import { STEPS, initWizardState, wizardReducer } from './wizardReducer'
import { ProgressSteps, cn } from './ui'
import { TraitsStep } from './steps/TraitsStep'
import { SkillsStep } from './steps/SkillsStep'
import { IdentityStep } from './steps/IdentityStep'
import { RecapStep } from './steps/RecapStep'

export function CharacterWizard({
  onExit,
  onSaved,
  editing,
  characterCount,
}: {
  onExit: () => void
  onSaved: () => void
  editing?: { id: string; draft: CharacterDraft }
  characterCount: number
}) {
  const [state, dispatch] = useReducer(
    wizardReducer,
    undefined,
    () =>
      editing
        ? initWizardState(editing.draft, STEPS.indexOf('recap'))
        : initWizardState(),
  )
  const step = STEPS[state.stepIndex]
  const isFirst = state.stepIndex === 0
  const isRecap = step === 'recap'
  const canNext = canAdvance(state.draft, step)
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
            ← Home
          </button>
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/70">
            Character Creation
          </span>
          <span className="w-12" />
        </div>

        <ProgressSteps
          current={state.stepIndex}
          onGoto={(stepIndex) => dispatch({ type: 'goto', stepIndex })}
        />

        {atLimit && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          >
            You've reached the limit of {MAX_CHARACTERS_PER_SYSTEM} characters. You won't be able to save this one — delete an existing character first.
          </div>
        )}

        {step === 'traits' && <TraitsStep draft={state.draft} dispatch={dispatch} />}
        {step === 'skills' && <SkillsStep draft={state.draft} dispatch={dispatch} />}
        {step === 'identity' && <IdentityStep draft={state.draft} dispatch={dispatch} />}
        {step === 'recap' && (
          <RecapStep
            draft={state.draft}
            dispatch={dispatch}
            onSaved={onSaved}
            editId={editing?.id}
            atLimit={atLimit}
          />
        )}

        {!isRecap && (
          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => dispatch({ type: 'back' })}
              disabled={isFirst}
              className={cn(
                'rounded-lg border px-6 py-2.5 font-semibold transition-colors',
                isFirst ? 'invisible' : 'border-stone-700 text-stone-200 hover:border-amber-600/50',
              )}
            >
              Back
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
              Next
            </button>
          </div>
        )}
        {isRecap && (
          <div className="mt-10 flex justify-start">
            <button
              type="button"
              onClick={() => dispatch({ type: 'back' })}
              className="rounded-lg border border-stone-700 px-6 py-2.5 font-semibold text-stone-200 hover:border-amber-600/50"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
