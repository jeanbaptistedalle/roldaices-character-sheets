import { screen } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import { describe, it, expect } from 'vitest'
import { renderWithI18n } from './i18n'

function Probe() {
  const { t } = useTranslation('common')
  return <span>{t('header.logIn')}</span>
}

describe('renderWithI18n', () => {
  it('renders English by default', () => {
    renderWithI18n(<Probe />)
    expect(screen.getByText('Log in')).toBeInTheDocument()
  })
})
