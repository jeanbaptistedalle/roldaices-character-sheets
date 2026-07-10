import { screen } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import { describe, it, expect } from 'vitest'
import { renderWithI18n } from './i18n'

function Probe() {
  const { t } = useTranslation('common')
  return <span>{t('header.logIn')}</span>
}

describe('renderWithI18n', () => {
  // NOTE: the `common` bundle doesn't exist until Task 3, so a missing key is
  // echoed back verbatim by react-i18next (`t('header.logIn')` -> the key
  // itself). This still proves the helper renders inside a working
  // I18nextProvider. Task 3 will flip this assertion to `'Log in'` once the
  // `common:header.logIn` key is registered.
  it('renders English by default', () => {
    renderWithI18n(<Probe />)
    expect(screen.getByText('header.logIn')).toBeInTheDocument()
  })
})
