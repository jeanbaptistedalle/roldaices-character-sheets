import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth'

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common')
  const { signInWithDiscord, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)

  // Close on Escape, or on a browser back/forward navigation (the modal is
  // rendered from the persistent header, so its state outlives a route change).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    window.addEventListener('popstate', onClose)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', onClose)
    }
  }, [onClose])

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    setError(null)
    const { error } = (await signInWithEmail(email)) as { error: unknown }
    if (error) {
      setStatus('error')
      setError(t('login.errorEmail'))
      return
    }
    setStatus('sent')
  }

  async function onDiscord() {
    setError(null)
    const { error } = (await signInWithDiscord()) as { error: unknown }
    if (error) {
      setStatus('error')
      setError(t('login.errorDiscord'))
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
        aria-label={t('login.title')}
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-stone-100">{t('login.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('login.close')}
            className="text-stone-500 transition-colors hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {status === 'sent' ? (
          <p className="text-sm leading-relaxed text-stone-300">
            {t('login.sentPrefix')}
            <span className="font-semibold text-amber-400">{email}</span>
            {t('login.sentSuffix')}
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={onDiscord}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t('login.discord')}
            </button>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-stone-600">
              <span className="h-px flex-1 bg-stone-800" />
              {t('login.or')}
              <span className="h-px flex-1 bg-stone-800" />
            </div>

            <form onSubmit={onEmailSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2.5 text-stone-100 placeholder-stone-600 outline-none focus:border-amber-600/60"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-lg border border-amber-600/50 bg-amber-600/10 px-4 py-2.5 font-semibold text-amber-300 transition-colors hover:bg-amber-600/20 disabled:opacity-50"
              >
                {status === 'sending' ? t('login.sending') : t('login.submit')}
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
