import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { ASPECTS } from '../../../rules/aspects'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { SelectableCard, StepShell } from '../ui'

export function AspectStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const { t } = useTranslation('mazes')
  return (
    <StepShell
      eyebrow={t('steps.aspect.eyebrow')}
      title={t('steps.aspect.title')}
      intro={t('steps.aspect.intro')}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {ASPECTS.map((aspect) => (
          <SelectableCard
            key={aspect.id}
            selected={draft.aspect === aspect.id}
            onClick={() => dispatch({ type: 'setAspect', aspect: aspect.id })}
            title={aspect.id}
          >
            <p className="italic text-amber-200/70">{aspect.prompt}</p>
            <p className="mt-2 text-stone-400">{aspect.description}</p>
          </SelectableCard>
        ))}
      </div>
    </StepShell>
  )
}
