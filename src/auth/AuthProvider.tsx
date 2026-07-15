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
import { syncDiscordMembership } from '../api'
import * as actions from './actions'

interface AuthValue {
  session: Session | null
  user: User | null
  loading: boolean
  signInWithDiscord: () => Promise<unknown>
  signOut: () => Promise<unknown>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Seed from any existing session, then keep in sync with auth changes
    // (OAuth redirect, sign out, token refresh).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      setLoading(false)

      // Right after a Discord sign-in the session carries the OAuth
      // provider_token (it's absent on later token refreshes). That's our one
      // chance to read the user's Discord server list, so kick off the
      // membership check now. Promote-only and best-effort: a failure here just
      // leaves the user as a guest, which they can retry by signing in again.
      if (event === 'SIGNED_IN' && next?.provider_token) {
        void syncDiscordMembership(next.provider_token).catch(() => {})
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signInWithDiscord: () => actions.signInWithDiscord(supabase),
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
