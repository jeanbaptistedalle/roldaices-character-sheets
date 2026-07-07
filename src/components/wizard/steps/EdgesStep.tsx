import type { Dispatch } from 'react'
import { getClass, type ClassEdge } from '../../../rules/classes'
import { getEdge, DOMAINS, FRIENDS_PLACES } from '../../../rules/edges'
import type { CharacterDraft, EdgeSlot } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { OptionChip, StepShell, cn } from '../ui'

export function EdgesStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  if (!draft.classId) return null
  const cls = getClass(draft.classId)

  return (
    <StepShell
      eyebrow="Step 4"
      title="Resolve your edges"
      intro={`Answer ${cls.name}'s questions to lock in your three edges.`}
    >
      <div className="mx-auto max-w-xl space-y-6">
        {/* Always edge (locked in) */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Always
          </p>
          <p className="mt-1 text-lg font-semibold text-amber-300">
            {cls.always.label ?? getEdge(cls.always.edgeId).name}
          </p>
          <p className="mt-1 text-sm text-stone-400">{getEdge(cls.always.edgeId).description}</p>
          <SubChoice slot="always" classEdge={cls.always} draft={draft} dispatch={dispatch} />
        </div>

        {/* Two questions */}
        {cls.questions.map((question, i) => {
          const index = i as 0 | 1
          const slot: EdgeSlot = index === 0 ? 'q0' : 'q1'
          const answer = draft.answers[index]
          const chosen = answer !== undefined ? question.options[answer] : undefined
          return (
            <div key={slot} className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
              <p className="mb-3 text-stone-200">{question.prompt}</p>
              <div className="flex flex-wrap gap-2">
                {question.options.map((opt, optIndex) => (
                  <OptionChip
                    key={opt.edgeId + optIndex}
                    selected={answer === optIndex}
                    onClick={() => dispatch({ type: 'setAnswer', index, option: optIndex })}
                  >
                    {opt.label ?? getEdge(opt.edgeId).name}
                  </OptionChip>
                ))}
              </div>
              {chosen && (
                <>
                  <p className="mt-3 text-sm text-stone-400">{getEdge(chosen.edgeId).description}</p>
                  <SubChoice slot={slot} classEdge={chosen} draft={draft} dispatch={dispatch} />
                </>
              )}
            </div>
          )
        })}
      </div>
    </StepShell>
  )
}

/** Renders the sub-choice input for a slot's edge, if one is needed. */
function SubChoice({
  slot,
  classEdge,
  draft,
  dispatch,
}: {
  slot: EdgeSlot
  classEdge: ClassEdge
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const edge = getEdge(classEdge.edgeId)
  const kind = edge.subChoice
  if (!kind) return null

  // A class-preset sub-choice is fixed — just show it.
  if (classEdge.presetSubChoice) {
    return (
      <p className="mt-3 text-sm text-stone-400">
        <span className="text-stone-500">Set:</span>{' '}
        <span className="text-amber-300">{classEdge.presetSubChoice}</span>
      </p>
    )
  }

  const value = draft.subChoices[slot]
  const set = (v: string) => dispatch({ type: 'setSubChoice', slot, value: v })

  if (kind === 'name') {
    return (
      <label className="mt-3 block text-sm">
        <span className="text-stone-500">Name it (optional):</span>
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => set(e.target.value)}
          placeholder={`Name your ${edge.name.toLowerCase()}`}
          className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
        />
      </label>
    )
  }

  const choices = kind === 'place' ? FRIENDS_PLACES : DOMAINS
  return (
    <div className="mt-3">
      <p className="text-sm text-stone-500">
        {kind === 'place' ? 'Choose a place:' : 'Choose a domain:'}
        <span className="ml-1 text-amber-500/80">(required)</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => set(choice)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              value === choice
                ? 'border-amber-500 bg-amber-600 text-stone-950'
                : 'border-stone-700 bg-stone-950 text-stone-200 hover:border-amber-600/50',
            )}
          >
            {choice}
          </button>
        ))}
      </div>
      {kind === 'school-or-domain' && (
        <label className="mt-2 block text-xs text-stone-500">
          …or name a school instead:
          <input
            type="text"
            value={value && !DOMAINS.includes(value as (typeof DOMAINS)[number]) ? value : ''}
            onChange={(e) => set(e.target.value)}
            placeholder="e.g. Necromancy"
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
          />
        </label>
      )}
    </div>
  )
}
