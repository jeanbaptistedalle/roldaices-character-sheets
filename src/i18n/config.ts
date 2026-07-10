export const SUPPORTED_LNGS = ['en', 'fr'] as const
export type Lng = (typeof SUPPORTED_LNGS)[number]
export const LANG_STORAGE_KEY = 'roldaice-lang'
