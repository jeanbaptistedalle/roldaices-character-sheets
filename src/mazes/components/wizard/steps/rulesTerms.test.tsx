// Verifies every rules noun the wizard steps render (roles, aspects,
// classes, edges, resolutions, Hearts/Stars/Die, edge types, domains,
// friends places) resolves through the mazes `t()` keyed on the stable
// domain id — not a hard-coded English string baked into the rules data.
// See Task 8 and .claude/skills/mazes-rules/SKILL.md.
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../../../../test/i18n'
import { RoleStep } from './RoleStep'
import { AspectStep } from './AspectStep'
import { ClassStep } from './ClassStep'
import { EdgesStep } from './EdgesStep'
import { RecapStep } from './RecapStep'
import { emptyDraft, type CharacterDraft } from '../../../rules/character'

vi.mock('../../../../auth', () => ({ useAuth: () => ({ user: null, loading: false }) }))
vi.mock('../../../../api', () => ({
  saveCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  listCharacters: vi.fn().mockResolvedValue([]),
}))

describe('RoleStep rules terms', () => {
  it('renders every role name', () => {
    renderWithI18n(<RoleStep draft={emptyDraft()} dispatch={vi.fn()} />)
    for (const name of ['Paragon', 'Vanguard', 'Fighter', 'Sentinel']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })
})

describe('AspectStep rules terms', () => {
  it('renders every aspect name', () => {
    renderWithI18n(<AspectStep draft={emptyDraft()} dispatch={vi.fn()} />)
    for (const name of ['Sword', 'Shadow', 'Sorcery']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
  })
})

describe('ClassStep rules terms', () => {
  it('renders class names and the always-edge term for the chosen aspect', () => {
    const draft: CharacterDraft = { ...emptyDraft(), aspect: 'Sword' }
    renderWithI18n(<ClassStep draft={draft} dispatch={vi.fn()} />)
    // monster-slayer: name + always edge "well-armed" -> "Well-Armed"
    expect(screen.getByText('The Monster Slayer')).toBeInTheDocument()
    expect(screen.getAllByText('Always').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Well-Armed').length).toBeGreaterThan(0)
  })
})

describe('EdgesStep rules terms', () => {
  it('renders the always-edge, question options, and domain choices by term', () => {
    const draft: CharacterDraft = {
      ...emptyDraft(),
      aspect: 'Sorcery',
      classId: 'blazing-magician',
      answers: [undefined, undefined],
    }
    renderWithI18n(<EdgesStep draft={draft} dispatch={vi.fn()} />)
    // blazing-magician: always = magic (needs domain/school sub-choice)
    expect(screen.getAllByText('Always').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Magic').length).toBeGreaterThan(0)
    for (const domain of ['Night', 'Forge', 'Sea', 'Sky', 'Earth']) {
      expect(screen.getByText(domain)).toBeInTheDocument()
    }
  })

  it('renders friends places by term for a class with a Friends question', () => {
    const draft: CharacterDraft = {
      ...emptyDraft(),
      aspect: 'Shadow',
      classId: 'adventurous-smallfolk',
      answers: [undefined, 2],
    }
    renderWithI18n(<EdgesStep draft={draft} dispatch={vi.fn()} />)
    for (const place of ['High Places', 'Low Places', 'Wild Places', 'Dark Places']) {
      expect(screen.getByText(place)).toBeInTheDocument()
    }
  })
})

describe('RecapStep rules terms', () => {
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

  it('resolves the die/Hearts/Stars stat labels, the Edges heading, and edge type terms', () => {
    renderWithI18n(<RecapStep draft={draft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />)
    expect(screen.getByText('Die')).toBeInTheDocument()
    expect(screen.getByText('Hearts')).toBeInTheDocument()
    expect(screen.getByText('Stars')).toBeInTheDocument()
    expect(screen.getByText('Edges')).toBeInTheDocument()
    // monster-slayer answers [0,2]: well-armed (Combat), mazewise (Wise), strong (Attribute)
    expect(screen.getByText('Combat')).toBeInTheDocument()
    expect(screen.getByText('Wise')).toBeInTheDocument()
    expect(screen.getByText('Attribute')).toBeInTheDocument()
  })

  it('resolves the class and aspect terms in the intro line', () => {
    renderWithI18n(<RecapStep draft={draft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />)
    expect(screen.getByText('Sword · The Monster Slayer')).toBeInTheDocument()
  })

  it('resolves the resolution row labels, including Key and Crown', () => {
    renderWithI18n(<RecapStep draft={draft()} dispatch={vi.fn()} onSaved={vi.fn()} atLimit={false} />)
    for (const label of ['Key', 'Books', 'Boots', 'Blades', 'Bones', 'Crown']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
