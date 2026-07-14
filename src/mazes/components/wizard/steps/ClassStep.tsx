import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { classesByAspect } from '../../../rules/classes'
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
  const { t } = useTranslation('mazes')
  if (!draft.aspect) return null
  const classes = classesByAspect(draft.aspect)

  return (
    <StepShell
      eyebrow={t('steps.class.eyebrow')}
      title={t('steps.class.title')}
      intro={t('steps.class.intro', {
        aspect: t(`terms.aspects.${draft.aspect}`),
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {classes.map((cls) => (
          <SelectableCard
            key={cls.id}
            selected={draft.classId === cls.id}
            onClick={() => dispatch({ type: 'setClass', classId: cls.id })}
            // cls.id is a plain string (not a literal union), so the dynamic
            // key can't be narrowed to a known `terms.classes.*` literal.
            title={t(`terms.classes.${cls.id}` as any)}
          >
            <p className="text-stone-400">
              {t('terms.always')}{' '}
              <span className="font-semibold text-amber-300">
                {cls.always.flavorKey
                  ? t(`terms.classFlavor.${cls.always.flavorKey}` as any)
                  : t(`terms.edges.${cls.always.edgeId}` as any)}
              </span>
            </p>
          </SelectableCard>
        ))}
      </div>
    </StepShell>
  )
}
