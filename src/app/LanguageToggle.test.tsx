import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithI18n } from '../test/i18n'
import { LanguageToggle } from './LanguageToggle'
import i18n from '../i18n'
import { LANG_STORAGE_KEY } from '../i18n/config'

describe('LanguageToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    return i18n.changeLanguage('en')
  })

  it('switches language and persists the choice', async () => {
    renderWithI18n(<LanguageToggle />)
    fireEvent.click(screen.getByRole('button', { name: 'FR' }))
    expect(i18n.language).toBe('fr')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('fr')
  })
})
