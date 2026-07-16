import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../../../test/i18n'
import { CharacterWizard } from './CharacterWizard'

vi.mock('../../../auth', () => ({ useAuth: () => ({ user: null, loading: false }) }))
vi.mock('../../../api', () => ({
  saveCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  listCharacters: vi.fn().mockResolvedValue([]),
}))

describe('CharacterWizard', () => {
  it('starts on the traits step and cannot advance until 18 points are spent', () => {
    renderWithI18n(
      <CharacterWizard systemId="rauks" onExit={vi.fn()} onSaved={vi.fn()} characterCount={0} />,
    )
    expect(screen.getByText('Assign your traits')).toBeInTheDocument()
    // Default all-2 traits sum to 12 -> Next is disabled.
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('shows the at-limit warning when the count is at the cap', () => {
    renderWithI18n(
      <CharacterWizard systemId="rauks" onExit={vi.fn()} onSaved={vi.fn()} characterCount={5} />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(/limit of 5/)
  })
})
