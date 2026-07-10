import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RauksApp } from './RauksApp'

vi.mock('../auth', () => ({ useAuth: () => ({ user: null, loading: false }) }))
vi.mock('../api', () => ({
  listCharacters: vi.fn().mockResolvedValue([]),
  deleteCharacter: vi.fn(),
}))

describe('RauksApp', () => {
  it('renders the home landing with a create button when logged out', () => {
    render(<RauksApp onExit={vi.fn()} />)
    expect(screen.getByText(/Rauks Character Sheets/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create a Character/i })).toBeInTheDocument()
  })
})
