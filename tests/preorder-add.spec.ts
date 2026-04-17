import { test, expect } from '@playwright/test'

test.describe('Pre-order Add Items', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu')
  })

  test('add one item updates pre-order list', async ({ page }) => {
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    if (await addBtn.count() === 0) { test.skip(); return }

    await addBtn.click()
    await expect(page.locator('text=No items added yet.')).not.toBeVisible()
    await expect(page.locator('text=Total')).toBeVisible()
  })

  test('button changes to Remove after adding', async ({ page }) => {
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    if (await addBtn.count() === 0) { test.skip(); return }

    await addBtn.click()
    await expect(page.locator('button', { hasText: 'Remove' }).first()).toBeVisible()
  })

  test('item count badge appears after adding', async ({ page }) => {
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    if (await addBtn.count() === 0) { test.skip(); return }

    await addBtn.click()
    // Pre-order list shows 1 item
    await expect(page.locator('text=1 item')).toBeVisible()
  })

  test('adding multiple different items shows all in list', async ({ page }) => {
    const addBtns = page.locator('button', { hasText: 'Add to Pre-order' })
    const count = await addBtns.count()
    if (count < 2) { test.skip(); return }

    await addBtns.nth(0).click()
    await addBtns.nth(1).click()
    await expect(page.locator('text=2 items')).toBeVisible()
  })

  test('total price is non-zero after adding item', async ({ page }) => {
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    if (await addBtn.count() === 0) { test.skip(); return }

    await addBtn.click()
    const totalText = await page.locator('text=Total').locator('..').locator('span').last().textContent()
    expect(totalText).toMatch(/฿[1-9]/)
  })

  test('in cart quantity label shows after add', async ({ page }) => {
    const addBtn = page.locator('button', { hasText: 'Add to Pre-order' }).first()
    if (await addBtn.count() === 0) { test.skip(); return }

    await addBtn.click()
    await expect(page.locator('text=×1 in cart')).toBeVisible()
  })
})
