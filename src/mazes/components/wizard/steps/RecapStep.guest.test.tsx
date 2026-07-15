// A signed-in guest may build a character but not save it: the save button is
// disabled and shows the "wait for validation" copy. A signed-in member (role
// 'user') sees the normal save button. The server (RLS) is the real gate; this
// covers the UX side.
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../../../../test/i18n'
import { RecapStep } from './RecapStep'
import { emptyDraft, type CharacterDraft } from '../../../rules/character'
import { getCurrentUserRole } from '../../../../api'

vi.mock('../../../../auth', () => ({
  useAuth: () => ({ user: { id: 'u1' }, loading: false }),
}))
vi.mock('../../../../api', () => ({
  saveCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  listCharacters: vi.fn().mockResolvedValue([]),
  getCurrentUserRole: vi.fn(),
}))

function draft(): CharacterDraft {
  return {
    ...emptyDraft(),
    role: 'Fighter',
    aspect: 'Sword',
    classId: 'monster-slayer',
    answers: [0, 2],
    name: 'Ironwolf',
  }
}

describe('RecapStep guest gating', () => {
  it('disables saving and explains why for a guest', async () => {
    vi.mocked(getCurrentUserRole).mockResolvedValue('guest')
    renderWithI18n(
      <RecapStep draft={draft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    const button = await screen.findByRole('button', {
      name: /wait for the admin to validate/i,
    })
    expect(button).toBeDisabled()
  })

  it('lets a validated member (role "user") save normally', async () => {
    vi.mocked(getCurrentUserRole).mockResolvedValue('user')
    renderWithI18n(
      <RecapStep draft={draft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    const button = await screen.findByRole('button', { name: /save character/i })
    expect(button).toBeEnabled()
  })
})
