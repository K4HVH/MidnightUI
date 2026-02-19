import { test, expect } from '@playwright/test';

test.describe('NumberInput component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'NumberInput' || t.textContent?.trim() === 'NumberInput') {
          t.click();
          return;
        }
      }
    });

    const heading = page.getByRole('heading', { name: 'NumberInput Component Examples', exact: true });
    await heading.scrollIntoViewIfNeeded();
  });

  test('renders with initial value', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.number-input__input');
    await expect(input).toHaveValue('42');
  });

  test('renders decrement and increment buttons', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await expect(firstCard.locator('.number-input__stepper--decrement')).toBeVisible();
    await expect(firstCard.locator('.number-input__stepper--increment')).toBeVisible();
  });

  test('increments value on + button click', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.number-input__input');
    const increment = firstCard.locator('.number-input__stepper--increment');

    await increment.click();
    await expect(input).toHaveValue('43');
  });

  test('decrements value on − button click', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.number-input__input');
    const decrement = firstCard.locator('.number-input__stepper--decrement');

    await decrement.click();
    await expect(input).toHaveValue('41');
  });

  test('clamps to min on blur', async ({ page }) => {
    // Min/Max Range card (3rd card)
    const cards = page.locator('.card');
    const rangeCard = cards.nth(2);
    const input = rangeCard.locator('.number-input__input');

    await input.click();
    await input.fill('-999');
    await input.blur();

    await expect(input).toHaveValue('0');
  });

  test('clamps to max on blur', async ({ page }) => {
    const cards = page.locator('.card');
    const rangeCard = cards.nth(2);
    const input = rangeCard.locator('.number-input__input');

    await input.click();
    await input.fill('999');
    await input.blur();

    await expect(input).toHaveValue('100');
  });

  test('disables decrement button at min value', async ({ page }) => {
    // Custom Step card (4th card) has min=0
    const cards = page.locator('.card');
    const stepCard = cards.nth(3);
    const input = stepCard.locator('.number-input__input');
    const decrement = stepCard.locator('.number-input__stepper--decrement');

    // Set to 0 (minimum)
    await input.click();
    await input.fill('0');
    await input.blur();

    await expect(decrement).toBeDisabled();
  });

  test('disables increment button at max value', async ({ page }) => {
    const cards = page.locator('.card');
    const stepCard = cards.nth(3);
    const input = stepCard.locator('.number-input__input');
    const increment = stepCard.locator('.number-input__stepper--increment');

    // Set to 100 (maximum)
    await input.click();
    await input.fill('100');
    await input.blur();

    await expect(increment).toBeDisabled();
  });

  test('increments with ArrowUp key', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.number-input__input');

    await input.click();
    await input.press('ArrowUp');
    await expect(input).toHaveValue('43');
  });

  test('decrements with ArrowDown key', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.number-input__input');

    await input.click();
    await input.press('ArrowDown');
    await expect(input).toHaveValue('41');
  });

  test('disabled state prevents interaction', async ({ page }) => {
    // Disabled State card (8th card)
    const cards = page.locator('.card');
    const disabledCard = cards.nth(7);

    const input = disabledCard.locator('.number-input__input');
    const decrement = disabledCard.locator('.number-input__stepper--decrement');
    const increment = disabledCard.locator('.number-input__stepper--increment');

    await expect(input).toBeDisabled();
    await expect(decrement).toBeDisabled();
    await expect(increment).toBeDisabled();
    await expect(disabledCard.locator('.number-input--disabled')).toBeVisible();
  });

  test('renders prefix and suffix', async ({ page }) => {
    // Prefix and Suffix card (6th card)
    const cards = page.locator('.card');
    const prefixCard = cards.nth(5);

    await expect(prefixCard.locator('.number-input__prefix').first()).toContainText('$');
    await expect(prefixCard.locator('.number-input__suffix').first()).toContainText('kg');
  });

  test('compact size applies modifier class', async ({ page }) => {
    // Compact Size card (7th card)
    const cards = page.locator('.card');
    const compactCard = cards.nth(6);
    await expect(compactCard.locator('.number-input--compact')).toBeVisible();
  });

  test('invalid state applies modifier class', async ({ page }) => {
    // Invalid State card (9th card)
    const cards = page.locator('.card');
    const invalidCard = cards.nth(8);
    await expect(invalidCard.locator('.number-input--invalid')).toBeVisible();
  });
});
