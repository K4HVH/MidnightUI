import { test, expect } from '@playwright/test';

test.describe('Chip component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to the Chip demo section via sidebar
    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'Chip' || t.textContent?.trim() === 'Chip') {
          t.click();
          return;
        }
      }
    });

    const heading = page.getByRole('heading', { name: 'Chip Component Examples', exact: true });
    await heading.scrollIntoViewIfNeeded();
  });

  test('renders static chips', async ({ page }) => {
    // First card has basic static chips
    const firstCard = page.locator('.card').first();
    const chips = firstCard.locator('.chip');

    await expect(chips).toHaveCount(4);
    await expect(chips.nth(0)).toContainText('JavaScript');
    await expect(chips.nth(1)).toContainText('TypeScript');
    await expect(chips.nth(2)).toContainText('SolidJS');
    await expect(chips.nth(3)).toContainText('CSS');
  });

  test('renders chips with icons', async ({ page }) => {
    // Second card has chips with icons
    const cards = page.locator('.card');
    const iconsCard = cards.nth(1);
    const chips = iconsCard.locator('.chip');

    await expect(chips.first()).toContainText('Tag');

    // Check that icon is present
    const icon = chips.first().locator('.chip__icon');
    await expect(icon).toBeVisible();
  });

  test('removable chip - click X button to remove', async ({ page }) => {
    // Navigate to "Removable Chips" card
    const cards = page.locator('.card');
    const removableCard = cards.nth(4); // "Removable Chips" is the 5th card

    // Get initial chip count
    const initialChips = await removableCard.locator('.chip').count();
    expect(initialChips).toBeGreaterThan(0);

    // Click the remove button on the first chip
    const firstChip = removableCard.locator('.chip').first();
    const removeButton = firstChip.locator('.chip__remove');

    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Wait a bit for the chip to be removed
    await page.waitForTimeout(100);

    // Verify chip was removed
    const remainingChips = await removableCard.locator('.chip').count();
    expect(remainingChips).toBe(initialChips - 1);
  });

  test('clickable chip - responds to click', async ({ page }) => {
    // Navigate to "Clickable Chips" card
    const cards = page.locator('.card');
    const clickableCard = cards.nth(6); // "Clickable Chips" is the 7th card

    const firstChip = clickableCard.locator('.chip').first();

    // Chip should be clickable (has role="button")
    await expect(firstChip).toHaveAttribute('role', 'button');

    // Initial state - should be neutral variant
    await expect(firstChip).toHaveClass(/chip--neutral/);

    // Click the chip
    await firstChip.click();

    // After click, should change to primary variant (based on demo logic)
    await expect(firstChip).toHaveClass(/chip--primary/);
  });

  test('keyboard navigation - Enter key for clickable chip', async ({ page }) => {
    const cards = page.locator('.card');
    const clickableCard = cards.nth(6); // "Clickable Chips" card

    const chip = clickableCard.locator('.chip').first();

    // Focus the chip
    await chip.focus();
    await expect(chip).toBeFocused();

    // Press Enter
    await chip.press('Enter');

    // Should trigger click (variant should change)
    await expect(chip).toHaveClass(/chip--primary/);
  });

  test('keyboard navigation - Space key for clickable chip', async ({ page }) => {
    const cards = page.locator('.card');
    const clickableCard = cards.nth(6); // "Clickable Chips" card

    const chip = clickableCard.locator('.chip').nth(1); // Second chip

    // Focus the chip
    await chip.focus();

    // Press Space
    await chip.press(' ');

    // Should trigger click (variant should change)
    await expect(chip).toHaveClass(/chip--primary/);
  });

  test('disabled chip cannot be clicked', async ({ page }) => {
    // Navigate to "Disabled State" card
    const cards = page.locator('.card');
    const disabledCard = cards.nth(8); // "Disabled State" is the 9th card

    const disabledClickableChip = disabledCard.locator('.chip').nth(2); // "Disabled Clickable"

    // Should have disabled class
    await expect(disabledClickableChip).toHaveClass(/chip--disabled/);

    // Should have aria-disabled
    await expect(disabledClickableChip).toHaveAttribute('aria-disabled', 'true');

    // Should not have clickable class even though it has onClick
    await expect(disabledClickableChip).not.toHaveClass(/chip--clickable/);
  });

  test('chip with both onClick and onRemove', async ({ page }) => {
    // Navigate to "Clickable with Remove" card
    const cards = page.locator('.card');
    const bothCard = cards.nth(7); // "Clickable with Remove" is the 8th card

    const chip = bothCard.locator('.chip').first();

    // Should be clickable
    await expect(chip).toHaveAttribute('role', 'button');

    // Should have remove button
    const removeButton = chip.locator('.chip__remove');
    await expect(removeButton).toBeVisible();

    // Clicking chip should trigger onClick (not remove)
    const chipLabel = chip.locator('.chip__label');
    await chipLabel.click();

    // Should still exist (not removed)
    await expect(chip).toBeVisible();
  });

  test('color variants render correctly', async ({ page }) => {
    // Navigate to "Color Variants" card
    const cards = page.locator('.card');
    const variantsCard = cards.nth(2); // "Color Variants" is the 3rd card

    const chips = variantsCard.locator('.chip');

    await expect(chips.nth(0)).toHaveClass(/chip--neutral/);
    await expect(chips.nth(1)).toHaveClass(/chip--primary/);
    await expect(chips.nth(2)).toHaveClass(/chip--success/);
    await expect(chips.nth(3)).toHaveClass(/chip--warning/);
    await expect(chips.nth(4)).toHaveClass(/chip--error/);
    await expect(chips.nth(5)).toHaveClass(/chip--info/);
  });

  test('size variants render correctly', async ({ page }) => {
    // Navigate to "Size Variants" card
    const cards = page.locator('.card');
    const sizeCard = cards.nth(3); // "Size Variants" is the 4th card

    const chips = sizeCard.locator('.chip');

    await expect(chips.nth(0)).toHaveClass(/chip--compact/);
    await expect(chips.nth(1)).not.toHaveClass(/chip--compact|chip--spacious/);
    await expect(chips.nth(2)).toHaveClass(/chip--spacious/);
  });
});
