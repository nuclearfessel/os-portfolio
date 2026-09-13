import { expect, test, type Page } from '@playwright/test';

const storageKey = 'alex-os.desktop.v1';

async function openDesktopMenu(page: Page) {
  await page.locator('.desktop-area').evaluate((element) => {
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 320,
      clientY: 220,
    }));
  });
  await expect(page.getByRole('menu', { name: 'Desktop options' })).toBeVisible();
}

async function chooseSubmenuOption(page: Page, submenu: string, option: string) {
  const row = page.getByRole('menuitem', { name: submenu }).locator('..');
  await row.hover();
  await page.getByRole('menuitemradio', { name: option }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();
});

test('persists moved icons and every desktop preference across reloads', async ({ page }) => {
  const aboutFolder = page.getByTestId('button-folder-about');
  const initialBox = await aboutFolder.boundingBox();
  expect(initialBox).not.toBeNull();

  await aboutFolder.hover();
  await page.mouse.down();
  await page.mouse.move(initialBox!.x - 180, initialBox!.y + 100, { steps: 8 });
  await page.mouse.up();

  const movedStyle = await aboutFolder.evaluate((element) => ({
    left: element.style.left,
    top: element.style.top,
  }));
  expect(movedStyle.left).not.toBe('');
  expect(movedStyle.top).not.toBe('');

  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'View', 'Small icons');

  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();

  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'Theme', 'Dark');

  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  await expect(page.getByTestId('button-folder-about')).toBeHidden();

  const savedBeforeReload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(savedBeforeReload.itemPositions['desktop-about']).toBeTruthy();
  expect(savedBeforeReload.iconSize).toBe('small');
  expect(savedBeforeReload.snapToGrid).toBe(true);
  expect(savedBeforeReload.theme).toBe('dark');
  expect(savedBeforeReload.showDesktopIcons).toBe(false);
  expect(Number.parseFloat(movedStyle.left)).toBeCloseTo(savedBeforeReload.itemPositions['desktop-about'].left, 2);
  expect(Number.parseFloat(movedStyle.top)).toBeCloseTo(savedBeforeReload.itemPositions['desktop-about'].top, 2);

  await page.reload();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  await expect(page.getByTestId('button-folder-about')).toBeHidden();
  const savedAfterReload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(savedAfterReload).toEqual(savedBeforeReload);

  await openDesktopMenu(page);
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  const restoredStyle = await page.getByTestId('button-folder-about').evaluate((element) => ({
    left: element.style.left,
    top: element.style.top,
  }));
  expect(restoredStyle).toEqual(movedStyle);
});

test('falls back to safe defaults when saved data is corrupted', async ({ page }) => {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, '{not-json']);
  await page.reload();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();

  await openDesktopMenu(page);
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'true');
});

test('stays usable when browser storage reads, writes, and removals fail', async ({ page }) => {
  await page.addInitScript(() => {
    const attempts = { getItem: 0, setItem: 0, removeItem: 0 };
    Object.defineProperty(window, '__storageFailureAttempts', {
      configurable: true,
      value: attempts,
    });

    for (const method of ['getItem', 'setItem', 'removeItem'] as const) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value: () => {
          attempts[method] += 1;
          throw new Error(`localStorage ${method} blocked`);
        },
      });
    }
  });
  await page.reload();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();
  expect(await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { getItem: number } }
  ).__storageFailureAttempts.getItem)).toBeGreaterThan(0);

  await page.getByTestId('button-dock-about').click();
  await expect(page.getByTestId('window-about')).toBeVisible();

  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'Theme', 'Dark');
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  expect(await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { setItem: number } }
  ).__storageFailureAttempts.setItem)).toBeGreaterThan(0);

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await expect(page.getByRole('alertdialog', { name: 'Reset desktop?' })).toBeVisible();
  await page.getByTestId('button-confirm-reset').click();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();
  expect(await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { removeItem: number } }
  ).__storageFailureAttempts.removeItem)).toBeGreaterThan(0);
});

test('Reset desktop restores every default after confirmation', async ({ page }) => {
  await page.evaluate(([key, state]) => localStorage.setItem(key, JSON.stringify(state)), [
    storageKey,
    {
      folderPositions: {},
      itemPositions: {
        'desktop-about': { left: 120, top: 140 },
        sticky: { left: 44, top: 55 },
      },
      itemSizes: { sticky: { width: 240, height: 160 } },
      iconSize: 'small',
      snapToGrid: true,
      theme: 'dark',
      showDesktopIcons: false,
      stickies: [{
        id: 'sticky',
        color: 'blue',
        text: 'Changed note',
        rotation: -2,
        author: 'user',
        createdAt: 'saved',
      }],
      dockPosition: 'left',
    },
  ]);
  await page.reload();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await expect(page.getByRole('alertdialog', { name: 'Reset desktop?' })).toBeVisible();
  await page.getByTestId('button-confirm-reset').click();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();
  const resetLauncherStyle = await page.getByTestId('button-folder-about').evaluate((element) => ({
    left: element.style.left,
    top: element.style.top,
  }));
  expect(resetLauncherStyle).toEqual({ left: '', top: '' });
  const resetStickyStyle = await page.getByTestId('sticky-sticky').evaluate((element) => ({
    left: element.style.left,
    top: element.style.top,
    width: element.style.width,
    height: element.style.height,
  }));
  expect(resetStickyStyle).toEqual({ left: '', top: '', width: '', height: '' });

  await openDesktopMenu(page);
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'true');

  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey)).toEqual({
    folderPositions: {},
    itemPositions: {},
    itemSizes: {},
    iconSize: 'large',
    snapToGrid: false,
    theme: 'light',
    showDesktopIcons: true,
    stickies: [{
      id: 'sticky',
      color: 'lemon',
      text: 'The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.',
      rotation: 3,
      author: 'alex',
      createdAt: '09:42',
    }],
    dockPosition: 'bottom',
  });
});