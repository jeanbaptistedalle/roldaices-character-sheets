import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithI18n } from '../test/i18n'
import { ProfileMenu } from './ProfileMenu'
import { getThemeMode, setThemeMode } from '../theme'
import i18n from '../i18n'

const AUTH_USER = { displayName: 'Grit', avatarUrl: undefined }

function renderMenu(
  props: Partial<{
    user: { displayName: string; avatarUrl: string | undefined } | null
    onSignOut: () => void
    onLogIn: () => void
  }> = {},
) {
  const onSignOut = props.onSignOut ?? vi.fn()
  const onLogIn = props.onLogIn ?? vi.fn()
  const user = 'user' in props ? props.user! : AUTH_USER
  renderWithI18n(
    <MemoryRouter>
      <ProfileMenu user={user} onSignOut={onSignOut} onLogIn={onLogIn} />
    </MemoryRouter>,
  )
  return { onSignOut, onLogIn }
}

function openMenu(triggerName: string) {
  fireEvent.click(screen.getByRole('button', { name: triggerName }))
}

describe('ProfileMenu', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    setThemeMode('system')
    return i18n.changeLanguage('en')
  })

  describe('authenticated', () => {
    it('is closed until the trigger is clicked', () => {
      renderMenu()
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      openMenu('Open profile menu')
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('links to the profile page', () => {
      renderMenu()
      openMenu('Open profile menu')
      expect(screen.getByRole('menuitem', { name: 'View profile' })).toHaveAttribute(
        'href',
        '/profile',
      )
    })

    it('switches theme from within the menu', () => {
      renderMenu()
      openMenu('Open profile menu')
      fireEvent.click(screen.getByRole('menuitemradio', { name: /Dark/ }))
      expect(getThemeMode()).toBe('dark')
    })

    it('switches language from within the menu', () => {
      renderMenu()
      openMenu('Open profile menu')
      fireEvent.click(screen.getByRole('button', { name: 'FR' }))
      expect(i18n.language).toBe('fr')
    })

    it('signs out and closes the menu', () => {
      const { onSignOut } = renderMenu()
      openMenu('Open profile menu')
      fireEvent.click(screen.getByRole('menuitem', { name: 'Log out' }))
      expect(onSignOut).toHaveBeenCalledOnce()
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('anonymous', () => {
    it('has no profile link, but keeps theme and language pickers', () => {
      renderMenu({ user: null })
      openMenu('Account menu')
      expect(screen.queryByRole('menuitem', { name: 'View profile' })).not.toBeInTheDocument()
      expect(screen.getByRole('menuitemradio', { name: /Dark/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument()
    })

    it('switches theme from within the menu without being logged in', () => {
      renderMenu({ user: null })
      openMenu('Account menu')
      fireEvent.click(screen.getByRole('menuitemradio', { name: /Dark/ }))
      expect(getThemeMode()).toBe('dark')
    })

    it('triggers log in and closes the menu', () => {
      const { onLogIn } = renderMenu({ user: null })
      openMenu('Account menu')
      fireEvent.click(screen.getByRole('menuitem', { name: 'Log in' }))
      expect(onLogIn).toHaveBeenCalledOnce()
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })
})
