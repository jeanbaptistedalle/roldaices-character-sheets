import { test, expect } from '@playwright/test'
import { BASE_URL } from './constants'

// Covers src/auth/postLoginRedirect.ts and the consuming effect in
// src/app/App.tsx. Discord's OAuth exchange itself can't be exercised here
// (no live Discord/Supabase credentials in CI) — these tests verify the two
// halves our own code is responsible for: stashing the route before the
// redirect, and returning to it (then clearing it) after the round trip.

test.describe('post-login redirect', () => {
  test('stashes the current route synchronously when Discord sign-in is triggered', async ({
    page,
  }) => {
    await page.goto('#/mazes')
    await page.getByText('Create a Character').click()
    await expect(page.getByText('Choose your role')).toBeVisible()

    await page.getByRole('button', { name: 'Log in' }).click()
    await expect(page.getByText('Continue with Discord')).toBeVisible()

    // Click and read sessionStorage in the SAME browser-side call — the real
    // Discord button click starts a same-tab navigation away from the app,
    // so a check made from a separate Playwright round trip can land after
    // the page has already left for another origin (which has its own,
    // empty sessionStorage) and false-negative.
    const stashed = await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Discord'),
      )
      button?.click()
      return sessionStorage.getItem('post-login-redirect')
    })
    expect(stashed).toBe('/mazes')
  })

  test('returns to the stashed route after the OAuth round trip and clears it', async ({
    page,
  }) => {
    await page.goto('#/mazes')
    await page.evaluate(() => sessionStorage.setItem('post-login-redirect', '/mazes'))

    // The real shape of a Supabase PKCE callback: a `?code=...&state=...`
    // query string appended to the bare redirectTo, no hash of its own (see
    // src/shared/supabase.ts for why flowType is explicitly 'pkce' — the
    // default 'implicit' flow instead delivers the session via a URL
    // *fragment*, which collides with HashRouter and strands the user; this
    // exact query-string shape is what regression-guards that).
    await page.goto(BASE_URL + '?code=test-code&state=test-state')
    await expect(page).toHaveURL(/#\/mazes$/)

    const stashedAfter = await page.evaluate(() => sessionStorage.getItem('post-login-redirect'))
    expect(stashedAfter).toBeNull()
  })

  test('resumes a mid-wizard draft through a realistic end-to-end login round trip', async ({
    page,
  }) => {
    // Build a real draft, a step in.
    await page.goto('#/mazes')
    await page.getByText('Create a Character').click()
    await page.getByText('Paragon', { exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('STEP 2')).toBeVisible()

    // Stash the redirect the same way the real login button does (that click
    // itself, and its synchronous stash, is covered by the test above — doing
    // it for real here would also kick off a real, doomed navigation to the
    // dummy .env.test Supabase URL, racing with the goto below).
    await page.evaluate(() => sessionStorage.setItem('post-login-redirect', '/mazes'))

    // Land on the realistic PKCE callback shape, as Supabase would produce.
    await page.goto(BASE_URL + '?code=test-code&state=test-state')
    await expect(page).toHaveURL(/#\/mazes$/)
    await expect(page.getByText('STEP 2')).toBeVisible()
  })

  test('a plain reload at the site root with no pending sign-in just shows the picker', async ({
    page,
  }) => {
    await page.goto('#/mazes')
    await page.getByText('Create a Character').click()
    await page.getByText('Paragon', { exact: true }).click()

    await page.goto(BASE_URL)
    // HashRouter doesn't rewrite a bare/no-hash URL to add "#/" — what matters
    // is that the picker renders, not bounced into the Mazes wizard.
    await expect(page.getByText('Rauks', { exact: true })).toBeVisible()
    await expect(page.getByText('Choose your role')).not.toBeVisible()
  })
})
