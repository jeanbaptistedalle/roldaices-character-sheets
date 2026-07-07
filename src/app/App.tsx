import { useState } from 'react'
import { SystemPicker } from './SystemPicker'
import { SYSTEMS } from './registry'

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const system = selectedId
    ? SYSTEMS.find((s) => s.id === selectedId) ?? null
    : null

  if (system) {
    const Entry = system.Entry
    return <Entry onExit={() => setSelectedId(null)} />
  }

  return <SystemPicker onSelect={setSelectedId} />
}

export default App
