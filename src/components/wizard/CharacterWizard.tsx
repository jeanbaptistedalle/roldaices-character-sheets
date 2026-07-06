import { useReducer } from 'react'
import { canAdvance } from '../../rules/character'
import { STEPS, initialWizardState, wizardReducer } from './wizardReducer'
import { ProgressSteps, cn } from './ui'
import { RoleStep } from './RoleStep'
import { AspectStep } from './AspectStep'
import { ClassStep } from './ClassStep'
import { EdgesStep } from './EdgesStep'
import { RecapStep } from './RecapStep'

export function CharacterWizard({ onExit }: { onExit: () => void }) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState)
  const step = STEPS[state.stepIndex]
  const isFirst = state.stepIndex === 0
  const isRecap = step === 'recap'
  const canNext = canAdvance(state.draft, step)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
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

        {step === 'role' && <RoleStep draft={state.draft} dispatch={dispatch} />}
        {step === 'aspect' && <AspectStep draft={state.draft} dispatch={dispatch} />}
        {step === 'class' && <ClassStep draft={state.draft} dispatch={dispatch} />}
        {step === 'edges' && <EdgesStep draft={state.draft} dispatch={dispatch} />}
        {step === 'recap' && <RecapStep draft={state.draft} dispatch={dispatch} />}

        {/* Nav (recap has its own actions) */}
        {!isRecap && (
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
