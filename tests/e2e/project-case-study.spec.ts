import { test, expect } from '@playwright/test'

test.describe('Project Detail & GitHub Case Study', () => {
  test('renders original header, description, and floating navigation', async ({
    page,
  }) => {
    await page.goto('/projects/attendance-workforce-management-system')

    // Expect Title
    await expect(
      page.getByRole('heading', {
        name: /Attendance/i,
      }),
    ).toBeVisible()

    // Expect Description paragraph
    await expect(
      page.locator('p', { hasText: /A production-grade attendance/i }).first(),
    ).toBeVisible()

    // Expect Visit the website indicator
    await expect(page.getByText(/Visit the website/i)).toBeVisible()

    // Expect Floating Next Project Link (Desktop)
    const floatingNextLink = page
      .getByRole('link', {
        name: /Next Project/i,
      })
      .first()
    await expect(floatingNextLink).toBeVisible()

    // Navigate to next project
    await floatingNextLink.click()
    await expect(page).toHaveURL(/.*projects\/.+/)
  })
})
