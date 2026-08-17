import { test, expect } from '@playwright/test'

test.describe('Admin CV Management Page', () => {
  test('redirects unauthenticated visitor from /admin/cv to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin/cv')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
