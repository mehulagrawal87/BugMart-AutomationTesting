import { test, expect } from '@playwright/test';

test.describe('BugMart Automated Defect Regression Suite (BugMart_Defect_Log.csv)', () => {

  // BUG-001: Bamboo Desk Organizer appears under Electronics category
  test('BUG-001 [TC-CAT-02]: Bamboo Desk Organizer incorrectly leaks into Electronics category', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();

    // Filter by Electronics
    const sidebar = page.locator('#catalog-sidebar');
    await sidebar.getByRole('button', { name: 'Electronics' }).click();

    // Defect Assertion: Bamboo Eco-Friendly Desk Organizer (Home & Living) incorrectly appears
    const leakedProduct = page.getByRole('heading', { name: 'Bamboo Eco-Friendly Desk Organizer' });
    await expect(leakedProduct).toBeVisible();
  });

  // BUG-002: Price sorting sorts alphabetically instead of numerically
  test('BUG-002 [TC-CAT-03]: Price sorting sorts alphabetically as string instead of numerically', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();

    // Wait for the API call to finish when changing sort
    const responsePromise = page.waitForResponse(res => res.url().includes('sort=price-asc') && res.status() === 200);
    await page.locator('#sort-select').selectOption('price-asc');
    await responsePromise;

    // Defect Assertion: Under alphabetical string sorting ("110" < "16"), CloudStrider ($110) is first
    await expect(page.getByRole('heading', { name: 'CloudStrider Cushioned Running Shoes' })).toBeVisible();
    const firstPrice = page.locator('.current-price').first();
    await expect(firstPrice).toHaveText('$110.00');
  });

  // BUG-003: Confirm password field accepts partial prefix matches
  test('BUG-003 [TC-AUTH-04]: Confirm password accepts partial prefix matches during registration', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Sign In' }).click();
    await page.locator('#link-to-register').click();

    await page.getByLabel('Full Name *').fill('Prefix Test');
    await page.getByLabel('Email Address *').fill(`prefixtest_${Date.now()}@example.com`);
    await page.locator('#register-password').fill('Secret123');
    // Enter only the prefix "Secret"
    await page.locator('#register-confirm-password').fill('Secret');

    await page.locator('#register-submit-btn').click();

    // Defect Assertion: Form does NOT display "Passwords do not match" error due to .startsWith() bug
    await expect(page.getByText('Passwords do not match')).not.toBeVisible();
  });

  // BUG-004: Cart allows zero and negative quantities via minus button
  test('BUG-004 [TC-CART-02]: Cart allows zero and negative quantities via minus button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await page.locator('#add-to-cart-1').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();

    const qtyInput = page.locator('#cart-item-1-qty-input');
    await expect(qtyInput).toHaveValue('1');

    // Click '-' button at quantity 1
    await page.locator('#cart-item-1-minus').click();

    // Defect Assertion: Quantity becomes 0 instead of remaining 1 or prompting removal
    await expect(qtyInput).toHaveValue('0');
  });

  // BUG-005: Quantity counter on Product Detail page allows 0 units
  test('BUG-005 [TC-DET-01]: Product Detail quantity counter decrements to 0 units', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await page.getByRole('heading', { name: 'AeroBeat Pro Wireless Headphones' }).click();

    const qtyInput = page.locator('#product-qty-input');
    await expect(qtyInput).toHaveValue('1');

    // Click '-' button
    await page.locator('#qty-decrement-btn').click();

    // Defect Assertion: Quantity decrements to 0
    await expect(qtyInput).toHaveValue('0');
  });

  // BUG-006: Checkout phone number field accepts non-numeric alphabet characters
  test('BUG-006 [TC-CHK-02]: Checkout phone field accepts non-numeric alphabet characters without validation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await page.locator('#add-to-cart-1').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    // Fill letters in contact phone
    await page.getByLabel('Contact Phone Number *').fill('abcdefghij');
    await page.locator('#place-order-submit-btn').click();

    // Defect Assertion: No validation error about numeric format is shown, order succeeds
    await expect(page.getByText(/numeric|valid phone/i)).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
  });

  // BUG-007: Checkout allows submitting UPI payment with empty UPI ID
  test('BUG-007 [TC-CHK-04]: Checkout allows submitting UPI payment with empty UPI ID', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await page.locator('#add-to-cart-1').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    // Select UPI payment method
    await page.locator('#radio-payment-upi').check();

    // Clear UPI ID input completely
    await page.locator('#checkout-upi-id').fill('');

    // Place order
    await page.locator('#place-order-submit-btn').click();

    // Defect Assertion: Order completes successfully even with empty UPI ID
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
  });

  // BUG-009: Admin product search filter is case-sensitive
  test('BUG-009 [TC-ADM-02]: Admin product search filter is case-sensitive', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('Email Address').fill('admin@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Admin@123');
    await page.locator('#login-form').getByRole('button', { name: 'Sign In' }).click();

    // Open Admin Portal
    await page.getByRole('button', { name: /admin portal/i }).click();

    // Search for "headphones" in lowercase
    const adminSearchInput = page.locator('#admin-product-search');
    await adminSearchInput.fill('headphones');

    // Defect Assertion: Due to case sensitivity (p.name.includes), 0 products match table
    await expect(page.locator('#admin-products-table tbody tr')).toHaveCount(0);
  });

  // BUG-010: Total Recorded Users count shows off-by-one discrepancy in Admin Users tab
  test('BUG-010 [TC-ADM-03]: Total Recorded Users count displays off-by-one discrepancy', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Sign In' }).click();
    await page.getByLabel('Email Address').fill('admin@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Admin@123');
    await page.locator('#login-form').getByRole('button', { name: 'Sign In' }).click();

    // Open Admin Portal & switch to Users tab
    await page.getByRole('button', { name: /admin portal/i }).click();
    await page.locator('#admin-tab-users').click();

    // Count user rows in the table (currently 2 seeded users)
    const userRows = page.locator('#admin-users-table tbody tr');
    const rowCount = await userRows.count();

    // Defect Assertion: The display header shows count + 1 due to the backend off-by-one bug
    const countDisplay = page.locator('#admin-user-count-display');
    await expect(countDisplay).toContainText(`Total Recorded Users: ${rowCount + 1}`);
  });

  // BUG-012: Case-sensitive registration email check allows duplicate account creation
  test('BUG-012 [TC-AUTH-05]: Registration allows duplicate account creation due to case sensitivity', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Sign In' }).click();
    await page.locator('#link-to-register').click();

    // Register with uppercase version of existing user tester@example.com
    await page.getByLabel('Full Name *').fill('Duplicate Alex');
    await page.getByLabel('Email Address *').fill(`TESTER_${Date.now()}@example.com`);
    await page.locator('#register-password').fill('Test@123');
    await page.locator('#register-confirm-password').fill('Test@123');

    await page.locator('#register-submit-btn').click();

    // Defect Assertion: Registration succeeds rather than throwing 409 duplicate error
    await expect(page.getByRole('heading', { name: 'Product Catalog' })).toBeVisible();
  });

  // BUG-013: Checkout card payment accepts expired credit card dates
  test('BUG-013 [TC-CHK-03]: Checkout accepts expired credit card date without validation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await page.locator('#add-to-cart-1').click();
    await page.getByRole('button', { name: 'View Shopping Cart' }).click();
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    // Enter an expired card expiry date (e.g. 01/20)
    await page.locator('#checkout-card-expiry').fill('01/20');

    // Place Order
    await page.locator('#place-order-submit-btn').click();

    // Defect Assertion: Order goes through without card expiration validation error
    await expect(page.getByText(/expired/i)).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
  });
});
