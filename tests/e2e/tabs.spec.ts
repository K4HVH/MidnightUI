import { test, expect } from '@playwright/test';

test.describe('Tabs component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: 'Tabs Component Examples', exact: true });
    await heading.scrollIntoViewIfNeeded();
  });

  test('renders tabs with correct labels', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-basic"] [role="tablist"]');
    await expect(tablist).toBeVisible();

    const tabs = tablist.locator('[role="tab"]');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toContainText('Dashboard');
    await expect(tabs.nth(1)).toContainText('Analytics');
    await expect(tabs.nth(2)).toContainText('Reports');
  });

  test('click to switch tabs', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-basic"] [role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');

    // First tab is active by default
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    // Click second tab
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  test('keyboard navigation with arrow keys', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-basic"] [role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');

    // Focus the first tab
    await tabs.nth(0).focus();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    // Arrow right to second tab
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    // Arrow right to third tab
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

    // Arrow right wraps to first tab
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('disabled tabs are not selectable', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-disabled"] [role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');

    // The disabled tab should have disabled attribute
    const disabledTab = tabs.nth(1);
    await expect(disabledTab).toBeDisabled();

    // Click on disabled tab should not change selection
    await disabledTab.click({ force: true });
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('vertical tabs render with correct orientation', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-vertical"] [role="tablist"]');
    await expect(tablist).toHaveClass(/tabs--vertical/);
    await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('vertical tabs use up/down arrow keys', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-vertical"] [role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');

    await tabs.nth(0).focus();

    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowUp');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('tabs with icons render icon elements', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-icons"] [role="tablist"]');
    const icons = tablist.locator('.tabs__tab-icon');
    await expect(icons).toHaveCount(3);
  });

  test('size variants apply correct classes', async ({ page }) => {
    const compact = page.locator('[data-testid="tabs-compact"] [role="tablist"]');
    await expect(compact).toHaveClass(/tabs--compact/);

    const spacious = page.locator('[data-testid="tabs-spacious"] [role="tablist"]');
    await expect(spacious).toHaveClass(/tabs--spacious/);
  });

  test('variant classes apply correctly', async ({ page }) => {
    // Basic tabs default to primary
    const primary = page.locator('[data-testid="tabs-basic"] [role="tablist"]');
    await expect(primary).toHaveClass(/tabs--primary/);

    // Secondary variant
    const secondary = page.locator('[data-testid="tabs-secondary"] [role="tablist"]');
    await expect(secondary).toHaveClass(/tabs--secondary/);

    // Subtle variant
    const subtle = page.locator('[data-testid="tabs-subtle"] [role="tablist"]');
    await expect(subtle).toHaveClass(/tabs--subtle/);
  });

  test('icon-only mode hides labels and shows icons', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-icon-only"] [role="tablist"]');
    await expect(tablist).toHaveClass(/tabs--icon-only/);

    // Icons should be visible
    const icons = tablist.locator('.tabs__tab-icon');
    await expect(icons).toHaveCount(3);

    // Labels should not be rendered
    const labels = tablist.locator('.tabs__tab-label');
    await expect(labels).toHaveCount(0);
  });

  test('icon-only tabs have aria-label for accessibility', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-icon-only"] [role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');

    await expect(tabs.nth(0)).toHaveAttribute('aria-label');
    await expect(tabs.nth(1)).toHaveAttribute('aria-label');
    await expect(tabs.nth(2)).toHaveAttribute('aria-label');
  });

  test('icon-only tabs are clickable', async ({ page }) => {
    const tablist = page.locator('[data-testid="tabs-icon-only"] [role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');

    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
  });
});
