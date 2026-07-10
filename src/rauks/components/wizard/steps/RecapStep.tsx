import { useEffect, useState, type Dispatch } from 'react'
import { buildCharacter, type CharacterDraft } from '../../../rules/character'
import { rerollTokens } from '../../../rules/traits'
import { draftToData } from '../../../persistence'
import type { WizardAction } from '../wizardReducer'
import { StepShell } from '../ui'
import { useAuth } from '../../../../auth'
import { saveCharacter, updateCharacter, listCharacters } from '../../../../api'
import { LoginModal } from '../../../../shared/LoginModal'
import { isAtLimit, MAX_CHARACTERS_PER_SYSTEM } from '../../../../app/limits'

const STANDARD_EQUIPMENT =
  'Tactical harness, bespoke Rauks pressure revolver, passport, wallet, tactical watch, and a notebook.'

export function RecapStep({
  draft,
  dispatch,
  onSaved,
  editId,
  atLimit,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
  onSaved: () => void
  editId?: string
  atLimit: boolean
}) {
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

  const blocked = atLimit || limitReached

  async function onSave() {
    if (!user) {
      setShowLogin(true)
      return
    }
    if (blocked) return
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
    ['Origin', character.imperial ? 'Imperial' : character.origin],
    ['Sex', character.sex],
    ['Birth date', character.birthDate],
    ['Rauksorg', character.rauksorg],
  ]

  return (
    <StepShell
      eyebrow="Step 4"
      title={character.name || 'Your character'}
      intro={`${character.imperial ? 'Imperial' : character.origin || 'Rauks'} · ${character.skills.length} skill${character.skills.length === 1 ? '' : 's'}`}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {(character.imageUri || character.description) && (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {character.imageUri && (
              <img
                src={character.imageUri}
                alt={`Portrait of ${character.name || 'the character'}`}
                className="h-28 w-28 shrink-0 rounded-xl border border-stone-800 bg-stone-900 object-cover"
              />
            )}
            {character.description && (
              <p className="text-center text-stone-300 sm:text-left">{character.description}</p>
            )}
          </div>
        )}

        {/* Identity */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl border border-stone-800 bg-stone-900/60 p-5 text-sm sm:grid-cols-4">
          {identityRows.map(([label, value]) => (
            <div key={label}>
              <div className="text-xs uppercase tracking-widest text-stone-500">{label}</div>
              <div className="font-semibold text-stone-100">{value || '—'}</div>
            </div>
          ))}
        </div>

        {/* Traits */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {character.traits.map(({ info, value }) => (
            <div
              key={info.key}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 text-center"
            >
              <div className="text-2xl font-bold text-amber-400">{value}</div>
              <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-widest text-stone-400">
                {info.key === 'competence' ? 'Skill' : info.label}
              </div>
              {info.key === 'rerolls' && (
                <div
                  data-testid="recap-reroll-total"
                  className="mt-2 border-t border-stone-800 pt-2 text-[0.65rem] text-stone-500"
                >
                  <span className="font-semibold text-amber-400">{rerollTokens(value)}</span> reroll
                  {rerollTokens(value) === 1 ? '' : 's'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Skills
          </h3>
          <ul className="space-y-2">
            {character.skills.map((skill) => (
              <li key={skill.id} className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-stone-100">
                  {skill.name}
                  {skill.gear && <span className="text-amber-300"> — {skill.gear}</span>}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-600">
                  {skill.category}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Standard equipment */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-5 text-sm text-stone-400">
          <p><span className="font-semibold text-stone-300">Standard equipment:</span> {STANDARD_EQUIPMENT}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saveStatus === 'saving' || blocked}
            className="rounded-lg bg-amber-600 px-6 py-2.5 font-semibold text-stone-950 transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {blocked
              ? 'Character limit reached'
              : saveStatus === 'saving'
                ? 'Saving…'
                : !user
                  ? 'Log in to save'
                  : editId
                    ? 'Save changes'
                    : 'Save character'}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset' })}
            className="rounded-lg border border-stone-700 px-6 py-2.5 font-semibold text-stone-200 hover:border-amber-600/50"
          >
            Start over
          </button>
        </div>
        {saveStatus === 'error' && (
          <p className="text-center text-sm text-red-400">Couldn't save your character. Try again.</p>
        )}
        {blocked && (
          <p className="text-center text-sm text-red-300">
            You've reached the limit of {MAX_CHARACTERS_PER_SYSTEM} characters. Delete one before saving a new character.
          </p>
        )}
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </StepShell>
  )
}
