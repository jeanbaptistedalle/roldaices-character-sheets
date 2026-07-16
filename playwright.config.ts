import { defineConfig, devices } from '@playwright/test'
import { BASE_URL } from './e2e/constants'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // --mode test loads the committed .env.test (dummy Supabase config, see
    // src/shared/supabase.ts) instead of a real/local .env — no secrets
    // needed, and no real backend is ever hit.
    command: 'npm run dev -- --mode test',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
