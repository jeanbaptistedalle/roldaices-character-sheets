import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../test/i18n'
import { RauksHome } from './RauksHome'

// Logged-in user so the character list renders (not the create-only CTA).
vi.mock('../auth', () => ({ useAuth: () => ({ user: { id: 'u1' }, loading: false }) }))
vi.mock('../api', () => ({
  listCharacters: vi.fn().mockResolvedValue([
    {
      id: '1',
      systemId: 'rauks',
      name: 'Arakel',
      description: null,
      imageUri: null,
      data: {
        traits: { physical: 3, perception: 3, mental: 3, charisma: 3, competence: 2, rerolls: 2 },
        skillIds: ['gorilla', 'shadow'],
        rauksorg: 'Lille',
      },
    },
  ]),
  deleteCharacter: vi.fn(),
}))

describe('RauksHome character list', () => {
  it('shows the Rauksorg under the name and above the skill summary', async () => {
    renderWithI18n(<RauksHome onCreate={vi.fn()} onEdit={vi.fn()} onExit={vi.fn()} />)
    const name = await screen.findByText('Arakel')
    const rauksorg = screen.getByText('Lille')
    const summary = screen.getByText('Gorilla · Shadow')
    // Document order: name → Rauksorg → skills.
    expect(name.compareDocumentPosition(rauksorg)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(rauksorg.compareDocumentPosition(summary)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
