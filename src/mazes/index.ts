import { lazy } from 'react'
import type { SystemDefinition } from '../app/system'

export const mazesSystem: SystemDefinition = {
  id: 'mazes',
  i18nNamespace: 'mazes',
  // Loaded on demand: the whole Mazes flow (components, rules, wizard) is a
  // separate chunk that downloads only when a user picks this system.
  Entry: lazy(() => import('./MazesApp').then((m) => ({ default: m.MazesApp }))),
}
