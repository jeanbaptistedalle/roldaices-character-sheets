import type { SupabaseClient } from '@supabase/supabase-js'
import { setPostLoginRedirect, clearPostLoginRedirect } from './postLoginRedirect'

// Auth actions, factored out of the React layer so they can be unit-tested with
// a mocked client (no DOM). Each takes the client explicitly. Discord is the
// only sign-in method: access is gated on membership of an allowed Discord
// server (see the discord-membership Edge Function + src/api/discord.ts).

// Where Supabase redirects back to after OAuth. Must include the Vite base path
// (import.meta.env.BASE_URL) so the redirect lands on the app, not the domain
// root — under GitHub Pages the app is served from a subpath
// (/roldaices-character-sheets/) and the bare origin 404s. undefined in a
// non-browser context (e.g. tests), where supabase-js falls back to its default.
const redirectTo =
  typeof window !== 'undefined'
    ? new URL(import.meta.env.BASE_URL, window.location.origin).toString()
    : undefined

// `guilds` lets us read the user's server list (GET /users/@me/guilds) with the
// OAuth provider token, so the server can check membership of an allowed server.
// `identify`/`email` are Discord's defaults; we spell them out alongside guilds.
const DISCORD_SCOPES = 'identify email guilds'

export function signInWithDiscord(client: SupabaseClient) {
  // Remember the page we're on so the app can return here once the OAuth
  // round trip lands back on the site root (see postLoginRedirect.ts).
  if (typeof window !== 'undefined') {
    setPostLoginRedirect(window.location.hash.slice(1) || '/')
  }
  return client.auth.signInWithOAuth({
    provider: 'discord',
    // Discord re-prompts for consent on every login by default; prompt=none
    // skips the screen for users who already authorized these scopes, and
    // is a no-op (normal screen) for anyone who hasn't.
    options: { redirectTo, scopes: DISCORD_SCOPES, queryParams: { prompt: 'none' } },
  }).then((result) => {
    // The browser only actually navigates away on success. On failure, clear
    // the stashed redirect so a stale entry doesn't fire on some later,
    // unrelated reload.
    if (result.error) clearPostLoginRedirect()
    return result
  })
}

export function signOut(client: SupabaseClient) {
  return client.auth.signOut()
}
