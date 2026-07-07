import type { SystemDefinition } from '../app/system'
import { MazesApp } from './MazesApp'

export const mazesSystem: SystemDefinition = {
  id: 'mazes',
  name: 'Mazes',
  publisher: '9th Level Games',
  tagline: 'A zero-prep introduction to fantasy roleplaying.',
  Entry: MazesApp,
}
