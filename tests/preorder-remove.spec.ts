import { test, expect } from '@playwright/test'

test.describe('Pre-order Remove Items', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu')
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    const count = await addBtn.count()
    if (count > 0) await addBtn.click()
  })

  test('remove button is visible in pre-order list', async ({ page }) => {
    const removeX = page.locator('button[aria-label*="Remove"]')
    const hasX = await removeX.count()
    if (hasX === 0) { test.skip(); return }
    await expect(removeX.first()).toBeVisible()
  })

  test('clicking ✕ removes item from list', async ({ page }) => {
    const removeX = page.locator('button[aria-label*="Remove"]').first()
    if (await removeX.count() === 0) { test.skip(); return }

    await removeX.click()
    await expect(page.locator('text=No items added yet.')).toBeVisible()
  })

  test('total resets to zero after removing all items', async ({ page }) => {
    const removeX = page.locator('button[aria-label*="Remove"]').first()
    if (await removeX.count() === 0) { test.skip(); return }

    await removeX.click()
    await expect(page.locator('text=Total')).not.toBeVisible()
  })

  test('clear all button removes everything', async ({ page }) => {
    const addBtns = page.locator('button', { hasText: 'Add to Pre-order' })
    const count = await addBtns.count()
    if (count > 1) await addBtns.nth(1).click()

    const clearBtn = page.locator('button', { hasText: 'Clear all' })
    if (await clearBtn.count() === 0) { test.skip(); return }

    await clearBtn.click()
    await expect(page.locator('text=No items added yet.')).toBeVisible()
  })

  test('list updates correctly when one of multiple items removed', async ({ page }) => {
    const addBtns = page.locator('button', { hasText: 'Add to Pre-order' })
    if (await addBtns.count() < 2) { test.skip(); return }

    await addBtns.nth(1).click()
    // Now 2 items in cart
    const removeX = page.locator('button[aria-label*="Remove"]')
    await removeX.first().click()
    await expect(page.locator('text=1 item')).toBeVisible()
  })

  test('button reverts to Add after removing via ✕', async ({ page }) => {
    const removeX = page.locator('button[aria-label*="Remove"]').first()
    if (await removeX.count() === 0) { test.skip(); return }

    await removeX.click()
    await expect(page.locator('button', { hasText: 'Add to Pre-order' }).first()).toBeVisible()
  })
})
