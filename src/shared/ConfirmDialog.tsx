import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Generic confirmation modal. Presentational and dumb: the parent owns all
 * async state (`busy`, `error`) and lifecycle. Mirrors LoginModal conventions —
 * portal to body, close on Escape, close on overlay click, stone/amber theme.
 */
export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  busyLabel = 'Working…',
  destructive = false,
  busy = false,
  error = null,
  onConfirm,
  onCancel,
}: {
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
  // Close on Escape (ignored while busy).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, busy])

  const confirmClasses = destructive
    ? 'border-red-600/50 bg-red-600/10 text-red-300 hover:bg-red-600/20'
    : 'border-amber-600/50 bg-amber-600/10 text-amber-300 hover:bg-amber-600/20'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => !busy && onCancel()}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className="mb-3 text-xl font-bold text-stone-100">{title}</h2>
        <div className="text-sm leading-relaxed text-stone-300">{message}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-400 transition-colors hover:text-stone-200 disabled:opacity-50"
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
