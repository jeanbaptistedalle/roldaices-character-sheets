import type { appEn } from '../app/i18n/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof appEn
    }
  }
}
