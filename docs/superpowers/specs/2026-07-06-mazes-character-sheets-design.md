# Mazes Character Sheets — Design

**Date:** 2026-07-06
**Status:** Approved for Step 1 (scaffold)

## Goal

A React web app for creating characters for the **Mazes** tabletop RPG
(9th Level Games). Created characters are stored in **RestDB**. The project
is also an experiment in "vibe coding" — building incrementally through
conversational iteration.

## The Mazes system (verified from the itch.io store page)

The core resolution mechanic is the **RESOLVER**: four stats, each governed
by one polyhedral die.

| Stat   | Used for                                  |
|--------|-------------------------------------------|
| BOOKS  | Using senses and knowledge                |
| BOOTS  | Physical activity                         |
| BLADES | Attacking and defending                   |
| BONES  | Resisting, being brave, testing strength  |

- The dice in play are **d4, d6, d8, d10**. Each character assigns these four
  dice across the four stats.
- The die arrangement is **role-specific** — a character's role (class)
  determines which die sits on which stat, plus a special power.
- **Exploding dice**: rolling the maximum value on a die causes it to
  "explode" (roll again and add).

### Known gaps (not on the store page — to be filled from the rulebook)

- The full list of **roles** and their die arrangements.
- Each role's **special power(s)**.
- **Hit points** / health rules.
- **Equipment**, advancement, and any other sheet fields.

These will be captured in the `mazes-rules` skill as the user provides the
rulebook content.

## Architecture

Frontend-only single-page app (no backend, by user decision — this is a
personal experiment).

- **Vite + React + TypeScript + Tailwind CSS** SPA.
- All RestDB access goes through a single **data-layer module** (`src/api/`)
  so components never call `fetch` directly. This isolates the RestDB seam:
  swapping in a backend proxy later is a small, contained change.
- RestDB API key lives in a `VITE_`-prefixed env var (`.env`, gitignored).

### RestDB security note

A `VITE_`-prefixed key is bundled into the client and is publicly visible.
Mitigation for the experiment: use a **restricted RestDB API key** scoped to
the character collection with minimal permissions. If the app ever goes
public, introduce a backend proxy that holds the key — the `src/api/` seam
makes this a localized change.

## Step 1 deliverables (this session)

1. `.gitignore` — Node/React/Vite appropriate (`node_modules`, `dist`,
   `.env*`, editor files).
2. Vite + React + TS + Tailwind scaffold (`package.json`, Vite config,
   Tailwind config, `tsconfig`, entry point).
3. A first **index page**: app title "Mazes Character Sheets", a short intro,
   and a placeholder "Create a Character" button (not wired up yet). Styled
   with Tailwind to confirm the toolchain works end-to-end.
4. `CLAUDE.md` — project goal, stack, architecture/conventions (data-layer
   seam, no secrets beyond the restricted key, `VITE_` env convention),
   Mazes reference link, and run instructions.
5. `mazes-rules` skill — seeded with the verified core mechanic above,
   gaps marked as TBD.

## Out of scope for Step 1 (later steps)

- The character-creation flow and the character data model.
- Actual RestDB wiring (create/read/list characters).
- Role/power/HP rules (pending rulebook).
- Deployment.
