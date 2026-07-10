import { useState } from 'react'
import { randomPortraits, PORTRAIT_COUNT, type Portrait } from './portraits'
import { cn } from '../cn'

/** The gallery always shows exactly this many portraits to choose from. */
const GALLERY_SIZE = PORTRAIT_COUNT

/**
 * System-agnostic portrait picker. Controlled: `value` is the selected data URI
 * ('' = none), `onChange` fires with the new URI — clicking the selected tile
 * again deselects it ('').
 */
export function PortraitPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (imageUri: string) => void
}) {
  // Draw a fresh random bucket on first render (lazy init runs once) so the
  // gallery is different every time it mounts, not only after a refresh.
  const [bucket, setBucket] = useState<Portrait[]>(() => randomPortraits(GALLERY_SIZE))
  // Portraits pinned to the front of the gallery: these survive a refresh so a
  // picked portrait is never lost. `kept` holds its own Portrait objects rather
  // than being derived from `value`, so selecting a *new* portrait does not
  // wipe the previously-kept one.
  const [kept, setKept] = useState<Portrait[]>([])

  // Always exactly GALLERY_SIZE tiles: dedupe pinned + bucket, then trim. The
  // bucket alone always holds GALLERY_SIZE fresh portraits, so slicing here can
  // never leave fewer — a pinned portrait just pushes out the last bucket tile.
  const gallery = dedupeByUrl([...kept, ...bucket]).slice(0, GALLERY_SIZE)

  // On refresh, pin the currently-selected portrait (if any) and draw a full
  // fresh bucket, so the grid stays exactly GALLERY_SIZE tiles either way.
  const drawNewPortraits = () => {
    const selected = gallery.find((p) => p.url === value)
    setKept(selected ? [selected] : [])
    setBucket(randomPortraits(GALLERY_SIZE))
  }

  return (
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
          const selected = value === portrait.url
          return (
            <button
              key={portrait.seed}
              type="button"
              aria-pressed={selected}
              aria-label={`Portrait ${portrait.seed}`}
              onClick={() => onChange(selected ? '' : portrait.url)}
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
  )
}

/** Merge portrait lists, keeping the first occurrence of each url. */
function dedupeByUrl(portraits: Portrait[]): Portrait[] {
  const seen = new Set<string>()
  return portraits.filter((p) => (seen.has(p.url) ? false : seen.add(p.url)))
}
