import { test, expect } from '@playwright/test'

test.describe('Recruiter Quick-Packet Button', () => {
  test('renders recruiter summary button on homepage and copies dossier on click', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/')

    const recruiterBtn = page.getByRole('button', {
      name: /Salin Ringkasan untuk HR/i,
    })
    await expect(recruiterBtn).toBeVisible()

    // Click the button
    await recruiterBtn.click()

    // Expect success toast notification to appear
    await expect(
      page.getByText(/Ringkasan Profil Berhasil Disalin!/i),
    ).toBeVisible({ timeout: 5000 })

    // Check button state updates to "Copied!"
    await expect(page.getByText(/Copied!/i)).toBeVisible()
  })
})
