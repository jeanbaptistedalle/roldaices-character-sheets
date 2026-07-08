import type { SupabaseClient } from '@supabase/supabase-js'

// Auth actions, factored out of the React layer so they can be unit-tested with
// a mocked client (no DOM). Each takes the client explicitly. Adding a new
// OAuth provider (e.g. Google) is a one-liner mirroring signInWithDiscord.

// Where Supabase redirects back to after OAuth / magic-link. undefined in a
// non-browser context (e.g. tests), where supabase-js falls back to its default.
const redirectTo =
  typeof window !== 'undefined' ? window.location.origin : undefined

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
