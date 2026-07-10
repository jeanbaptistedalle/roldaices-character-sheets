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
      className="flex items-center rounded-lg border border-stone-700 text-xs font-semibold"
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
              ? 'bg-amber-600/20 text-amber-300'
              : 'text-stone-400 hover:text-stone-200',
          )}
        >
          {t(`lang.${lng}`)}
        </button>
      ))}
    </div>
  )
}
