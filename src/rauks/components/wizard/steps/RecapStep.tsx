import { useEffect, useState, type Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { buildCharacter, type CharacterDraft } from '../../../rules/character'
import { rerollTokens } from '../../../rules/traits'
import { draftToData } from '../../../persistence'
import type { NavAction } from '../../../../app/wizard/WizardState'
import { StepShell } from '../ui'
import { useAuth } from '../../../../auth'
import {
  saveCharacter,
  updateCharacter,
  listCharacters,
  getCurrentUserRole,
  type UserRole,
} from '../../../../api'
import { LoginModal } from '../../../../shared/LoginModal'
import { isAtLimit, MAX_CHARACTERS_PER_SYSTEM } from '../../../../app/limits'

export function RecapStep({
  draft,
  dispatch,
  onSaved,
  editId,
  atLimit,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<NavAction>
  onSaved: () => void
  editId?: string
  atLimit: boolean
}) {
  const { t } = useTranslation('rauks')
  const character = buildCharacter(draft)
  const { user } = useAuth()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [showLogin, setShowLogin] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  // Re-check the server count once a user is present (seed can be stale for a
  // user who started logged out). Edits are never blocked.
  useEffect(() => {
    if (!user || editId) return
    let active = true
    listCharacters('rauks')
      .then((rows) => {
        if (active) setLimitReached(isAtLimit(rows.length, false))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user, editId])

  // Guests may build a character but not persist it (enforced server-side by
  // RLS; this just hides the save button and explains why).
  const [role, setRole] = useState<UserRole | null>(null)
  useEffect(() => {
    if (!user) return
    let active = true
    getCurrentUserRole()
      .then((r) => {
        if (active) setRole(r)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user])
  const isGuest = Boolean(user) && role === 'guest'

  const blocked = atLimit || limitReached

  async function onSave() {
    if (!user) {
      setShowLogin(true)
      return
    }
    if (isGuest || blocked) return
    setSaveStatus('saving')
    try {
      const payload = {
        name: character.name ?? '',
        description: character.description,
        imageUri: character.imageUri,
        data: draftToData(draft),
      }
      if (editId) {
        await updateCharacter(editId, payload)
      } else {
        await saveCharacter({ systemId: 'rauks', ...payload })
      }
      onSaved()
    } catch {
      setSaveStatus('error')
    }
  }

  const identityRows: [string, string | undefined][] = [
    [
      t('steps.identity.originLabel'),
      character.imperial ? t('steps.identity.imperialValue') : character.origin,
    ],
    [t('steps.identity.sexLabel'), character.sex],
    [t('steps.identity.birthDateLabel'), character.birthDate],
  ]

  return (
    <StepShell
      eyebrow={t('steps.recap.eyebrow')}
      title={character.name || t('steps.recap.titleFallback')}
      intro={`${character.imperial ? t('steps.identity.imperialValue') : character.origin || 'Rauks'} · ${t('steps.recap.introSkill', { count: character.skills.length })}`}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {(character.imageUri || character.description) && (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {character.imageUri && (
              <img
                src={character.imageUri}
                alt={`Portrait of ${character.name || 'the character'}`}
                className="h-28 w-28 shrink-0 rounded-xl border border-border bg-surface object-cover"
              />
            )}
            {character.description && (
              <p className="text-center text-ink-secondary sm:text-left">{character.description}</p>
            )}
          </div>
        )}

        {/* Identity */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl border border-border bg-surface/60 p-5 text-sm sm:grid-cols-3">
          {identityRows.map(([label, value]) => (
            <div key={label}>
              <div className="text-xs uppercase tracking-widest text-ink-muted">{label}</div>
              <div className="font-semibold text-ink">{value || '—'}</div>
            </div>
          ))}
        </div>

        {/* Traits */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {character.traits.map(({ info, value }) => (
            <div
              key={info.key}
              className="rounded-xl border border-border bg-surface/60 p-4 text-center"
            >
              <div className="text-2xl font-bold text-accent-hover">{value}</div>
              <div
                data-testid={`recap-trait-label-${info.key}`}
                className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-ink-muted"
              >
                {t(`terms.characteristics.${info.key}`)}
              </div>
              {info.key === 'rerolls' && (
                <div
                  data-testid="recap-reroll-total"
                  className="mt-2 border-t border-border pt-2 text-[0.65rem] text-ink-muted"
                >
                  <span className="font-semibold text-accent-hover">{rerollTokens(value)}</span>{' '}
                  {t('rerollSuffix', { count: rerollTokens(value) })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rauksorg — the character's city, surfaced prominently ahead of the skills. */}
        <div
          data-testid="recap-rauksorg"
          className="flex items-baseline justify-between gap-3 rounded-xl border border-accent/40 bg-surface/60 px-5 py-4"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            {t('steps.identity.rauksorgLabel')}
          </span>
          <span className="text-lg font-semibold text-accent-selected-text">{character.rauksorg || '—'}</span>
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-border bg-surface/60 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
            {t('steps.recap.skillsHeading')}
          </h3>
          <ul className="space-y-2">
            {character.skills.map((skill) => (
              <li key={skill.id} className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-ink">
                  {t(`terms.skills.${skill.id}` as any)}
                  {skill.gear && (
                    <span className="text-accent-selected-text">
                      {' '}
                      — {t(`terms.skillGear.${skill.id}` as any)}
                    </span>
                  )}
                </span>
                <span className="text-xs uppercase tracking-widest text-ink-faint">
                  {t(`terms.skillCategories.${skill.category}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Traits/trauma */}
        {character.traitsAndTrauma.length > 0 && (
          <div className="rounded-xl border border-border bg-surface/60 p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
              {t('steps.identity.traitsAndTrauma.label')}
            </h3>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {character.traitsAndTrauma.map((value, index) => (
                <li key={index} className="text-ink">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Standard equipment */}
        <div className="rounded-xl border border-border bg-surface/40 p-5 text-sm text-ink-muted">
          <p>
            <span className="font-semibold text-ink-secondary">{t('steps.recap.equipmentLabel')}</span>{' '}
            {t('steps.recap.standardEquipment')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saveStatus === 'saving' || blocked || isGuest}
            className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-accent-on transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGuest
              ? t('steps.recap.awaitingValidation')
              : blocked
                ? t('steps.recap.limitReached')
                : saveStatus === 'saving'
                  ? t('steps.recap.saving')
                  : !user
                    ? t('steps.recap.loginToSave')
                    : editId
                      ? t('steps.recap.saveChanges')
                      : t('steps.recap.saveCharacter')}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset' })}
            className="rounded-lg border border-border px-6 py-2.5 font-semibold text-ink-secondary hover:border-accent/50"
          >
            {t('steps.recap.startOver')}
          </button>
        </div>
        {saveStatus === 'error' && (
          <p className="text-center text-sm text-red-400">{t('steps.recap.saveError')}</p>
        )}
        {isGuest && (
          <p className="text-center text-sm text-accent-selected-text/80">
            {t('steps.recap.guestMessage')}
          </p>
        )}
        {!isGuest && blocked && (
          <p className="text-center text-sm text-red-300">
            {t('steps.recap.limitMessage', { max: MAX_CHARACTERS_PER_SYSTEM })}
          </p>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </StepShell>
  )
}
