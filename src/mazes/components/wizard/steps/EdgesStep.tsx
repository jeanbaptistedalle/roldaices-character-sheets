import type { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('mazes')
  if (!draft.classId) return null
  const cls = getClass(draft.classId)

  return (
    <StepShell
      eyebrow={t('steps.edges.eyebrow')}
      title={t('steps.edges.title')}
      intro={t('steps.edges.intro', { className: t(`terms.classes.${cls.id}` as any) })}
    >
      <div className="mx-auto max-w-xl space-y-6">
        {/* Always edge (locked in) */}
        <div className="rounded-xl border border-border bg-surface/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            {t('terms.always')}
          </p>
          <p className="mt-1 text-lg font-semibold text-accent-selected-text">
            {cls.always.flavorKey
              ? t(`terms.classFlavor.${cls.always.flavorKey}` as any)
              : t(`terms.edges.${cls.always.edgeId}` as any)}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {t(`terms.edgeDescriptions.${cls.always.edgeId}` as any)}
          </p>
          <SubChoice slot="always" classEdge={cls.always} draft={draft} dispatch={dispatch} />
        </div>

        {/* Two questions */}
        {cls.questions.map((question, i) => {
          const index = i as 0 | 1
          const slot: EdgeSlot = index === 0 ? 'q0' : 'q1'
          const answer = draft.answers[index]
          const chosen = answer !== undefined ? question.options[answer] : undefined
          return (
            <div key={slot} className="rounded-xl border border-border bg-surface/60 p-5">
              <p className="mb-3 text-ink-secondary">
                {t(`terms.classQuestions.${cls.id}.${index}` as any)}
              </p>
              <div className="flex flex-wrap gap-2">
                {question.options.map((opt, optIndex) => (
                  <OptionChip
                    key={opt.edgeId + optIndex}
                    selected={answer === optIndex}
                    onClick={() => dispatch({ type: 'setAnswer', index, option: optIndex })}
                  >
                    {opt.flavorKey
                      ? t(`terms.classFlavor.${opt.flavorKey}` as any)
                      : t(`terms.edges.${opt.edgeId}` as any)}
                  </OptionChip>
                ))}
              </div>
              {chosen && (
                <>
                  <p className="mt-3 text-sm text-ink-muted">
                    {t(`terms.edgeDescriptions.${chosen.edgeId}` as any)}
                  </p>
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
  const { t } = useTranslation('mazes')
  const edge = getEdge(classEdge.edgeId)
  const kind = edge.subChoice
  if (!kind) return null

  // A class-preset sub-choice is fixed — just show it (localized via flavorKey,
  // falling back to the stored preset value if no key is defined).
  if (classEdge.presetSubChoice) {
    return (
      <p className="mt-3 text-sm text-ink-muted">
        <span className="text-ink-muted">{t('steps.edges.setLabel')}</span>{' '}
        <span className="text-accent-selected-text">
          {classEdge.flavorKey
            ? t(`terms.classFlavor.${classEdge.flavorKey}` as any)
            : classEdge.presetSubChoice}
        </span>
      </p>
    )
  }

  const value = draft.subChoices[slot]
  const set = (v: string) => dispatch({ type: 'setSubChoice', slot, value: v })

  if (kind === 'name') {
    return (
      <label className="mt-3 block text-sm">
        <span className="text-ink-muted">{t('steps.edges.nameOptional')}</span>
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => set(e.target.value)}
          placeholder={t('steps.edges.namePlaceholder', {
            edge: t(`terms.edges.${edge.id}` as any).toLowerCase(),
          })}
          className="mt-1 w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
      </label>
    )
  }

  const choices = kind === 'place' ? FRIENDS_PLACES : DOMAINS
  return (
    <div className="mt-3">
      <p className="text-sm text-ink-muted">
        {kind === 'place' ? t('steps.edges.choosePlace') : t('steps.edges.chooseDomain')}
        <span className="ml-1 text-accent/80">{t('steps.edges.required')}</span>
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
                ? 'border-accent-hover bg-accent text-accent-on'
                : 'border-border bg-surface-inset text-ink-secondary hover:border-accent/50',
            )}
          >
            {kind === 'place'
              ? t(`terms.friendsPlaces.${choice as (typeof FRIENDS_PLACES)[number]}`)
              : t(`terms.domains.${choice as (typeof DOMAINS)[number]}`)}
          </button>
        ))}
      </div>
      {kind === 'school-or-domain' && (
        <label className="mt-2 block text-xs text-ink-muted">
          {t('steps.edges.orNameSchool')}
          <input
            type="text"
            value={value && !DOMAINS.includes(value as (typeof DOMAINS)[number]) ? value : ''}
            onChange={(e) => set(e.target.value)}
            placeholder={t('steps.edges.schoolPlaceholder')}
            className="mt-1 w-full rounded-lg border border-border bg-surface-inset px-3 py-2 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </label>
      )}
    </div>
  )
}
