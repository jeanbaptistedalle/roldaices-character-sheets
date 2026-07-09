import type { User } from '@supabase/supabase-js'

/** The best available display name for a user, matching the header's resolution
 *  order: full_name → user_name → email → 'Account'. */
export function displayNameOf(user: User | null | undefined): string {
  const meta = user?.user_metadata ?? {}
  return (
    (meta.full_name as string | undefined) ??
    (meta.user_name as string | undefined) ??
    user?.email ??
    'Account'
  )
}

/** The user's avatar URL from OAuth metadata, or undefined. */
export function avatarUrlOf(user: User | null | undefined): string | undefined {
  return user?.user_metadata?.avatar_url as string | undefined
}
