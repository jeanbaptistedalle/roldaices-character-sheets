import { describe, it, expect, beforeEach } from 'vitest'
import { getThemeMode, setThemeMode } from './index'
import { THEME_STORAGE_KEY } from './config'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    setThemeMode('system')
  })

  it('defaults to system with no class on <html>', () => {
    expect(getThemeMode()).toBe('system')
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('applies the dark class and persists the choice', () => {
    setThemeMode('dark')
    expect(getThemeMode()).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('switching back to system removes the class', () => {
    setThemeMode('light')
    setThemeMode('system')
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
