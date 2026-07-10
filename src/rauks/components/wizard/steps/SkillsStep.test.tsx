import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithI18n } from '../../../../test/i18n'
import { SkillsStep } from './SkillsStep'
import { emptyDraft, type CharacterDraft } from '../../../rules/character'

function draftWith(overrides: Partial<CharacterDraft>): CharacterDraft {
  return { ...emptyDraft(), ...overrides }
}

describe('SkillsStep', () => {
  it('shows the picked/budget counter', () => {
    const draft = draftWith({
      traits: { ...emptyDraft().traits, competence: 3 },
      skillIds: ['gorilla'],
    })
    renderWithI18n(<SkillsStep draft={draft} dispatch={vi.fn()} />)
    expect(screen.getByTestId('skill-count')).toHaveTextContent('1 / 3')
  })

  it('dispatches toggleSkill when a skill card is clicked', () => {
    const dispatch = vi.fn()
    const draft = draftWith({ traits: { ...emptyDraft().traits, competence: 2 } })
    renderWithI18n(<SkillsStep draft={draft} dispatch={dispatch} />)
    fireEvent.click(screen.getByRole('button', { name: /Gorilla/ }))
    expect(dispatch).toHaveBeenCalledWith({ type: 'toggleSkill', id: 'gorilla' })
  })

  it('disables unselected skills once the budget is full', () => {
    const draft = draftWith({
      traits: { ...emptyDraft().traits, competence: 1 },
      skillIds: ['gorilla'],
    })
    renderWithI18n(<SkillsStep draft={draft} dispatch={vi.fn()} />)
    // A different, unselected skill is disabled.
    expect(screen.getByRole('button', { name: /Shadow/ })).toBeDisabled()
    // The selected one stays enabled so it can be toggled off.
    expect(screen.getByRole('button', { name: /Gorilla/ })).not.toBeDisabled()
  })
})
