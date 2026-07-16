import type { ReactNode } from 'react'

/** Tiny className joiner (no dependency). */
export function cn(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function ProgressSteps({
  steps,
  current,
  onGoto,
}: {
  steps: { key: string; label: string }[]
  current: number
  onGoto: (index: number) => void
}) {
  return (
    <ol className="mb-10 flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step.key} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled={i > current}
              onClick={() => onGoto(i)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest transition-colors',
                active && 'bg-accent text-accent-on',
                done && 'bg-surface-hover text-accent-hover hover:bg-surface',
                !active && !done && 'bg-surface text-ink-faint',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[0.7rem]',
                  active ? 'bg-surface-inset/30' : 'bg-surface-inset/40',
                )}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <span className={cn('h-px w-4 sm:w-8', done ? 'bg-accent/60' : 'bg-surface-hover')} />
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
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent/80">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-ink">{title}</h2>
        {intro && <p className="mx-auto mt-3 max-w-xl text-ink-muted">{intro}</p>}
      </header>
      {children}
    </section>
  )
}
