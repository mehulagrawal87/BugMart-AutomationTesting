import { test, expect } from '@playwright/test';
import { SEARCH_DATA } from './test-data';

test.describe('Shopping Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and access the catalog
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await expect(page.getByRole('heading', { name: 'Product Catalog' })).toBeVisible();
  });

  test('TC-CART-01: Open product detail and add item to cart', async ({ page }) => {
    // 1. Open the product detail page by clicking the product title
    await page.getByRole('heading', { name: SEARCH_DATA.expectedProductName }).click();

    // 2. Verify product detail view is displayed
    await expect(page.locator('#detail-add-to-cart-btn')).toBeVisible();

    // 3. Click "Add to Cart" button
    await page.locator('#detail-add-to-cart-btn').click();

    // 4. Navigate to the Cart page via the navbar cart button
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();

    // 5. Verify the product is listed in the cart
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByRole('heading', { name: SEARCH_DATA.expectedProductName })).toBeVisible();
  });

  test('TC-CART-02: Increase item quantity and verify cart calculations update', async ({ page }) => {
    // Add product to cart directly from catalog
    await page.getByRole('heading', { name: SEARCH_DATA.expectedProductName }).click();
    await page.locator('#detail-add-to-cart-btn').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();

    // Initial quantity should be 1
    const qtyInput = page.locator('[id$="-qty-input"]').first();
    await expect(qtyInput).toHaveValue('1');

    // Click '+' button to increment quantity to 2
    const plusBtn = page.locator('[id$="-plus"]').first();
    await plusBtn.click();

    // Assert quantity value updated to 2
    await expect(qtyInput).toHaveValue('2');

    // Assert item subtotal recalculated ($129.99 * 2 = $259.98)
    const itemSubtotal = page.locator('[id$="-subtotal"]').first();
    await expect(itemSubtotal).toHaveText('$259.98');
  });

  test('TC-CART-03: Remove item from cart and verify empty cart state', async ({ page }) => {
    // Add product to cart and open cart
    await page.getByRole('heading', { name: SEARCH_DATA.expectedProductName }).click();
    await page.locator('#detail-add-to-cart-btn').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();

    // Click the remove button for the cart item
    const removeBtn = page.locator('[id$="-remove-btn"]').first();
    await removeBtn.click();

    // Assert that the empty cart state heading is visible
    await expect(page.getByRole('heading', { name: 'Your Cart is Empty' })).toBeVisible();
  });
});
