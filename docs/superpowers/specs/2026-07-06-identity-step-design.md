# Identity Step — Design

**Date:** 2026-07-06
**Status:** Approved
**Builds on:** `2026-07-06-character-creation-wizard-design.md`

## Goal

Add an **Identity** step to the character-creation wizard so a character has a
name, a short description, and a portrait, in addition to its mechanics. The
portrait is chosen from a public gallery and stored as a URI (ready for RestDB).

## Flow change

Insert **Identity** as step 5; **Recap** becomes step 6:

`Role → Aspect → Class → Edges → Identity → Recap`

The Recap renders the portrait, name, and description above the mechanical
summary — a complete character sheet as the finale.

## The Identity step

- **Name** — text input, **required**. Next is disabled until it contains
  non-whitespace text.
- **Description** — a `textarea`, optional.
- **Portrait** — a grid of ~12 avatars from **DiceBear**
  (`https://api.dicebear.com/<version>/<style>/svg?seed=<seed>`). No API key,
  CORS-friendly, deterministic URLs. Selecting one stores its **URL string** in
  the draft. Optional.

## Data model

`CharacterDraft` gains three optional identity fields, independent of the
mechanical choices (changing Role/Aspect/Class does NOT clear them):

```ts
interface CharacterDraft {
  // …existing mechanical fields…
  name?: string
  description?: string
  imageUri?: string
}
```

`BuiltCharacter` gains `name`, `description`, `imageUri`.

## New module: `src/rules/portraits.ts`

Pure and unit-testable:

```ts
export const PORTRAIT_SEEDS: string[]        // fixed list (~12)
export function portraitUrl(seed: string): string
export const PORTRAITS: { seed: string; url: string }[]
```

`portraitUrl` builds a deterministic DiceBear SVG URL for a seed. The exact
DiceBear version and style are confirmed to load in the preview before
finalizing (avoid shipping a dead URL); a fantasy-appropriate style is chosen
then.

## Logic changes (`src/rules/character.ts`)

- `WizardStep` / `STEPS` gain `identity` between `edges` and `recap`.
- `canAdvance(draft, 'identity')` = `Boolean(draft.name?.trim())`.
- `isDraftComplete` additionally requires a non-empty name.
- `buildCharacter` includes `name`, `description`, `imageUri`.

## Reducer changes (`src/components/wizard/wizardReducer.ts`)

- `STEPS` gains `identity` before `recap`.
- New actions: `setName`, `setDescription`, `setImage`.
- Identity fields are NOT reset by `setAspect` / `setClass`.

## Components

- New `IdentityStep.tsx`: name input (required), description textarea, and the
  portrait gallery (grid of DiceBear `<img>`s, click to select, selected
  highlighted).
- `RecapStep.tsx`: show the portrait (if chosen), name as the heading, and the
  description, above the existing stats/edges/resolution sheet.
- `ui.tsx`: add the `identity` progress label.

## Testing (Vitest, TDD for logic)

- `portraits.ts`: `portraitUrl` is deterministic and encodes the seed;
  `PORTRAITS` has the expected length with unique URLs.
- `character.ts`: `canAdvance(_, 'identity')` requires a name; `isDraftComplete`
  requires a name; `buildCharacter` carries the identity fields.
- `wizardReducer.ts`: `setName`/`setDescription`/`setImage` update the draft;
  `STEPS` order includes `identity` before `recap`; identity survives
  `setAspect`/`setClass`.

Component tests remain out of scope.

## Out of scope

- Persistence to RestDB (Save stays a disabled placeholder; `imageUri` is only
  captured for later).
- Uploading custom images; only gallery selection.

## Success criteria

- The wizard has six steps in the order above; Identity gates on a name.
- A chosen portrait's URL is stored on the draft and shown in the Recap.
- `npm run build` and all Vitest tests pass.
