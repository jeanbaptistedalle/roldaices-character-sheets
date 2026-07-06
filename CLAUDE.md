# Mazes Character Sheets

A React web app for creating characters for the **Mazes** tabletop RPG
(9th Level Games). Created characters are stored in **RestDB**. This project
is also an experiment in incremental "vibe coding".

Reference (game): https://9thlevelgames.itch.io/mazes-zero-prep-introduction-to-fantasy-roleplaying

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

## The Mazes system

The mechanical rules live in the `mazes-rules` skill
(`.claude/skills/mazes-rules/SKILL.md`). Consult it before building anything
that touches game mechanics (stats, dice, roles, character creation).
Its current state records the verified core mechanic and flags the parts still
pending the rulebook — keep it updated as we learn more.

## Status

- **Done:** project scaffold, landing page, docs, `mazes-rules` skill seed.
- **Next (not yet built):** character-creation flow, character data model,
  and RestDB wiring under `src/api/`.

See `docs/superpowers/specs/` for design docs.
