import type { IconifyIcon } from '@iconify/react'

/**
 * Sun / moon / monitor glyphs for the theme picker, bundled offline like
 * `rpgDiceIcon` — monochrome line art via `currentColor`, no runtime request
 * to the Iconify API.
 */
export const sunIcon: IconifyIcon = {
  width: 24,
  height: 24,
  body:
    '<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>',
}

export const moonIcon: IconifyIcon = {
  width: 24,
  height: 24,
  body:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
}

export const systemIcon: IconifyIcon = {
  width: 24,
  height: 24,
  body:
    '<rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8 21h8M12 17v4"/>',
}
