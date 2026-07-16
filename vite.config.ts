/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The Supabase config the client needs at import time (see
// src/shared/supabase.ts, which throws when these are absent). Missing them
// yields a blank page in the browser rather than a build/startup error.
const REQUIRED_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']

// Fail fast — on any *runtime* launch of the app (`vite dev`, incl. VS Code F5;
// `vite preview`; and the vitest run) — when required config is missing, instead
// of serving a blank page. These all resolve with `command === 'serve'`, and the
// right env file is picked per mode by Vite's own resolution: `.env` for dev,
// the committed `.env.test` for tests, `.env`/`.env.production` for preview, plus
// real process env (CI). We deliberately DON'T check `vite build` (command ===
// 'build'): bundling isn't runtime, and CI builds a fork PR with no secrets as a
// pure smoke test — the real deploy injects the secrets as process env, and a
// genuinely misconfigured deploy still surfaces at runtime via
// src/shared/supabase.ts.
function requireSupabaseEnv(): Plugin {
  return {
    name: 'require-supabase-env',
    configResolved(config) {
      if (config.command !== 'serve') return
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
    // Vitest's default include glob also matches Playwright's *.spec.ts
    // convention, so it was picking up e2e/ and trying to run those files
    // itself — colliding with @playwright/test's own runtime. Those specs
    // only ever run via `npm run test:e2e` (playwright test).
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
