# Character-Creation Wizard — Design

**Date:** 2026-07-06
**Status:** Approved

## Goal

A multi-step (wizard) form for creating a Mazes character, following the rules'
creation order. Each step presents **one** concern and hides the others, so the
user is never overwhelmed. The final step is a **recap** of the built character
(Dice, Hearts/Stars, Aspect, Class, Edges).

Rules reference: `.claude/skills/mazes-rules/SKILL.md` (source of truth).

## Scope

**In scope:** the 5-step wizard, the pure rules data/logic it needs, and Vitest
unit tests for that logic.

**Out of scope (later steps):** persistence to RestDB (the recap's "Save" is a
disabled placeholder), character naming/identity, Advances (starting characters
only), Conditions/Treasure/Darkness, and per-class flavor (Recruiting/Drives/
Names/Kit).

## Flow — five steps

Navigation: Back / Next with a progress indicator. **Next is disabled until the
current step's required choice is made.** Changing **Aspect** clears the
downstream Class and Edges (classes are aspect-gated); changing Class clears
Edges.

1. **Role** — choose your die as one of four cards: Paragon (d4), Vanguard (d6),
   Fighter (d8), Sentinel (d10), each with its "choose because you want to…"
   blurb. Hearts/Stars/die values are **withheld here** and revealed in the
   recap (keeps the step focused on the choice).
2. **Aspect** — three cards (Sword / Shadow / Sorcery) each with its
   "I solve problems…" line.
3. **Class** — the eight example classes **filtered to the chosen aspect**, as
   selectable cards showing the class name and its `always` edge as a teaser.
4. **Edges** — resolve the class's three edges: the `always` edge shown locked,
   then Question 1 and Question 2 as single-choice groups. Any resulting edge
   that needs a sub-choice prompts inline (see "Edge sub-choices").
5. **Recap** — Dice, Hearts & Stars, Aspect, Class name, and the three resolved
   edges (with sub-choices). Disabled "Save" placeholder + "Start over".

## Architecture

- **`src/rules/`** — pure Mazes data + logic, no React, fully unit-testable:
  - `roles.ts` — `Role` enum; die, hearts, stars per role; blurbs.
  - `resolutions.ts` — fixed target numbers (Key/Books/Boots/Blades/Bones/Crown).
  - `aspects.ts` — `Aspect` enum + descriptions.
  - `edges.ts` — edge list, `EdgeType`, and which edges need a sub-choice.
  - `classes.ts` — all 24 class definitions (see data below).
  - `character.ts` — draft type + derivation/validation helpers.
- **`src/components/wizard/`** — `CharacterWizard` shell owns draft state via
  `useReducer` and renders the current step; one component per step
  (`RoleStep`, `AspectStep`, `ClassStep`, `EdgesStep`, `RecapStep`); shared
  presentational primitives (`ChoiceGrid`, `ChoiceCard`, `WizardNav`).
- **No router, no new runtime deps.** `App` toggles landing ↔ wizard via a
  simple `view` state. (Vitest is a dev dependency only.)

## Data model

```ts
type Role = 'Paragon' | 'Vanguard' | 'Fighter' | 'Sentinel'
type Aspect = 'Sword' | 'Shadow' | 'Sorcery'
type EdgeType = 'Attribute' | 'Combat' | 'Magic' | 'Society' | 'Wise'
              | 'Lineage' | 'Advance'

// A concrete edge on a character, with its resolved sub-choice if any.
interface EdgeChoice { edgeId: string; subChoice?: string }

interface CharacterDraft {
  role?: Role
  aspect?: Aspect
  classId?: string
  // Edges the player has resolved: the always-edge + one per question.
  edges: EdgeChoice[]
}
```

Hearts, Stars, the die, and resolution target numbers are **derived from
constants keyed by Role** — never stored on the draft.

### Role table (derived constants)

| Role     | Die | Hearts | Stars |
|----------|-----|--------|-------|
| Paragon  | d4  | 4      | 4     |
| Vanguard | d6  | 6      | 3     |
| Fighter  | d8  | 8      | 2     |
| Sentinel | d10 | 10     | 1     |

### Edge sub-choices

Some edges require a further choice. The wizard handles them thus:

- **Magic** → player picks a **Domain** (Night/Forge/Sea/Sky/Earth) *or* a
  School. If the class pre-sets it (Infernal Summoner → School "Summoning"),
  it's pre-filled and shown, not asked.
- **Familiar** → player picks a **Domain**.
- **Friends** → player picks a **place**: High / Low / Wild / Dark Places.
- **Retainers / Magic Item / Magic Weapon / Rank** → when the class supplies a
  flavor name (e.g. "Sworn Swords", "Potions", "Accursed Relic"), it's
  pre-filled; otherwise an optional free-text label. No validation gate on
  these free-text names.
- **Lineage** (Bugbear/Ilf/Smallfolk) and **Shapeshift** → no sub-choice.

### Class definitions (all 24)

Each class is `always <edge>` + Q1 (2 options) + Q2 (2–3 options). Parenthesised
text is the underlying edge for a flavor-named option.

**Sword**
- **Dangerous Bravo** — always Precise · Q1: Agile / Accurate · Q2: Hale / Fast / Strong
- **Jaded Sellsword** — always Well-Armed · Q1: Rank / Wealth · Q2: Lucky / Veteran / Retainers (Sworn Swords)
- **Knockabout Ranger** — always Accurate · Q1: Travelled / Quiet · Q2: Naturewise / Tough / Familiar (Beast)
- **Monster Slayer** — always Well-Armed · Q1: Mazewise / Retainers (Loyal Hounds) · Q2: Cunning / Dexterous / Strong
- **Outcast Bugbear** — always Bugbear (Lineage) · Q1: Deadly / Armored · Q2: Strong / Tough / Travelled
- **Reluctant Hero** — always Young · Q1: Magic Weapon / Magic Item · Q2: Beautiful / Charming / Lucky
- **Savage Barbarian** — always Tough · Q1: Deadly / Strong · Q2: Ardent / Hale / Naturewise
- **Valiant Dragoon** — always Armored · Q1: Deadly / Retainers (Shieldbearers) · Q2: Ardent / Strong / Intimidating

**Shadow**
- **Adventurous Smallfolk** — always Smallfolk (Lineage) · Q1: Animalwise / Shapeshift · Q2: Charming / Quiet / Friends
- **Cursed Tomb Robber** — always Mazewise · Q1: Gearwise / Retainers (Torchbearers) · Q2: Cunning / Dexterous / Keen
- **Excellent Vagabond** — always Travelled · Q1: Charming / Cunning · Q2: Fast / Lucky / Friends
- **Filthy Urchin** — always Quiet · Q1: Streetwise / Dexterous · Q2: Agile / Fast / Keen
- **Nighthawk Assassin** — always Deadly · Q1: Accurate / Quiet · Q2: Agile / Fast / Keen
- **Puzzling Locksmith** — always Gearwise · Q1: Tools / Learned · Q2: Streetwise / Keen / Quiet
- **Talented Thief** — always Streetwise · Q1: Accurate / Quiet · Q2: Agile / Charming / Keen
- **Zealous Cultist** — always Lorewise · Q1: Retainers (Mad Followers) / Familiar (dark) · Q2: Intimidating / Old / Rank

**Sorcery**
- **Blazing Magician** — always Magic · Q1: Accurate / Armored · Q2: Ardent / Strong / Tough
- **Guild Mage** — always Magic · Q1: Familiar / Magic Item · Q2: Learned / Travelled / Naturewise
- **Haunted Librarian** — always Lorewise · Q1: Magic (Forbidden) / Magic Item (Accursed Relic) · Q2: Intimidating / Keen / Wealth
- **Infernal Summoner** — always Magic (School: Summoning) · Q1: Lorewise / Familiar · Q2: Ardent / Beautiful / Learned
- **Last Ilf** — always Ilf (Lineage) · Q1: Magic / Magic Weapon · Q2: Beautiful / Cunning / Quiet
- **Quack Alchemist** — always Magic Item (Potions) · Q1: Lorewise / Naturewise · Q2: Dexterous / Keen / Learned
- **Underground Druid** — always Shapeshift · Q1: Naturewise / Mazewise · Q2: Strong / Keen / Deadly
- **Wise Witch** — always Magic · Q1: Lorewise / Naturewise · Q2: Cunning / Learned / Familiar

## Validation rules

- Role step: a role must be selected to advance.
- Aspect step: an aspect must be selected to advance.
- Class step: a class must be selected to advance.
- Edges step: both questions answered; every required sub-choice (Magic
  domain/school, Familiar domain, Friends place) selected. Free-text names are
  optional and never block advancing.
- Recap: no further input; "Save" is disabled.

## Testing (Vitest)

Add Vitest (+ `@testing-library/react` optional, but not required for this
pass). Unit-test the pure `src/rules/` logic:

- Role → die/hearts/stars derivation.
- `classById` returns a well-formed definition for every one of the 24 classes
  (always-edge present, Q1 has 2 options, Q2 has 2–3 options, every referenced
  edge id exists in `edges.ts`).
- Resolving a class + answers into the final three edges.
- Which edges require a sub-choice, and step-validation predicates.

Component tests are out of scope for this pass.

## Success criteria

- User can walk Role → Aspect → Class → Edges → Recap, one concern per screen.
- Downstream choices reset correctly when an upstream choice changes.
- The recap accurately shows die, Hearts, Stars, Aspect, Class, and the three
  resolved edges (with sub-choices).
- `npm run build` passes and Vitest tests pass.
