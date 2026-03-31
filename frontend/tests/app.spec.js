import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('App UI Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('switch between Tasks and Bugs', async ({ page }) => {
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');

    await page.click('[data-testid="nav-bugs"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('bugs');

    await page.click('[data-testid="nav-tasks"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');
  });

  test('toggle sidebar (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });

    const sidebar = page.locator('[data-testid="sidebar"]');

    await page.click('[data-testid="toggle-sidebar"]');
    await expect(sidebar).toBeVisible();

    await page.click('body');
  });

  test('toggle notes sidebar', async ({ page }) => {
    const notes = page.locator('[data-testid="notes-sidebar"]');

    await page.click('[data-testid="toggle-notes"]');
    await expect(notes).toBeVisible();
    await expect(notes).not.toHaveClass(/translate-x-full/);

    await page.click('[data-testid="toggle-notes"]');
    await expect(notes).toHaveClass(/translate-x-full/);
  });

  test('toggle dark mode', async ({ page }) => {
    const html = page.locator('html');

    await page.click('[data-testid="toggle-dark"]');
    await expect(html).toHaveClass(/dark/);

    await page.click('[data-testid="toggle-dark"]');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('dashboard shows stats', async ({ page }) => {
    await page.waitForTimeout(1000);

    await expect(page.locator('[data-testid="total-tasks"]'))
      .toBeVisible();

    await expect(page.locator('[data-testid="total-bugs"]'))
      .toBeVisible();
  });

  test('charts are rendered', async ({ page }) => {
    await expect(page.locator('[data-testid="task-chart"]'))
      .toBeVisible();

    await expect(page.locator('[data-testid="bug-chart"]'))
      .toBeVisible();
  });

  test('full user flow', async ({ page }) => {
    await page.click('[data-testid="toggle-notes"]');
    await expect(page.locator('[data-testid="notes-sidebar"]'))
      .toBeVisible();

    await page.click('[data-testid="nav-bugs"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('bugs');

    await page.click('[data-testid="toggle-dark"]');
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.click('[data-testid="nav-tasks"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');
  });

});