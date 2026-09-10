import { test, expect } from '@playwright/test';
import { SEARCH_DATA, FILTER_DATA } from './test-data';

test.describe('Product Catalog - Search & Filter Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and access the Product Catalog
    await page.goto('/');
    await page.getByRole('navigation').getByRole('button', { name: 'Catalog' }).click();
    await expect(page.getByRole('heading', { name: 'Product Catalog' })).toBeVisible();
  });

  test('TC-CAT-01: Search for an existing product returns matching result', async ({ page }) => {
    // Enter search keyword into the catalog search input
    const searchInput = page.getByPlaceholder('Search products by title, feature, or keyword...');
    await searchInput.fill(SEARCH_DATA.query);

    // Click the Search button
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    // Verify that the matching product card is visible in the search results
    const productHeading = page.getByRole('heading', { name: SEARCH_DATA.expectedProductName });
    await expect(productHeading).toBeVisible();
  });

  test('TC-CAT-02: Filtering by category displays only relevant items', async ({ page }) => {
    // Select the category filter from the sidebar
    const sidebar = page.locator('#catalog-sidebar');
    await sidebar.getByRole('button', { name: FILTER_DATA.category }).click();

    // Verify that the category product is displayed
    const matchingProduct = page.getByRole('heading', { name: FILTER_DATA.expectedProduct });
    await expect(matchingProduct).toBeVisible();

    // Verify that a product belonging to another category is excluded from results
    const excludedProduct = page.getByRole('heading', { name: FILTER_DATA.excludedProduct });
    await expect(excludedProduct).not.toBeVisible();
  });
});
