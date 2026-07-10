import type { ReactElement } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

export function renderWithI18n(
  ui: ReactElement,
  opts: { lng?: 'en' | 'fr' } = {},
): RenderResult {
  void i18n.changeLanguage(opts.lng ?? 'en')
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>)
}

export function changeTestLang(lng: 'en' | 'fr') {
  return i18n.changeLanguage(lng)
}
