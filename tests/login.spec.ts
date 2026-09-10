import { test, expect } from '@playwright/test';
import { TEST_USER, INVALID_USER } from './test-data';

test.describe('Authentication - Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and open the Login page from the navigation bar
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });

  test('TC-AUTH-01: Valid login displays user profile in navigation', async ({ page }) => {
    // Fill in valid credentials using semantic locators
    await page.getByLabel('Email Address').fill(TEST_USER.email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_USER.password);

    // Submit the login form
    await page.locator('#login-form').getByRole('button', { name: 'Sign In' }).click();

    // Assert that the user's name is displayed in the navigation header
    await expect(page.getByRole('button', { name: TEST_USER.firstName })).toBeVisible();

    // Assert redirection to the Product Catalog
    await expect(page.getByRole('heading', { name: 'Product Catalog' })).toBeVisible();
  });

  test('TC-AUTH-02: Invalid login displays appropriate error alert', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel('Email Address').fill(INVALID_USER.email);
    await page.getByLabel('Password', { exact: true }).fill(INVALID_USER.password);

    // Submit the login form
    await page.locator('#login-form').getByRole('button', { name: 'Sign In' }).click();

    // Assert that the server error message is displayed
    const errorAlert = page.locator('#login-server-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/invalid|authentication failed/i);
  });
});
