import { useState } from 'react'
import { SystemPicker } from './SystemPicker'
import { Header } from './Header'
import { SYSTEMS } from './registry'
import { AuthProvider } from '../auth'

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const system = selectedId
    ? SYSTEMS.find((s) => s.id === selectedId) ?? null
    : null

  return (
    <AuthProvider>
      <Header />
      {system ? (
        <system.Entry onExit={() => setSelectedId(null)} />
      ) : (
        <SystemPicker onSelect={setSelectedId} />
      )}
    </AuthProvider>
  )
}

export default App
