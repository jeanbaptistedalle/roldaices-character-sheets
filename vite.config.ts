/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The Supabase config the client needs at import time (see
// src/shared/supabase.ts, which throws when these are absent). Missing them
// yields a blank page in the browser rather than a build/startup error.
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']

// Fail fast — on `vite dev` (incl. VS Code F5), `vite build`, and `vite
// preview` — when required config is missing, instead of serving or shipping a
// blank page. Runs however Vite is launched, so it can't be bypassed the way an
// npm `prebuild` hook is (F5 runs the `dev` task, never `build`). Values are
// read via Vite's own env resolution, so `.env`, `.env.<mode>`, and real
// process env (CI) all count. Test mode is covered by the committed `.env.test`.
function requireSupabaseEnv(): Plugin {
  return {
    name: 'require-supabase-env',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root)
      const missing = REQUIRED_ENV.filter((key) => !env[key])
      if (missing.length) {
        throw new Error(
          `Missing required environment variables for mode "${config.mode}": ` +
            `${missing.join(', ')}.\n` +
            'Copy .env.example to .env and fill in your Supabase config.',
        )
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/roldaices-character-sheets/',
  plugins: [requireSupabaseEnv(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code into its own cacheable chunks so
        // repeat visitors re-download only our app code when it changes.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
