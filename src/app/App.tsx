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
      <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
        <Header />
        {system ? (
          <system.Entry onExit={() => setSelectedId(null)} />
        ) : (
          <SystemPicker onSelect={setSelectedId} />
        )}
      </div>
    </AuthProvider>
  )
}

export default App
