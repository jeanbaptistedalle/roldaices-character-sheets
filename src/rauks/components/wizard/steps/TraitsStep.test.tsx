import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TraitsStep } from './TraitsStep'
import { emptyDraft } from '../../../rules/character'

describe('TraitsStep', () => {
  it('shows the six trait labels and the points-remaining counter', () => {
    render(<TraitsStep draft={emptyDraft()} dispatch={vi.fn()} />)
    for (const label of ['Physical', 'Perception', 'Mental', 'Charisma', 'Competence', 'Rerolls']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    // All traits at 2 (sum 12) => 6 points remaining.
    expect(screen.getByTestId('points-remaining')).toHaveTextContent('6')
  })

  it('dispatches setTrait with the incremented value when + is clicked', () => {
    const dispatch = vi.fn()
    render(<TraitsStep draft={emptyDraft()} dispatch={dispatch} />)
    fireEvent.click(screen.getByLabelText('Increase Physical'))
    expect(dispatch).toHaveBeenCalledWith({ type: 'setTrait', key: 'physical', value: 3 })
  })

  it('disables decrement at the floor', () => {
    const draft = { ...emptyDraft(), traits: { ...emptyDraft().traits, physical: 1 } }
    render(<TraitsStep draft={draft} dispatch={vi.fn()} />)
    expect(screen.getByLabelText('Decrease Physical')).toBeDisabled()
  })

  it('shows the calculated reroll total on the rerolls card (1 + 2 × value)', () => {
    const draft = { ...emptyDraft(), traits: { ...emptyDraft().traits, rerolls: 3 } }
    render(<TraitsStep draft={draft} dispatch={vi.fn()} />)
    // 1 + 2 × 3 = 7
    expect(screen.getByTestId('reroll-total')).toHaveTextContent('7 rerolls')
  })
})
