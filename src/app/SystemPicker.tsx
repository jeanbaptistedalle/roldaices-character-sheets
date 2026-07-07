import { SYSTEMS } from './registry'

export function SystemPicker({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/80">
          Tabletop RPGs
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          TTRPG Character Sheets
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
          Build characters for tabletop roleplaying games. Pick a system to
          begin.
        </p>

        <section className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {SYSTEMS.map((system) => (
            <button
              key={system.id}
              type="button"
              onClick={() => onSelect(system.id)}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 text-left transition-colors hover:border-amber-600/50"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
                {system.publisher}
              </div>
              <div className="mt-2 text-2xl font-bold text-stone-100">
                {system.name}
              </div>
              <div className="mt-2 text-sm text-stone-400">{system.tagline}</div>
            </button>
          ))}
        </section>
      </main>
    </div>
  )
}
