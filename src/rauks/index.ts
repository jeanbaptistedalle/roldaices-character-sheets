import type { SystemDefinition } from '../app/system'
import { RauksApp } from './RauksApp'

export const rauksSystem: SystemDefinition = {
  id: 'rauks',
  i18nNamespace: 'rauks',
  Entry: RauksApp,
}
