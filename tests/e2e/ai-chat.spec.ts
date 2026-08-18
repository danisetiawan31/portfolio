import { test, expect } from '@playwright/test'

test.describe('AI Assistant Chat Widget', () => {
  test('renders minimalist circular floating button on desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const aiButton = page.getByRole('button', {
      name: /Tanya AI Assistant/i,
    })
    await expect(aiButton).toBeVisible()
  })

  test('renders and opens cleanly in mobile viewport (375x667)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const aiButton = page.getByRole('button', {
      name: /Tanya AI Assistant/i,
    })
    await expect(aiButton).toBeVisible()

    // Click to open in mobile
    await aiButton.click()

    await expect(page.getByText('Dhani AI Assistant')).toBeVisible()
    await expect(page.getByText('Ada yang bisa saya bantu?')).toBeVisible()

    // Close in mobile
    const closeBtn = page.getByRole('button', { name: /Tutup chat/i })
    await closeBtn.click()

    await expect(page.getByText('Dhani AI Assistant')).not.toBeVisible()
  })

  test('opens and closes chat dialog smoothly with quick prompt suggestions', async ({
    page,
  }) => {
    await page.goto('/')

    // Click trigger to open
    const aiButton = page.getByRole('button', {
      name: /Tanya AI Assistant/i,
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
