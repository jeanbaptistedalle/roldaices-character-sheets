import type { Dispatch } from 'react'
import { classesByAspect } from '../../../rules/classes'
import { getEdge } from '../../../rules/edges'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { SelectableCard, StepShell } from '../ui'

export function ClassStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  if (!draft.aspect) return null
  const classes = classesByAspect(draft.aspect)

  return (
    <StepShell
      eyebrow="Step 3"
      title="Choose your class"
      intro={`${draft.aspect} classes. Your class is a descriptive name and grants your three edges.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {classes.map((cls) => (
          <SelectableCard
            key={cls.id}
            selected={draft.classId === cls.id}
            onClick={() => dispatch({ type: 'setClass', classId: cls.id })}
            title={cls.name}
          >
            <p className="text-stone-400">
              Always{' '}
              <span className="font-semibold text-amber-300">
                {cls.always.label ?? getEdge(cls.always.edgeId).name}
              </span>
            </p>
          </SelectableCard>
        ))}
      </div>
    </StepShell>
  )
}
