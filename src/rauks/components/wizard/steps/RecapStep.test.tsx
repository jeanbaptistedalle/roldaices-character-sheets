import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecapStep } from './RecapStep'
import { emptyDraft, type CharacterDraft } from '../../../rules/character'

vi.mock('../../../../auth', () => ({ useAuth: () => ({ user: null, loading: false }) }))
vi.mock('../../../../api', () => ({
  saveCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  listCharacters: vi.fn().mockResolvedValue([]),
}))

function completeDraft(): CharacterDraft {
  return {
    ...emptyDraft(),
    traits: { physical: 4, perception: 3, mental: 3, charisma: 3, competence: 3, rerolls: 2 },
    skillIds: ['gorilla', 'shadow', 'lawyer'],
    name: 'Arakel',
    origin: 'Vhalto',
  }
}

describe('RecapStep', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the built character name, traits, and chosen skills', () => {
    render(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.getByText('Arakel')).toBeInTheDocument()
    expect(screen.getByText('Gorilla')).toBeInTheDocument()
    expect(screen.getByText('Charisma')).toBeInTheDocument()
  })

  it('prompts to log in to save when logged out', () => {
    render(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.getByRole('button', { name: /Log in to save/ })).toBeInTheDocument()
  })
})
