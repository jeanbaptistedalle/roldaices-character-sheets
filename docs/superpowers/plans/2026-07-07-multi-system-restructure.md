# Multi-System Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the single-TTRPG (Mazes) app into a multi-system platform: relocate Mazes into a feature-first vertical slice, add a system seam + picker, update docs.

**Architecture:** Each system is a sibling folder under `src/` (feature-first). Mazes moves to `src/mazes/` with `rules/` and `components/wizard/` intact. A shared shell in `src/app/` holds a `SystemDefinition` type, a registry, a `SystemPicker`, and the top-level `App` that mounts the selected system's `Entry`.

**Tech Stack:** Vite + React 19 + TypeScript, Tailwind CSS v4, Vitest.

## Global Constraints

- No `fetch` in components — RestDB access goes through `src/api/` (not touched here).
- Dark fantasy theme: stone/amber palette (`bg-stone-950`, `text-stone-100`, `amber-600` accents).
- Preserve relative structure when moving Mazes files so intra-Mazes imports stay valid.
- No router library — App uses a `useState` toggle.
- `npm run build` (tsc -b + vite build) and `npm test` (vitest run) must pass after each task.
- Product title on the picker: **"TTRPG Character Sheets"**.
- Commit only within tasks as specified (frequent commits per TDD flow).

---

### Task 1: Relocate Mazes vertical slice

Move Mazes source into `src/mazes/` with structure preserved. `App.tsx` moves to `src/app/App.tsx` and still renders the Mazes wizard directly (intermediate valid state). No behavior change.

**Files:**
- Move (git mv): `src/rules/` → `src/mazes/rules/` (all `.ts` + `.test.ts`)
- Move (git mv): `src/components/wizard/` → `src/mazes/components/wizard/` (all files + `steps/`)
- Move (git mv): `src/App.tsx` → `src/app/App.tsx`
- Modify: `src/app/App.tsx` (import path)
- Modify: `src/main.tsx` (import path)

**Interfaces:**
- Produces: `src/mazes/rules/*`, `src/mazes/components/wizard/CharacterWizard.tsx` (unchanged exports), `src/app/App.tsx` (default export `App`).

- [ ] **Step 1: Move directories and App with git**

```bash
cd C:/Development/mazes-character-sheets
mkdir -p src/mazes src/app
git mv src/rules src/mazes/rules
git mv src/components/wizard src/mazes/components/wizard
git mv src/App.tsx src/app/App.tsx
```

Note: `src/components/` may now be empty — if so, it is gone (git mv moved `wizard`; no other contents existed).

- [ ] **Step 2: Fix the import in `src/app/App.tsx`**

Change line 2 from:

```ts
import { CharacterWizard } from './components/wizard/CharacterWizard'
```

to:

```ts
import { CharacterWizard } from '../mazes/components/wizard/CharacterWizard'
```

- [ ] **Step 3: Fix the import in `src/main.tsx`**

Change line 4 from:

```ts
import App from './App.tsx'
```

to:

```ts
import App from './app/App.tsx'
```

- [ ] **Step 4: Verify tests pass (moved rules/wizard tests)**

Run: `npm test`
Expected: PASS — all existing suites (aspects, character, classes, edges, portraits, resolutions, roles, wizardReducer) green. Their relative imports (`./character`, `../../rules/...`, `../../../rules/...`) are unchanged because rules and wizard moved together.

- [ ] **Step 5: Verify the build type-checks**

Run: `npm run build`
Expected: PASS — no dangling imports.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(mazes): relocate Mazes into src/mazes vertical slice"
```

---

### Task 2: Carve Mazes into Home + App entry + system definition

Extract the landing markup out of `src/app/App.tsx` into `src/mazes/MazesHome.tsx`, wrap the home↔wizard toggle in `src/mazes/MazesApp.tsx`, and declare the Mazes `SystemDefinition` in `src/mazes/index.ts`. `App.tsx` temporarily renders `<MazesApp onExit={...} />` directly (picker comes in Task 3). `MazesHome` gains an `onExit` "← Systems" control and an `onCreate` button.

**Files:**
- Create: `src/mazes/MazesHome.tsx`
- Create: `src/mazes/MazesApp.tsx`
- Create: `src/mazes/index.ts`
- Modify: `src/app/App.tsx`
- Create: `src/app/system.ts`

**Interfaces:**
- Produces:
  - `SystemDefinition` (in `src/app/system.ts`): `{ id: string; name: string; publisher: string; tagline: string; Entry: ComponentType<{ onExit: () => void }> }`
  - `MazesHome` — `({ onCreate, onExit }: { onCreate: () => void; onExit: () => void }) => JSX.Element`
  - `MazesApp` — `({ onExit }: { onExit: () => void }) => JSX.Element`
  - `mazesSystem: SystemDefinition` (default? no — named export `mazesSystem` from `src/mazes/index.ts`)
- Consumes: `CharacterWizard` from `./components/wizard/CharacterWizard` (prop `onExit: () => void`, already exists).

- [ ] **Step 1: Create the SystemDefinition type**

Create `src/app/system.ts`:

```ts
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
```

- [ ] **Step 2: Create `MazesHome` from the current landing markup**

Create `src/mazes/MazesHome.tsx` (STATS + markup lifted from the old `App.tsx`, plus a "← Systems" control and an `onCreate` button):

```tsx
const STATS = [
  { name: 'BOOKS', die: 'd?', blurb: 'Senses & knowledge' },
  { name: 'BOOTS', die: 'd?', blurb: 'Physical activity' },
  { name: 'BLADES', die: 'd?', blurb: 'Attacking & defending' },
  { name: 'BONES', die: 'd?', blurb: 'Resist, be brave, be strong' },
] as const

export function MazesHome({
  onCreate,
  onExit,
}: {
  onCreate: () => void
  onExit: () => void
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <button
          type="button"
          onClick={onExit}
          className="text-sm text-stone-500 transition-colors hover:text-amber-400"
        >
          ← Systems
        </button>
      </div>
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-8 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/80">
          9th Level Games
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Mazes Character Sheets
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
          Build a character for <span className="text-stone-200">Mazes</span>, a
          zero-prep fantasy roleplaying game. Assign your dice, pick your role,
          and step into the maze.
        </p>

        <section className="mt-14 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.name}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 transition-colors hover:border-amber-600/50"
            >
              <div className="text-2xl font-bold text-amber-400">{stat.die}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-stone-200">
                {stat.name}
              </div>
              <div className="mt-1 text-xs text-stone-500">{stat.blurb}</div>
            </div>
          ))}
        </section>

        <button
          type="button"
          onClick={onCreate}
          className="mt-14 rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold text-stone-950 transition-colors hover:bg-amber-500"
        >
          Create a Character
        </button>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Create `MazesApp` (home ↔ wizard toggle)**

Create `src/mazes/MazesApp.tsx`:

```tsx
import { useState } from 'react'
import { MazesHome } from './MazesHome'
import { CharacterWizard } from './components/wizard/CharacterWizard'

export function MazesApp({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<'home' | 'wizard'>('home')

  if (view === 'wizard') {
    return <CharacterWizard onExit={() => setView('home')} />
  }

  return <MazesHome onCreate={() => setView('wizard')} onExit={onExit} />
}
```

- [ ] **Step 4: Declare the Mazes system**

Create `src/mazes/index.ts`:

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

- [ ] **Step 5: Point `App.tsx` at `MazesApp` (temporary, pre-picker)**

Replace the entire contents of `src/app/App.tsx` with:

```tsx
import { MazesApp } from '../mazes/MazesApp'

function App() {
  return <MazesApp onExit={() => {}} />
}

export default App
```

(`onExit` is a no-op until the picker exists in Task 3.)

- [ ] **Step 6: Verify tests still pass**

Run: `npm test`
Expected: PASS — no test files changed; suites remain green.

- [ ] **Step 7: Verify the build type-checks**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor(mazes): split home/app entry and declare mazes system"
```

---

### Task 3: System seam — registry, picker, App host

Add the registry, a `SystemPicker`, and rewrite `App.tsx` to mount the selected system's `Entry`. Rename the package. A unit test guards registry invariants.

**Files:**
- Create: `src/app/registry.ts`
- Create: `src/app/registry.test.ts`
- Create: `src/app/SystemPicker.tsx`
- Modify: `src/app/App.tsx`
- Modify: `package.json:2`

**Interfaces:**
- Consumes: `SystemDefinition` (`src/app/system.ts`), `mazesSystem` (`src/mazes/index.ts`).
- Produces:
  - `SYSTEMS: SystemDefinition[]` (from `src/app/registry.ts`)
  - `SystemPicker` — `({ onSelect }: { onSelect: (id: string) => void }) => JSX.Element`

- [ ] **Step 1: Write the failing registry test**

Create `src/app/registry.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { SYSTEMS } from './registry'

describe('SYSTEMS registry', () => {
  it('contains the Mazes system', () => {
    expect(SYSTEMS.some((s) => s.id === 'mazes')).toBe(true)
  })

  it('has unique ids', () => {
    const ids = SYSTEMS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every system has a name, publisher, tagline, and Entry', () => {
    for (const s of SYSTEMS) {
      expect(s.name).toBeTruthy()
      expect(s.publisher).toBeTruthy()
      expect(s.tagline).toBeTruthy()
      expect(s.Entry).toBeTypeOf('function')
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- registry`
Expected: FAIL — `Cannot find module './registry'`.

- [ ] **Step 3: Create the registry**

Create `src/app/registry.ts`:

```ts
import type { SystemDefinition } from './system'
import { mazesSystem } from '../mazes'

/** All TTRPG systems available in the app. Add a system: import + append here. */
export const SYSTEMS: SystemDefinition[] = [mazesSystem]
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- registry`
Expected: PASS — 3 tests green.

- [ ] **Step 5: Create the SystemPicker**

Create `src/app/SystemPicker.tsx`:

```tsx
import { SYSTEMS } from './registry'

export function SystemPicker({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500/80">
          Tabletop RPGs
        </p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          TTRPG Character Sheets
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
          Build characters for tabletop roleplaying games. Pick a system to
          begin.
        </p>

        <section className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {SYSTEMS.map((system) => (
            <button
              key={system.id}
              type="button"
              onClick={() => onSelect(system.id)}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-6 text-left transition-colors hover:border-amber-600/50"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">
                {system.publisher}
              </div>
              <div className="mt-2 text-2xl font-bold text-stone-100">
                {system.name}
              </div>
              <div className="mt-2 text-sm text-stone-400">{system.tagline}</div>
            </button>
          ))}
        </section>
      </main>
    </div>
  )
}
```

- [ ] **Step 6: Rewrite `App.tsx` as the picker host**

Replace the entire contents of `src/app/App.tsx` with:

```tsx
import { useState } from 'react'
import { SystemPicker } from './SystemPicker'
import { SYSTEMS } from './registry'

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const system = selectedId
    ? SYSTEMS.find((s) => s.id === selectedId) ?? null
    : null

  if (system) {
    const Entry = system.Entry
    return <Entry onExit={() => setSelectedId(null)} />
  }

  return <SystemPicker onSelect={setSelectedId} />
}

export default App
```

- [ ] **Step 7: Rename the package**

Modify `package.json:2` from:

```json
  "name": "mazes-character-sheets",
```

to:

```json
  "name": "ttrpg-character-sheets",
```

- [ ] **Step 8: Verify all tests pass**

Run: `npm test`
Expected: PASS — all suites including the new registry tests.

- [ ] **Step 9: Verify the build type-checks**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(app): add system registry and picker shell"
```

---

### Task 4: Docs, skill, and CLAUDE.md

Move Mazes specs into a `mazes/` subfolder, reframe `CLAUDE.md` for multi-system, and note the Mazes scope in the rules skill.

**Files:**
- Move (git mv): 3 specs → `docs/superpowers/specs/mazes/`
- Modify: `CLAUDE.md`
- Modify: `.claude/skills/mazes-rules/SKILL.md`

**Interfaces:** none (documentation only).

- [ ] **Step 1: Move the Mazes specs**

```bash
cd C:/Development/mazes-character-sheets
mkdir -p docs/superpowers/specs/mazes
git mv "docs/superpowers/specs/2026-07-06-mazes-character-sheets-design.md" docs/superpowers/specs/mazes/
git mv "docs/superpowers/specs/2026-07-06-character-creation-wizard-design.md" docs/superpowers/specs/mazes/
git mv "docs/superpowers/specs/2026-07-06-identity-step-design.md" docs/superpowers/specs/mazes/
```

The cross-cutting restructure spec (`2026-07-07-multi-system-restructure-design.md`) stays at the specs root.

- [ ] **Step 2: Reframe `CLAUDE.md`**

Replace the intro paragraph (top of file, currently beginning "A React web app for creating characters for the **Mazes** tabletop RPG…") with:

```markdown
# TTRPG Character Sheets

A React web app for creating characters for **multiple tabletop RPG systems**.
Each system is a self-contained vertical slice; **Mazes** (9th Level Games) is
the first. Created characters are stored in **RestDB**. This project is also an
experiment in incremental "vibe coding".

Reference (first system — Mazes): https://9thlevelgames.itch.io/mazes-zero-prep-introduction-to-fantasy-roleplaying
```

Replace the **Architecture & conventions** intro bullets by inserting this bullet **first** in that list (keep the existing data-layer, secrets, TypeScript, styling bullets):

```markdown
- **System vertical slices:** each TTRPG system lives in its own folder under
  `src/<id>/` (feature-first) — e.g. `src/mazes/` holds `rules/`,
  `components/`, and `index.ts` exporting a `SystemDefinition`. The shared shell
  lives in `src/app/` (`system.ts` type, `registry.ts` list, `SystemPicker`,
  and `App` which mounts the selected system's `Entry`). Add a system: create
  `src/<id>/` and append it to `SYSTEMS` in `src/app/registry.ts`.
```

Replace the **The Mazes system** section body with (keep referencing the skill):

```markdown
## Game systems

Each system's mechanical rules live in a dedicated skill. **Mazes** rules are in
the `mazes-rules` skill (`.claude/skills/mazes-rules/SKILL.md`) — consult it
before building anything that touches Mazes mechanics (stats, dice, roles,
character creation). Future systems get their own rules skills. Keep skills
updated as we learn more.
```

Replace the **Status** section with:

```markdown
## Status

- **Done:** project scaffold, system seam (`src/app/`), system picker, Mazes
  vertical slice (`src/mazes/` — rules, character-creation wizard, identity
  step), docs, `mazes-rules` skill.
- **Next (not yet built):** RestDB wiring under `src/api/` (character records
  carry a `systemId` discriminator), and a second TTRPG system.

See `docs/superpowers/specs/` for design docs (per-system specs under
`docs/superpowers/specs/<system>/`).
```

- [ ] **Step 3: Note Mazes scope in the rules skill**

In `.claude/skills/mazes-rules/SKILL.md`, add a one-line note near the top of the body (after the frontmatter / first heading) stating scope:

```markdown
> **Scope:** This skill covers the **Mazes** system (9th Level Games) only. In
> this multi-system repo, other TTRPG systems have their own rules skills.
```

- [ ] **Step 4: Verify build still passes (docs-only, sanity)**

Run: `npm run build`
Expected: PASS (no source touched in this task).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: reframe for multi-system; move Mazes specs into mazes/"
```

---

## Self-Review

**Spec coverage:**
- Target structure (`src/app/`, `src/mazes/`) → Tasks 1–3. ✓
- `SystemDefinition` seam → Task 2 Step 1. ✓
- Registry + picker + App host → Task 3. ✓
- Adding system #2 = folder + registry line → documented in Task 4 CLAUDE.md + registry comment. ✓
- Move 3 specs into `mazes/` → Task 4 Step 1. ✓
- CLAUDE.md reframe (intro, architecture, systems, status) → Task 4 Step 2. ✓
- package.json rename → Task 3 Step 7. ✓
- mazes-rules skill note → Task 4 Step 3. ✓
- Tests move with source and pass → Task 1 Step 4. ✓
- `systemId` future note → Task 4 status section + spec. ✓

**Placeholder scan:** No TBD/TODO. `onExit={() => {}}` in Task 2 is an intentional, explained temporary no-op replaced in Task 3. ✓

**Type consistency:** `SystemDefinition` fields (`id`, `name`, `publisher`, `tagline`, `Entry`) identical across `system.ts`, `mazesSystem`, `SystemPicker`, and `registry.test.ts`. `Entry` prop `{ onExit: () => void }` matches `MazesApp` signature and `CharacterWizard`'s existing `onExit`. ✓
