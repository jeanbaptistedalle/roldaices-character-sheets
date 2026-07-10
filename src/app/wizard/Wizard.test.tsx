import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Wizard } from './Wizard'
import type { WizardConfig } from './WizardState'

interface Draft {
  name: string
}
type Action = { type: 'setName'; name: string }

const config: WizardConfig<Draft, Action> = {
  emptyDraft: () => ({ name: '' }),
  draftReducer: (draft, action) =>
    action.type === 'setName' ? { ...draft, name: action.name } : draft,
  steps: [
    {
      key: 'name',
      label: 'Name',
      canAdvance: (d) => d.name !== '',
      render: ({ draft, dispatch }) => (
        <input
          aria-label="name"
          value={draft.name}
          onChange={(e) => dispatch({ type: 'setName', name: e.target.value })}
        />
      ),
    },
    {
      key: 'recap',
      label: 'Recap',
      terminal: true,
      canAdvance: () => true,
      render: () => <p>All done</p>,
    },
  ],
}

function renderWizard(overrides: Partial<React.ComponentProps<typeof Wizard>> = {}) {
  return render(
    <Wizard
      config={config}
      onExit={vi.fn()}
      onSaved={vi.fn()}
      characterCount={0}
      {...overrides}
    />,
  )
}

describe('Wizard', () => {
  it('starts on the first step with Next disabled until it can advance', () => {
    renderWizard()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Zed' } })
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('advances to the terminal step, which shows Back but no Next', () => {
    renderWizard()
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Zed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('All done')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('opens editing drafts on the terminal step', () => {
    renderWizard({ editing: { id: 'x1', draft: { name: 'Seed' } } })
    expect(screen.getByText('All done')).toBeInTheDocument()
  })

  it('shows the at-limit warning at the cap', () => {
    renderWizard({ characterCount: 5 })
    expect(screen.getByRole('alert')).toHaveTextContent(/limit of 5/)
  })
})
