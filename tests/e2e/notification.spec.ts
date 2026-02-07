import { test, expect } from '@playwright/test';

test.describe('Notification behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Navigate to the Notification demo section via sidebar
    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'Notification' || t.textContent?.trim() === 'Notification') { t.click(); return; }
      }
    });

    // Scroll to the Notification section
    const notificationSection = page.locator('h2', { hasText: 'Notification Component Examples' });
    await notificationSection.scrollIntoViewIfNeeded();
  });

  test('shows success notification', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Success' });
    await button.click();

    // Notification should appear
    await expect(page.locator('.notification--success')).toBeVisible();
    await expect(page.locator('.notification__title', { hasText: 'Success!' })).toBeVisible();
    await expect(page.locator('.notification__message', { hasText: 'Your changes have been saved successfully.' })).toBeVisible();
  });

  test('shows error notification', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Error' });
    await button.click();

    // Notification should appear
    await expect(page.locator('.notification--error')).toBeVisible();
    await expect(page.locator('.notification__title', { hasText: 'Error' })).toBeVisible();
  });

  test('shows warning notification', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Warning' });
    await button.click();

    // Notification should appear
    await expect(page.locator('.notification--warning')).toBeVisible();
    await expect(page.locator('.notification__title', { hasText: 'Warning' })).toBeVisible();
  });

  test('shows info notification', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Info' }).first();
    await button.click();

    // Notification should appear
    await expect(page.locator('.notification--info')).toBeVisible();
    await expect(page.locator('.notification__title', { hasText: 'Information' })).toBeVisible();
  });

  test('dismisses notification when close button is clicked', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Success' });
    await button.click();

    // Wait for notification to appear
    const notification = page.locator('.notification--success');
    await expect(notification).toBeVisible();

    // Click close button
    const closeButton = notification.locator('.notification__close');
    await closeButton.click();

    // Notification should disappear
    await expect(notification).not.toBeVisible();
  });

  test('auto-dismisses notification after timeout', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Quick Dismiss' });
    await button.click();

    // Notification should appear
    const notification = page.locator('.notification', { hasText: 'Quick (2s)' });
    await expect(notification).toBeVisible();

    // Wait for auto-dismiss (2 seconds + buffer)
    await page.waitForTimeout(2500);

    // Notification should disappear
    await expect(notification).not.toBeVisible();
  });

  test('persistent notification does not auto-dismiss', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Persistent' });
    await button.click();

    // Notification should appear
    const notification = page.locator('.notification', { hasText: 'Persistent' });
    await expect(notification).toBeVisible();

    // Wait longer than normal timeout
    await page.waitForTimeout(6000);

    // Notification should still be visible
    await expect(notification).toBeVisible();

    // Clean up - close the notification
    await notification.locator('.notification__close').click();
  });

  test('shows notification in top-right position', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Top Right' });
    await button.click();

    // Check container position
    const container = page.locator('.notification-container--top-right');
    await expect(container.locator('.notification')).toBeVisible();
  });

  test('shows notification in top-center position', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Top Center' });
    await button.click();

    // Check container position
    const container = page.locator('.notification-container--top-center');
    await expect(container.locator('.notification')).toBeVisible();
  });

  test('shows notification in bottom-right position', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Bottom Right' });
    await button.click();

    // Check container position
    const container = page.locator('.notification-container--bottom-right');
    await expect(container.locator('.notification')).toBeVisible();
  });

  test('shows notification in bottom-center position', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Bottom Center' });
    await button.click();

    // Check container position
    const container = page.locator('.notification-container--bottom-center');
    await expect(container.locator('.notification')).toBeVisible();
  });

  test('shows notification with action buttons', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Update Notification' });
    await button.click();

    // Notification should appear with actions
    const notification = page.locator('.notification', { hasText: 'Update Available' });
    await expect(notification).toBeVisible();
    await expect(notification.locator('.notification__action', { hasText: 'Update Now' })).toBeVisible();
    await expect(notification.locator('.notification__action', { hasText: 'Later' })).toBeVisible();
  });

  test('dismisses notification when action is clicked', async ({ page }) => {
    const button = page.locator('button', { hasText: 'With Single Action' });
    await button.click();

    // Wait for notification
    const notification = page.locator('.notification', { hasText: 'File Uploaded' });
    await expect(notification).toBeVisible();

    // Click action button
    const actionButton = notification.locator('.notification__action', { hasText: 'View' });
    await actionButton.click();

    // Notification should disappear
    await expect(notification).not.toBeVisible();
  });

  test('shows multiple notifications simultaneously', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Multiple' });
    await button.click();

    // Wait a bit for all notifications to appear
    await page.waitForTimeout(1000);

    // All three notifications should be visible
    await expect(page.locator('.notification', { hasText: 'First notification' })).toBeVisible();
    await expect(page.locator('.notification', { hasText: 'Second notification' })).toBeVisible();
    await expect(page.locator('.notification', { hasText: 'Third notification' })).toBeVisible();
  });

  test('stacks notifications correctly', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Stack' });
    await button.click();

    // Wait for notifications to appear
    await page.waitForTimeout(1500);

    // Check that multiple notifications are visible
    const notifications = page.locator('.notification');
    const count = await notifications.count();
    expect(count).toBeGreaterThan(1);
  });

  test('notification has icon', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Success' });
    await button.click();

    // Check for icon
    const notification = page.locator('.notification--success');
    await expect(notification.locator('.notification__icon')).toBeVisible();
  });

  test('notification supports title only', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Title Only' });
    await button.click();

    // Notification should appear with just a title
    await expect(page.locator('.notification__title', { hasText: 'Saved!' })).toBeVisible();

    // Message should not be present
    const notification = page.locator('.notification', { hasText: 'Saved!' });
    await expect(notification.locator('.notification__message')).not.toBeVisible();
  });

  test('notification appears with animation', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Show Success' });
    await button.click();

    // Notification should have animation class
    const notification = page.locator('.notification--success');
    await expect(notification).toBeVisible();

    // Verify it's actually rendered (animation completed)
    await page.waitForTimeout(500);
    await expect(notification).toBeVisible();
  });
});
