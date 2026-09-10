import { test, expect } from '@playwright/test';
import { CHECKOUT_DATA, SEARCH_DATA } from './test-data';

test.describe('Checkout & Order Placement Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to catalog, add an item to cart, and proceed to checkout
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await page.getByRole('heading', { name: SEARCH_DATA.expectedProductName }).click();
    await page.locator('#detail-add-to-cart-btn').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();

    // Click Proceed to Checkout
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page.getByRole('heading', { name: 'Checkout & Payment' })).toBeVisible();
  });

  test('TC-CHK-01: End-to-end checkout places order and confirms reference ID', async ({ page }) => {
    // Fill required delivery information
    await page.getByLabel('Recipient Name *').fill(CHECKOUT_DATA.name);
    await page.getByLabel('Email Address *').fill(CHECKOUT_DATA.email);
    await page.getByLabel('Street Address *').fill(CHECKOUT_DATA.address);
    await page.getByLabel('City *').fill(CHECKOUT_DATA.city);
    await page.getByLabel('State / Province *').fill(CHECKOUT_DATA.state);
    await page.getByLabel('PIN / Postal Code *').fill(CHECKOUT_DATA.pinCode);
    await page.getByLabel('Contact Phone Number *').fill(CHECKOUT_DATA.phone);

    // Place the order
    await page.locator('#place-order-submit-btn').click();

    // Verify successful order placement confirmation
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();

    // Verify that a valid Order Reference ID (starting with ORD-) is rendered
    const orderIdElement = page.locator('#confirmed-order-id');
    await expect(orderIdElement).toBeVisible();
    await expect(orderIdElement).toContainText(/ORD-/i);
  });

  test('TC-CHK-02: Negative - Submitting checkout with empty required field shows validation error', async ({ page }) => {
    // Clear the required Recipient Name field to trigger validation
    await page.getByLabel('Recipient Name *').fill('');

    // Attempt to place the order
    await page.locator('#place-order-submit-btn').click();

    // Verify appropriate field validation error is displayed
    await expect(page.getByText('Full name is required')).toBeVisible();

    // Assert that the user remains on the Checkout page and order was not submitted
    await expect(page.getByRole('heading', { name: 'Checkout & Payment' })).toBeVisible();
  });
});
