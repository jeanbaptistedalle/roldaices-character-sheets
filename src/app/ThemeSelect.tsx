import { useTranslation } from 'react-i18next'
import { THEME_MODES, type ThemeMode } from '../theme/config'
import { setThemeMode } from '../theme'
import { useThemeMode } from '../theme/useThemeMode'

export function ThemeSelect() {
  const { t } = useTranslation('common')
  const mode = useThemeMode()
  return (
    <select
      aria-label={t('theme.toggleAria')}
      value={mode}
      onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
      className="rounded-lg border border-border bg-surface px-2 py-1 text-xs font-semibold text-ink-secondary transition-colors hover:text-ink"
    >
      {THEME_MODES.map((m) => (
        <option key={m} value={m}>
          {t(`theme.${m}`)}
        </option>
      ))}
    </select>
  )
}
