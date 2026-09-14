import { expect, test } from '@playwright/test';

test('a fresh Firefox session keeps the default sticky at its intended size', async ({ page }) => {
  await page.goto('/');

  const sticky = page.getByTestId('sticky-sticky');
  await expect(sticky).toBeVisible();
  await expect(sticky).toHaveCSS('width', '214px');
  await expect(sticky).toHaveCSS('height', '138px');
  const box = await sticky.boundingBox();
  expect(box?.x).toBeGreaterThan((await page.evaluate(() => innerWidth)) / 2);

  const savedState = await page.evaluate(() => JSON.parse(localStorage.getItem('fes-os.desktop.v4') ?? '{}'));
  expect(savedState.itemSizes?.sticky).toBeUndefined();
  expect(savedState.itemPositions?.sticky).toBeUndefined();
});

test('Firefox discards sticky dimensions below the legal minimum', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('fes-os.desktop.v4', JSON.stringify({
      itemPositions: { sticky: { left: 28, top: 137 } },
      itemSizes: { sticky: { width: 1367, height: 84 } },
      stickies: [{
        id: 'sticky',
        color: 'lemon',
        text: 'Saved note',
        rotation: 3,
        author: 'fes',
        createdAt: '09:42',
      }],
    }));
  });
  await page.goto('/');

  const sticky = page.getByTestId('sticky-sticky');
  await expect(sticky).toHaveCSS('width', '214px');
  await expect(sticky).toHaveCSS('height', '138px');
  const box = await sticky.boundingBox();
  expect(box?.x).toBeGreaterThan((await page.evaluate(() => innerWidth)) / 2);
});