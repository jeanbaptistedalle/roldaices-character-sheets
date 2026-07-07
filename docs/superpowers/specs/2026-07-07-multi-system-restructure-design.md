# Multi-System Restructure — Design

**Date:** 2026-07-07
**Status:** Approved, pending implementation

## Goal

Change the repository's purpose from a single-TTRPG (Mazes) character creator
into a platform that hosts character creation for **multiple TTRPG systems**.
Mazes becomes the first of several systems. This spec covers the structural
groundwork: a system seam, a system picker, relocating Mazes code into a
feature-first vertical slice, and updating docs. It does **not** add a second
system — only the structure that makes adding one a bounded change.

## Non-goals

- No second system implemented.
- No RestDB/persistence wiring (still pending from the original spec).
- No repo git-folder rename. Only `package.json` `name` changes.
- No router library — a simple state toggle is sufficient for now.

## Target structure

Feature-first: each system is a sibling folder under `src/`. Shared shell and
the system registry live under `src/app/`.

```
src/
  main.tsx                     # unchanged entry point
  index.css                    # unchanged
  app/
    App.tsx                    # top-level: system picker <-> selected system
    SystemPicker.tsx           # lists registered systems as cards
    system.ts                  # SystemDefinition type
    registry.ts                # SYSTEMS = [mazesSystem]
  mazes/
    index.ts                   # mazesSystem: SystemDefinition (meta + Entry)
    MazesHome.tsx              # the current landing (stats grid + Create button)
    MazesApp.tsx               # Entry: owns home <-> wizard toggle
    rules/                     # moved verbatim from src/rules/
      aspects.ts, character.ts, classes.ts, edges.ts,
      portraits.ts, resolutions.ts, roles.ts (+ .test.ts)
    components/
      wizard/                  # moved verbatim from src/components/wizard/
        CharacterWizard.tsx, wizardReducer.ts, ui.tsx, steps/, tests
```

## The system seam

`src/app/system.ts`:

```ts
import type { ComponentType } from 'react'

export interface SystemDefinition {
  /** stable slug, e.g. 'mazes' */
  id: string
  /** display name, e.g. 'Mazes' */
  name: string
  /** publisher, e.g. '9th Level Games' */
  publisher: string
  /** one-line pitch for the picker card */
  tagline: string
  /** the system's whole flow (landing + wizard); receives onExit to return to picker */
  Entry: ComponentType<{ onExit: () => void }>
}
```

`src/app/registry.ts`:

```ts
import type { SystemDefinition } from './system'
import { mazesSystem } from '../mazes'

export const SYSTEMS: SystemDefinition[] = [mazesSystem]
```

`src/mazes/index.ts`:

```ts
import type { SystemDefinition } from '../app/system'
import { MazesApp } from './MazesApp'

export const mazesSystem: SystemDefinition = {
  id: 'mazes',
  name: 'Mazes',
  publisher: '9th Level Games',
  tagline: 'A zero-prep introduction to fantasy roleplaying.',
  Entry: MazesApp,
}
```

## App flow

`src/app/App.tsx` holds `selectedId: string | null`.

- `null` → render `<SystemPicker onSelect={setSelectedId} />`.
- otherwise → look up the system in `SYSTEMS`, render `<system.Entry onExit={() => setSelectedId(null)} />`.

`SystemPicker` — product title **"TTRPG Character Sheets"**, subtitle e.g.
"Build characters for tabletop RPGs." Renders one card per system in `SYSTEMS`
(name, publisher, tagline). Clicking a card calls `onSelect(system.id)`.
Keeps the dark stone/amber theme.

`MazesApp` — the current `App.tsx` logic: a `'landing' | 'wizard'` toggle.
Landing content moves into `MazesHome` (the stats grid + "Create a Character").
`onExit` from the wizard's Home button now returns to the **picker**, not a
Mazes-only landing. So: `MazesHome` has a "Create a Character" button →
wizard; the wizard's "← Home" returns to `MazesHome`; a top-level "← Systems"
control returns to the picker via the `onExit` prop.

## Import updates

Moving files changes relative import depths. Notably, wizard steps and rules
tests reference `../../rules/...`; after the move the relative structure inside
`src/mazes/` is preserved (rules and components move together), so most
intra-Mazes imports are unchanged. `App.tsx`'s import of `CharacterWizard`
is replaced by the picker/registry wiring.

## Docs & config

- **Move** the 3 Mazes specs into `docs/superpowers/specs/mazes/`:
  - `2026-07-06-mazes-character-sheets-design.md`
  - `2026-07-06-character-creation-wizard-design.md`
  - `2026-07-06-identity-step-design.md`
- **This spec** stays at `docs/superpowers/specs/` root (cross-cutting).
- **`CLAUDE.md`** — reframe from "A React web app for creating characters for
  the Mazes TTRPG" to a multi-system platform. Update:
  - Intro/goal to multi-system.
  - Architecture: systems live in `src/<id>/` (feature-first vertical slice),
    each exposing a `SystemDefinition`; shared shell + registry in `src/app/`.
    Mazes is the first system.
  - The Mazes system section points to the `mazes-rules` skill (unchanged).
  - Status: scaffold + Mazes slice + system seam done; next = RestDB wiring
    (with a `systemId` discriminator) and system #2.
- **`package.json`** `name`: `mazes-character-sheets` → `ttrpg-character-sheets`.
  Git folder untouched.
- **`mazes-rules` skill** (`.claude/skills/mazes-rules/SKILL.md`): add one line
  noting it covers the **Mazes** system specifically (future systems get their
  own rules skills). Otherwise unchanged.

## Testing

- Existing rule + reducer tests move with their source; they must still pass
  (`npm run build` type-checks; test runner runs the suites).
- `npm run build` must succeed after the move (no dangling imports).
- Manual: picker shows one "Mazes" card → click → Mazes home → wizard →
  "← Systems" returns to picker.

## Future (out of scope, noted for the seam)

- RestDB records gain a `systemId` field; the `src/api/` layer keys character
  storage by system.
- A second system is a new `src/<id>/` folder + one entry in `registry.ts`.
