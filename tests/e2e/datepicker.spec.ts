import { test, expect } from '@playwright/test';

test.describe('DatePicker component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'DatePicker' || t.textContent?.trim() === 'DatePicker') {
          t.click();
          return;
        }
      }
    });

    const heading = page.getByRole('heading', { name: 'DatePicker Component Examples', exact: true });
    await heading.scrollIntoViewIfNeeded();
  });

  test('renders all demo cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'DatePicker Component Examples', exact: true })).toBeVisible();
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('shows placeholder when no value', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.date-picker__input');
    await expect(input).toHaveAttribute('placeholder', 'Select date');
    await expect(input).toHaveValue('');
  });

  test('opens calendar on icon button click', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__panel')).toBeVisible();
  });

  test('calendar shows day-of-week headers (Monday first)', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    const headers = page.locator('.date-picker__day-header');
    await expect(headers.first()).toHaveText('Mon');
    await expect(headers.last()).toHaveText('Sun');
  });

  test('calendar shows 42 day cells', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__day')).toHaveCount(42);
  });

  test('selecting a date closes calendar and updates input', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();

    // Click first non-other-month day
    const days = page.locator('.date-picker__day:not(.date-picker__day--other-month)');
    await days.first().click();

    // Calendar should close
    await expect(page.locator('.date-picker__panel')).not.toBeVisible();
    // Input should have a value (not empty)
    await expect(firstCard.locator('.date-picker__input')).not.toHaveValue('');
  });

  test('closes calendar on Escape key', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.date-picker__panel')).not.toBeVisible();
  });

  test('navigates to previous month', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();

    const headerBtn = page.locator('.date-picker__month-year-btn');
    const before = await headerBtn.textContent();

    const navBtns = page.locator('.date-picker__nav-btn');
    await navBtns.first().click();

    const after = await headerBtn.textContent();
    expect(before).not.toBe(after);
  });

  test('navigates to next month', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();

    const headerBtn = page.locator('.date-picker__month-year-btn');
    const before = await headerBtn.textContent();

    const navBtns = page.locator('.date-picker__nav-btn');
    await navBtns.last().click();

    const after = await headerBtn.textContent();
    expect(before).not.toBe(after);
  });

  test('opens month picker on header click', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    await page.locator('.date-picker__month-year-btn').click();
    await expect(page.locator('.date-picker__month-grid')).toBeVisible();
    await expect(page.locator('.date-picker__month-item')).toHaveCount(12);
  });

  test('opens year picker from month view', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    await page.locator('.date-picker__month-year-btn').click();
    await page.locator('.date-picker__month-year-btn').click();
    await expect(page.locator('.date-picker__year-grid')).toBeVisible();
    await expect(page.locator('.date-picker__year-item')).toHaveCount(20);
  });

  test('selecting a month returns to day view', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    await page.locator('.date-picker__month-year-btn').click();
    await page.locator('.date-picker__month-item').first().click();
    await expect(page.locator('.date-picker__days-grid')).toBeVisible();
  });

  test('Today button navigates to today and selects it', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await firstCard.locator('.date-picker__icon-btn').click();
    const todayBtn = page.locator('.date-picker__footer-btn', { hasText: 'Today' });
    await todayBtn.click();
    // Calendar should close after Today click in date mode
    await expect(page.locator('.date-picker__panel')).not.toBeVisible();
    // Input should show a date
    await expect(firstCard.locator('.date-picker__input')).not.toHaveValue('');
  });

  test('preloaded date card shows formatted value', async ({ page }) => {
    const cards = page.locator('.card');
    const preloadedCard = cards.nth(1);
    await expect(preloadedCard.locator('.date-picker__input')).toHaveValue('19 Feb 2026');
  });

  test('preloaded date card opens at correct month', async ({ page }) => {
    const cards = page.locator('.card');
    const preloadedCard = cards.nth(1);
    await preloadedCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__month-year-btn')).toContainText('February 2026');
    await page.keyboard.press('Escape');
  });

  test('time picker card shows time display', async ({ page }) => {
    const cards = page.locator('.card');
    const timeCard = cards.nth(2); // Time Picker card
    await expect(timeCard.locator('.date-picker__input')).toHaveAttribute('placeholder', 'Select time');
    await timeCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__time')).toBeVisible();
    // Should NOT show calendar
    await expect(page.locator('.date-picker__days-grid')).not.toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('datetime picker shows both calendar and time section', async ({ page }) => {
    const cards = page.locator('.card');
    const dtCard = cards.nth(3); // Date & Time card
    await dtCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__days-grid')).toBeVisible();
    await expect(page.locator('.date-picker__time')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('time section increments hour', async ({ page }) => {
    const cards = page.locator('.card');
    const timeCard = cards.nth(2);
    await timeCard.locator('.date-picker__icon-btn').click();

    const timeBtns = page.locator('.date-picker__time-btn');
    await timeBtns.first().click(); // increment hour → 01
    const timeValue = page.locator('.date-picker__time-value').first();
    await expect(timeValue).toHaveText('01');
    await page.keyboard.press('Escape');
  });

  test('Now button closes picker and sets time in time mode', async ({ page }) => {
    const cards = page.locator('.card');
    const timeCard = cards.nth(2);
    await timeCard.locator('.date-picker__icon-btn').click();
    const nowBtn = page.locator('.date-picker__footer-btn', { hasText: 'Now' });
    await nowBtn.click();
    await expect(page.locator('.date-picker__panel')).not.toBeVisible();
    await expect(timeCard.locator('.date-picker__input')).not.toHaveValue('');
  });

  test('clearable card shows × button when value present', async ({ page }) => {
    const cards = page.locator('.card');
    const clearCard = cards.nth(4); // Clearable card
    // First select a date to get a value
    await clearCard.locator('.date-picker__icon-btn').click();
    await page.locator('.date-picker__day:not(.date-picker__day--other-month)').first().click();
    await expect(clearCard.locator('.date-picker__clear')).toBeVisible();
  });

  test('clearable × button clears the value', async ({ page }) => {
    const cards = page.locator('.card');
    const clearCard = cards.nth(4);
    // Select a date
    await clearCard.locator('.date-picker__icon-btn').click();
    await page.locator('.date-picker__day:not(.date-picker__day--other-month)').first().click();
    // Clear it
    await clearCard.locator('.date-picker__clear').click();
    await expect(clearCard.locator('.date-picker__input')).toHaveValue('');
  });

  test('range picker shows range hint when open', async ({ page }) => {
    const cards = page.locator('.card');
    const rangeCard = cards.nth(5); // Date Range card
    await rangeCard.locator('.date-picker__icon-btn').click();
    await expect(page.locator('.date-picker__range-hint')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('range picker selects start then end date', async ({ page }) => {
    const cards = page.locator('.card');
    const rangeCard = cards.nth(5);
    await rangeCard.locator('.date-picker__icon-btn').click();

    const days = page.locator('.date-picker__day:not(.date-picker__day--other-month)');
    // Click first date (start)
    await days.nth(3).click();
    // Click a later date (end)
    await days.nth(10).click();

    // Calendar should close after range selection in date mode
    await expect(page.locator('.date-picker__panel')).not.toBeVisible();
    // Input should show a range (value contains →)
    await expect(rangeCard.locator('.date-picker__input')).toHaveValue(/→/);
  });

  test('min/max constraint card disables out-of-range dates', async ({ page }) => {
    const cards = page.locator('.card');
    const constraintCard = cards.nth(7); // Min/Max card
    await constraintCard.locator('.date-picker__icon-btn').click();

    // Day 1 should be disabled (before Feb 10)
    const day1 = page.locator('.date-picker__day:not(.date-picker__day--other-month)').first();
    await expect(day1).toBeDisabled();
    await page.keyboard.press('Escape');
  });

  test('weekday-only card disables weekend days', async ({ page }) => {
    const cards = page.locator('.card');
    const weekdayCard = cards.nth(8); // isDateDisabled card
    await weekdayCard.locator('.date-picker__icon-btn').click();

    await expect(page.locator('.date-picker__day--disabled').first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('compact size applies correct modifier class', async ({ page }) => {
    const cards = page.locator('.card');
    const compactCard = cards.nth(9); // Compact card
    await expect(compactCard.locator('.date-picker--compact').first()).toBeVisible();
  });

  test('disabled state prevents opening', async ({ page }) => {
    const cards = page.locator('.card');
    const disabledCard = cards.nth(10); // Disabled card
    const iconBtn = disabledCard.locator('.date-picker--disabled .date-picker__icon-btn').first();
    await iconBtn.click({ force: true });
    await expect(page.locator('.date-picker__panel')).not.toBeVisible();
  });

  test('invalid state shows danger border', async ({ page }) => {
    const cards = page.locator('.card');
    const invalidCard = cards.nth(11); // Invalid card
    await expect(invalidCard.locator('.date-picker--invalid')).toBeVisible();
  });

  test('manual text input accepts YYYY-MM-DD', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.date-picker__input');
    await input.click();
    await input.fill('2026-06-15');
    await input.press('Enter');
    await expect(input).toHaveValue('15 Jun 2026');
  });

  test('manual text input accepts D MMM YYYY', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    const input = firstCard.locator('.date-picker__input');
    await input.click();
    await input.fill('15 Jun 2026');
    await input.press('Enter');
    await expect(input).toHaveValue('15 Jun 2026');
  });

  test('seconds card shows seconds column', async ({ page }) => {
    const cards = page.locator('.card');
    // Seconds card is nth(13) — after FormField Integration (12)
    const secCard = cards.nth(13);
    await secCard.locator('.date-picker__icon-btn').click();
    // Should have 6 time buttons (hour up/down, min up/down, sec up/down)
    await expect(page.locator('.date-picker__time-btn')).toHaveCount(6);
    await page.keyboard.press('Escape');
  });

  test('12-hour card shows AM/PM button', async ({ page }) => {
    const cards = page.locator('.card');
    const ampmCard = cards.nth(14); // 12-hour clock card
    await ampmCard.locator('.date-picker__icon-btn').first().click();
    await expect(page.locator('.date-picker__ampm-btn').first()).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
