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

  it('shows the calculated reroll total under the rerolls trait (1 + 2 × value)', () => {
    render(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    // rerolls = 2 => 1 + 2 × 2 = 5
    expect(screen.getByTestId('recap-reroll-total')).toHaveTextContent('5 rerolls')
  })

  it('labels the competence trait "Skill" (not "Competence")', () => {
    render(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.getByText('Skill')).toBeInTheDocument()
    expect(screen.queryByText('Competence')).not.toBeInTheDocument()
  })

  it('does not mention Karma', () => {
    render(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.queryByText(/Karma/)).not.toBeInTheDocument()
  })
})
