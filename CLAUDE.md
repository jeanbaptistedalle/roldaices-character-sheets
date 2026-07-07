# TTRPG Character Sheets

A React web app for creating characters for **multiple tabletop RPG systems**.
Each system is a self-contained vertical slice; **Mazes** (9th Level Games) is
the first. Created characters are stored in **RestDB**. This project is also an
experiment in incremental "vibe coding".

Reference (first system — Mazes): https://9thlevelgames.itch.io/mazes-zero-prep-introduction-to-fantasy-roleplaying

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via the `@tailwindcss/vite` plugin — styles are imported
  in `src/index.css` with `@import "tailwindcss";`; there is no
  `tailwind.config.js` and no PostCSS config).
- **RestDB** for persistence (see below).

## Commands

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check (tsc -b) + production build to dist/
npm run preview  # preview the production build
```

## Architecture & conventions

- **System vertical slices:** each TTRPG system lives in its own folder under
  `src/<id>/` (feature-first) — e.g. `src/mazes/` holds `rules/`,
  `components/`, and `index.ts` exporting a `SystemDefinition`. The shared shell
  lives in `src/app/` (`system.ts` type, `registry.ts` list, `SystemPicker`,
  and `App` which mounts the selected system's `Entry`). Add a system: create
  `src/<id>/` and append it to `SYSTEMS` in `src/app/registry.ts`.
- **Data-layer seam:** all RestDB access goes through a single module under
  `src/api/`. Components MUST NOT call `fetch` directly. This isolates the
  persistence layer so we can later swap the direct-from-browser calls for a
  backend proxy without touching components.
- **Secrets:** the RestDB URL and API key come from `VITE_`-prefixed env vars
  (see `.env.example`). Anything `VITE_`-prefixed is bundled into the client
  and is **publicly visible** — only ever use a **restricted** RestDB API key
  (scoped to the character collection, minimal permissions). Never commit
  `.env`. Never hard-code keys in source.
- **TypeScript:** model the Mazes domain (stats, dice, roles, characters) with
  explicit types. Prefer typed data over loose objects.
- **Styling:** Tailwind utility classes. Keep the dark fantasy theme
  established on the landing page (stone/amber palette) unless we decide
  otherwise.

## Game systems

Each system's mechanical rules live in a dedicated skill. **Mazes** rules are in
the `mazes-rules` skill (`.claude/skills/mazes-rules/SKILL.md`) — consult it
before building anything that touches Mazes mechanics (stats, dice, roles,
character creation). Future systems get their own rules skills. Keep skills
updated as we learn more.

## Status

- **Done:** project scaffold, system seam (`src/app/`), system picker, Mazes
  vertical slice (`src/mazes/` — rules, character-creation wizard, identity
  step), docs, `mazes-rules` skill.
- **Next (not yet built):** RestDB wiring under `src/api/` (character records
  carry a `systemId` discriminator), and a second TTRPG system.

See `docs/superpowers/specs/` for design docs (per-system specs under
`docs/superpowers/specs/<system>/`).
