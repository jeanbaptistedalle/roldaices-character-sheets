import { useState } from 'react'
import { CharacterWizard } from '../mazes/components/wizard/CharacterWizard'

const STATS = [
  { name: 'BOOKS', die: 'd?', blurb: 'Senses & knowledge' },
  { name: 'BOOTS', die: 'd?', blurb: 'Physical activity' },
  { name: 'BLADES', die: 'd?', blurb: 'Attacking & defending' },
  { name: 'BONES', die: 'd?', blurb: 'Resist, be brave, be strong' },
] as const

function App() {
  const [view, setView] = useState<'landing' | 'wizard'>('landing')

  if (view === 'wizard') {
    return <CharacterWizard onExit={() => setView('landing')} />
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
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

        <section className="mt-14 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.name}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 transition-colors hover:border-amber-600/50"
            >
              <div className="text-2xl font-bold text-amber-400">{stat.die}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-stone-200">
                {stat.name}
              </div>
              <div className="mt-1 text-xs text-stone-500">{stat.blurb}</div>
            </div>
          ))}
        </section>

        <button
          type="button"
          onClick={() => setView('wizard')}
          className="mt-14 rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold text-stone-950 transition-colors hover:bg-amber-500"
        >
          Create a Character
        </button>
      </main>
    </div>
  )
}

export default App
