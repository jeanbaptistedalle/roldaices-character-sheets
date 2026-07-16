import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SYSTEMS } from './registry'
import { getSystemT } from './system'
import { useAuth } from '../auth'
import { countCharactersBySystem } from '../api'

export function SystemPicker({ onSelect }: { onSelect: (id: string) => void }) {
  const { t, i18n } = useTranslation('common')
  const { user, loading: authLoading } = useAuth()
  const [counts, setCounts] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    if (authLoading || !user) {
      setCounts(null)
      return
    }
    let cancelled = false
    countCharactersBySystem()
      .then((c) => {
        if (!cancelled) setCounts(c)
      })
      .catch(() => {
        if (!cancelled) setCounts(null)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key on the stable id; `user` gets a new
    // reference on every token refresh, which would otherwise retrigger the fetch.
  }, [authLoading, user?.id])

  return (
    <div className="flex-1 bg-page text-ink">
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          {t('brand')}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          {t('picker.subtitle')}
        </p>

        <section className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {SYSTEMS.map((system) => {
            const tSystem = getSystemT(i18n, system.i18nNamespace)
            const count = counts?.[system.id] ?? 0
            return (
              <button
                key={system.id}
                type="button"
                onClick={() => onSelect(system.id)}
                className="rounded-xl border border-border bg-surface/60 p-6 text-left transition-colors hover:border-accent/50"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-accent/80">
                  {tSystem('publisher')}
                </div>
                <div className="mt-2 text-2xl font-bold text-ink">
                  {tSystem('name')}
                </div>
                <div className="mt-2 text-sm text-ink-muted">{tSystem('tagline')}</div>
                {counts && (
                  <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                    {t('picker.characterCount', { count })}
                  </div>
                )}
              </button>
            )
          })}
        </section>
      </main>
    </div>
  )
}
