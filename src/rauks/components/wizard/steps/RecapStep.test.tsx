import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../../../../test/i18n'
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
    renderWithI18n(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.getByText('Arakel')).toBeInTheDocument()
    expect(screen.getByText('Gorilla')).toBeInTheDocument()
    expect(screen.getByText('Charisma')).toBeInTheDocument()
  })

  it('prompts to log in to save when logged out', () => {
    renderWithI18n(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.getByRole('button', { name: /Log in to save/ })).toBeInTheDocument()
  })

  it('shows the calculated reroll total under the rerolls trait (1 + 2 × value)', () => {
    renderWithI18n(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    // rerolls = 2 => 1 + 2 × 2 = 5
    expect(screen.getByTestId('recap-reroll-total')).toHaveTextContent('5 rerolls')
  })

  it('labels the competence trait via the localized characteristics term (not a hardcoded "Skill")', () => {
    renderWithI18n(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.getByTestId('recap-trait-label-competence')).toHaveTextContent('Skills')
    expect(screen.queryByText('Competence')).not.toBeInTheDocument()
  })

  it('localizes the competence trait label in French too', () => {
    renderWithI18n(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
      { lng: 'fr' },
    )
    expect(screen.getByTestId('recap-trait-label-competence')).toHaveTextContent('Compétences')
    expect(screen.queryByText('Skill')).not.toBeInTheDocument()
  })

  it('does not mention Karma', () => {
    renderWithI18n(
      <RecapStep draft={completeDraft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />,
    )
    expect(screen.queryByText(/Karma/)).not.toBeInTheDocument()
  })
})
