import { useTranslation } from 'react-i18next'
import { cn } from '../shared/cn'
import { SUPPORTED_LNGS } from '../i18n/config'

export function LanguageToggle() {
  const { i18n, t } = useTranslation('common')
  const current = i18n.resolvedLanguage
  return (
    <div
      role="group"
      aria-label={t('lang.toggleAria')}
      className="inline-flex items-center rounded-lg border border-border text-xs font-semibold"
    >
      {SUPPORTED_LNGS.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => void i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={cn(
            'px-2.5 py-1 uppercase transition-colors',
            current === lng
              ? 'bg-accent/20 text-accent-selected-text'
              : 'text-ink-muted hover:text-ink-secondary',
          )}
        >
          {t(`lang.${lng}`)}
        </button>
      ))}
    </div>
  )
}
