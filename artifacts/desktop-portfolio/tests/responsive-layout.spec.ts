import { expect, test, type Page } from '@playwright/test';

const storageKey = 'alex-os.desktop.v1';

async function resetStorage(page: Page) {
  await page.goto('/');
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();
}

async function openDesktopMenu(page: Page) {
  await page.locator('.desktop-area').evaluate((element) => {
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 120,
    }));
  });
}

test('managed launcher focus leaves the sticky workspace', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await resetStorage(page);

  await expect(page.locator('.os-shell')).toHaveClass(/workspace-managed/);
  await page.getByTestId('button-dock-stickies').click();
  await expect(page.getByTestId('sticky-sticky')).toBeVisible();
  await expect(page.getByTestId('window-work')).toBeHidden();

  await page.getByTestId('button-folder-work').evaluate((button: HTMLButtonElement) => button.click());

  await expect(page.getByTestId('window-work')).toBeVisible();
  await expect(page.getByTestId('sticky-sticky')).toBeHidden();
});

test('reset in managed mode clears the preserved desktop geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await resetStorage(page);
  await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key) ?? '{}');
    state.itemPositions = { ...state.itemPositions, work: { left: 177, top: 133 } };
    state.itemSizes = { ...state.itemSizes, work: { width: 760, height: 540 } };
    localStorage.setItem(key, JSON.stringify(state));
  }, storageKey);
  await page.reload();
  await expect(page.getByTestId('window-work')).toHaveCSS('left', '177px');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.os-shell')).toHaveClass(/workspace-managed/);
  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.os-shell')).toHaveClass(/workspace-desktop/);
  await expect.poll(async () => page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key) ?? '{}');
    return { positions: state.itemPositions, sizes: state.itemSizes };
  }, storageKey)).toEqual({ positions: {}, sizes: {} });
  await expect(page.getByTestId('window-work')).not.toHaveCSS('left', '177px');
});