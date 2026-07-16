import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth'
import { listCharacters, deleteCharacter, type CharacterRecord } from '../api'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { summaryKeys, type MazesData } from './persistence'
import { MAX_CHARACTERS_PER_SYSTEM } from '../app/limits'

export function MazesHome({
  onCreate,
  onEdit,
  onExit,
}: {
  onCreate: (count: number) => void
  onEdit: (character: CharacterRecord) => void
  onExit: () => void
}) {
  const { t } = useTranslation()
  const { t: tMazes } = useTranslation('mazes')
  return (
    <div className="flex-1 bg-page text-ink">
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-ink-muted transition-colors hover:text-accent-hover"
        >
          {t('systemHome.backToSystems')}
        </button>
      </div>
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-8 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-accent/80">
          {tMazes('publisher')}
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          {tMazes('home.title')}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          {tMazes('home.subtitlePrefix')}
          <span className="text-ink-secondary">{tMazes('home.subtitleName')}</span>
          {tMazes('home.subtitleSuffix')}
        </p>

        <Characters onCreate={onCreate} onEdit={onEdit} />
      </main>
    </div>
  )
}

/** Logged out: just the Create button. Logged in: the user's character list. */
function Characters({
  onCreate,
  onEdit,
}: {
  onCreate: (count: number) => void
  onEdit: (character: CharacterRecord) => void
}) {
  const { t } = useTranslation()
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => onCreate(0)}
        className="mt-14 rounded-lg bg-accent px-8 py-3 text-lg font-semibold text-accent-on transition-colors hover:bg-accent-hover"
      >
        {t('systemHome.createCharacter')}
      </button>
    )
  }

  return <CharacterList onCreate={onCreate} onEdit={onEdit} />
}

function CharacterList({
  onCreate,
  onEdit,
}: {
  onCreate: (count: number) => void
  onEdit: (character: CharacterRecord) => void
}) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [characters, setCharacters] = useState<CharacterRecord[]>([])
  const [confirmTarget, setConfirmTarget] = useState<CharacterRecord | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    listCharacters('mazes')
      .then((rows) => {
        if (!active) return
        setCharacters(rows)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  function cancelDelete() {
    setConfirmTarget(null)
    setDeleteError(null)
  }

  async function confirmDelete() {
    if (!confirmTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteCharacter(confirmTarget.id)
      setCharacters((prev) => prev.filter((c) => c.id !== confirmTarget.id))
      setConfirmTarget(null)
    } catch {
      setDeleteError(t('systemHome.deleteError'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="mt-14 w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
            {t('systemHome.yourCharacters')}
          </h2>
          {status === 'ready' && (
            <span className="text-sm font-semibold text-ink-muted">
              {characters.length} / {MAX_CHARACTERS_PER_SYSTEM}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onCreate(characters.length)}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-on transition-colors hover:bg-accent-hover"
        >
          {t('systemHome.createCharacter')}
        </button>
      </div>

      {status === 'loading' && (
        <p className="py-8 text-sm text-ink-muted">{t('systemHome.loading')}</p>
      )}

      {status === 'error' && (
        <p className="py-8 text-sm text-red-400">{t('systemHome.loadError')}</p>
      )}

      {status === 'ready' && characters.length === 0 && (
        <p className="rounded-xl border border-dashed border-border py-10 text-sm text-ink-muted">
          {t('systemHome.empty')}
        </p>
      )}

      {status === 'ready' && characters.length > 0 && (
        <ul className="space-y-3 text-left">
          {characters.map((c) => (
            <CharacterRow
              key={c.id}
              character={c}
              onEdit={() => onEdit(c)}
              onRequestDelete={() => setConfirmTarget(c)}
            />
          ))}
        </ul>
      )}

      {confirmTarget && (
        <ConfirmDialog
          title={t('systemHome.deleteTitle')}
          message={
            <>
              {t('systemHome.deleteConfirmPrefix')}
              <span className="font-semibold text-ink">
                {confirmTarget.name}
              </span>
              {t('systemHome.deleteConfirmSuffix')}
            </>
          }
          confirmLabel={t('systemHome.delete')}
          busyLabel={t('systemHome.deleting')}
          destructive
          busy={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </section>
  )
}

function CharacterRow({
  character,
  onEdit,
  onRequestDelete,
}: {
  character: CharacterRecord
  onEdit: () => void
  onRequestDelete: () => void
}) {
  const { t } = useTranslation()
  const { t: tMazes } = useTranslation('mazes')
  const summary = summaryKeys(character.data as MazesData)
    .map((key) => tMazes(key as any))
    .join(' · ')
  return (
    <li className="flex items-center gap-4 rounded-xl border border-border bg-surface/60 p-4">
      {character.imageUri ? (
        <img
          src={character.imageUri}
          alt=""
          className="h-14 w-14 shrink-0 rounded-lg border border-border bg-surface object-cover"
        />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-surface" />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-ink">
          {character.name}
        </div>
        {summary && (
          <div className="truncate text-sm text-ink-muted">{summary}</div>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={t('systemHome.editAria', { name: character.name })}
        className="shrink-0 rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-hover hover:text-accent-hover"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onRequestDelete}
        aria-label={t('systemHome.deleteAria', { name: character.name })}
        className="shrink-0 rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-hover hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6M10 11v6M14 11v6" />
        </svg>
      </button>
    </li>
  )
}
