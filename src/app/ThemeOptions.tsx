import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { cn } from '../shared/cn'
import { sunIcon, moonIcon, systemIcon } from '../shared/icons/theme'
import { THEME_MODES, type ThemeMode } from '../theme/config'
import { setThemeMode } from '../theme'
import { useThemeMode } from '../theme/useThemeMode'

export const THEME_MODE_ICON: Record<ThemeMode, typeof sunIcon> = {
  light: sunIcon,
  dark: moonIcon,
  system: systemIcon,
}

/** Light/dark/system rows with icons, shared between the guest-facing
 *  `ThemeMenu` and the logged-in `ProfileMenu`. */
export function ThemeOptions({ onSelect }: { onSelect?: () => void }) {
  const { t } = useTranslation('common')
  const mode = useThemeMode()

  return (
    <div role="group" aria-label={t('theme.toggleAria')} className="flex flex-col gap-0.5">
      {THEME_MODES.map((m) => (
        <button
          key={m}
          type="button"
          role="menuitemradio"
          aria-checked={mode === m}
          onClick={() => {
            setThemeMode(m)
            onSelect?.()
          }}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors',
            mode === m
              ? 'bg-accent/20 text-accent-selected-text'
              : 'text-ink-secondary hover:bg-surface-hover hover:text-ink',
          )}
        >
          <Icon icon={THEME_MODE_ICON[m]} aria-hidden="true" className="h-4 w-4 shrink-0" />
          {t(`theme.${m}`)}
        </button>
      ))}
    </div>
  )
}
