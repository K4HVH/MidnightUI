import { test, expect } from '@playwright/test';

/** Click the sidebar nav tab to switch to a demo section */
async function navigateToDemo(page: import('@playwright/test').Page, label: string) {
  // The sidebar pane has two content layers (partial icon-only + open with labels).
  // The active layer's tabs may be overlapped by the pane body or main content.
  // Use evaluate to programmatically click the correct tab button.
  await page.evaluate((lbl) => {
    const activeContent = document.querySelector('.pane--permanent .pane__content--active');
    if (!activeContent) throw new Error('No active pane content found');
    const tabs = activeContent.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    for (const tab of tabs) {
      const ariaLabel = tab.getAttribute('aria-label');
      const textContent = tab.textContent?.trim();
      if (ariaLabel === lbl || textContent === lbl) {
        tab.click();
        return;
      }
    }
    throw new Error(`Tab "${lbl}" not found in active pane content`);
  }, label);
}

test.describe('Design System Test Page', () => {
  test('should load the test page', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Design System Test Page' })).toBeVisible();
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Solid App/);
  });

  test('displays typography section', async ({ page }) => {
    await page.goto('/');

    // Typography is the default demo
    await expect(page.getByRole('heading', { name: 'Typography Examples' })).toBeVisible();
  });

  test('displays card component examples', async ({ page }) => {
    await page.goto('/');

    await navigateToDemo(page, 'Card');
    await expect(page.getByRole('heading', { name: 'Card Component Examples' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Default Card' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Emphasized Card' })).toBeVisible();
  });

  test('displays checkbox component examples', async ({ page }) => {
    await page.goto('/');

    await navigateToDemo(page, 'Checkbox');
    await expect(page.getByRole('heading', { name: 'Checkbox Component Examples' })).toBeVisible();
    await expect(page.getByText('Basic Checkboxes')).toBeVisible();
  });

  test('displays button component examples', async ({ page }) => {
    await page.goto('/');

    await navigateToDemo(page, 'Button');
    await expect(page.getByRole('heading', { name: 'Button Component Examples' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Primary Button' })).toBeVisible();
  });

  test('interactive button works', async ({ page }) => {
    await page.goto('/');

    await navigateToDemo(page, 'Button');

    // Find the specific "Click me" button in the Interactive Example section
    const button = page.getByRole('button', { name: 'Click me', exact: true }).first();
    await button.scrollIntoViewIfNeeded();

    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());

    await button.click();
  });

  test('displays combobox examples', async ({ page }) => {
    await page.goto('/');

    await navigateToDemo(page, 'Combobox');
    await expect(page.getByRole('heading', { name: 'Combobox Examples', exact: true })).toBeVisible();
  });
});
