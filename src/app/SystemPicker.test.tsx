import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import type { User } from '@supabase/supabase-js'
import { renderWithI18n } from '../test/i18n'
import { SystemPicker } from './SystemPicker'

vi.mock('../auth', () => ({ useAuth: vi.fn() }))
vi.mock('../api', () => ({ countCharactersBySystem: vi.fn() }))

import { useAuth } from '../auth'
import { countCharactersBySystem } from '../api'

const USER = { id: 'user-1' } as unknown as User

function renderPicker() {
  return renderWithI18n(<SystemPicker onSelect={() => {}} />)
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useAuth).mockReturnValue({ user: USER, loading: false } as ReturnType<typeof useAuth>)
  vi.mocked(countCharactersBySystem).mockResolvedValue({ mazes: 3 })
})

describe('SystemPicker', () => {
  it('shows each system with the signed-in user’s character count', async () => {
    renderPicker()
    // Mazes has 3 characters; Rauks (absent from the map) shows 0.
    await waitFor(() => expect(screen.getByText('3 characters')).toBeInTheDocument())
    expect(screen.getByText('0 characters')).toBeInTheDocument()
  })

  it('pluralizes a single character', async () => {
    vi.mocked(countCharactersBySystem).mockResolvedValue({ mazes: 1 })
    renderPicker()
    await waitFor(() => expect(screen.getByText('1 character')).toBeInTheDocument())
  })

  it('shows no counts when signed out', async () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false } as ReturnType<typeof useAuth>)
    renderPicker()
    // The system cards still render, but no count line appears.
    expect(screen.getByText('Mazes')).toBeInTheDocument()
    expect(screen.queryByText(/\d+ character/)).not.toBeInTheDocument()
    expect(countCharactersBySystem).not.toHaveBeenCalled()
  })

  it('does not fetch counts while auth is still loading', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: true } as ReturnType<typeof useAuth>)
    renderPicker()
    expect(countCharactersBySystem).not.toHaveBeenCalled()
  })
})
