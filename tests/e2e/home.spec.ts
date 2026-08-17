import { test, expect } from '@playwright/test'

test.describe('Public Homepage', () => {
  test('renders hero section and core elements', async ({ page }) => {
    await page.goto('/')

    // Hero title / branding
    await expect(page).toHaveTitle(/Ahmad Dhani|Portfolio/i)

    // Download CV button exists
    const downloadBtn = page.getByRole('link', { name: /Download CV/i })
    await expect(downloadBtn).toBeVisible()
    await expect(downloadBtn).toHaveAttribute('download')
  })

  test('renders main sections and navigation', async ({ page }) => {
    await page.goto('/')

    // Check main role and specific sections exist in the DOM
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('#projects')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})
