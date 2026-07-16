import { THEME_MODES, THEME_STORAGE_KEY, type ThemeMode } from './config'

function readStoredMode(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return (THEME_MODES as readonly string[]).includes(stored ?? '')
    ? (stored as ThemeMode)
    : 'system'
}

function applyMode(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (mode !== 'system') root.classList.add(mode)
}

let mode: ThemeMode = readStoredMode()
const listeners = new Set<() => void>()

applyMode(mode)

export function getThemeMode(): ThemeMode {
  return mode
}

export function setThemeMode(next: ThemeMode) {
  mode = next
  localStorage.setItem(THEME_STORAGE_KEY, next)
  applyMode(next)
  listeners.forEach((listener) => listener())
}

export function subscribeThemeMode(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
