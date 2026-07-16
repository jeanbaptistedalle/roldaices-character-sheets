// Session-scoped persistence for an in-progress wizard draft. Discord OAuth
// sign-in is a full-page browser round trip that reloads the whole app and
// always lands back on the site root, which would otherwise wipe whatever
// draft the user was in the middle of building. Stashing it here lets the app
// resume exactly where the user left off once they're back.

export interface StoredDraft<Draft> {
  draft: Draft
  stepIndex: number
  editId?: string
}

function key(systemId: string): string {
  return `wizard-draft:${systemId}`
}

export function saveDraft<Draft>(systemId: string, value: StoredDraft<Draft>): void {
  try {
    sessionStorage.setItem(key(systemId), JSON.stringify(value))
  } catch {
    // Storage unavailable (private browsing, quota) — draft won't survive a reload.
  }
}

export function loadDraft<Draft>(systemId: string): StoredDraft<Draft> | null {
  try {
    const raw = sessionStorage.getItem(key(systemId))
    return raw ? (JSON.parse(raw) as StoredDraft<Draft>) : null
  } catch {
    return null
  }
}

export function clearDraft(systemId: string): void {
  try {
    sessionStorage.removeItem(key(systemId))
  } catch {
    // ignore
  }
}
