import { useState, type Dispatch } from 'react'
import {
  PORTRAITS,
  randomPortraits,
  PORTRAIT_COUNT,
  type Portrait,
} from '../../../rules/portraits'
import type { CharacterDraft } from '../../../rules/character'
import type { WizardAction } from '../wizardReducer'
import { StepShell, cn } from '../ui'

/** The gallery always shows exactly this many portraits to choose from. */
const GALLERY_SIZE = PORTRAIT_COUNT

export function IdentityStep({
  draft,
  dispatch,
}: {
  draft: CharacterDraft
  dispatch: Dispatch<WizardAction>
}) {
  const [bucket, setBucket] = useState<Portrait[]>(PORTRAITS)
  // Portraits pinned to the front of the gallery: these survive a refresh so a
  // picked portrait is never lost. `kept` holds its own Portrait objects rather
  // than being derived from `draft.imageUri`, so selecting a *new* portrait does
  // not wipe the previously-kept one.
  const [kept, setKept] = useState<Portrait[]>([])

  // Always exactly GALLERY_SIZE tiles: dedupe pinned + bucket, then trim. The
  // bucket alone always holds GALLERY_SIZE fresh portraits, so slicing here can
  // never leave fewer — a pinned portrait just pushes out the last bucket tile.
  const gallery = dedupeByUrl([...kept, ...bucket]).slice(0, GALLERY_SIZE)

  // On refresh, pin the currently-selected portrait (if any) and draw a full
  // fresh bucket, so the grid stays exactly GALLERY_SIZE tiles either way.
  const drawNewPortraits = () => {
    const selected = gallery.find((p) => p.url === draft.imageUri)
    setKept(selected ? [selected] : [])
    setBucket(randomPortraits(GALLERY_SIZE))
  }

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
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-stone-200">Portrait</p>
            <button
              type="button"
              onClick={drawNewPortraits}
              className="rounded-lg border border-stone-700 px-3 py-1 text-xs font-semibold text-stone-300 transition-colors hover:border-amber-600/50 hover:text-amber-400"
            >
              New portraits
            </button>
          </div>
          <p className="mb-3 text-xs text-stone-500">Pick a portrait, or leave it blank.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {gallery.map((portrait) => {
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

/** Merge portrait lists, keeping the first occurrence of each url. */
function dedupeByUrl(portraits: Portrait[]): Portrait[] {
  const seen = new Set<string>()
  return portraits.filter((p) => (seen.has(p.url) ? false : seen.add(p.url)))
}
