import { test, expect } from '@playwright/test'

test.describe('Admin Route Protection (Proxy)', () => {
  test('redirects unauthenticated visitor from /admin to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Password/i)).toBeVisible()
  })

  test('redirects unauthenticated visitor from /admin/projects to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin/projects')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('redirects unauthenticated visitor from /admin/certificates to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin/certificates')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
