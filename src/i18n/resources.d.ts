import type { appEn } from '../app/i18n/en'
import type { mazesEn } from '../mazes/i18n/en'
import type { rauksEn } from '../rauks/i18n/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof appEn
      mazes: typeof mazesEn
      rauks: typeof rauksEn
    }
  }
}
