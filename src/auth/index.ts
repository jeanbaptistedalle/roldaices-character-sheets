// Public surface of the auth seam. Components import from here, never from
// supabase-js or ./client directly.
export { AuthProvider, useAuth } from './AuthProvider'
export { consumePostLoginRedirect } from './postLoginRedirect'
