import { type Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import type { CharacterDraft } from '../../../rules/character'
import { skillsByCategory } from '../../../rules/skills'
import type { WizardAction } from '../wizardReducer'
import { StepShell, cn } from '../ui'

export function SkillsStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const { t } = useTranslation('rauks')
  const budget = draft.traits.competence
  const picked = draft.skillIds.length
  const full = picked >= budget
  const groups = skillsByCategory()

  return (
    <StepShell
      eyebrow={t('steps.skills.eyebrow')}
      title={t('steps.skills.title')}
      intro={t('steps.skills.intro')}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div
          data-testid="skill-count"
          className={cn(
            'rounded-lg border px-4 py-3 text-center text-sm font-semibold',
            picked === budget
              ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-300'
              : 'border-amber-800/60 bg-amber-950/20 text-amber-300',
          )}
        >
          {t('steps.skills.counter', { picked, budget })}
        </div>

        {groups.map(({ category, skills }) => (
          <div key={category}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
              {t(`terms.skillCategories.${category}`)}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((skill) => {
                const selected = draft.skillIds.includes(skill.id)
                const disabled = full && !selected
                return (
                  <button
                    key={skill.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => dispatch({ type: 'toggleSkill', id: skill.id })}
                    className={cn(
                      'flex h-full w-full flex-col rounded-xl border p-4 text-left transition-colors',
                      selected
                        ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/40'
                        : disabled
                          ? 'cursor-not-allowed border-stone-800/60 bg-stone-900/30 opacity-50'
                          : 'border-stone-800 bg-stone-900/60 hover:border-amber-600/50',
                    )}
                  >
                    <span className="font-semibold text-stone-100">
                      {t(`terms.skills.${skill.id}` as any)}
                    </span>
                    <span className="mt-1 text-sm text-stone-400">{skill.description}</span>
                    {skill.gear && (
                      <span className="mt-2 text-xs italic text-amber-300/80">
                        {t('steps.skills.gear', { gear: skill.gear })}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </StepShell>
  )
}
