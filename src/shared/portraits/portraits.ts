// A small gallery of portrait options generated locally with the DiceBear
// library (@dicebear/core + the adventurer style from @dicebear/collection).
// Avatars are rendered to deterministic data URIs — no network request, no
// API key. We store the selected data URI on the character (ready for Supabase);
// we host nothing ourselves.
//
// System-agnostic: any TTRPG system can reuse this and the PortraitPicker.

import { createAvatar } from '@dicebear/core'
import { adventurer } from '@dicebear/collection'

/** How many portraits a gallery always contains. */
export const PORTRAIT_COUNT = 16

/** Build a deterministic DiceBear SVG data URI for a seed. */
export function portraitUrl(seed: string): string {
  return createAvatar(adventurer, { seed }).toDataUri()
}

export interface Portrait {
  seed: string
  url: string
}

/** A random seed with enough entropy to avoid collisions across buckets. */
function randomSeed(): string {
  return Math.random().toString(36).slice(2, 12)
}

/** Draw a fresh bucket of random portraits (non-deterministic between calls). */
export function randomPortraits(count = PORTRAIT_COUNT): Portrait[] {
  return Array.from({ length: count }, () => {
    const seed = randomSeed()
    return { seed, url: portraitUrl(seed) }
  })
}
