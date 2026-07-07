import type { Dispatch } from 'react'
import { buildCharacter, type CharacterDraft } from '../../rules/character'
import { RESOLUTIONS, hittableTargets } from '../../rules/resolutions'
import type { WizardAction } from './wizardReducer'
import { StepShell } from './ui'

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 text-center">
      <div className="text-3xl font-bold text-amber-400">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </div>
    </div>
  )
}

export function RecapStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const character = buildCharacter(draft)
  const { role } = character

  return (
    <StepShell
      eyebrow="Step 6"
      title={character.name || 'Your character'}
      intro={`${character.aspect.id} · ${character.className}`}
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

        <div className="grid grid-cols-3 gap-4">
          <Stat label="Die" value={role.dieLabel} />
          <Stat label="Hearts" value={role.hearts} />
          <Stat label="Stars" value={role.stars} />
        </div>

        {/* Edges */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
            Edges
          </h3>
          <ul className="space-y-2">
            {character.edges.map((e) => (
              <li key={e.slot} className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-stone-100">
                  {e.label}
                  {e.subChoice && <span className="text-amber-300"> ({e.subChoice})</span>}
                </span>
                <span className="text-xs uppercase tracking-widest text-stone-600">
                  {e.edge.type}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resolution sheet for this die */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
            What your {role.dieLabel} hits
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <Row label="Key" value="1" />
            {RESOLUTIONS.map((r) => {
              const targets = hittableTargets(r.id, role.die)
              return (
                <Row
                  key={r.id}
                  label={r.id}
                  value={targets.length ? targets.join(', ') : '—'}
                />
              )
            })}
            <Row label="Crown" value={String(role.die)} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled
            title="Saving to RestDB is coming in a later step"
            className="cursor-not-allowed rounded-lg bg-amber-600/40 px-6 py-2.5 font-semibold text-amber-100/60"
          >
            Save character
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'reset' })}
            className="rounded-lg border border-stone-700 px-6 py-2.5 font-semibold text-stone-200 hover:border-amber-600/50"
          >
            Start over
          </button>
        </div>
        <p className="text-center text-xs text-stone-600">
          Saving to RestDB is coming in a later step.
        </p>
      </div>
    </StepShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-stone-800/60 pb-1">
      <span className="text-stone-400">{label}</span>
      <span className="font-semibold text-stone-100">{value}</span>
    </div>
  )
}
