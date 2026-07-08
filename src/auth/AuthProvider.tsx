import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../shared/supabase'
import * as actions from './actions'

interface AuthValue {
  session: Session | null
  user: User | null
  loading: boolean
  signInWithDiscord: () => Promise<unknown>
  signInWithEmail: (email: string) => Promise<unknown>
  signOut: () => Promise<unknown>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Seed from any existing session, then keep in sync with auth changes
    // (OAuth redirect, magic-link landing, sign out, token refresh).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signInWithDiscord: () => actions.signInWithDiscord(supabase),
      signInWithEmail: (email: string) =>
        actions.signInWithEmail(supabase, email),
      signOut: () => actions.signOut(supabase),
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return ctx
}
