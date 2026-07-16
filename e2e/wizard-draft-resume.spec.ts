import { test, expect } from '@playwright/test'

// Covers the draft-persistence mechanism in src/app/wizard/draftStorage.ts:
// an in-progress wizard draft survives in-app navigation away and back (not
// just the Discord OAuth reload — see post-login-redirect.spec.ts for that),
// and is discarded once the wizard is exited.

test.describe('wizard draft resume', () => {
  test('keeps a draft when navigating home and switching systems, and resumes it on returning', async ({
    page,
  }) => {
    await page.goto('#/mazes')
    await page.getByText('Create a Character').click()
    await expect(page.getByText('Choose your role')).toBeVisible()

    await page.getByText('Paragon', { exact: true }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('STEP 2')).toBeVisible()

    // Navigate Home (not via the wizard's own exit), browse another system...
    await page.getByRole('link', { name: /Roldaice/i }).click()
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByText('Rauks', { exact: true })).toBeVisible()
    await page.getByText('Rauks', { exact: true }).click()
    await expect(page).toHaveURL(/#\/rauks/)

    // ...then come back to Mazes — the draft should resume on the same step.
    await page.getByRole('link', { name: /Roldaice/i }).click()
    await page.getByText('Mazes', { exact: true }).click()
    await expect(page).toHaveURL(/#\/mazes/)
    await expect(page.getByText('STEP 2')).toBeVisible()
  })

  test('clears the draft once the wizard is exited', async ({ page }) => {
    await page.goto('#/mazes')
    await page.getByText('Create a Character').click()
    await expect(page.getByText('Choose your role')).toBeVisible()
    await page.getByText('Paragon', { exact: true }).click()

    const storedWhileEditing = await page.evaluate(() =>
      sessionStorage.getItem('wizard-draft:mazes'),
    )
    expect(storedWhileEditing).not.toBeNull()

    await page.getByText('← Home', { exact: true }).click()
    await expect(page.getByText('Create a Character')).toBeVisible()

    const storedAfterExit = await page.evaluate(() => sessionStorage.getItem('wizard-draft:mazes'))
    expect(storedAfterExit).toBeNull()
  })
})
