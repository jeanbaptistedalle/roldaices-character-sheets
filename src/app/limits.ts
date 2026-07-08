/** Max characters a user may create per system. App-wide policy, not
 * specific to any one TTRPG system. */
export const MAX_CHARACTERS_PER_SYSTEM = 5

/**
 * Whether creating a new character is blocked by the per-system cap.
 * Edits are never blocked — only new characters count against the limit.
 */
export function isAtLimit(count: number, editing: boolean): boolean {
  return !editing && count >= MAX_CHARACTERS_PER_SYSTEM
}
