# Roldaice's character sheets

A React web app for creating characters for **multiple tabletop RPG systems**.
Each system is a self-contained vertical slice; **Mazes** (9th Level Games) is
the first. Created characters are stored in **Supabase**. This project is also an
experiment in incremental "vibe coding".

Reference (first system — Mazes): https://9thlevelgames.itch.io/mazes-zero-prep-introduction-to-fantasy-roleplaying

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via the `@tailwindcss/vite` plugin — styles are imported
  in `src/index.css` with `@import "tailwindcss";`; there is no
  `tailwind.config.js` and no PostCSS config).
- **Supabase** for persistence and authentication (see below).

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
- **Data-layer seam:** all Supabase access goes through a single module under
  `src/api/`. Components MUST NOT call the Supabase client directly. This
  isolates the persistence layer so we can later change the backend without
  touching components.
- **Secrets:** the Supabase URL and publishable key come from `VITE_`-prefixed
  env vars (see `.env.example`). Anything `VITE_`-prefixed is bundled into the
  client and is **publicly visible** — the publishable key
  (`sb_publishable_...`) is public by design; data is protected by Row Level
  Security, not key secrecy. Never use a secret key in the client. Never commit
  `.env`. Never hard-code keys in source. Server-side secrets (e.g. the Discord
  guild allow-list `DISCORD_ALLOWED_GUILD_IDS`) live in the Supabase Edge
  Function env, synced from GitHub secrets by CI — never `VITE_`-prefixed.
- **Auth & roles:** sign-in is **Discord-only** (no email/password). Every user
  has a `role` in `public.profiles` (`guest`/`user`/`moderator`/`admin`),
  defaulting to `guest`. Guests can use the wizard but cannot persist characters
  — the `characters` RLS write policies require `public.is_privileged()`.
  Promotion `guest`→`user` is automatic for members of an allowed Discord server,
  done server-side by the `discord-membership` Edge Function (promote-only). Role
  reads in the client (`getCurrentUserRole`) are for UX only; RLS is the gate.
- **TypeScript:** model each system's domain (stats, dice, roles, characters)
  with explicit types, kept inside that system's `src/<id>/` slice. Prefer
  typed data over loose objects.
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

- **Done:** project scaffold, system seam (`src/app/`), system picker; two
  vertical slices — **Mazes** (`src/mazes/`) and **Rauks** (`src/rauks/`), each
  with rules + full character-creation wizard; i18n (en/fr); Supabase
  persistence (`src/api/` — characters carry a `systemId` discriminator) and
  auth (`src/auth/`); role-based access (`profiles` + RLS); Discord-server
  membership gating (`discord-membership` Edge Function); CI for GitHub Pages
  and Supabase deploys; `mazes-rules` / `rauks-rules` skills.
- **Next:** an admin UI to promote/manage users by hand (currently role changes
  are done in the Supabase SQL editor), and additional TTRPG systems.

See `docs/superpowers/specs/` for design docs (per-system specs under
`docs/superpowers/specs/<system>/`).
