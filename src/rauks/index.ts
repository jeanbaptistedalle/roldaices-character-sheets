import type { SystemDefinition } from '../app/system'
import { RauksApp } from './RauksApp'

export const rauksSystem: SystemDefinition = {
  id: 'rauks',
  name: 'Rauks',
  publisher: 'Thibaut & Quentin Constant',
  tagline: 'Play an elite investigator-knight of the World Empire.',
  Entry: RauksApp,
}
