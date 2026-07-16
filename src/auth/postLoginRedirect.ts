// Discord sign-in is a full-page browser round trip that always lands back on
// the site root (see actions.ts's `redirectTo`) — the OAuth redirect target
// can't carry the current hash route without colliding with the token
// Supabase appends to it. Stashing the route here lets the app send the user
// back to the page they were on instead of stranding them on the picker.

const KEY = 'post-login-redirect'

export function setPostLoginRedirect(path: string): void {
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
    // Storage unavailable — falls back to landing on the site root.
  }
}

export function clearPostLoginRedirect(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

/** Reads and clears the stashed path in one step — it's only ever meant to
 *  fire once, right after the OAuth round trip that set it. */
export function consumePostLoginRedirect(): string | null {
  try {
    const path = sessionStorage.getItem(KEY)
    if (path) sessionStorage.removeItem(KEY)
    return path
  } catch {
    return null
  }
}
