import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('App UI Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // =========================
  // 🔹 PAGE NAVIGATION
  // =========================
  test('switch between Tasks and Bugs', async ({ page }) => {
    // default = tasks
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');

    // ไป bugs
    await page.click('[data-testid="nav-bugs"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('bugs');

    // กลับ tasks
    await page.click('[data-testid="nav-tasks"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');
  });

  // =========================
  // 🔹 SIDEBAR
  // =========================
  test('toggle sidebar (mobile)', async ({ page }) => {
    // simulate mobile
    await page.setViewportSize({ width: 375, height: 800 });

    const sidebar = page.locator('[data-testid="sidebar"]');

    // เปิด sidebar
    await page.click('[data-testid="toggle-sidebar"]');
    await expect(sidebar).toBeVisible();

    // ปิดโดย click overlay
    await page.click('body');
  });

  // =========================
  // 🔹 NOTES SIDEBAR
  // =========================
test('toggle notes sidebar', async ({ page }) => {
  const notes = page.locator('[data-testid="notes-sidebar"]');

  // เปิด
  await page.click('[data-testid="toggle-notes"]');
  await expect(notes).toBeVisible();
  await expect(notes).not.toHaveClass(/translate-x-full/);

  // ปิด
  await page.click('[data-testid="toggle-notes"]');
  await expect(notes).toHaveClass(/translate-x-full/);
});

  // =========================
  // 🔹 DARK MODE
  // =========================
  test('toggle dark mode', async ({ page }) => {
    const html = page.locator('html');

    // เปิด dark
    await page.click('[data-testid="toggle-dark"]');
    await expect(html).toHaveClass(/dark/);

    // ปิด dark
    await page.click('[data-testid="toggle-dark"]');
    await expect(html).not.toHaveClass(/dark/);
  });

  // =========================
  // 🔹 DASHBOARD LOAD
  // =========================
  test('dashboard shows stats', async ({ page }) => {
    // รอ fetch
    await page.waitForTimeout(1000);

    await expect(page.locator('[data-testid="total-tasks"]'))
      .toBeVisible();

    await expect(page.locator('[data-testid="total-bugs"]'))
      .toBeVisible();
  });

  // =========================
  // 🔹 CHART RENDER
  // =========================
  test('charts are rendered', async ({ page }) => {
    await expect(page.locator('[data-testid="task-chart"]'))
      .toBeVisible();

    await expect(page.locator('[data-testid="bug-chart"]'))
      .toBeVisible();
  });

  // =========================
  // 🔹 FULL FLOW
  // =========================
  test('full user flow', async ({ page }) => {
    // เปิด notes
    await page.click('[data-testid="toggle-notes"]');
    await expect(page.locator('[data-testid="notes-sidebar"]'))
      .toBeVisible();

    // เปลี่ยนหน้า
    await page.click('[data-testid="nav-bugs"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('bugs');

    // เปิด dark mode
    await page.click('[data-testid="toggle-dark"]');
    await expect(page.locator('html')).toHaveClass(/dark/);

    // กลับ tasks
    await page.click('[data-testid="nav-tasks"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');
  });

});