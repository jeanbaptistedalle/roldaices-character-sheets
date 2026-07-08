import { useEffect, useState } from 'react'
import { useAuth } from '../auth'
import { listCharacters, type CharacterRecord } from '../api'
import { summarize, type MazesData } from './persistence'

export function MazesHome({
  onCreate,
  onExit,
}: {
  onCreate: () => void
  onExit: () => void
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-stone-500 transition-colors hover:text-amber-400"
        >
          ← Systems
        </button>
      </div>
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-8 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/80">
          9th Level Games
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Mazes Character Sheets
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
          Build a character for <span className="text-stone-200">Mazes</span>, a
          zero-prep fantasy roleplaying game. Assign your dice, pick your role,
          and step into the maze.
        </p>

        <Characters onCreate={onCreate} />
      </main>
    </div>
  )
}

/** Logged out: just the Create button. Logged in: the user's character list. */
function Characters({ onCreate }: { onCreate: () => void }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return (
      <button
        type="button"
        onClick={onCreate}
        className="mt-14 rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold text-stone-950 transition-colors hover:bg-amber-500"
      >
        Create a Character
      </button>
    )
  }

  return <CharacterList onCreate={onCreate} />
}

function CharacterList({ onCreate }: { onCreate: () => void }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [characters, setCharacters] = useState<CharacterRecord[]>([])

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

  return (
    <section className="mt-14 w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400">
          Your characters
        </h2>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500"
        >
          Create a Character
        </button>
      </div>

      {status === 'loading' && (
        <p className="py-8 text-sm text-stone-500">Loading…</p>
      )}

      {status === 'error' && (
        <p className="py-8 text-sm text-red-400">
          Couldn't load your characters. Try again later.
        </p>
      )}

      {status === 'ready' && characters.length === 0 && (
        <p className="rounded-xl border border-dashed border-stone-800 py-10 text-sm text-stone-500">
          No characters yet — create your first one.
        </p>
      )}

      {status === 'ready' && characters.length > 0 && (
        <ul className="space-y-3 text-left">
          {characters.map((c) => (
            <CharacterRow key={c.id} character={c} />
          ))}
        </ul>
      )}
    </section>
  )
}

function CharacterRow({ character }: { character: CharacterRecord }) {
  const summary = summarize(character.data as MazesData)
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
      <div className="min-w-0">
        <div className="truncate font-semibold text-stone-100">
          {character.name}
        </div>
        {summary && (
          <div className="truncate text-sm text-stone-500">{summary}</div>
        )}
      </div>
    </li>
  )
}
