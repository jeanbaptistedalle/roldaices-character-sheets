import type { ComponentType, LazyExoticComponent } from 'react'
import type { i18n as I18n } from 'i18next'

/** Props every system's `Entry` receives. */
export type SystemEntryProps = { onExit: () => void }

/** A TTRPG system available in the app. Each system owns its own flow. */
export interface SystemDefinition {
  /** stable slug, e.g. 'mazes' */
  id: string
  /** i18next namespace holding this system's `name`, `publisher`, `tagline`, and copy. */
  i18nNamespace: string
  /**
   * The system's whole flow (landing + wizard); onExit returns to the picker.
   * May be lazy-loaded (`React.lazy`), so render it inside a `<Suspense>`.
   */
  Entry:
    | ComponentType<SystemEntryProps>
    | LazyExoticComponent<ComponentType<SystemEntryProps>>
}

/**
 * Namespaces that hold a system's `name`/`publisher`/`tagline` (the ones referenced by
 * `SystemDefinition.i18nNamespace`). Kept separate from that field's plain `string` type so
 * consumers can resolve a type-checked `t` for whichever system is being rendered.
 */
export type SystemNamespace = 'mazes' | 'rauks'

/** Type-safe `t` scoped to a system's own i18n namespace, for use with `SYSTEMS.map`. */
export function getSystemT(i18n: I18n, i18nNamespace: string) {
  return i18n.getFixedT<SystemNamespace>(null, i18nNamespace as SystemNamespace)
}
