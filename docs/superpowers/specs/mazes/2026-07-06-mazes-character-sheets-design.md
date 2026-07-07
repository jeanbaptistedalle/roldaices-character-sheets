# Mazes Character Sheets — Design

**Date:** 2026-07-06
**Status:** Approved for Step 1 (scaffold)

## Goal

A React web app for creating characters for the **Mazes** tabletop RPG
(9th Level Games). Created characters are stored in **RestDB**. The project
is also an experiment in "vibe coding" — building incrementally through
conversational iteration.

## The Mazes system

The full, verified rules now live in the **`mazes-rules` skill**
(`.claude/skills/mazes-rules/SKILL.md`) — consult it as the source of truth for
mechanics. Summary of what drives the character model:

- A character has **one die**, set by their **Role**: Paragon (d4), Vanguard
  (d6), Fighter (d8), Sentinel (d10). The role also sets **Hearts** and
  **Stars** (d4→4/4, d6→6/3, d8→8/2, d10→10/1).
- There are **fixed resolutions** (not per-character stats): KEY (1), BOOKS
  (2–3), BOOTS (3–5), BLADES (4–7), BONES (5–9), and CROWN (die max). You roll
  your die and succeed if you hit the resolution's target numbers.
- **Aspect** (Sword / Shadow / Sorcery) is the fiction of how you solve
  problems and gates the available classes.
- **Class** = a name (Adjective + Noun) that is itself an edge, plus **3 edges**
  (fixed + player choices).
- **Edges** are adjective-like descriptors grouped into 7 types (Attributes,
  Combat, Magic, Society, 'Wises, Lineages, Advances); invoking one grants
  Advantage or information.

> **Correction from the earlier draft:** the initial reading (each character
> assigns four dice across four stats) was wrong. A character has a *single*
> die; the four resolutions are *fixed* target-number sets shared by all dice.

### Character model implications

- `Role` enum → derives die, Hearts, Stars (don't store them loosely).
- Resolutions modeled as **constants**, not character data.
- `Aspect` enum gates the class list.
- Classes and edges kept **data-driven** so stock content is encodable and
  custom classes/edges can be added.

See the skill for the full edge list, example classes, and modeling notes.

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
- Deployment.

*(Update 2026-07-06: the Mazes rules are now fully captured in the `mazes-rules`
skill, so they are no longer a gap — the next step is implementing character
creation on top of them.)*
