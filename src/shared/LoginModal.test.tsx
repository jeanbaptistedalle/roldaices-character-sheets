import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../test/i18n'
import { LoginModal } from './LoginModal'

vi.mock('../auth', () => ({
  useAuth: () => ({ signInWithDiscord: vi.fn().mockResolvedValue({ error: null }) }),
}))

describe('LoginModal', () => {
  it('offers Discord sign-in only — no email form', () => {
    renderWithI18n(<LoginModal onClose={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: /continue with discord/i }),
    ).toBeInTheDocument()
    // Email auth was removed: no text input and no email field.
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/@/)).not.toBeInTheDocument()
  })

  it('explains that access is gated on Discord membership', () => {
    renderWithI18n(<LoginModal onClose={vi.fn()} />)
    expect(screen.getByText(/members of our Discord server/i)).toBeInTheDocument()
  })
})
