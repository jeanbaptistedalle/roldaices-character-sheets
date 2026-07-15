import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth'
import { listCharacters, deleteCharacter, type CharacterRecord } from '../api'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { summarize, type RauksData } from './persistence'
import { MAX_CHARACTERS_PER_SYSTEM } from '../app/limits'

export function RauksHome({
  onCreate,
  onEdit,
  onExit,
}: {
  onCreate: (count: number) => void
  onEdit: (character: CharacterRecord) => void
  onExit: () => void
}) {
  const { t } = useTranslation()
  const { t: tRauks } = useTranslation('rauks')
  return (
    <div className="flex-1 bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-stone-500 transition-colors hover:text-amber-400"
        >
          {t('systemHome.backToSystems')}
        </button>
      </div>
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-8 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/80">
          {tRauks('publisher')}
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          {tRauks('home.title')}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
          {tRauks('home.subtitle')}
        </p>
        <Characters onCreate={onCreate} onEdit={onEdit} />
      </main>
    </div>
  )
}

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
        className="mt-14 rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold text-stone-950 transition-colors hover:bg-amber-500"
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
    listCharacters('rauks')
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
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400">
            {t('systemHome.yourCharacters')}
          </h2>
          {status === 'ready' && (
            <span className="text-sm font-semibold text-stone-500">
              {characters.length} / {MAX_CHARACTERS_PER_SYSTEM}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onCreate(characters.length)}
          className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500"
        >
          {t('systemHome.createCharacter')}
        </button>
      </div>

      {status === 'loading' && (
        <p className="py-8 text-sm text-stone-500">{t('systemHome.loading')}</p>
      )}
      {status === 'error' && (
        <p className="py-8 text-sm text-red-400">{t('systemHome.loadError')}</p>
      )}
      {status === 'ready' && characters.length === 0 && (
        <p className="rounded-xl border border-dashed border-stone-800 py-10 text-sm text-stone-500">
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
              <span className="font-semibold text-stone-100">
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
  const { t: tRauks } = useTranslation('rauks')
  const data = character.data as RauksData
  // tRauks is typed against the literal key union; summarize builds keys
  // dynamically, so bridge it through a plain string signature.
  const summary = summarize(data, (key) => tRauks(key as never))
  return (
    <li className="flex items-center gap-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
      {character.imageUri ? (
        <img
          src={character.imageUri}
          alt=""
          className="h-14 w-14 shrink-0 rounded-lg border border-stone-800 bg-stone-900 object-cover"
        />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-lg border border-stone-800 bg-stone-900" />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-stone-100">{character.name}</div>
        {data.rauksorg && (
          <div className="truncate text-sm font-medium text-amber-300/90">{data.rauksorg}</div>
        )}
        {summary && <div className="truncate text-sm text-stone-500">{summary}</div>}
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={t('systemHome.editAria', { name: character.name })}
        className="shrink-0 rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-800 hover:text-amber-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onRequestDelete}
        aria-label={t('systemHome.deleteAria', { name: character.name })}
        className="shrink-0 rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-800 hover:text-red-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6M10 11v6M14 11v6" />
        </svg>
      </button>
    </li>
  )
}
