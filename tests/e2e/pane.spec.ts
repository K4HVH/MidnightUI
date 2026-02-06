import { test, expect } from '@playwright/test';

test.describe('Pane component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('viewport permanent pane renders with handle visible', async ({ page }) => {
    // The viewport-level permanent left pane wraps the page content
    const pane = page.locator('.pane--permanent.pane--left').first();
    await expect(pane).toBeVisible();

    const handle = pane.locator('.pane__handle');
    await expect(handle).toBeVisible();
  });

  test('viewport permanent pane starts in partial state', async ({ page }) => {
    const pane = page.locator('.pane--permanent.pane--left').first();
    await expect(pane).toHaveClass(/pane--partial/);
  });

  test('handle click cycles through states with partial', async ({ page }) => {
    const pane = page.locator('.pane--permanent.pane--left').first();
    const handle = pane.locator('.pane__handle');

    // Starts partial
    await expect(pane).toHaveClass(/pane--partial/);

    // Click → open
    await handle.click();
    await expect(pane).toHaveClass(/pane--open/);

    // Click → closed
    await handle.click();
    await expect(pane).toHaveClass(/pane--closed/);

    // Click → partial (cycle restarts)
    await handle.click();
    await expect(pane).toHaveClass(/pane--partial/);
  });

  test('handle icon rotates when open', async ({ page }) => {
    const pane = page.locator('.pane--permanent.pane--left').first();
    const handle = pane.locator('.pane__handle');
    const icon = handle.locator('.pane__handle-icon');

    // Partial — not rotated
    await expect(icon).not.toHaveClass(/pane__handle-icon--rotated/);

    // Click → open — rotated
    await handle.click();
    await expect(icon).toHaveClass(/pane__handle-icon--rotated/);

    // Click → closed — not rotated
    await handle.click();
    await expect(icon).not.toHaveClass(/pane__handle-icon--rotated/);
  });

  test('temporary overlay pane opens with backdrop', async ({ page }) => {
    // Scroll to the Pane section and click Open Right Pane
    const paneSection = page.getByRole('heading', { name: 'Pane Component Examples', exact: true });
    await paneSection.scrollIntoViewIfNeeded();

    const openButton = page.locator('button', { hasText: 'Open Right Pane' });
    await openButton.click();

    // Fixed overlay pane should be open
    const pane = page.locator('.pane--fixed.pane--right');
    await expect(pane).toHaveClass(/pane--open/);
    await expect(pane).toHaveClass(/pane--overlay/);

    // Backdrop should be visible
    const backdrop = page.locator('.pane__backdrop--visible.pane__backdrop--fixed');
    await expect(backdrop).toBeVisible();
  });

  test('temporary overlay pane closes on backdrop click', async ({ page }) => {
    const paneSection = page.getByRole('heading', { name: 'Pane Component Examples', exact: true });
    await paneSection.scrollIntoViewIfNeeded();

    const openButton = page.locator('button', { hasText: 'Open Right Pane' });
    await openButton.click();

    const pane = page.locator('.pane--fixed.pane--right');
    await expect(pane).toHaveClass(/pane--open/);

    // Click the visible fixed backdrop
    const backdrop = page.locator('.pane__backdrop--fixed.pane__backdrop--visible');
    await backdrop.click({ position: { x: 5, y: 5 }, force: true });

    // Pane should be closed
    await expect(pane).toHaveClass(/pane--closed/);
  });

  test('temporary overlay pane closes on Escape', async ({ page }) => {
    const paneSection = page.getByRole('heading', { name: 'Pane Component Examples', exact: true });
    await paneSection.scrollIntoViewIfNeeded();

    const openButton = page.locator('button', { hasText: 'Open Left Pane' });
    await openButton.click();

    const pane = page.locator('.pane--fixed.pane--left');
    await expect(pane).toHaveClass(/pane--open/);

    // Press Escape
    await page.keyboard.press('Escape');

    // Pane should be closed
    await expect(pane).toHaveClass(/pane--closed/);
  });

  test('pane aria-expanded reflects state', async ({ page }) => {
    const pane = page.locator('.pane--permanent.pane--left').first();
    const handle = pane.locator('.pane__handle');

    // Partial — aria-expanded should be true
    await expect(pane).toHaveAttribute('aria-expanded', 'true');

    // Close it
    await handle.click(); // partial → open
    await handle.click(); // open → closed

    await expect(pane).toHaveAttribute('aria-expanded', 'false');
  });
});
