import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../auth'
import { LoginModal } from '../shared/LoginModal'
import { displayNameOf, avatarUrlOf } from './userDisplay'
import { LanguageToggle } from './LanguageToggle'

export function Header() {
  const { t } = useTranslation('common')
  const { user, loading, signOut } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const displayName = displayNameOf(user)
  const avatarUrl = avatarUrlOf(user)

  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link
          to="/"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500/80 transition-colors hover:text-amber-400"
        >
          {t('brand')}
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/jeanbaptistedalle/roldaices-character-sheets"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('header.github')}
            title={t('header.github')}
            className="text-stone-400 transition-colors hover:text-stone-100"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <LanguageToggle />
          {loading ? null : user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-1 text-sm text-stone-300 transition-colors hover:text-stone-100"
              >
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-7 w-7 rounded-full border border-stone-700"
                  />
                )}
                <span className="max-w-[12rem] truncate">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
              >
                {t('header.logOut')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg border border-amber-600/50 bg-amber-600/10 px-4 py-1.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-600/20"
            >
              {t('header.logIn')}
            </button>
          )}
        </div>
      </div>

      {modalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </header>
  )
}
