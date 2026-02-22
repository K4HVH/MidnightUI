import { test, expect } from '@playwright/test';

test.describe('CommandPalette behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to the CommandPalette demo section via sidebar
    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'CommandPalette' || t.textContent?.trim() === 'CommandPalette') { t.click(); return; }
      }
    });

    // Wait for the demo heading
    const heading = page.locator('h2', { hasText: 'CommandPalette Component Examples' });
    await heading.scrollIntoViewIfNeeded();
  });

  test('opens and closes basic command palette', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    // Palette should be visible
    const dialog = page.locator('[role="dialog"][aria-label="Command palette"]');
    await expect(dialog).toBeVisible();

    // Search input should be focused
    const input = page.locator('.command-palette__input');
    await expect(input).toBeFocused();

    // Should show items
    const items = page.locator('.command-palette__item');
    await expect(items.first()).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('filters commands by search query', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    const input = page.locator('.command-palette__input');
    await input.fill('Save');

    // Only matching item should be visible
    const items = page.locator('.command-palette__item');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('Save File');
  });

  test('shows empty state when no results', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    const input = page.locator('.command-palette__input');
    await input.fill('zzzznonexistent');

    const empty = page.locator('.command-palette__empty');
    await expect(empty).toBeVisible();
    await expect(empty).toHaveText('No commands found');
  });

  test('navigates with keyboard and selects item', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    // Navigate down
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Active state should move
    const activeItems = page.locator('.command-palette__item--active');
    await expect(activeItems).toHaveCount(1);

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Palette should close after selection
    const dialog = page.locator('[role="dialog"][aria-label="Command palette"]');
    await expect(dialog).not.toBeVisible();

    // Action should be recorded
    const lastAction = page.locator('strong');
    await expect(lastAction).not.toHaveText('None');
  });

  test('selects item by clicking', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    // Click on a specific item
    const settingsItem = page.locator('.command-palette__item', { hasText: 'Settings' });
    await settingsItem.click();

    // Palette should close
    const dialog = page.locator('[role="dialog"][aria-label="Command palette"]');
    await expect(dialog).not.toBeVisible();

    // Action should be recorded
    await expect(page.locator('strong')).toHaveText('Settings');
  });

  test('closes when clicking backdrop', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    const dialog = page.locator('[role="dialog"][aria-label="Command palette"]');
    await expect(dialog).toBeVisible();

    // Click the backdrop area
    const backdrop = page.locator('.command-palette__backdrop');
    await backdrop.click({ position: { x: 10, y: 10 } });

    await expect(dialog).not.toBeVisible();
  });

  test('renders grouped items with headers', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Grouped Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    // Should show group headers
    const headers = page.locator('.command-palette__group-header');
    await expect(headers.first()).toBeVisible();

    // Should show multiple groups
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThanOrEqual(2);
  });

  test('renders rich items with descriptions and tags', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Rich Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    // Should show descriptions
    const descriptions = page.locator('.command-palette__item-description');
    await expect(descriptions.first()).toBeVisible();

    // Should show tags (rendered as Chips)
    const tags = page.locator('.command-palette__item-tags .chip');
    await expect(tags.first()).toBeVisible();
  });

  test('renders compact size variant', async ({ page }) => {
    const compactButton = page.locator('button', { hasText: 'Compact' });
    await compactButton.scrollIntoViewIfNeeded();
    await compactButton.click();

    const palette = page.locator('.command-palette--compact');
    await expect(palette).toBeVisible();

    // Close
    await page.keyboard.press('Escape');
  });

  test('renders spacious size variant', async ({ page }) => {
    const spaciousButton = page.locator('button', { hasText: 'Spacious' });
    await spaciousButton.scrollIntoViewIfNeeded();
    await spaciousButton.click();

    const palette = page.locator('.command-palette--spacious');
    await expect(palette).toBeVisible();

    // Close
    await page.keyboard.press('Escape');
  });

  test('clears search query with clear button', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    const input = page.locator('.command-palette__input');
    await input.fill('Save');

    // Clear button should appear
    const clearButton = page.locator('.command-palette__clear');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Input should be empty and all items visible
    await expect(input).toHaveValue('');
    const items = page.locator('.command-palette__item');
    const count = await items.count();
    expect(count).toBeGreaterThan(1);
  });

  test('shows keyboard shortcut hints in footer', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    const footer = page.locator('.command-palette__footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('navigate');
    await expect(footer).toContainText('select');
    await expect(footer).toContainText('close');
  });

  test('renders shortcut badges on items', async ({ page }) => {
    const openButton = page.locator('button', { hasText: 'Open Command Palette' });
    await openButton.scrollIntoViewIfNeeded();
    await openButton.click();

    const shortcut = page.locator('.command-palette__shortcut');
    await expect(shortcut.first()).toBeVisible();
    await expect(shortcut.first()).toHaveText('Ctrl+S');
  });
});
