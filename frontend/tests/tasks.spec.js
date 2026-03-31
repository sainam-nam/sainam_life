// import { test, expect } from '@playwright/test';

// const BASE_URL = 'http://localhost:5173';

// test.describe('Tasks Page', () => {

//   test.beforeEach(async ({ page }) => {
//     await page.goto(BASE_URL);

//     await page.click('[data-testid="nav-tasks"]');
//     await expect(page.locator('[data-testid="page-title"]'))
//       .toHaveText('tasks');
//   });

//   test('create task', async ({ page }) => {
//     const title = `Task ${Date.now()}`;

//     await page.fill('[data-testid="new-task-title"]', title);
//     await page.click('[data-testid="add-task"]');

//     await expect(page.locator('[data-testid="todo-column"]'))
//       .toContainText(title, { timeout: 5000 });
//   });

//   test('delete task', async ({ page }) => {
//     const task = page.locator('[data-testid^="task-"]').first();

//     if (await task.count() === 0) test.skip();

//     // const deleteBtn = task.locator('[data-testid^="delete-task-"]');

//     // await deleteBtn.click();
//     await task.getByRole('button', { name: 'Delete' }).click();

//     await expect(task).toHaveCount(0);
//   });

//   test('open edit modal', async ({ page }) => {
//     const editBtn = page.locator('[data-testid^="edit-task-"]').first();

//     if (await editBtn.count() === 0) test.skip();

//     await editBtn.click();

//     await expect(page.locator('[data-testid="edit-modal"]'))
//       .toBeVisible();
//   });

//   // test('edit task', async ({ page }) => {
//   //   const editBtn = page.locator('[data-testid^="edit-task-"]').first();

//   //   if (await editBtn.count() === 0) test.skip();

//   //   const newTitle = `Updated ${Date.now()}`;

//   //   await editBtn.click();

//   //   await page.fill('[data-testid="edit-task-title"]', newTitle);
//   //   await page.click('[data-testid="save-edit-task"]');

//   //   await expect(page.locator('[data-testid="edit-modal"]'))
//   //     .toHaveCount(0);

//   //   await expect(page.locator('[data-testid^="task-"]'))
//   //     .toContainText(newTitle);
//   // });
//   test('edit task', async ({ page }) => {
//     const column = page.locator('[data-testid="todo-column"]');

//     const task = column.locator('[data-testid^="task-"]').first();

//     const newTitle = `Updated ${Date.now()}`;

//     await task.getByRole('button', { name: 'Edit' }).click();

//     await page.fill('[data-testid="edit-task-title"]', newTitle);
//     await page.click('[data-testid="save-edit-task"]');

//     await expect(column).toContainText(newTitle);
//   });

//   test('cancel edit modal', async ({ page }) => {
//     const editBtn = page.locator('[data-testid^="edit-task-"]').first();

//     if (await editBtn.count() === 0) test.skip();

//     await editBtn.click();
//     await page.click('[data-testid="cancel-edit-task"]');

//     await expect(page.locator('[data-testid="edit-modal"]'))
//       .toHaveCount(0);
//   });

//   // test('drag task from todo → doing', async ({ page }) => {
//   //   const task = page.locator('[data-testid="todo-column"] [data-testid^="task-"]').first();

//   //   if (await task.count() === 0) test.skip();

//   //   const target = page.locator('[data-testid="doing-column"]');

//   //   await expect(task).toBeVisible();

//   //   await task.dragTo(target, { force: true });

//   //   await expect(target).toContainText(await task.innerText());
//   // });
//   test('drag task from todo → doing', async ({ page }) => {
//     const task = page.locator('[data-testid="todo-column"] [data-testid^="task-"]').first();

//     if (await task.count() === 0) test.skip();

//     const text = await task.innerText();

//     const target = page.locator('[data-testid="doing-column"]');

//     await task.dragTo(target);

//     await expect(page.locator('[data-testid="todo-column"]')).not.toContainText(text);

//     await expect(target).toContainText(text);
//   });

//   // test('drag task to done column', async ({ page }) => {
//   //   const task = page.locator('[data-testid="doing-column"] [data-testid^="task-"]').first();

//   //   if (await task.count() === 0) test.skip();

//   //   const done = page.locator('[data-testid="done-column"]');

//   //   await task.dragTo(done, { force: true });

//   //   await expect(done).toContainText(await task.innerText());
//   // });
//   test('drag task to done column', async ({ page }) => {
//     const task = page.locator('[data-testid="doing-column"] [data-testid^="task-"]').first();

//     if (await task.count() === 0) test.skip();

//     const text = await task.innerText();

//     const done = page.locator('[data-testid="done-column"]');

//     await task.dragTo(done);

//     await expect(page.locator('[data-testid="doing-column"]')).not.toContainText(text);
//     await expect(done).toContainText(text);
//   });

//   test('full task lifecycle', async ({ page }) => {
//     const title = `Flow ${Date.now()}`;
//     const updated = `Updated ${Date.now()}`;

//     await page.fill('[data-testid="new-task-title"]', title);
//     await page.click('[data-testid="add-task"]');

//     const column = page.locator('[data-testid="todo-column"]');

//     await expect(column).toContainText(title);

//     const task = column.locator('[data-testid^="task-"]').filter({
//       hasText: title
//     });

//     await task.locator('[data-testid^="edit-task-"]').click();

//     await page.fill('[data-testid="edit-task-title"]', updated);
//     await page.click('[data-testid="save-edit-task"]');

//     await expect(column).toContainText(updated);

//     const updatedTask = column.locator('[data-testid^="task-"]').filter({
//       hasText: updated
//     });

//     await updatedTask.locator('[data-testid^="delete-task-"]').click();

//     await expect(column).not.toContainText(updated);
//   });

// });

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Tasks Page (Full Coverage)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    await page.click('[data-testid="nav-tasks"]');
    await expect(page.locator('[data-testid="page-title"]'))
      .toHaveText('tasks');
  });

  test('create task with all fields', async ({ page }) => {
    const title = `Task ${Date.now()}`;

    await page.fill('[data-testid="new-task-title"]', title);
    await page.fill('[data-testid="new-task-description"]', 'desc test');
    await page.selectOption('[data-testid="new-task-priority"]', 'high');
    await page.fill('[data-testid="new-task-due-date"]', '2026-12-31');

    await page.click('[data-testid="add-task"]');

    const column = page.locator('[data-testid="todo-column"]');

    await expect(column).toContainText(title);
    await expect(column).toContainText('desc test');
    await expect(column).toContainText('high');
  });

  test('cannot create task without title', async ({ page }) => {
    await page.fill('[data-testid="new-task-description"]', 'no title');
    await page.click('[data-testid="add-task"]');

    const column = page.locator('[data-testid="todo-column"]');

    await expect(column).not.toContainText('no title');
  });

  test('delete task', async ({ page }) => {
    const column = page.locator('[data-testid="todo-column"]');

    const task = column.locator('[data-testid^="task-"]').first();
    if (await task.count() === 0) test.skip();

    const text = await task.innerText();

    await task.locator('[data-testid^="delete-task-"]').click();

    await expect(column).not.toContainText(text);
  });

  test('open edit modal', async ({ page }) => {
    const editBtn = page.locator('[data-testid^="edit-task-"]').first();
    if (await editBtn.count() === 0) test.skip();

    await editBtn.click();

    await expect(page.locator('[data-testid="edit-modal"]'))
      .toBeVisible();
  });

  test('edit task full fields', async ({ page }) => {
    const column = page.locator('[data-testid="todo-column"]');

    const task = column.locator('[data-testid^="task-"]').first();
    if (await task.count() === 0) test.skip();

    const newTitle = `Updated ${Date.now()}`;

    await task.locator('[data-testid^="edit-task-"]').click();

    await page.fill('[data-testid="edit-task-title"]', newTitle);
    await page.fill('[data-testid="edit-task-description"]', 'updated desc');
    await page.selectOption('[data-testid="edit-task-priority"]', 'low');
    await page.fill('[data-testid="edit-task-due-date"]', '2027-01-01');

    await page.click('[data-testid="save-edit-task"]');

    await expect(page.locator('[data-testid="edit-modal"]'))
      .toHaveCount(0);

    await expect(column).toContainText(newTitle);
    await expect(column).toContainText('updated desc');
    await expect(column).toContainText('low');
  });

  test('cancel edit modal', async ({ page }) => {
    const editBtn = page.locator('[data-testid^="edit-task-"]').first();
    if (await editBtn.count() === 0) test.skip();

    await editBtn.click();
    await page.click('[data-testid="cancel-edit-task"]');

    await expect(page.locator('[data-testid="edit-modal"]'))
      .toHaveCount(0);
  });

  test('drag todo → doing', async ({ page }) => {
    const todo = page.locator('[data-testid="todo-column"]');
    const doing = page.locator('[data-testid="doing-column"]');

    const task = todo.locator('[data-testid^="task-"]').first();
    if (await task.count() === 0) test.skip();

    const title = await task.locator('.font-semibold').innerText();

    const sourceBox = await task.boundingBox();
    const targetBox = await doing.boundingBox();

    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );

    await page.mouse.down();

    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );

    await page.mouse.up();

    await expect
      .poll(async () => {
        return await doing
          .locator('[data-testid^="task-"]')
          .filter({ hasText: title })
          .count();
      })
      .toBe(1);
  });

  test('drag doing → done', async ({ page }) => {
    const doing = page.locator('[data-testid="doing-column"]');
    const done = page.locator('[data-testid="done-column"]');

    const task = doing.locator('[data-testid^="task-"]').first();
    if (await task.count() === 0) test.skip();

    const title = await task.locator('.font-semibold').innerText();

    const sourceBox = await task.boundingBox();
    const targetBox = await done.boundingBox();

    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );

    await page.mouse.down();

    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );

    await page.mouse.up();

    await expect
      .poll(async () => {
        return await done
          .locator('[data-testid^="task-"]')
          .filter({ hasText: title })
          .count();
      })
      .toBe(1);

    await expect(
      doing.locator('[data-testid^="task-"]').filter({ hasText: title })
    ).toHaveCount(0);
  });

  test('full lifecycle', async ({ page }) => {
    const title = `Flow ${Date.now()}`;
    const updated = `Updated ${Date.now()}`;

    const column = page.locator('[data-testid="todo-column"]');

    await page.fill('[data-testid="new-task-title"]', title);
    await page.click('[data-testid="add-task"]');

    await expect(column).toContainText(title);

    const task = column.locator('[data-testid^="task-"]').filter({
      hasText: title
    });

    await task.locator('[data-testid^="edit-task-"]').click();

    await page.fill('[data-testid="edit-task-title"]', updated);
    await page.click('[data-testid="save-edit-task"]');

    await expect(column).toContainText(updated);

    const updatedTask = column.locator('[data-testid^="task-"]').filter({
      hasText: updated
    });

    await updatedTask.locator('[data-testid^="delete-task-"]').click();

    await expect(column).not.toContainText(updated);
  });

});