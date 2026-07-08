import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The single shared supabase-js client for the whole app. There must be exactly
// one instance — multiple GoTrue clients fight over the stored session. Both the
// auth seam (src/auth) and the data-layer seam (src/api) import it from here.

// Read the publicly-bundled Supabase config. Fail fast with a clear message if
// it's missing, rather than letting supabase-js throw an opaque error later.
function readEnv(): { url: string; key: string } {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing Supabase config. Set VITE_SUPABASE_URL and ' +
        'VITE_SUPABASE_PUBLISHABLE_KEY in your .env (see .env.example).',
    )
  }
  return { url, key }
}

// Session persistence and detectSessionInUrl are on by default, so the OAuth /
// magic-link redirect back to the app is picked up automatically.
const { url, key } = readEnv()
export const supabase: SupabaseClient = createClient(url, key)
