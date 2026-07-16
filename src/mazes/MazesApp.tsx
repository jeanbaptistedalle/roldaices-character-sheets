import { useState } from 'react'
import { MazesHome } from './MazesHome'
import { CharacterWizard } from './components/wizard/CharacterWizard'
import { dataToDraft } from './persistence'
import type { CharacterRecord } from '../api'
import { clearDraft, loadDraft, type StoredDraft } from '../app/wizard/draftStorage'
import type { CharacterDraft } from './rules/character'

const SYSTEM_ID = 'mazes'

export function MazesApp({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<'home' | 'wizard'>(() =>
    loadDraft<CharacterDraft>(SYSTEM_ID) ? 'wizard' : 'home',
  )
  const [editing, setEditing] = useState<CharacterRecord | null>(null)
  // Seeded once on mount, e.g. resuming a draft after the Discord OAuth
  // round trip reloaded the app. Only relevant for that first render — cleared
  // as soon as the user goes home or opens a specific character, so a stale
  // resume can never outlive it and override a later `editing` character.
  const [resume, setResume] = useState<StoredDraft<CharacterDraft> | null>(() =>
    loadDraft<CharacterDraft>(SYSTEM_ID),
  )
  const [characterCount, setCharacterCount] = useState(0)

  function goHome() {
    clearDraft(SYSTEM_ID)
    setEditing(null)
    setResume(null)
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
    <MazesHome
      onCreate={(count) => {
        setCharacterCount(count)
        setEditing(null)
        setResume(null)
        setView('wizard')
      }}
      onEdit={(character) => {
        setEditing(character)
        setResume(null)
        setView('wizard')
      }}
      onExit={onExit}
    />
  )
}
