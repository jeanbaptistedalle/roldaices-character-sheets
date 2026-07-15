// Guest gating for the Rauks recap (mirrors the Mazes test). A signed-in guest
// can't save; a validated member can. RLS is the real gate — this is the UX.
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
    traits: { physical: 4, perception: 3, mental: 3, charisma: 3, competence: 3, rerolls: 2 },
    skillIds: ['gorilla', 'shadow', 'lawyer'],
    name: 'Arakel',
    origin: 'Vhalto',
  }
}

describe('RecapStep guest gating (rauks)', () => {
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
