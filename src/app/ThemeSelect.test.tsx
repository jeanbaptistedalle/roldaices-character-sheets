import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithI18n } from '../test/i18n'
import { ThemeSelect } from './ThemeSelect'
import { getThemeMode, setThemeMode } from '../theme'
import { THEME_STORAGE_KEY } from '../theme/config'

describe('ThemeSelect', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    setThemeMode('system')
  })

  it('switches theme and persists the choice', () => {
    renderWithI18n(<ThemeSelect />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'dark' } })
    expect(getThemeMode()).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })
})
