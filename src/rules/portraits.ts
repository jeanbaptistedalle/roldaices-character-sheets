// A small gallery of portrait options sourced from DiceBear — a free, no-key,
// CORS-friendly avatar service with deterministic URLs. We store the selected
// URL on the character (ready for RestDB); we host nothing ourselves.

const DICEBEAR_VERSION = '9.x'
const DICEBEAR_STYLE = 'adventurer'

/** Fixed seeds that produce a stable, repeatable gallery. */
export const PORTRAIT_SEEDS: string[] = [
  'Aldric',
  'Brenna',
  'Corvus',
  'Dahlia',
  'Eldwin',
  'Fenn',
  'Grey Wolf',
  'Halza',
  'Ione',
  'Jorund',
  'Kestrel',
  'Lythia',
]

/** Build a deterministic DiceBear SVG URL for a seed. */
export function portraitUrl(seed: string): string {
  return `https://api.dicebear.com/${DICEBEAR_VERSION}/${DICEBEAR_STYLE}/svg?seed=${encodeURIComponent(
    seed,
  )}`
}

export interface Portrait {
  seed: string
  url: string
}

export const PORTRAITS: Portrait[] = PORTRAIT_SEEDS.map((seed) => ({
  seed,
  url: portraitUrl(seed),
}))
