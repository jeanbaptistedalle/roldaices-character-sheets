import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { accountIcon } from '../shared/icons/account'
import { useOutsideClick } from '../shared/useOutsideClick'
import { ThemeOptions } from './ThemeOptions'
import { LanguageToggle } from './LanguageToggle'

/** Single header menu for both authenticated and anonymous visitors: same
 *  trigger/dropdown shape either way — only the profile link and the
 *  bottom log in/out action are conditional on `user`. This is also how
 *  guests reach the theme and language pickers without signing in. */
export function ProfileMenu({
  user,
  onSignOut,
  onLogIn,
}: {
  user: { displayName: string; avatarUrl: string | undefined } | null
  onSignOut: () => void
  onLogIn: () => void
}) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useOutsideClick(ref, () => setOpen(false), open)

  const triggerLabel = user ? t('header.profileMenuAria') : t('header.accountMenuAria')

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        className="flex items-center gap-2 rounded-lg px-1 text-sm text-ink-secondary transition-colors hover:text-ink"
      >
        {user ? (
          <>
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-7 w-7 rounded-full border border-border"
              />
            )}
            <span className="max-w-[12rem] truncate">{user.displayName}</span>
          </>
        ) : (
          <Icon icon={accountIcon} aria-hidden="true" className="h-5 w-5" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={triggerLabel}
          className="absolute right-0 z-50 mt-2 min-w-[12rem] rounded-lg border border-border bg-surface p-1 shadow-lg"
        >
          {user && (
            <>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
              >
                {t('header.viewProfile')}
              </Link>

              <div className="my-1 border-t border-border" />
            </>
          )}

          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {t('theme.sectionLabel')}
          </p>
          <ThemeOptions onSelect={() => setOpen(false)} />

          <div className="my-1 border-t border-border" />

          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {t('lang.sectionLabel')}
          </p>
          <div className="px-3 py-1">
            <LanguageToggle />
          </div>

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              user ? onSignOut() : onLogIn()
            }}
            className="block w-full rounded-md px-3 py-1.5 text-left text-sm text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink"
          >
            {user ? t('header.logOut') : t('header.logIn')}
          </button>
        </div>
      )}
    </div>
  )
}
