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
})
