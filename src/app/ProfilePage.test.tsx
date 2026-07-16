import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { renderWithI18n } from '../test/i18n'
import { ProfilePage } from './ProfilePage'

vi.mock('../auth', () => ({ useAuth: vi.fn() }))
vi.mock('../api', () => ({
  getCurrentProfile: vi.fn(),
  countCharactersBySystem: vi.fn(),
}))

import { useAuth } from '../auth'
import { getCurrentProfile, countCharactersBySystem } from '../api'

const USER = {
  email: 'grit@example.com',
  user_metadata: { full_name: 'Grit' },
} as unknown as User

function renderPage() {
  return renderWithI18n(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.mocked(useAuth).mockReturnValue({ user: USER, loading: false } as ReturnType<typeof useAuth>)
  vi.mocked(getCurrentProfile).mockResolvedValue({
    id: 'user-1',
    email: 'grit@example.com',
    role: 'admin',
    createdAt: '2026-07-09T00:00:00Z',
    lastSeenAt: '2026-07-09T00:00:00Z',
  })
  vi.mocked(countCharactersBySystem).mockResolvedValue({ mazes: 5 })
})

describe('ProfilePage', () => {
  it('shows the username and friendly role label', async () => {
    renderPage()
    expect(screen.getByText('Grit')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Admin')).toBeInTheDocument())
  })

  it('lists every registered system with count / 5', async () => {
    renderPage()
    // Mazes is a registered system; it has 5 characters (at the limit).
    await waitFor(() => expect(screen.getByText('Mazes')).toBeInTheDocument())
    expect(screen.getByText('5 / 5')).toBeInTheDocument()
  })

  it('shows 0 / 5 in the muted style for systems with no characters', async () => {
    vi.mocked(countCharactersBySystem).mockResolvedValue({})
    renderPage()
    // Every registered system shows "0 / 5" when the user has no characters.
    await waitFor(() => expect(screen.getAllByText('0 / 5').length).toBeGreaterThan(0))
    const countEl = screen.getAllByText('0 / 5')[0]
    expect(countEl.className).not.toContain('accent-hover')
    expect(countEl.className).toContain('ink-muted')
  })

  it('links each system row to its game route', async () => {
    renderPage()
    const link = await screen.findByRole('link', { name: /Mazes/ })
    expect(link).toHaveAttribute('href', '/mazes')
  })

  it('states the per-system character limit', async () => {
    renderPage()
    await waitFor(() =>
      expect(screen.getByText(/up to 5 characters per game/i)).toBeInTheDocument(),
    )
  })

  it('redirects away when signed out', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false } as ReturnType<typeof useAuth>)
    renderPage()
    expect(screen.queryByText('Characters')).not.toBeInTheDocument()
  })
})
