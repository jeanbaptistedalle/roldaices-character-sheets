import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth'
import {
  getCurrentProfile,
  countCharactersBySystem,
  type ProfileRecord,
} from '../api'
import { SYSTEMS } from './registry'
import { getSystemT } from './system'
import { MAX_CHARACTERS_PER_SYSTEM } from './limits'
import { displayNameOf, avatarUrlOf } from './userDisplay'

export function ProfilePage() {
  const { t, i18n } = useTranslation('common')
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading || !user) return
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([getCurrentProfile(), countCharactersBySystem()])
      .then(([p, c]) => {
        if (cancelled) return
        setProfile(p)
        setCounts(c)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : t('profile.loadError'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key on the stable id; `user` gets a new
    // reference on every token refresh, which would otherwise retrigger the fetch.
  }, [authLoading, user?.id])

  if (authLoading) return null
  if (!user) return <Navigate to="/" replace />

  const displayName = displayNameOf(user)
  const avatarUrl = avatarUrlOf(user)
  const roleLabel = profile ? t(`profile.roles.${profile.role}`) : null

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Link to="/" className="text-sm text-ink-muted transition-colors hover:text-ink-secondary">
        {t('profile.back')}
      </Link>

      <section className="mt-6 flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-16 w-16 rounded-full border border-border"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-hover text-2xl font-bold text-ink-secondary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-ink">{displayName}</h1>
          {roleLabel && (
            <span className="mt-1 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent-selected-text">
              {roleLabel}
            </span>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent/80">
          {t('profile.charactersHeading')}
        </h2>
        <p className="mt-1 text-xs text-ink-muted">
          {t('profile.limitNote', { max: MAX_CHARACTERS_PER_SYSTEM })}
        </p>

        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : loading ? (
          <p className="mt-4 text-sm text-ink-muted">{t('profile.loading')}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {SYSTEMS.map((system) => {
              const count = counts[system.id] ?? 0
              const full = count >= MAX_CHARACTERS_PER_SYSTEM
              const tSystem = getSystemT(i18n, system.i18nNamespace)
              return (
                <li key={system.id}>
                  <Link
                    to={`/${system.id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-4 py-3 transition-colors hover:border-ink-muted hover:bg-surface"
                  >
                    <span className="text-ink-secondary">{tSystem('name')}</span>
                    <span
                      className={
                        full
                          ? 'text-sm font-semibold text-accent-hover'
                          : 'text-sm text-ink-muted'
                      }
                    >
                      {count} / {MAX_CHARACTERS_PER_SYSTEM}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </main>
  )
}
