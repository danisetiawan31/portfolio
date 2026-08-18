import { test, expect } from '@playwright/test'

test.describe('Admin AI Assistant Page Protection', () => {
  test('redirects unauthenticated visitor from /admin/ai to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin/ai')
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Password/i)).toBeVisible()
  })
})
