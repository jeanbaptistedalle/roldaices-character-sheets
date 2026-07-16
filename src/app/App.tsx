import { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { SystemPicker } from './SystemPicker'
import { Header } from './Header'
import { ProfilePage } from './ProfilePage'
import { SYSTEMS } from './registry'
import { AuthProvider, consumePostLoginRedirect } from '../auth'

/** Resolves the :systemId param to a system and mounts its Entry, or redirects
 *  home for an unknown id. */
function SystemRoute() {
  const { systemId } = useParams()
  const navigate = useNavigate()
  const system = SYSTEMS.find((s) => s.id === systemId)
  if (!system) return <Navigate to="/" replace />
  // Entry may be a lazy chunk (see registry) — Suspense covers its download.
  return (
    <Suspense fallback={null}>
      <system.Entry onExit={() => navigate('/')} />
    </Suspense>
  )
}

function App() {
  const navigate = useNavigate()

  // Send the user back to the page they triggered Discord sign-in from,
  // instead of stranding them on the site root the OAuth redirect lands on.
  // A no-op unless a sign-in was just completed (see auth/postLoginRedirect).
  useEffect(() => {
    const path = consumePostLoginRedirect()
    if (path) navigate(path, { replace: true })
  }, [navigate])

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
        <Header />
        <Routes>
          <Route path="/" element={<SystemPicker onSelect={(id) => navigate(`/${id}`)} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/:systemId" element={<SystemRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
