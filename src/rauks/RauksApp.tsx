import { useState } from 'react'
import { RauksHome } from './RauksHome'
import { CharacterWizard } from './components/wizard/CharacterWizard'
import { dataToDraft } from './persistence'
import type { CharacterRecord } from '../api'

export function RauksApp({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<'home' | 'wizard'>('home')
  const [editing, setEditing] = useState<CharacterRecord | null>(null)
  const [characterCount, setCharacterCount] = useState(0)

  function goHome() {
    setEditing(null)
    setView('home')
  }

  if (view === 'wizard') {
    return (
      <CharacterWizard
        key={editing?.id ?? 'new'}
        editing={editing ? { id: editing.id, draft: dataToDraft(editing) } : undefined}
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
