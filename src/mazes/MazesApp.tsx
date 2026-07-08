import { useState } from 'react'
import { MazesHome } from './MazesHome'
import { CharacterWizard } from './components/wizard/CharacterWizard'

export function MazesApp({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<'home' | 'wizard'>('home')

  if (view === 'wizard') {
    return (
      <CharacterWizard
        onExit={() => setView('home')}
        onSaved={() => setView('home')}
      />
    )
  }

  return <MazesHome onCreate={() => setView('wizard')} onExit={onExit} />
}
