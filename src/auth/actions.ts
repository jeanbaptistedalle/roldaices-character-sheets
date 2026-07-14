import type { SupabaseClient } from '@supabase/supabase-js'

// Auth actions, factored out of the React layer so they can be unit-tested with
// a mocked client (no DOM). Each takes the client explicitly. Adding a new
// OAuth provider (e.g. Google) is a one-liner mirroring signInWithDiscord.

// Where Supabase redirects back to after OAuth / magic-link. Must include the
// Vite base path (import.meta.env.BASE_URL) so the redirect lands on the app,
// not the domain root — under GitHub Pages the app is served from a subpath
// (/roldaices-character-sheets/) and the bare origin 404s. undefined in a
// non-browser context (e.g. tests), where supabase-js falls back to its default.
const redirectTo =
  typeof window !== 'undefined'
    ? new URL(import.meta.env.BASE_URL, window.location.origin).toString()
    : undefined

export function signInWithDiscord(client: SupabaseClient) {
  return client.auth.signInWithOAuth({
    provider: 'discord',
    options: { redirectTo },
  })
}

export function signInWithEmail(client: SupabaseClient, email: string) {
  // Magic link (OTP). No password stored or managed.
  return client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  })
}

export function signOut(client: SupabaseClient) {
  return client.auth.signOut()
}
