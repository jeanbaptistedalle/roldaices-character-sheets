import { useState } from 'react'
import { useAuth } from '../auth'
import { LoginModal } from '../shared/LoginModal'

export function Header() {
  const { user, loading, signOut } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.user_name as string | undefined) ??
    user?.email ??
    'Account'
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500/80">
          Roldaice's character sheets
        </span>

        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <span className="flex items-center gap-2 text-sm text-stone-300">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-7 w-7 rounded-full border border-stone-700"
                  />
                )}
                <span className="max-w-[12rem] truncate">{displayName}</span>
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-lg border border-stone-700 px-3 py-1.5 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg border border-amber-600/50 bg-amber-600/10 px-4 py-1.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-600/20"
            >
              Log in
            </button>
          )}
        </div>
      </div>

      {modalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </header>
  )
}
