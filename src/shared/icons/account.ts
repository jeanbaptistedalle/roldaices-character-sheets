import type { IconifyIcon } from '@iconify/react'

/**
 * Generic account glyph for the profile menu trigger when no avatar is
 * available (anonymous visitors), bundled offline like the other icons here.
 */
export const accountIcon: IconifyIcon = {
  width: 24,
  height: 24,
  body:
    '<circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>',
}
