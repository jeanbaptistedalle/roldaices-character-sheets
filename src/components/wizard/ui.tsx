import type { ReactNode } from 'react'
import { STEPS, type Step } from './wizardReducer'

/** Tiny className joiner (no dependency). */
export function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

const STEP_LABELS: Record<Step, string> = {
  role: 'Role',
  aspect: 'Aspect',
  class: 'Class',
  edges: 'Edges',
  identity: 'Identity',
  recap: 'Recap',
}

export function ProgressSteps({
  current,
  onGoto,
}: {
  current: number
  onGoto: (index: number) => void
}) {
  return (
    <ol className="mb-10 flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={i > current}
              onClick={() => onGoto(i)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors',
                active && 'bg-amber-600 text-stone-950',
                done && 'bg-stone-800 text-amber-400 hover:bg-stone-700',
                !active && !done && 'bg-stone-900 text-stone-600',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem]',
                  active ? 'bg-stone-950/30' : 'bg-stone-950/40',
                )}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{STEP_LABELS[step]}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={cn('h-px w-4 sm:w-8', done ? 'bg-amber-600/60' : 'bg-stone-800')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function StepShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section>
      <header className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500/80">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-stone-100">{title}</h2>
        {intro && <p className="mx-auto mt-3 max-w-xl text-stone-400">{intro}</p>}
      </header>
      {children}
    </section>
  )
}

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
