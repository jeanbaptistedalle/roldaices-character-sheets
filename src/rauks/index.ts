import { lazy } from 'react'
import type { SystemDefinition } from '../app/system'

export const rauksSystem: SystemDefinition = {
  id: 'rauks',
  i18nNamespace: 'rauks',
  // Loaded on demand: the whole Rauks flow (components, rules, wizard) is a
  // separate chunk that downloads only when a user picks this system.
  Entry: lazy(() => import('./RauksApp').then((m) => ({ default: m.RauksApp }))),
}
