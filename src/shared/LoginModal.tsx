import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth'

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common')
  const { signInWithDiscord } = useAuth()
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

  async function onDiscord() {
    setError(null)
    const { error } = (await signInWithDiscord()) as { error: unknown }
    if (error) {
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

        <button
          type="button"
          onClick={onDiscord}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('login.discord')}
        </button>

        <p className="mt-4 text-sm leading-relaxed text-stone-400">
          {t('login.discordHint')}
        </p>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>,
    document.body,
  )
}
