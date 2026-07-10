import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressSteps, cn } from './ui'

describe('cn', () => {
  it('joins truthy parts and drops falsy ones', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b')
  })
})

describe('ProgressSteps', () => {
  const steps = [
    { key: 'one', label: 'One' },
    { key: 'two', label: 'Two' },
    { key: 'three', label: 'Three' },
  ]

  it('renders a labelled button per step', () => {
    render(<ProgressSteps steps={steps} current={0} onGoto={vi.fn()} />)
    expect(screen.getByRole('button', { name: /One/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Three/ })).toBeInTheDocument()
  })

  it('disables steps ahead of the current one', () => {
    render(<ProgressSteps steps={steps} current={0} onGoto={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Two/ })).toBeDisabled()
  })
})
