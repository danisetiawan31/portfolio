import { test, expect } from '@playwright/test'

test.describe('AI Assistant Chat Widget', () => {
  test('renders floating launcher button on homepage', async ({ page }) => {
    await page.goto('/')

    const aiButton = page.getByRole('button', {
      name: /Tanya AI|Buka Chat AI/i,
    })
    await expect(aiButton).toBeVisible()
  })

  test('opens and closes chat dialog smoothly with quick prompt suggestions', async ({
    page,
  }) => {
    await page.goto('/')

    // Click trigger to open
    const aiButton = page.getByRole('button', {
      name: /Tanya AI|Buka Chat AI/i,
    })
    await aiButton.click()

    // Dialog title and welcome banner should be visible
    await expect(page.getByText('Dhani AI Assistant')).toBeVisible()
    await expect(page.getByText('Ada yang bisa saya bantu?')).toBeVisible()

    // Quick prompt buttons should be visible
    await expect(page.getByText('Tech Stack & Keahlian')).toBeVisible()
    await expect(page.getByText('Project Unggulan')).toBeVisible()

    // Close button
    const closeBtn = page.getByRole('button', { name: /Tutup chat/i })
    await closeBtn.click()

    // Dialog should disappear
    await expect(page.getByText('Dhani AI Assistant')).not.toBeVisible()
  })
})
