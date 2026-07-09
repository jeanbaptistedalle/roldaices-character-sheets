import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
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
  return render(
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
    await waitFor(() => expect(screen.getByText('0 / 5')).toBeInTheDocument())
    const countEl = screen.getByText('0 / 5')
    expect(countEl.className).not.toContain('amber')
    expect(countEl.className).toContain('stone-400')
  })

  it('redirects away when signed out', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false } as ReturnType<typeof useAuth>)
    renderPage()
    expect(screen.queryByText('Characters')).not.toBeInTheDocument()
  })
})
