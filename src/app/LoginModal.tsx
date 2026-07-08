import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../auth'

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { signInWithDiscord, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    setError(null)
    const { error } = (await signInWithEmail(email)) as { error: unknown }
    if (error) {
      setStatus('error')
      setError("Couldn't send the link. Check the address and try again.")
      return
    }
    setStatus('sent')
  }

  async function onDiscord() {
    setError(null)
    const { error } = (await signInWithDiscord()) as { error: unknown }
    if (error) {
      setStatus('error')
      setError("Couldn't start Discord sign-in. Try again.")
    }
    // On success the browser redirects away; nothing more to do here.
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Log in"
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-stone-100">Log in</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-stone-500 transition-colors hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {status === 'sent' ? (
          <p className="text-sm leading-relaxed text-stone-300">
            Check your inbox — we sent a magic link to{' '}
            <span className="font-semibold text-amber-400">{email}</span>. Open
            it on this device to finish logging in.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={onDiscord}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Continue with Discord
            </button>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-600">
              <span className="h-px flex-1 bg-stone-800" />
              or
              <span className="h-px flex-1 bg-stone-800" />
            </div>

            <form onSubmit={onEmailSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 placeholder-stone-600 outline-none focus:border-amber-600/60"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-lg border border-amber-600/50 bg-amber-600/10 px-4 py-2.5 font-semibold text-amber-300 transition-colors hover:bg-amber-600/20 disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending…' : 'Send an invitation link'}
              </button>
            </form>
          </>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>,
    document.body,
  )
}
