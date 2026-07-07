import type { SystemDefinition } from './system'
import { mazesSystem } from '../mazes'

/** All TTRPG systems available in the app. Add a system: import + append here. */
export const SYSTEMS: SystemDefinition[] = [mazesSystem]
