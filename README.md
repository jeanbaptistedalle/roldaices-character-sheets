# Roldaice's character sheets

A React web app for creating characters for **multiple tabletop RPG systems**.
Each system is a self-contained vertical slice — **Mazes** (9th Level Games) and
**Rauks** (Rauksorg) are the first two. Created characters are stored in
[Supabase](https://supabase.com/). This project is also an experiment in
incremental "vibe coding".

**▶️ Live app: <https://jeanbaptistedalle.github.io/roldaices-character-sheets/>**

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via the `@tailwindcss/vite` plugin — no
  `tailwind.config.js`, no PostCSS config)
- **react-router-dom** for routing, **i18next** / **react-i18next** for
  internationalization (English & French)
- **Supabase** for persistence and authentication

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

Copy `.env.example` to `.env` and fill in your Supabase values:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Anything with a `VITE_` prefix is bundled into the client and is **publicly
visible**. The publishable key is public by design — data is protected by Row
Level Security, not key secrecy. Never commit `.env`; never use a secret key in
the client.

## Scripts

```bash
npm run dev       # start the dev server
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # preview the production build
npm test          # run the test suite (vitest)
npm run test:watch

npm run migration:list   # list Supabase migrations
npm run db:push          # apply migrations
npm run db:reset         # reset the local database
npm run db:start         # start the local Supabase stack
```

## Architecture

- **System vertical slices:** each TTRPG system lives in its own folder under
  `src/<id>/` (feature-first) — e.g. `src/mazes/` and `src/rauks/`, each holding
  `rules/`, `components/`, and an `index.ts` exporting a `SystemDefinition`. The
  shared shell lives in `src/app/` (`system.ts` type, `registry.ts` list,
  `SystemPicker`, and `App`, which mounts the selected system's `Entry`). Add a
  system by creating `src/<id>/` and appending it to `SYSTEMS` in
  `src/app/registry.ts`.
- **Data-layer seam:** all Supabase access goes through a single module under
  `src/api/`. Components must not call the Supabase client directly, so the
  backend can change without touching components.
- **TypeScript:** each system models its domain (stats, dice, roles,
  characters) with explicit types kept inside its `src/<id>/` slice.
- **Styling:** Tailwind utility classes, with a dark fantasy theme
  (stone/amber palette).

## Deployment

The app deploys to **GitHub Pages** automatically on every push to `main` via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite `base`
is set to `/roldaices-character-sheets/` to match the Pages path.

## License

This is a personal, non-commercial fan project. The RPG systems it supports
(Mazes by 9th Level Games, Rauks/Rauksorg) belong to their respective creators.
