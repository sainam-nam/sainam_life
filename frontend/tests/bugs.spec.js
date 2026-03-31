import { test, expect } from '@playwright/test';

test.describe('Bugs Page (no testid)', () => {

  const getColumn = (page, name) =>
    page.getByRole('heading', { name }).locator('..');

  const drag = async (page, source, target) => {
    const s = await source.boundingBox();
    const t = await target.boundingBox();
    
    await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
    await page.mouse.down();
    await page.mouse.move(t.x + t.width / 2, t.y + t.height * 0.75, { steps: 15 });
    await page.mouse.up();
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: '🐞 Bugs' }).click();
  });

  test('create bug', async ({ page }) => {
    const title = `Bug ${Date.now()}`;

    await page.getByPlaceholder('Title').fill(title);
    await page.getByPlaceholder('Description').fill('desc test');
    await page.getByRole('button', { name: 'Add Bug' }).click();

    const open = getColumn(page, 'open');

    await expect(
      open.locator('.font-semibold').filter({ hasText: title })
    ).toHaveCount(1);
  });

  test('delete bug', async ({ page }) => {
    const open = getColumn(page, 'open');

    const bug = open.locator('.font-semibold').first();
    if (await bug.count() === 0) test.skip();

    const title = await bug.innerText();

    const card = bug.locator('..');
    await card.getByRole('button', { name: 'Delete' }).click();

    await expect(
      open.locator('.font-semibold').filter({ hasText: title })
    ).toHaveCount(0);
  });

  test('open edit modal', async ({ page }) => {
    const open = getColumn(page, 'open');

    const bug = open.locator('.font-semibold').first();
    if (await bug.count() === 0) test.skip();

    const card = bug.locator('..');

    await card.getByRole('button', { name: 'Edit' }).click();

    await expect(page.getByText('Bug Detail')).toBeVisible();
  });

  test('edit bug', async ({ page }) => {
    const open = getColumn(page, 'open');

    const bug = open.locator('.font-semibold').first();
    if (await bug.count() === 0) test.skip();

    const card = bug.locator('..');

    const newTitle = `Updated ${Date.now()}`;

    await card.getByRole('button', { name: 'Edit' }).click();

    await page.getByPlaceholder('formTitle').fill(newTitle);
    await page.getByPlaceholder('formDescription').fill('Updated description');
    await page.getByPlaceholder('formPriority').selectOption('high');
    await page.getByPlaceholder('formSolution').fill('Updated solution');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
      open.locator('.font-semibold').filter({ hasText: newTitle })
    ).toHaveCount(1);
  });

  const getDropZone = (page, name) =>
    page.getByRole('heading', { name }).locator('..').locator('> div').nth(1);

  test('drag open → in_progress', async ({ page }) => {
    const open = getColumn(page, 'open');
    const inProgressColumn = getColumn(page, 'in_progress');
    const inProgress = getDropZone(page, 'in_progress');

    const bug = open.locator('.font-semibold').first();
    if (await bug.count() === 0) test.skip();

    const title = (await bug.innerText()).trim();
    const card = bug.locator('..');

    await drag(page, card, inProgress);

    await expect.poll(async () => {
      return await inProgressColumn
        .locator('.font-semibold')
        .filter({ hasText: title })
        .count();
    }).toBe(1, { timeout: 5000 }); 

    await expect(
      open.locator('.font-semibold').filter({ hasText: title })
    ).toHaveCount(0);
  });

  test('drag in_progress → fixed', async ({ page }) => {
    const inProgress = getColumn(page, 'in_progress');
    const fixedColumn = getColumn(page, 'fixed');
    const fixed = getDropZone(page, 'fixed');

    const bug = inProgress.locator('.font-semibold').first();
    if (await bug.count() === 0) test.skip();

    const title = await bug.innerText();
    const card = bug.locator('..');

    await drag(page, card, fixed);

    await expect.poll(async () => {
      return await fixedColumn
        .locator('.font-semibold')
        .filter({ hasText: title })
        .count();
    }).toBe(1, { timeout: 5000 }); 

    await expect(
      inProgress.locator('.font-semibold').filter({ hasText: title })
    ).toHaveCount(0);
  });

});