import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

/**
 * Generic confirmation modal. Presentational and dumb: the parent owns all
 * async state (`busy`, `error`) and lifecycle. Mirrors LoginModal conventions —
 * portal to body, close on Escape, close on overlay click, semantic theme tokens.
 */
export function ConfirmDialog(props: {
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  busyLabel?: string
  destructive?: boolean
  busy?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}) {
  const { t } = useTranslation('common')
  const {
    title,
    message,
    confirmLabel = t('confirm.confirm'),
    cancelLabel = t('confirm.cancel'),
    busyLabel = t('confirm.busy'),
    destructive = false,
    busy = false,
    error = null,
    onConfirm,
    onCancel,
  } = props
  // Close on Escape (ignored while busy).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, busy])

  const confirmClasses = destructive
    ? 'border-red-600/50 bg-red-600/10 text-red-300 hover:bg-red-600/20'
    : 'border-accent/50 bg-accent/10 text-accent-selected-text hover:bg-accent/20'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => !busy && onCancel()}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className="mb-3 text-xl font-bold text-ink">{title}</h2>
        <div className="text-sm leading-relaxed text-ink-secondary">{message}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink-secondary disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${confirmClasses}`}
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </div>,
    document.body,
  )
}
