import { test, expect } from '@playwright/test';

test.describe('Divider component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to the Divider demo section via sidebar
    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'Divider' || t.textContent?.trim() === 'Divider') {
          t.click();
          return;
        }
      }
    });

    const heading = page.getByRole('heading', { name: 'Divider Component Examples', exact: true });
    await heading.scrollIntoViewIfNeeded();
  });

  test('renders horizontal dividers', async ({ page }) => {
    // First card has a basic horizontal divider
    const firstCard = page.locator('.card').first();
    const divider = firstCard.locator('.divider--horizontal');
    await expect(divider).toBeVisible();
    await expect(divider).toHaveAttribute('role', 'separator');
  });

  test('renders all line style variants', async ({ page }) => {
    // Second card has solid, dashed, dotted
    const cards = page.locator('.card');
    const lineStyleCard = cards.nth(1);

    await expect(lineStyleCard.locator('.divider--solid')).toBeVisible();
    await expect(lineStyleCard.locator('.divider--dashed')).toBeVisible();
    await expect(lineStyleCard.locator('.divider--dotted')).toBeVisible();
  });

  test('renders color theme variants with labels', async ({ page }) => {
    // Third card has default, primary, accent
    const cards = page.locator('.card');
    const themeCard = cards.nth(2);

    await expect(themeCard.locator('.divider--primary')).toBeVisible();
    await expect(themeCard.locator('.divider--accent')).toBeVisible();

    // Labels should be visible
    await expect(themeCard.getByText('Default', { exact: true })).toBeVisible();
    await expect(themeCard.getByText('Primary', { exact: true })).toBeVisible();
    await expect(themeCard.getByText('Accent', { exact: true })).toBeVisible();
  });

  test('renders dividers with labels', async ({ page }) => {
    // Fifth card has labeled dividers
    const cards = page.locator('.card');
    const labelCard = cards.nth(4);
    await labelCard.scrollIntoViewIfNeeded();

    await expect(labelCard.getByText('OR')).toBeVisible();
    await expect(labelCard.getByText('Section Break')).toBeVisible();
  });

  test('renders label alignment variants', async ({ page }) => {
    // Sixth card has start, center, end label alignment
    const cards = page.locator('.card');
    const alignCard = cards.nth(5);
    await alignCard.scrollIntoViewIfNeeded();

    await expect(alignCard.locator('.divider--label-start')).toBeVisible();
    await expect(alignCard.locator('.divider--label-center')).toBeVisible();
    await expect(alignCard.locator('.divider--label-end')).toBeVisible();
  });

  test('renders vertical dividers', async ({ page }) => {
    // Eighth card has vertical dividers
    const cards = page.locator('.card');
    const verticalCard = cards.nth(7);
    await verticalCard.scrollIntoViewIfNeeded();

    const verticalDividers = verticalCard.locator('.divider--vertical');
    await expect(verticalDividers.first()).toBeVisible();
  });

  test('draggable horizontal divider resizes on drag', async ({ page }) => {
    // Tenth card has draggable horizontal divider
    const cards = page.locator('.card');
    const dragCard = cards.nth(9);
    await dragCard.scrollIntoViewIfNeeded();

    const divider = dragCard.locator('.divider--draggable').first();
    await expect(divider).toBeVisible();

    // Get initial panel text
    const topPanel = dragCard.locator('div').filter({ hasText: /Top panel/ }).first();
    const initialText = await topPanel.textContent();

    // Perform drag
    const box = await divider.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 30, { steps: 5 });
      await page.mouse.up();
    }

    // After drag, panel size should have changed
    const updatedText = await topPanel.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test('draggable vertical divider resizes on drag', async ({ page }) => {
    // Eleventh card has draggable vertical divider
    const cards = page.locator('.card');
    const dragCard = cards.nth(10);
    await dragCard.scrollIntoViewIfNeeded();

    const divider = dragCard.locator('.divider--draggable').first();
    await expect(divider).toBeVisible();

    const leftPanel = dragCard.locator('div').filter({ hasText: /Left/ }).first();
    const initialText = await leftPanel.textContent();

    // Perform drag horizontally
    const box = await divider.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2, { steps: 5 });
      await page.mouse.up();
    }

    const updatedText = await leftPanel.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test('drag handle dots are visible on draggable dividers', async ({ page }) => {
    const cards = page.locator('.card');
    const dragCard = cards.nth(9);
    await dragCard.scrollIntoViewIfNeeded();

    const handle = dragCard.locator('.divider__handle').first();
    await expect(handle).toBeVisible();

    const dots = handle.locator('.divider__handle-dot');
    await expect(dots).toHaveCount(3);
  });
});
