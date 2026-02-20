import { test, expect } from '@playwright/test';
import path from 'path';
import os from 'os';
import fs from 'fs';

test.describe('FileUpload component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      const activeContent = document.querySelector('.pane--permanent .pane__content--active');
      const tabs = activeContent!.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      for (const t of tabs) {
        if (t.getAttribute('aria-label') === 'FileUpload' || t.textContent?.trim() === 'FileUpload') {
          t.click();
          return;
        }
      }
    });

    const heading = page.getByRole('heading', { name: 'FileUpload Component Examples', exact: true });
    await heading.scrollIntoViewIfNeeded();
  });

  test('renders all demo cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'FileUpload Component Examples', exact: true })).toBeVisible();
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('dropzone variant is visible by default', async ({ page }) => {
    const firstCard = page.locator('.card').first();
    await expect(firstCard.locator('.file-upload__dropzone')).toBeVisible();
    await expect(firstCard.getByText('Drag files here or click to browse')).toBeVisible();
  });

  test('button variant renders browse button', async ({ page }) => {
    // Third card is "Button Variant — Single File"
    const buttonCard = page.locator('.card').nth(2);
    await buttonCard.scrollIntoViewIfNeeded();
    await expect(buttonCard.locator('.file-upload__button')).toBeVisible();
    await expect(buttonCard.getByText('Browse files')).toBeVisible();
  });

  test('constraint hints are visible on the constraints card', async ({ page }) => {
    // Fifth card has accept, maxSize, maxFiles
    const constraintCard = page.locator('.card').nth(4);
    await constraintCard.scrollIntoViewIfNeeded();
    await expect(constraintCard.getByText(/Accepts: image\/\*/)).toBeVisible();
    await expect(constraintCard.getByText(/Max size: 2.0 MB/)).toBeVisible();
    await expect(constraintCard.getByText(/Up to 3 files/)).toBeVisible();
  });

  test('progress bar is visible on the progress card', async ({ page }) => {
    // Sixth card has progress={65}
    const progressCard = page.locator('.card').nth(5);
    await progressCard.scrollIntoViewIfNeeded();
    await expect(progressCard.locator('.progress--linear')).toBeVisible();
  });

  test('disabled dropzone is styled as disabled', async ({ page }) => {
    // Eighth card (index 7) is "Disabled State" — Compact Size is at index 6
    const disabledCard = page.locator('.card').nth(7);
    await disabledCard.scrollIntoViewIfNeeded();
    await expect(disabledCard.locator('.file-upload--disabled')).toBeVisible();
    const input = disabledCard.locator('input[type="file"]');
    await expect(input).toBeDisabled();
  });

  test('invalid state shows error message', async ({ page }) => {
    // Ninth card (index 8) is "Invalid / Error State"
    const invalidCard = page.locator('.card').nth(8);
    await invalidCard.scrollIntoViewIfNeeded();
    await expect(invalidCard.locator('.file-upload--invalid')).toBeVisible();
    await expect(invalidCard.getByText('Please upload a valid file.')).toBeVisible();
  });

  test('drag-over class is applied on dragenter and removed on dragleave', async ({ page }) => {
    // Use page.evaluate to dispatch real DragEvent instances (plain objects aren't valid DataTransfer)
    await page.evaluate(() => {
      const el = document.querySelector('.file-upload__dropzone') as HTMLElement;
      el.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true }));
    });
    await expect(page.locator('.file-upload--drag-over').first()).toBeVisible();

    await page.evaluate(() => {
      const el = document.querySelector('.file-upload__dropzone') as HTMLElement;
      el.dispatchEvent(new DragEvent('dragleave', { bubbles: true, cancelable: true }));
    });
    await expect(page.locator('.file-upload--drag-over').first()).not.toBeVisible({ timeout: 3000 });
  });

  test('drag-over state changes dropzone text', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.querySelector('.file-upload__dropzone') as HTMLElement;
      el.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true }));
    });
    await expect(page.locator('.file-upload__dropzone').first().getByText('Drop files here')).toBeVisible();
  });

  test('file chip appears after selecting a file via file input', async ({ page }) => {
    const tmpFile = path.join(os.tmpdir(), 'test-upload.txt');
    fs.writeFileSync(tmpFile, 'hello world');

    const firstCard = page.locator('.card').first();
    await firstCard.locator('input[type="file"]').setInputFiles(tmpFile);

    // Use the chip label specifically to avoid matching the <small> debug text in the demo
    await expect(firstCard.locator('.chip__label', { hasText: 'test-upload.txt' })).toBeVisible();

    fs.unlinkSync(tmpFile);
  });

  test('file chip can be removed', async ({ page }) => {
    const tmpFile = path.join(os.tmpdir(), 'removable.txt');
    fs.writeFileSync(tmpFile, 'data');

    const firstCard = page.locator('.card').first();
    await firstCard.locator('input[type="file"]').setInputFiles(tmpFile);
    await expect(firstCard.locator('.chip__label', { hasText: 'removable.txt' })).toBeVisible();

    await firstCard.locator('.chip__remove').click();
    await expect(firstCard.locator('.chip')).not.toBeVisible({ timeout: 3000 });

    fs.unlinkSync(tmpFile);
  });

  test('multiple files can be added in multiple mode', async ({ page }) => {
    const file1 = path.join(os.tmpdir(), 'file1.txt');
    const file2 = path.join(os.tmpdir(), 'file2.txt');
    fs.writeFileSync(file1, 'a');
    fs.writeFileSync(file2, 'b');

    // Second card is "Dropzone — Multiple Files"
    const multiCard = page.locator('.card').nth(1);
    await multiCard.scrollIntoViewIfNeeded();
    await multiCard.locator('input[type="file"]').setInputFiles([file1, file2]);

    await expect(multiCard.locator('.chip__label', { hasText: 'file1.txt' })).toBeVisible();
    await expect(multiCard.locator('.chip__label', { hasText: 'file2.txt' })).toBeVisible();

    fs.unlinkSync(file1);
    fs.unlinkSync(file2);
  });
});
