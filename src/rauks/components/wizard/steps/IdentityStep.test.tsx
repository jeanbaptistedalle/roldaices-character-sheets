import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithI18n } from '../../../../test/i18n'
import { IdentityStep } from './IdentityStep'
import { emptyDraft } from '../../../rules/character'

describe('IdentityStep', () => {
  it('dispatches setName as the name field changes', () => {
    const dispatch = vi.fn()
    renderWithI18n(<IdentityStep draft={emptyDraft()} dispatch={dispatch} />)
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Arakel' } })
    expect(dispatch).toHaveBeenCalledWith({ type: 'setName', name: 'Arakel' })
  })

  it('toggles Imperial and disables the origin input when on', () => {
    const dispatch = vi.fn()
    const { rerender } = renderWithI18n(<IdentityStep draft={emptyDraft()} dispatch={dispatch} />)
    fireEvent.click(screen.getByLabelText(/Imperial/))
    expect(dispatch).toHaveBeenCalledWith({ type: 'setImperial', value: true })
    rerender(<IdentityStep draft={{ ...emptyDraft(), imperial: true }} dispatch={dispatch} />)
    expect(screen.getByLabelText(/Origin/)).toBeDisabled()
  })

  it('adds, edits, and removes traits & trauma entries', () => {
    const dispatch = vi.fn()
    const { rerender } = renderWithI18n(<IdentityStep draft={emptyDraft()} dispatch={dispatch} />)
    fireEvent.click(screen.getByText('Add a feature/trauma'))
    expect(dispatch).toHaveBeenCalledWith({ type: 'addTraitAndTrauma' })

    const draft = { ...emptyDraft(), traitsAndTrauma: ['A limp from Vhalto'] }
    rerender(<IdentityStep draft={draft} dispatch={dispatch} />)
    fireEvent.change(screen.getByDisplayValue('A limp from Vhalto'), {
      target: { value: 'A limp from Vhalto (worse in the cold)' },
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'setTraitAndTrauma',
      index: 0,
      value: 'A limp from Vhalto (worse in the cold)',
    })

    fireEvent.click(screen.getByLabelText('Remove this feature/trauma'))
    expect(dispatch).toHaveBeenCalledWith({ type: 'removeTraitAndTrauma', index: 0 })

    rerender(
      <IdentityStep
        draft={{ ...emptyDraft(), traitsAndTrauma: ['a', 'b', 'c', 'd'] }}
        dispatch={dispatch}
      />,
    )
    expect(screen.queryByText('Add a feature/trauma')).not.toBeInTheDocument()
  })
})
