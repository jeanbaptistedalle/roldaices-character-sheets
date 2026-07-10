import type { SystemDefinition } from '../app/system'
import { MazesApp } from './MazesApp'

export const mazesSystem: SystemDefinition = {
  id: 'mazes',
  i18nNamespace: 'mazes',
  Entry: MazesApp,
}
