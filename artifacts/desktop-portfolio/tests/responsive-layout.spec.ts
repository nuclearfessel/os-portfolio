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

test('desktop-only apps disappear outside desktop mode', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await resetStorage(page);

  await expect(page.getByTestId('button-dock-stickies')).toBeVisible();
  await expect(page.getByTestId('button-dock-terminal')).toBeVisible();
  await expect(page.getByTestId('button-dock-mode')).toHaveCount(0);
  await expect(page.getByTestId('button-folder-stickies-app')).toBeVisible();
  await expect(page.getByTestId('button-folder-terminal')).toBeVisible();

  for (const viewport of [
    { width: 1024, height: 768, device: 'tablet', orientation: 'landscape' },
    { width: 768, height: 1024, device: 'tablet', orientation: 'portrait' },
    { width: 390, height: 844, device: 'mobile', orientation: 'portrait' },
    { width: 844, height: 390, device: 'mobile', orientation: 'portrait' },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await expect(page.locator('.os-shell')).toHaveClass(new RegExp(`device-${viewport.device}`));
    await expect(page.locator('.os-shell')).toHaveClass(new RegExp(`orientation-${viewport.orientation}`));
    await expect(page.getByTestId('button-dock-stickies')).toHaveCount(0);
    await expect(page.getByTestId('button-dock-terminal')).toHaveCount(0);
    await expect(page.getByTestId('button-dock-mode')).toBeVisible();
    await expect(page.locator('.desktop-folders')).toHaveCount(0);
    await expect(page.getByTestId('window-terminal')).toHaveCount(0);
  }
});

test('non-desktop dock is fixed, labeled, and focuses the selected app', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await resetStorage(page);

  const dock = page.locator('.dock');
  await expect(dock).toHaveClass(/dock-mobile-menu/);
  await expect(dock).toHaveCSS('position', 'fixed');
  await expect(page.getByTestId('button-dock-work').locator('span')).toBeVisible();
  await expect(page.getByTestId('button-dock-about').locator('span')).toBeVisible();
  await expect(page.getByTestId('button-dock-contact').locator('span')).toBeVisible();
  await expect(page.getByTestId('button-dock-mode').getByText('Mode')).toBeVisible();

  await page.getByTestId('button-dock-mode').click();
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect(page.getByTestId('button-dock-mode')).toHaveAttribute('aria-label', 'Switch to light mode');

  await page.getByTestId('button-dock-about').click();
  await expect(page.getByTestId('window-about')).toBeVisible();
  await expect(page.getByTestId('window-work')).toHaveCount(0);

  await page.getByTestId('button-dock-contact').click();
  await expect(page.getByTestId('window-contact')).toBeVisible();
  await expect(page.getByTestId('window-about')).toHaveCount(0);
});

test('managed windows keep an 8px inset below the system bar', async ({ page }) => {
  for (const viewport of [
    { width: 768, height: 1024, controlsHidden: true },
    { width: 390, height: 844, controlsHidden: true },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await resetStorage(page);

    const appWindow = page.getByTestId('window-work');
    const systemBar = page.locator('.system-bar');
    const dock = page.locator('.dock');
    await expect(appWindow).toBeVisible();

    const geometry = await Promise.all([
      appWindow.boundingBox(),
      systemBar.boundingBox(),
      dock.boundingBox(),
    ]);
    const [windowBox, barBox, dockBox] = geometry;
    expect(windowBox).not.toBeNull();
    expect(barBox).not.toBeNull();
    expect(dockBox).not.toBeNull();
    expect(windowBox!.x).toBeCloseTo(8, 0);
    expect(viewport.width - windowBox!.x - windowBox!.width).toBeCloseTo(8, 0);
    expect(windowBox!.y - (barBox!.y + barBox!.height)).toBeCloseTo(8, 0);
    expect(dockBox!.y - (windowBox!.y + windowBox!.height)).toBeGreaterThanOrEqual(7);
    await expect(appWindow).toHaveCSS('background-color', 'rgb(247, 250, 248)');
    await expect(appWindow.locator('.window-header')).toHaveCSS('background-color', 'rgb(219, 232, 228)');

    if (viewport.controlsHidden) {
      await expect(appWindow.locator('.traffic-lights .minimize')).toBeHidden();
      await expect(appWindow.locator('.traffic-lights .maximize')).toBeHidden();
      await expect(appWindow.locator('.traffic-lights .close')).toBeVisible();
    } else {
      await expect(appWindow.locator('.traffic-lights')).toBeVisible();
    }
  }
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