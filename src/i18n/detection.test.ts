import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import i18n from './index'
import { LANG_STORAGE_KEY } from './config'

describe('language resolution', () => {
  const originalLng = i18n.resolvedLanguage ?? 'en'

  beforeEach(() => {
    localStorage.clear()
  })

  afterAll(async () => {
    // Avoid leaking a mutated language into other test files sharing this
    // singleton i18n instance.
    localStorage.clear()
    await i18n.changeLanguage(originalLng)
  })

  it('collapses regional variants to the base language', async () => {
    await i18n.changeLanguage('fr-FR')
    expect(i18n.resolvedLanguage).toBe('fr')
  })

  it('falls back to English for unsupported languages', async () => {
    await i18n.changeLanguage('de')
    // 'de' is not in `supportedLngs`, so it should resolve through
    // `fallbackLng: 'en'`. Verified this resolves `resolvedLanguage` to
    // 'en' directly in this jsdom test env (checked via a throwaway probe
    // before committing to this assertion), so we assert it directly
    // rather than only checking a translated key's fallback value.
    expect(i18n.resolvedLanguage).toBe('en')
  })

  it('persists an explicit choice to localStorage', async () => {
    await i18n.changeLanguage('fr')
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('fr')
  })
})
