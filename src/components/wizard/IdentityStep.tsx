import type { Dispatch } from 'react'
import { PORTRAITS } from '../../rules/portraits'
import type { CharacterDraft } from '../../rules/character'
import type { WizardAction } from './wizardReducer'
import { StepShell, cn } from './ui'

export function IdentityStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  return (
    <StepShell
      eyebrow="Step 5"
      title="Name your character"
      intro="Give your character an identity. A name is required; the rest is up to you."
    >
      <div className="mx-auto max-w-xl space-y-6">
        {/* Name */}
        <label className="block">
          <span className="text-sm font-semibold text-stone-200">
            Name <span className="text-amber-500">*</span>
          </span>
          <input
            type="text"
            value={draft.name ?? ''}
            onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
            placeholder="e.g. Ironwolf"
            autoFocus
            className="mt-1 w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
          />
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-sm font-semibold text-stone-200">Description</span>
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => dispatch({ type: 'setDescription', description: e.target.value })}
            placeholder="A short description, backstory, or notable quirk…"
            rows={4}
            className="mt-1 w-full resize-y rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
          />
        </label>

        {/* Portrait gallery */}
        <div>
          <p className="text-sm font-semibold text-stone-200">Portrait</p>
          <p className="mb-3 text-xs text-stone-500">Pick a portrait, or leave it blank.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {PORTRAITS.map((portrait) => {
              const selected = draft.imageUri === portrait.url
              return (
                <button
                  key={portrait.seed}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`Portrait ${portrait.seed}`}
                  onClick={() =>
                    dispatch({
                      type: 'setImage',
                      imageUri: selected ? '' : portrait.url,
                    })
                  }
                  className={cn(
                    'aspect-square overflow-hidden rounded-xl border bg-stone-900 transition-colors',
                    selected
                      ? 'border-amber-500 ring-2 ring-amber-500/50'
                      : 'border-stone-800 hover:border-amber-600/50',
                  )}
                >
                  <img
                    src={portrait.url}
                    alt={`Portrait ${portrait.seed}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </StepShell>
  )
}
