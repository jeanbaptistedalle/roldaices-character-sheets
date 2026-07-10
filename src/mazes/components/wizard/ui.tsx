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
          ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/40'
          : 'border-stone-800 bg-stone-900/60 hover:border-amber-600/50',
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-semibold text-stone-100">{title}</span>
        {badge && <span className="text-2xl font-bold text-amber-400">{badge}</span>}
      </div>
      {children && <div className="mt-2 text-sm text-stone-400">{children}</div>}
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
          ? 'border-amber-500 bg-amber-600 text-stone-950'
          : 'border-stone-800 bg-stone-900 text-stone-200 hover:border-amber-600/50',
      )}
    >
      {children}
    </button>
  )
}
