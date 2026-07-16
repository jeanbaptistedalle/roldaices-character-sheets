import type { ReactNode } from 'react'
import { cn, StepShell } from '../../../app/wizard/ui'

export { cn, StepShell }

export function SelectableCard({
  selected,
  onClick,
  title,
  badge,
  children,
}: {
  selected: boolean
  onClick: () => void
  title: string
  badge?: ReactNode
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex h-full w-full flex-col rounded-xl border p-5 text-left transition-colors',
        selected
          ? 'border-accent-hover bg-accent/10 ring-1 ring-accent/40'
          : 'border-border bg-surface/60 hover:border-accent/50',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-semibold text-ink">{title}</span>
        {badge && <span className="text-2xl font-bold text-accent-hover">{badge}</span>}
      </div>
      {children && <div className="mt-2 text-sm text-ink-muted">{children}</div>}
    </button>
  )
}

/** A small pill for a single chosen option (used in the Edges questions). */
export function OptionChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-accent-hover bg-accent text-accent-on'
          : 'border-border bg-surface text-ink-secondary hover:border-accent/50',
      )}
    >
      {children}
    </button>
  )
}
