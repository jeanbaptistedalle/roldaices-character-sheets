import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { SUPPORTED_LNGS, LANG_STORAGE_KEY } from './config'
import { appEn } from '../app/i18n/en'
import { appFr } from '../app/i18n/fr'
import { mazesEn } from '../mazes/i18n/en'
import { mazesFr } from '../mazes/i18n/fr'
import { rauksEn } from '../rauks/i18n/en'
import { rauksFr } from '../rauks/i18n/fr'

// Per-slice bundles are registered here as they are built (Tasks 3, 6, 8).
const resources = {
  en: { common: appEn, mazes: mazesEn, rauks: rauksEn },
  fr: { common: appFr, mazes: mazesFr, rauks: rauksFr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    supportedLngs: SUPPORTED_LNGS as unknown as string[],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANG_STORAGE_KEY,
    },
  })

// Keep <html lang> in sync.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.resolvedLanguage ?? 'en'

export default i18n
