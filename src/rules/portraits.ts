// A small gallery of portrait options generated locally with the DiceBear
// library (@dicebear/core + the adventurer style from @dicebear/collection).
// Avatars are rendered to deterministic data URIs — no network request, no
// API key. We store the selected data URI on the character (ready for RestDB);
// we host nothing ourselves.

import { createAvatar } from '@dicebear/core'
import { adventurer } from '@dicebear/collection'

/** How many portraits a gallery always contains. */
export const PORTRAIT_COUNT = 9

/** Fixed seeds that produce a stable, repeatable gallery of PORTRAIT_COUNT. */
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
]

/** Build a deterministic DiceBear SVG data URI for a seed. */
export function portraitUrl(seed: string): string {
  return createAvatar(adventurer, { seed }).toDataUri()
}

export interface Portrait {
  seed: string
  url: string
}

export const PORTRAITS: Portrait[] = PORTRAIT_SEEDS.map((seed) => ({
  seed,
  url: portraitUrl(seed),
}))

/** How many portraits a freshly-drawn bucket contains. */
export const PORTRAIT_BUCKET_SIZE = PORTRAIT_SEEDS.length

/** A random seed with enough entropy to avoid collisions across buckets. */
function randomSeed(): string {
  return Math.random().toString(36).slice(2, 12)
}

/** Draw a fresh bucket of random portraits (non-deterministic between calls). */
export function randomPortraits(count = PORTRAIT_BUCKET_SIZE): Portrait[] {
  return Array.from({ length: count }, () => {
    const seed = randomSeed()
    return { seed, url: portraitUrl(seed) }
  })
}
