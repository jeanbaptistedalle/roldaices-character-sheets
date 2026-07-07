import type { ComponentType } from 'react'

/** A TTRPG system available in the app. Each system owns its own flow. */
export interface SystemDefinition {
  /** stable slug, e.g. 'mazes' */
  id: string
  /** display name, e.g. 'Mazes' */
  name: string
  /** publisher, e.g. '9th Level Games' */
  publisher: string
  /** one-line pitch for the picker card */
  tagline: string
  /** the system's whole flow (landing + wizard); onExit returns to the picker */
  Entry: ComponentType<{ onExit: () => void }>
}
