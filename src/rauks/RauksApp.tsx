import { useState } from 'react'
import { RauksHome } from './RauksHome'
import { CharacterWizard } from './components/wizard/CharacterWizard'
import { dataToDraft } from './persistence'
import type { CharacterRecord } from '../api'
import { clearDraft, loadDraft, type StoredDraft } from '../app/wizard/draftStorage'
import type { CharacterDraft } from './rules/character'

const SYSTEM_ID = 'rauks'

export function RauksApp({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<'home' | 'wizard'>(() =>
    loadDraft<CharacterDraft>(SYSTEM_ID) ? 'wizard' : 'home',
  )
  const [editing, setEditing] = useState<CharacterRecord | null>(null)
  // Seeded once on mount, e.g. resuming a draft after the Discord OAuth
  // round trip reloaded the app. Discarded on exit/save alongside the draft.
  const [resume] = useState<StoredDraft<CharacterDraft> | null>(() =>
    loadDraft<CharacterDraft>(SYSTEM_ID),
  )
  const [characterCount, setCharacterCount] = useState(0)

  function goHome() {
    clearDraft(SYSTEM_ID)
    setEditing(null)
    setView('home')
  }

  if (view === 'wizard') {
    return (
      <CharacterWizard
        key={editing?.id ?? 'new'}
        systemId={SYSTEM_ID}
        editing={editing ? { id: editing.id, draft: dataToDraft(editing) } : undefined}
        resume={resume ?? undefined}
        characterCount={characterCount}
        onExit={goHome}
        onSaved={goHome}
      />
    )
  }

  return (
    <RauksHome
      onCreate={(count) => {
        setCharacterCount(count)
        setEditing(null)
        setView('wizard')
      }}
      onEdit={(character) => {
        setEditing(character)
        setView('wizard')
      }}
      onExit={onExit}
    />
  )
}
