import { expect, test, type Page } from '@playwright/test';

const storageKey = 'os-portfolio.desktop.v4';
const defaultStorageKey = 'os-portfolio.desktop.default.v1';
const legacyStorageKey = 'portfolio-os.desktop.v4';
const legacyDefaultStorageKey = 'portfolio-os.desktop.default.v1';

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

async function openSettingsAndSetTheme(page: Page, theme: 'Light' | 'Dark') {
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  await openSettingsSection(page, 'theme');
  await page.getByTestId(`settings-theme-${theme.toLowerCase()}`).click();
  await page.getByTestId('button-close-settings').click();
}

async function openSettingsSection(page: Page, section: string) {
  const trigger = page.getByTestId(`settings-section-trigger-${section}`);
  if (await trigger.getAttribute('aria-expanded') !== 'true') {
    await trigger.click();
  }
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
}

async function openStickyMenu(page: Page, stickyId = 'sticky') {
  await page.getByTestId(`sticky-${stickyId}`).evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    }));
  });
  await expect(page.getByRole('menu', { name: 'Sticky options' })).toBeVisible();
}

async function openDockMenu(page: Page) {
  await page.locator('.dock').evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    }));
  });
  await expect(page.getByRole('menu', { name: 'Dock options' })).toBeVisible();
}

async function openSystemBarMenu(page: Page) {
  await page.locator('.system-bar').evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    }));
  });
  await expect(page.getByRole('menu', { name: 'System bar options' })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate((keys) => {
    keys.forEach((key) => localStorage.removeItem(key));
  }, [storageKey, defaultStorageKey, legacyStorageKey, legacyDefaultStorageKey]);
  await page.reload();
});

test('migrates the legacy desktop snapshot to the renamed storage key', async ({ page }) => {
  await page.evaluate(([currentKey, oldKey, value]) => {
    localStorage.removeItem(currentKey as string);
    localStorage.setItem(oldKey as string, JSON.stringify(value));
  }, [storageKey, legacyStorageKey, { theme: 'dark', showDesktopIcons: false }] as const);
  await page.reload();

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect(page.getByTestId('button-folder-about')).toBeHidden();
  await expect.poll(async () => page.evaluate(([currentKey, oldKey]) => ({
    current: localStorage.getItem(currentKey),
    legacy: localStorage.getItem(oldKey),
  }), [storageKey, legacyStorageKey])).toEqual({
    current: expect.stringContaining('"theme":"dark"'),
    legacy: null,
  });
});

test('migrates the legacy saved default snapshot to the renamed storage key', async ({ page }) => {
  await page.evaluate(([currentKey, oldKey, value]) => {
    localStorage.removeItem(currentKey as string);
    localStorage.setItem(oldKey as string, JSON.stringify(value));
  }, [defaultStorageKey, legacyDefaultStorageKey, { theme: 'dark', showDesktopIcons: false }] as const);
  await page.reload();

  await expect.poll(async () => page.evaluate(([currentKey, oldKey]) => ({
    current: localStorage.getItem(currentKey),
    legacy: localStorage.getItem(oldKey),
  }), [defaultStorageKey, legacyDefaultStorageKey])).toEqual({
    current: expect.stringContaining('"theme":"dark"'),
    legacy: null,
  });
});

test('migrates legacy persisted intro names in the current desktop state', async ({ page }) => {
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [
    storageKey,
    {
      introCustomization: {
        text: {
          primary: 'Joe Doe designs',
          accent: 'Fes Naqvi builds',
          body: 'Joe Doe and Fes Naqvi make thoughtful systems.',
        },
      },
    },
  ]);
  await page.reload();

  await expect(page.locator('.desktop-intro h1')).toContainText('John Doe designs');
  await expect(page.locator('.desktop-intro h1')).toContainText('John Doe builds');
  await expect(page.locator('.desktop-intro p')).toHaveText('John Doe and John Doe make thoughtful systems.');
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey))
    .toMatchObject({
      introCustomization: {
        text: {
          primary: 'John Doe designs',
          accent: 'John Doe builds',
          body: 'John Doe and John Doe make thoughtful systems.',
        },
      },
    });
});

test('migrates legacy persisted intro names in the saved default state', async ({ page }) => {
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [
    defaultStorageKey,
    {
      introCustomization: {
        text: {
          primary: 'Fes Naqvi designs',
          accent: 'Joe Doe builds',
          body: 'Fes Naqvi and Joe Doe make thoughtful systems.',
        },
      },
    },
  ]);
  await page.reload();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();

  await expect(page.locator('.desktop-intro h1')).toContainText('John Doe designs');
  await expect(page.locator('.desktop-intro h1')).toContainText('John Doe builds');
  await expect(page.locator('.desktop-intro p')).toHaveText('John Doe and John Doe make thoughtful systems.');
});

test('layers stickies above desktop content and below every window', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  const sticky = page.getByTestId('sticky-sticky');
  const intro = page.locator('.desktop-intro');
  const launcherLayerContainer = page.locator('.desktop-folders');
  const aboutWindow = page.getByTestId('window-about');

  await expect(sticky).toBeVisible();
  await expect(aboutWindow).toBeVisible();

  const layers = await Promise.all(
    [intro, launcherLayerContainer, sticky, aboutWindow].map((locator) =>
      locator.evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10)),
    ),
  );
  const [introLayer, launcherLayer, stickyLayer, windowLayer] = layers;

  expect(stickyLayer).toBeGreaterThan(introLayer);
  expect(stickyLayer).toBeGreaterThan(launcherLayer);
  expect(windowLayer).toBeGreaterThan(stickyLayer);

  await sticky.click();
  const activeStickyLayer = await sticky.evaluate(
    (element) => Number.parseInt(getComputedStyle(element).zIndex, 10),
  );
  expect(activeStickyLayer).toBeGreaterThan(stickyLayer);
  expect(windowLayer).toBeGreaterThan(activeStickyLayer);
});

test('suppresses native context menus at every responsive breakpoint', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    const result = await page.locator('.system-bar').evaluate((element) => {
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
      });
      const dispatchResult = element.dispatchEvent(event);
      return {
        defaultPrevented: event.defaultPrevented,
        dispatchResult,
      };
    });

    expect(result.defaultPrevented).toBe(true);
    expect(result.dispatchResult).toBe(false);
  }
});

test('desktop context menu keeps its intended surface styling in light and dark themes', async ({ page }) => {
  const expectedBackgrounds = {
    light: 'rgba(247, 250, 248, 0.9)',
    dark: 'rgba(29, 32, 54, 0.9)',
  } as const;

  for (const theme of ['light', 'dark'] as const) {
    await page.evaluate(([key, selectedTheme]) => {
      localStorage.setItem(key, JSON.stringify({ theme: selectedTheme }));
    }, [storageKey, theme]);
    await page.reload();
    await openDesktopMenu(page);

    const menu = page.getByTestId('menu-desktop-context');
    await expect(menu).toHaveCSS('background-color', expectedBackgrounds[theme]);

    await page.getByRole('menuitem', { name: 'View' }).hover();
    const submenu = page.getByRole('menu', { name: 'Icon size' });
    await expect(submenu).toBeVisible();
    await expect(submenu).toHaveCSS('background-color', expectedBackgrounds[theme]);

    await page.keyboard.press('Escape');
  }
});

test('system bar repositions like the Dock and preserves its desktop edge', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const systemBar = page.getByTestId('system-bar');

  await openSystemBarMenu(page);
  await page.getByRole('menuitemradio', { name: 'Right' }).click();
  await expect(systemBar).toHaveClass(/system-bar-right/);
  await expect(page.locator('.desktop-area')).toHaveClass(/system-bar-space-right/);
  const expectSideBarContentContained = async () => {
    const geometry = await systemBar.evaluate((element) => {
      const bar = element.getBoundingClientRect();
      const statusElement = element.querySelector<HTMLElement>('.system-status')!;
      const status = statusElement.getBoundingClientRect();
      const separator = element.querySelector('.system-side-separator')!.getBoundingClientRect();
      const clockTime = element.querySelector('.system-clock-time')!.getBoundingClientRect();
      const clockPeriod = element.querySelector('.system-clock-period')!.getBoundingClientRect();
      const statusFontSize = getComputedStyle(statusElement).fontSize;
      const periodFontSize = getComputedStyle(element.querySelector('.system-clock-period')!).fontSize;
      const textWritingModes = Array.from(element.querySelectorAll('span'))
        .filter((item) => getComputedStyle(item).display !== 'none' && item.textContent?.trim())
        .map((item) => getComputedStyle(item).writingMode);
      return {
        barWidth: bar.width,
        statusContained: status.left >= bar.left && status.right <= bar.right,
        statusStacked: getComputedStyle(statusElement).flexDirection === 'column',
        separatorVisible: separator.width > 0 && separator.height > 0,
        clockStacked: clockTime.bottom <= clockPeriod.top,
        statusMatchesPeriod: statusFontSize === periodFontSize,
        logoVisible: getComputedStyle(element.querySelector('.system-logo')!).display !== 'none',
        wordmarkHidden: getComputedStyle(element.querySelector('.system-mark')!).display === 'none',
        textWritingModes,
      };
    });
    expect(geometry.barWidth).toBeCloseTo(48, 0);
    expect(geometry.statusContained).toBe(true);
    expect(geometry.statusStacked).toBe(true);
    expect(geometry.separatorVisible).toBe(true);
    expect(geometry.clockStacked).toBe(true);
    expect(geometry.statusMatchesPeriod).toBe(true);
    expect(geometry.logoVisible).toBe(true);
    expect(geometry.wordmarkHidden).toBe(true);
    expect(geometry.textWritingModes.every((mode) => mode === 'horizontal-tb')).toBe(true);
  };
  await expectSideBarContentContained();

  await expect.poll(async () => page.evaluate((key) => (
    JSON.parse(localStorage.getItem(key) ?? '{}').systemBarPosition
  ), storageKey)).toBe('right');

  await page.reload();
  await expect(systemBar).toHaveClass(/system-bar-right/);
  const rightEdgeGeometry = await page.evaluate(() => {
    const readLeft = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().left;
    return {
      intro: readLeft('.desktop-intro'),
      window: readLeft('[data-testid="window-about"]'),
      sticky: readLeft('[data-testid="sticky-sticky"]'),
    };
  });

  const bounds = await systemBar.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(4, 400, { steps: 8 });
  await page.mouse.up();
  await expect(systemBar).toHaveClass(/system-bar-left/);
  await expectSideBarContentContained();
  const leftEdgeGeometry = await page.evaluate(() => {
    const readLeft = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().left;
    return {
      barRight: document.querySelector('.system-bar')!.getBoundingClientRect().right,
      intro: readLeft('.desktop-intro'),
      window: readLeft('[data-testid="window-about"]'),
      sticky: readLeft('[data-testid="sticky-sticky"]'),
    };
  });
  expect(leftEdgeGeometry.intro).toBeGreaterThanOrEqual(leftEdgeGeometry.barRight);
  expect(leftEdgeGeometry.intro - rightEdgeGeometry.intro).toBeCloseTo(48, 0);
  expect(leftEdgeGeometry.window - rightEdgeGeometry.window).toBeCloseTo(48, 0);
  expect(leftEdgeGeometry.sticky - rightEdgeGeometry.sticky).toBeCloseTo(48, 0);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(systemBar).toHaveClass(/system-bar-top/);
  expect(await page.evaluate((key) => (
    JSON.parse(localStorage.getItem(key) ?? '{}').systemBarPosition
  ), storageKey)).toBe('left');

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(systemBar).toHaveClass(/system-bar-left/);
});

test('keeps keyboard focus predictable in desktop, dock, and sticky context menus', async ({ page }) => {
  const desktop = page.locator('.desktop-area');
  await desktop.focus();
  await openDesktopMenu(page);
  await expect(page.getByRole('menu', { name: 'Desktop options' })).toBeFocused();
  await expect(page.getByRole('menu', { name: 'Icon size' })).not.toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Cleanup icons' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Cleanup icons' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Desktop options' })).toHaveCount(0);
  await expect(desktop).toBeFocused();

  const dock = page.locator('.dock');
  await openDockMenu(page);
  await expect(page.getByRole('menu', { name: 'Dock options' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Top' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Right' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Dock options' })).toHaveCount(0);
  await expect(dock).toBeFocused();

  const stickyText = page.getByTestId('sticky-sticky').getByRole('textbox', { name: 'Sticky note 1 text' });
  await stickyText.focus();
  await openStickyMenu(page);
  await expect(page.getByRole('menu', { name: 'Sticky options' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Lemon' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Reset rotation' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Lemon' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Sticky options' })).toHaveCount(0);
  await expect(stickyText).toBeFocused();
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

  await openSettingsAndSetTheme(page, 'Dark');

  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-small/);
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

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-small/);
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

test('snaps desktop launchers to an 8px grid', async ({ page }) => {
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();

  const aboutFolder = page.getByTestId('button-folder-about');
  const initialBox = await aboutFolder.boundingBox();
  const desktopBox = await page.locator('.desktop-area').boundingBox();
  expect(initialBox).not.toBeNull();
  expect(desktopBox).not.toBeNull();

  await page.mouse.move(initialBox!.x + initialBox!.width / 2, initialBox!.y + initialBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    desktopBox!.x + 333 + initialBox!.width / 2,
    desktopBox!.y + 277 + initialBox!.height / 2,
    { steps: 6 },
  );

  await expect.poll(() => aboutFolder.evaluate((element) => ({
    left: Number.parseFloat(element.style.left),
    top: Number.parseFloat(element.style.top),
  }))).toEqual({ left: 333, top: 277 });

  await page.mouse.up();

  const position = await aboutFolder.evaluate((element) => ({
    left: Number.parseFloat(element.style.left),
    top: Number.parseFloat(element.style.top),
  }));
  expect(position).toEqual({ left: 336, top: 280 });
});

test('cleanup aligns icons horizontally from the leftmost anchor without changing auto arrange order', async ({ page }) => {
  await page.evaluate((key) => {
    localStorage.setItem(key, JSON.stringify({
      itemPositions: {
        'desktop-about': { left: 200, top: 300 },
        'desktop-work': { left: 120, top: 420 },
        'desktop-terminal': { left: 350, top: 180 },
        'desktop-contact': { left: 250, top: 250 },
        'desktop-stickies-app': { left: 300, top: 500 },
      },
    }));
  }, storageKey);
  await page.reload();

  await openDesktopMenu(page);
  const cleanup = page.getByRole('menuitem', { name: 'Cleanup icons' });
  const snapToGridItem = page.getByRole('menuitemcheckbox', { name: 'Snap to grid' });
  expect(await cleanup.evaluate((element) => (
    Array.from(element.parentElement!.children).indexOf(element)
  ))).toBeLessThan(await snapToGridItem.evaluate((element) => (
    Array.from(element.parentElement!.children).indexOf(element)
  )));
  await cleanup.click();

  const ids = ['about', 'work', 'terminal', 'contact', 'stickies-app'];
  const cleaned = await Promise.all(ids.map(async (id) => ({
    id,
    ...await page.getByTestId(`button-folder-${id}`).evaluate((element) => ({
      left: Number.parseFloat((element as HTMLElement).style.left),
      top: Number.parseFloat((element as HTMLElement).style.top),
    })),
  })));
  const anchor = cleaned.find((icon) => icon.id === 'work')!;
  expect(new Set(cleaned.map((icon) => icon.top)).size).toBe(1);
  expect(anchor).toMatchObject({ left: 120, top: 420 });
  expect(cleaned.every((icon) => (icon.left - anchor.left) % 8 === 0)).toBe(true);
  expect([...cleaned].sort((first, second) => first.left - second.left).map((icon) => icon.id))
    .toEqual(['work', 'about', 'contact', 'stickies-app', 'terminal']);

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Auto arrange icons' }).click();
  const autoArrangeOrder = ['about', 'work', 'terminal', 'contact', 'stickies-app'];
  const arranged = await Promise.all(autoArrangeOrder.map(async (id) => ({
    id,
    ...await page.getByTestId(`button-folder-${id}`).evaluate((element) => ({
      left: Number.parseFloat((element as HTMLElement).style.left),
      top: Number.parseFloat((element as HTMLElement).style.top),
    })),
  })));
  expect(new Set(arranged.map((icon) => icon.left)).size).toBe(1);
  expect(arranged[0].left).toBeGreaterThan(1000);
  expect([...arranged].sort((first, second) => first.top - second.top).map((icon) => icon.id))
    .toEqual(autoArrangeOrder);
});

test('keeps long desktop icon tooltips evenly padded without overflow', async ({ page }) => {
  const terminalTooltip = page.getByTestId('button-folder-terminal').locator('.desktop-icon-tooltip');
  const metrics = await terminalTooltip.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    };
  });

  expect(metrics.paddingLeft).toBe('12px');
  expect(metrics.paddingRight).toBe('12px');
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
});

test('renders dock labels with the same surface as folder and toolbar tooltips', async ({ page }) => {
  const readSurface = async (selector: ReturnType<typeof page.locator>) =>
    selector.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius,
        borderWidth: style.borderWidth,
        boxShadow: style.boxShadow,
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        padding: style.padding,
      };
    });

  const folderSurface = await readSurface(
    page.getByTestId('button-folder-terminal').locator('.desktop-icon-tooltip'),
  );
  const toolbarSurface = await readSurface(
    page.getByTestId('button-close-about').locator('.window-control-tooltip'),
  );
  const dockSurface = await readSurface(
    page.getByTestId('button-dock-terminal').locator('.dock-item-label-tooltip'),
  );

  expect(toolbarSurface).toEqual(folderSurface);
  expect(dockSurface).toEqual(folderSurface);
});

test('uses intentional cursors while allowing text selection only in stickies', async ({ page }) => {
  const cursorFor = (selector: ReturnType<typeof page.locator>) =>
    selector.evaluate((element) => window.getComputedStyle(element).cursor);
  const selectionFor = (selector: ReturnType<typeof page.locator>) =>
    selector.evaluate((element) => window.getComputedStyle(element).userSelect);

  await expect(page.getByTestId('window-about')).toBeVisible();
  await expect(page.getByTestId('window-work')).toBeVisible();
  expect(await cursorFor(page.getByTestId('window-about').locator('.window-body p').first())).toBe('default');
  expect(await cursorFor(page.getByTestId('window-work').locator('.project-copy h3').first())).toBe('default');

  await page.getByTestId('button-dock-terminal').click();
  expect(await cursorFor(page.getByTestId('window-terminal').locator('.terminal-body'))).toBe('text');
  expect(await cursorFor(page.getByTestId('input-terminal-command'))).toBe('text');
  expect(await cursorFor(page.getByTestId('sticky-sticky').locator('.sticky-text'))).toBe('text');
  expect(await selectionFor(page.getByTestId('window-about').locator('.window-body p').first())).toBe('none');
  expect(await selectionFor(page.getByTestId('window-work').locator('.project-copy h3').first())).toBe('none');
  expect(await selectionFor(page.getByTestId('window-terminal').locator('.terminal-body'))).toBe('none');
  expect(await selectionFor(page.getByTestId('input-terminal-command'))).toBe('none');
  expect(await selectionFor(page.getByTestId('sticky-sticky').locator('.sticky-text'))).toBe('text');

  expect(await cursorFor(page.getByTestId('window-work').locator('.project-link').first())).toBe('pointer');
  expect(await cursorFor(page.getByTestId('window-about').locator('.window-resize-se'))).toBe('nwse-resize');
});

test('lists work files with names that match the selected projects', async ({ page }) => {
  const workLabel = page.getByTestId('button-folder-work').locator('.desktop-folder-label');
  await expect(workLabel).toHaveText('work');
  await expect(workLabel).toHaveCSS('white-space', 'normal');
  expect(await workLabel.evaluate((element) => ({
    horizontallyClipped: element.scrollWidth > element.clientWidth,
    verticallyClipped: element.scrollHeight > element.clientHeight,
  }))).toEqual({ horizontallyClipped: false, verticallyClipped: false });
  await expect(page.getByTestId('button-dock-work')).toContainText('Work');

  await page.getByTestId('button-dock-terminal').click();
  const input = page.getByTestId('input-terminal-command');
  await input.fill('ls ~/work');
  await input.press('Enter');

  const output = page.getByTestId('window-terminal').locator('.terminal-output').last();
  await expect(output).toContainText('fieldnote-collaboration-kit.md');
  await expect(output).toContainText('mosaic-health-toolkit.md');
  await expect(output).toContainText('northstar-commerce-system.md');
  await expect(output).toContainText('signal-operations-platform.md');
});

test('About and Work use distinct saturated application icons instead of folders', async ({ page }) => {
  const about = page.getByTestId('button-folder-about');
  const work = page.getByTestId('button-folder-work');
  const terminal = page.getByTestId('button-folder-terminal');
  const stickies = page.getByTestId('button-folder-stickies-app');

  await expect(about.getByTestId('icon-about-circle-user-fill')).toBeVisible();
  await expect(about.getByTestId('icon-about-circle-user-fill').locator('path').first()).toHaveAttribute('fill', 'currentColor');
  await expect(page.getByTestId('icon-dock-about-circle-user-fill')).toBeVisible();
  await expect(page.getByTestId('icon-dock-about-circle-user-fill').locator('path').first()).toHaveAttribute('fill', 'currentColor');
  await expect(page.getByTestId('icon-stickies-bootstrap-fill')).toBeVisible();
  await expect(page.getByTestId('icon-dock-stickies-bootstrap-fill')).toBeVisible();
  await expect(terminal.getByTestId('icon-terminal-square')).toBeVisible();
  await expect(page.getByTestId('icon-dock-terminal-square')).toBeVisible();
  const terminalLauncherStyle = await terminal.locator('.desktop-app-icon').evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundImage, border: style.borderColor, color: style.color };
  });
  const terminalDockStyle = await page.getByTestId('button-dock-terminal').evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundImage, color: style.color };
  });
  expect(terminalDockStyle).toEqual({
    background: terminalLauncherStyle.background,
    color: terminalLauncherStyle.color,
  });
  const stickiesLauncherStyle = await stickies.locator('.desktop-app-icon').evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundImage, border: style.borderColor, color: style.color };
  });
  const stickiesDockStyle = await page.getByTestId('button-dock-stickies').evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundImage, color: style.color };
  });
  expect(stickiesDockStyle).toEqual({
    background: stickiesLauncherStyle.background,
    color: stickiesLauncherStyle.color,
  });
  expect(stickiesLauncherStyle.color).toBe('rgb(87, 61, 114)');
  await expect(about).toHaveClass(/desktop-app/);
  await expect(work).toHaveClass(/desktop-app/);
  await expect(about.locator('.desktop-app-icon')).toBeVisible();
  await expect(work.locator('.desktop-app-icon')).toBeVisible();
  await expect(about.locator('.desktop-folder-icon')).toHaveCount(0);
  await expect(work.locator('.desktop-folder-icon')).toHaveCount(0);
  await expect(about).toHaveAttribute('aria-label', /application$/);
  await expect(work).toHaveAttribute('aria-label', /application$/);

  const backgrounds = await Promise.all(
    [about, work, terminal].map((launcher) => launcher.locator('.desktop-app-icon').evaluate(
      (element) => getComputedStyle(element).backgroundImage,
    )),
  );
  expect(new Set(backgrounds).size).toBe(3);
});

test('Terminal predicts and completes commands, arguments, and paths with Tab', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('button-dock-terminal').click();

  const input = page.getByTestId('input-terminal-command');
  const prediction = page.getByTestId('terminal-prediction');

  await input.fill('op');
  await expect(prediction).toContainText('open');
  await input.press('Tab');
  await expect(input).toHaveValue('open');

  await input.fill('open w');
  await expect(prediction).toContainText('open work');
  await input.press('Tab');
  await expect(input).toHaveValue('open work');

  await input.fill('set high c');
  await expect(prediction).toContainText('set high contrast on');
  await input.press('Tab');
  await expect(input).toHaveValue('set high contrast on');

  await input.fill('cat ~/work/north');
  await expect(prediction).toContainText('northstar-commerce-system.md');
  await input.press('Tab');
  await expect(input).toHaveValue('cat ~/work/northstar-commerce-system.md');
});

test('Contact uses a filled Remix mail-send icon with its own saturated app treatment', async ({ page }) => {
  const contact = page.getByTestId('button-folder-contact');
  const contactIcon = contact.locator('.desktop-app-icon');

  await expect(contact.getByTestId('icon-contact-mail-fill')).toBeVisible();
  await expect(contact.getByTestId('icon-contact-mail-fill')).toHaveAttribute('fill', 'currentColor');
  const contactBackground = await contactIcon.evaluate((element) => getComputedStyle(element).backgroundImage);
  const otherBackgrounds = await Promise.all(
    ['about', 'work', 'terminal', 'stickies-app'].map((id) => page.getByTestId(`button-folder-${id}`).locator('.desktop-app-icon').evaluate(
      (element) => getComputedStyle(element).backgroundImage,
    )),
  );
  expect(contactBackground).toContain('linear-gradient');
  expect(otherBackgrounds).not.toContain(contactBackground);
});

test('Dock mirrors the saturated About, Work, and filled Contact app identities', async ({ page }) => {
  const dockLaunchers = [
    page.getByTestId('button-dock-about'),
    page.getByTestId('button-dock-work'),
    page.getByTestId('button-dock-contact'),
  ];

  await expect(page.getByTestId('icon-dock-contact-mail-fill')).toBeVisible();
  await expect(page.getByTestId('icon-dock-contact-mail-fill')).toHaveAttribute('fill', 'currentColor');
  const backgrounds = await Promise.all(dockLaunchers.map((launcher) => launcher.evaluate(
    (element) => getComputedStyle(element).backgroundImage,
  )));
  expect(backgrounds.every((background) => background.includes('linear-gradient'))).toBe(true);
  expect(new Set(backgrounds).size).toBe(3);
});

test('keeps mobile and tablet dock labels free of desktop tooltip effects', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
  ]) {
    await page.setViewportSize(viewport);
    const dockLabel = page.getByTestId('button-dock-work').locator('span');
    await expect(dockLabel).toBeVisible();

    const style = await dockLabel.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        background: computed.backgroundColor,
        borderWidth: computed.borderWidth,
        boxShadow: computed.boxShadow,
        hasVisibleBoxShadow:
          computed.boxShadow !== 'none' &&
          [...computed.boxShadow.matchAll(/rgba\([^)]*,\s*([\d.]+)\)/g)]
            .some((match) => Number(match[1]) > 0),
        padding: computed.padding,
      };
    });

    expect(style.background).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderWidth).toBe('0px');
    expect(style.hasVisibleBoxShadow).toBe(false);
    expect(style.padding).toBe('0px');
  }
});

test('reopens a closed window at the same position and size', async ({ page }) => {
  await page.getByTestId('button-dock-contact').click();
  const contactWindow = page.getByTestId('window-contact');
  await expect(contactWindow).toBeVisible();

  const initialBox = await contactWindow.boundingBox();
  expect(initialBox).not.toBeNull();
  const contactHeader = contactWindow.locator('.window-header');
  await contactHeader.hover();
  await page.mouse.down();
  await page.mouse.move(initialBox!.x + 110, initialBox!.y + 85, { steps: 6 });
  await page.mouse.up();

  const movedBox = await contactWindow.boundingBox();
  expect(movedBox).not.toBeNull();
  const resizeHandle = contactWindow.locator('.window-resize-se');
  const resizeHandleBox = await resizeHandle.boundingBox();
  expect(resizeHandleBox).not.toBeNull();
  await page.mouse.move(
    resizeHandleBox!.x + resizeHandleBox!.width / 2,
    resizeHandleBox!.y + resizeHandleBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    movedBox!.x + movedBox!.width + 72,
    movedBox!.y + movedBox!.height + 48,
    { steps: 6 },
  );
  await page.mouse.up();

  const beforeClose = await contactWindow.boundingBox();
  expect(beforeClose).not.toBeNull();
  await page.getByTestId('button-close-contact').click();
  await expect(contactWindow).toHaveCount(0);
  await page.getByTestId('button-dock-contact').click();
  await expect(contactWindow).toBeVisible();

  const afterReopen = await contactWindow.boundingBox();
  expect(afterReopen).not.toBeNull();
  expect(afterReopen!.x).toBeCloseTo(beforeClose!.x, 0);
  expect(afterReopen!.y).toBeCloseTo(beforeClose!.y, 0);
  expect(afterReopen!.width).toBeCloseTo(beforeClose!.width, 0);
  expect(afterReopen!.height).toBeCloseTo(beforeClose!.height, 0);
});

test('keeps stacked windows locally painted while moving and dragging across them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const aboutWindow = page.getByTestId('window-about');
  const workWindow = page.getByTestId('window-work');
  const settingsWindow = page.getByTestId('window-settings');

  await page.getByTestId('button-dock-settings').click();
  await expect(aboutWindow).toBeVisible();
  await expect(workWindow).toBeVisible();
  await expect(settingsWindow).toBeVisible();

  const initialGeometry = await Promise.all([aboutWindow, workWindow, settingsWindow].map(async (window) => {
    const box = await window.boundingBox();
    expect(box).not.toBeNull();
    return box!;
  }));
  const expectOverlap = (first: NonNullable<typeof initialGeometry[number]>, second: NonNullable<typeof initialGeometry[number]>) => {
    expect(first.x).toBeLessThan(second.x + second.width);
    expect(second.x).toBeLessThan(first.x + first.width);
    expect(first.y).toBeLessThan(second.y + second.height);
    expect(second.y).toBeLessThan(first.y + first.height);
  };
  expectOverlap(initialGeometry[0], initialGeometry[1]);
  expectOverlap(initialGeometry[0], initialGeometry[2]);
  expectOverlap(initialGeometry[1], initialGeometry[2]);

  const expectRestingShadow = async (window: ReturnType<typeof page.getByTestId>) => {
    await expect.poll(() => window.evaluate((element) => {
      const shadow = getComputedStyle(element).boxShadow;
      const withoutColor = shadow.replace(/(?:rgba?|hsla?)\([^)]*\)/g, '').trim();
      return {
        shadow,
        isInsetOnly: shadow !== 'none'
          && shadow.endsWith('inset')
          && /^(?:-?\d+(?:\.\d+)?px\s+){3,4}inset$/.test(withoutColor),
      };
    })).toMatchObject({ isInsetOnly: false });
  };
  const expectLocalShadow = async (window: ReturnType<typeof page.getByTestId>) => {
    await expect.poll(() => window.evaluate((element) => {
      const shadow = getComputedStyle(element).boxShadow;
      const withoutColor = shadow.replace(/(?:rgba?|hsla?)\([^)]*\)/g, '').trim();
      return {
        shadow,
        isInsetOnly: shadow !== 'none'
          && shadow.endsWith('inset')
          && /^(?:-?\d+(?:\.\d+)?px\s+){3,4}inset$/.test(withoutColor),
      };
    })).toMatchObject({ isInsetOnly: true });
  };
  for (const window of [aboutWindow, workWindow, settingsWindow]) {
    await expectRestingShadow(window);
  }

  const overlapX = Math.max(initialGeometry[0].x, initialGeometry[1].x, initialGeometry[2].x) + 40;
  const overlapY = Math.max(initialGeometry[0].y, initialGeometry[1].y, initialGeometry[2].y) + 60;
  await page.mouse.move(overlapX - 180, overlapY - 120, { steps: 8 });
  await page.mouse.move(overlapX, overlapY, { steps: 12 });
  await page.mouse.move(overlapX + 160, overlapY + 110, { steps: 12 });

  const settingsBeforeDrag = await settingsWindow.boundingBox();
  expect(settingsBeforeDrag).not.toBeNull();
  const aboutBeforeDrag = await aboutWindow.boundingBox();
  const workBeforeDrag = await workWindow.boundingBox();
  expect(aboutBeforeDrag).not.toBeNull();
  expect(workBeforeDrag).not.toBeNull();

  const dragDelta = { x: 96, y: 64 };
  const header = settingsWindow.locator('.window-header');
  const headerBox = await header.boundingBox();
  expect(headerBox).not.toBeNull();
  const startX = headerBox!.x + headerBox!.width * 0.4;
  const startY = headerBox!.y + headerBox!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dragDelta.x, startY + dragDelta.y, { steps: 12 });
  await expectLocalShadow(settingsWindow);
  await expectRestingShadow(aboutWindow);
  await expectRestingShadow(workWindow);
  await page.mouse.up();

  const settingsAfterDrag = await settingsWindow.boundingBox();
  const aboutAfterDrag = await aboutWindow.boundingBox();
  const workAfterDrag = await workWindow.boundingBox();
  expect(settingsAfterDrag).not.toBeNull();
  expect(aboutAfterDrag).not.toBeNull();
  expect(workAfterDrag).not.toBeNull();
  expect(settingsAfterDrag!.x).toBeCloseTo(settingsBeforeDrag!.x + dragDelta.x, 0);
  expect(settingsAfterDrag!.y).toBeCloseTo(settingsBeforeDrag!.y + dragDelta.y, 0);
  expect(aboutAfterDrag!.x).toBeCloseTo(aboutBeforeDrag!.x, 0);
  expect(aboutAfterDrag!.y).toBeCloseTo(aboutBeforeDrag!.y, 0);
  expect(workAfterDrag!.x).toBeCloseTo(workBeforeDrag!.x, 0);
  expect(workAfterDrag!.y).toBeCloseTo(workBeforeDrag!.y, 0);

  for (const window of [aboutWindow, workWindow, settingsWindow]) {
    await expectRestingShadow(window);
  }
});

test('restores a maximized window into a continuous title-bar drag', async ({ page }) => {
  const aboutWindow = page.getByTestId('window-about');
  const aboutHeader = aboutWindow.locator('.window-header');
  const floatingBox = await aboutWindow.boundingBox();
  expect(floatingBox).not.toBeNull();

  await page.getByTestId('button-maximize-about').click();
  await expect(aboutWindow).toHaveClass(/is-maximized/);
  const maximizedBox = await aboutWindow.boundingBox();
  expect(maximizedBox).not.toBeNull();

  const grabX = maximizedBox!.x + maximizedBox!.width * 0.65;
  const grabY = maximizedBox!.y + 22;
  await page.mouse.move(grabX, grabY);
  await page.mouse.down();
  await page.mouse.move(grabX - 140, grabY + 90, { steps: 8 });
  await page.mouse.up();

  await expect(aboutWindow).not.toHaveClass(/is-maximized/);
  const restoredBox = await aboutWindow.boundingBox();
  expect(restoredBox).not.toBeNull();
  expect(restoredBox!.width).toBeCloseTo(floatingBox!.width, 0);
  expect(restoredBox!.height).toBeCloseTo(floatingBox!.height, 0);
  expect(restoredBox!.x).not.toBeCloseTo(floatingBox!.x, 0);
  expect(restoredBox!.y).not.toBeCloseTo(floatingBox!.y, 0);

  await aboutHeader.dblclick();
  await expect(aboutWindow).toHaveClass(/is-maximized/);
  await aboutHeader.dblclick();
  await expect(aboutWindow).not.toHaveClass(/is-maximized/);
});

test('uses 4 instead of backtick for the terminal shortcut', async ({ page }) => {
  const terminalWindow = page.getByTestId('window-terminal');
  await expect(terminalWindow).toHaveCount(0);

  await page.keyboard.press('Backquote');
  await expect(terminalWindow).toHaveCount(0);

  await page.keyboard.press('4');
  await expect(terminalWindow).toBeVisible();

  await page.getByTestId('button-dock-shortcuts').click();
  await expect(page.getByTestId('menu-mobile')).toContainText('Use 1–8 for Dock shortcuts.');
  await expect(page.getByTestId('button-menu-terminal')).toContainText('4terminal');
  await expect(page.getByTestId('button-menu-stickies')).toContainText('5stickies');
  await expect(page.getByTestId('button-menu-shortcuts')).toContainText('6shortcuts');
  await expect(page.getByTestId('button-menu-settings')).toContainText('7settings');
  await expect(page.getByTestId('button-menu-guide')).toContainText('8guide');
});

test('uses 5 through 8 for Stickies, Shortcuts, Settings, and the User Guide', async ({ page }) => {
  const visibleStickies = page.locator('.desktop-note:visible');
  const stickyDock = page.getByTestId('button-dock-stickies');
  await expect(visibleStickies.first()).toBeVisible();
  await expect(stickyDock).toHaveAttribute('aria-label', 'Open or focus Stickies');
  await page.keyboard.press('5');
  await expect(stickyDock).toHaveAttribute('aria-label', 'Minimize Stickies');
  await page.keyboard.press('5');
  await expect(visibleStickies).toHaveCount(0);

  await page.keyboard.press('6');
  await expect(page.getByTestId('menu-mobile')).toBeVisible();
  await page.keyboard.press('6');
  await expect(page.getByTestId('menu-mobile')).toHaveCount(0);

  await expect(page.getByTestId('window-settings')).toHaveCount(0);
  await page.keyboard.press('7');
  await expect(page.getByTestId('window-settings')).toBeVisible();

  await expect(page.getByTestId('window-guide')).toHaveCount(0);
  await page.keyboard.press('8');
  const guideWindow = page.getByTestId('window-guide');
  await expect(guideWindow).toBeVisible();
  await expect(guideWindow.getByRole('heading', { name: 'A calmer way to work' })).toBeVisible();
  await page.getByTestId('guide-nav-customize').click();
  await expect(guideWindow.getByRole('heading', { name: 'Make the desktop yours' })).toBeVisible();
  await page.getByTestId('guide-nav-technical').click();
  await expect(guideWindow.getByRole('heading', { name: 'A desktop built in the browser' })).toBeVisible();
  await expect(guideWindow).toContainText('React components render the desktop');
  await expect(guideWindow).toContainText('Vite bundles the React and TypeScript source');
  await expect(guideWindow).toContainText('The Terminal window responds to its built-in command set');
  await expect(guideWindow).toContainText('The browser sandbox prevents the page from acting like a general-purpose shell');
  await expect(guideWindow).toContainText('Blur, transparency, shadows, pointer capture, scrollbars, and keyboard focus');
});

test('keeps Settings and the User Guide light navigation states consistent', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  const settingsActive = page.getByTestId('settings-nav-personalization');
  const settingsHover = page.getByTestId('settings-nav-accessibility');
  await expect(settingsActive).toBeVisible();
  await settingsHover.hover();
  const settingsColors = await page.evaluate(() => {
    const active = document.querySelector('[data-testid="settings-nav-personalization"]');
    const hover = document.querySelector('[data-testid="settings-nav-accessibility"]');
    return {
      activeColor: active ? getComputedStyle(active).color : '',
      activeBackground: active ? getComputedStyle(active).backgroundColor : '',
      activeShadow: active ? getComputedStyle(active).boxShadow : '',
      hoverColor: hover ? getComputedStyle(hover).color : '',
      hoverBackground: hover ? getComputedStyle(hover).backgroundColor : '',
    };
  });

  await page.getByTestId('button-close-settings').click();
  await page.getByTestId('button-dock-guide').click();
  const guideActive = page.getByTestId('guide-nav-overview');
  const guideHover = page.getByTestId('guide-nav-windows');
  await expect(guideActive).toBeVisible();
  await guideHover.hover();
  const guideColors = await page.evaluate(() => {
    const active = document.querySelector('[data-testid="guide-nav-overview"]');
    const hover = document.querySelector('[data-testid="guide-nav-windows"]');
    return {
      activeColor: active ? getComputedStyle(active).color : '',
      activeBackground: active ? getComputedStyle(active).backgroundColor : '',
      activeShadow: active ? getComputedStyle(active).boxShadow : '',
      hoverColor: hover ? getComputedStyle(hover).color : '',
      hoverBackground: hover ? getComputedStyle(hover).backgroundColor : '',
    };
  });

  expect(guideColors.activeColor).toBe(settingsColors.activeColor);
  expect(guideColors.activeBackground).toBe(settingsColors.activeBackground);
  expect(guideColors.hoverColor).toBe(settingsColors.hoverColor);
  expect(guideColors.hoverBackground).toBe(settingsColors.hoverBackground);
  expect(guideColors.activeBackground).toBe('rgb(44, 143, 129)');
  expect(guideColors.activeShadow).toBe('none');
});

test('closes the shortcuts drawer with Escape or an outside click', async ({ page }) => {
  const drawer = page.getByTestId('menu-mobile');
  await page.getByTestId('button-dock-shortcuts').click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);

  await page.getByTestId('button-dock-shortcuts').click();
  await expect(drawer).toBeVisible();
  await page.mouse.click(8, 700);
  await expect(drawer).toHaveCount(0);
});

test('closes the topmost or all desktop windows with modifier shortcuts', async ({ page }) => {
  await page.keyboard.press('3');
  await expect(page.getByTestId('window-contact')).toBeVisible();
  await page.keyboard.press('Control+Shift+X');
  await expect(page.getByTestId('window-contact')).toHaveCount(0);
  await expect(page.getByTestId('window-about')).toBeVisible();
  await expect(page.getByTestId('window-work')).toBeVisible();

  await page.keyboard.press('4');
  await page.keyboard.press('7');
  await expect(page.getByTestId('window-terminal')).toBeVisible();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  await page.keyboard.press('Control+Alt+Shift+X');
  await expect(page.locator('[data-testid^="window-"]')).toHaveCount(0);

  await page.keyboard.press('1');
  await expect(page.getByTestId('window-about')).toBeVisible();
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'x',
      metaKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    }));
  });
  await expect(page.getByTestId('window-about')).toHaveCount(0);
});

test('keeps the shortcuts drawer clear of every system bar position', async ({ page }) => {
  for (const position of ['top', 'bottom', 'left', 'right'] as const) {
    await page.evaluate(([key, systemBarPosition]) => {
      const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
      localStorage.setItem(key, JSON.stringify({ ...saved, systemBarPosition }));
    }, [storageKey, position]);
    await page.reload();
    await page.getByTestId('button-dock-shortcuts').click();

    const drawerBox = await page.getByTestId('menu-mobile').boundingBox();
    expect(drawerBox).not.toBeNull();
    expect(drawerBox!.y).toBeCloseTo(position === 'top' ? 58 : 16, 0);
    if (position === 'left') expect(drawerBox!.x).toBeGreaterThanOrEqual(64);
    if (position === 'right') expect(drawerBox!.x + drawerBox!.width).toBeLessThanOrEqual(1280 - 64);
  }
});

test('falls back to safe defaults when saved data is corrupted', async ({ page }) => {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, '{not-json']);
  await page.reload();

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();

  await openDesktopMenu(page);
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'true');
});

test('stays usable when browser storage reads, writes, and removals fail', async ({ page }) => {
  await page.addInitScript(() => {
    const attempts = { getItem: 0, setItem: 0, removeItem: 0 };
    const storageRecoveryMarker = 'desktop-storage-recovered';
    let storageBlocked = window.name !== storageRecoveryMarker;
    Object.defineProperty(window, '__storageFailureAttempts', {
      configurable: true,
      value: attempts,
    });
    Object.defineProperty(window, '__allowStorage', {
      configurable: true,
      value: () => {
        storageBlocked = false;
        window.name = storageRecoveryMarker;
      },
    });

    for (const method of ['getItem', 'setItem', 'removeItem'] as const) {
      const original = Storage.prototype[method];
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value: function (...args: [string, string?]) {
          if (!storageBlocked) {
            return original.apply(this, args as never);
          }
          attempts[method] += 1;
          throw new Error(`localStorage ${method} blocked`);
        },
      });
    }
  });
  await page.reload();

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();
  const storageNotice = page.getByTestId('notice-storage-unavailable');
  const storageRestored = page.getByTestId('notice-storage-restored');
  await expect(storageNotice).toHaveCount(1);
  await expect(storageRestored).toHaveCount(0);
  await expect(storageNotice).toContainText('Changes won’t be saved.');
  await expect(storageNotice).toContainText('They’ll work for this session, but reset after you reload.');
  const storageHelp = page.getByRole('button', { name: 'How to restore saving' });
  await expect(storageHelp).toHaveAttribute('aria-expanded', 'false');
  await storageHelp.click();
  const recoveryGuidance = page.getByText('Leave private browsing, or allow this site to store site data in your browser settings.');
  const retrySaving = page.getByRole('button', { name: 'Try saving again' });
  await expect(recoveryGuidance).toBeVisible();
  await expect(retrySaving).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hide help' })).toHaveAttribute('aria-expanded', 'true');
  await expect(storageNotice).toHaveCount(1);
  expect(await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { getItem: number } }
  ).__storageFailureAttempts.getItem)).toBeGreaterThan(0);

  const sticky = page.getByTestId('sticky-sticky');
  await expect(sticky).toBeVisible();
  const initialStickyBox = await sticky.boundingBox();
  expect(initialStickyBox).not.toBeNull();
  await sticky.locator('.note-label').hover();
  await page.mouse.down();
  await page.mouse.move(initialStickyBox!.x - 100, initialStickyBox!.y + 65, { steps: 6 });
  await page.mouse.up();
  await sticky.getByRole('textbox', { name: 'Sticky note 1 text' }).fill('Recovery keeps the whole desktop.');

  await page.getByTestId('button-open-contact').evaluate((element) => (element as HTMLElement).click());
  const contactWindow = page.getByTestId('window-contact');
  await expect(contactWindow).toBeVisible();

  const contactHeader = contactWindow.locator('.window-header');
  const initialContactBox = await contactWindow.boundingBox();
  expect(initialContactBox).not.toBeNull();
  await contactHeader.hover();
  await page.mouse.down();
  await page.mouse.move(initialContactBox!.x + 90, initialContactBox!.y + 70, { steps: 6 });
  await page.mouse.up();

  const movedContactBox = await contactWindow.boundingBox();
  expect(movedContactBox).not.toBeNull();
  const resizeHandleBox = await contactWindow.locator('.window-resize-se').boundingBox();
  expect(resizeHandleBox).not.toBeNull();
  await page.mouse.move(resizeHandleBox!.x + resizeHandleBox!.width / 2, resizeHandleBox!.y + resizeHandleBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(movedContactBox!.x + movedContactBox!.width + 45, movedContactBox!.y + movedContactBox!.height + 30, { steps: 6 });
  await page.mouse.up();

  const aboutFolder = page.getByTestId('button-folder-about');
  const initialAboutBox = await aboutFolder.boundingBox();
  expect(initialAboutBox).not.toBeNull();
  await aboutFolder.hover();
  await page.mouse.down();
  await page.mouse.move(initialAboutBox!.x - 140, initialAboutBox!.y + 80, { steps: 6 });
  await page.mouse.up();
  const launcherGeometry = await aboutFolder.evaluate((element) => ({
    left: Number.parseFloat(element.style.left),
    top: Number.parseFloat(element.style.top),
    width: Number.NaN,
    height: Number.NaN,
  }));

  await openSettingsAndSetTheme(page, 'Dark');
  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'View', 'Small icons');
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  await openDockMenu(page);
  await page.getByRole('menuitemradio', { name: 'Right' }).click();

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-small/);
  await expect(aboutFolder).toBeHidden();
  await expect(page.locator('.desktop-area')).toHaveClass(/dock-space-right/);
  await expect(storageNotice).toHaveCount(1);
  expect(await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { setItem: number } }
  ).__storageFailureAttempts.setItem)).toBeGreaterThan(0);

  const visibleInMemoryState = await page.evaluate(() => {
    const readGeometry = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      return {
        left: Number.parseFloat(element.style.left),
        top: Number.parseFloat(element.style.top),
        width: Number.parseFloat(element.style.width),
        height: Number.parseFloat(element.style.height),
      };
    };
    return {
      contact: readGeometry('[data-testid="window-contact"]'),
      sticky: readGeometry('[data-testid="sticky-sticky"]'),
      stickyText: (document.querySelector('[aria-label="Sticky note 1 text"]') as HTMLTextAreaElement).value,
    };
  });
  const inMemoryState = { launcher: launcherGeometry, ...visibleInMemoryState };

  const attemptsBeforeRetry = await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { setItem: number } }
  ).__storageFailureAttempts.setItem);
  await retrySaving.click();
  await expect(storageNotice).toHaveCount(1);
  await expect(storageRestored).toHaveCount(0);
  await expect(recoveryGuidance).toBeVisible();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-small/);
  await expect(aboutFolder).toBeHidden();
  await expect(page.locator('.desktop-area')).toHaveClass(/dock-space-right/);
  await expect(sticky.getByRole('textbox', { name: 'Sticky note 1 text' })).toHaveValue(inMemoryState.stickyText);
  expect(await page.evaluate(() => {
    const readGeometry = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      return {
        left: Number.parseFloat(element.style.left),
        top: Number.parseFloat(element.style.top),
        width: Number.parseFloat(element.style.width),
        height: Number.parseFloat(element.style.height),
      };
    };
    return {
      contact: readGeometry('[data-testid="window-contact"]'),
      sticky: readGeometry('[data-testid="sticky-sticky"]'),
      stickyText: (document.querySelector('[aria-label="Sticky note 1 text"]') as HTMLTextAreaElement).value,
    };
  })).toEqual(visibleInMemoryState);
  expect(await page.evaluate(() => (
    window as typeof window & { __storageFailureAttempts: { setItem: number } }
  ).__storageFailureAttempts.setItem)).toBe(attemptsBeforeRetry + 1);

  await page.evaluate(() => (
    window as typeof window & { __allowStorage: () => void }
  ).__allowStorage());
  await retrySaving.click();
  await expect(storageNotice).toHaveCount(0);
  await expect(storageRestored).toHaveText('Saving restored. Current desktop changes are saved.');
  await expect(storageRestored).toHaveAttribute('role', 'status');
  await expect(storageRestored).toHaveAttribute('aria-live', 'polite');
  const recoveredSnapshot = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(recoveredSnapshot).toMatchObject({
    iconSize: 'small',
    snapToGrid: true,
    theme: 'dark',
    showDesktopIcons: false,
    stickies: [{
      id: 'sticky',
      text: inMemoryState.stickyText,
    }, {
      id: 'sticky-1',
      text: '',
    }],
    dockPosition: 'right',
  });
  expect(recoveredSnapshot.itemPositions['desktop-about'].left).toBeCloseTo(inMemoryState.launcher.left, 2);
  expect(recoveredSnapshot.itemPositions['desktop-about'].top).toBeCloseTo(inMemoryState.launcher.top, 2);
  expect(recoveredSnapshot.itemPositions.contact.left).toBeCloseTo(inMemoryState.contact.left, 2);
  expect(recoveredSnapshot.itemPositions.contact.top).toBeCloseTo(inMemoryState.contact.top, 2);
  expect(recoveredSnapshot.itemPositions.sticky.left).toBeCloseTo(inMemoryState.sticky.left, 2);
  expect(recoveredSnapshot.itemPositions.sticky.top).toBeCloseTo(inMemoryState.sticky.top, 2);
  expect(recoveredSnapshot.itemSizes.contact.width).toBeCloseTo(inMemoryState.contact.width, 2);
  expect(recoveredSnapshot.itemSizes.contact.height).toBeCloseTo(inMemoryState.contact.height, 2);
  await expect(contactWindow).toBeVisible();

  await page.reload();

  await expect(page.getByTestId('notice-storage-unavailable')).toHaveCount(0);
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-small/);
  await expect(page.getByTestId('button-folder-about')).toBeHidden();
  await expect(page.locator('.desktop-area')).toHaveClass(/dock-space-right/);
  await page.getByTestId('button-dock-contact').click();
  await expect(page.getByTestId('window-contact')).toBeVisible();
  await expect(page.getByTestId('sticky-sticky').getByRole('textbox', { name: 'Sticky note 1 text' }))
    .toHaveValue(inMemoryState.stickyText);

  const restoredVisibleState = await page.evaluate(() => {
    const readGeometry = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      return {
        left: Number.parseFloat(element.style.left),
        top: Number.parseFloat(element.style.top),
        width: Number.parseFloat(element.style.width),
        height: Number.parseFloat(element.style.height),
      };
    };
    return {
      contact: readGeometry('[data-testid="window-contact"]'),
      sticky: readGeometry('[data-testid="sticky-sticky"]'),
    };
  });
  expect(restoredVisibleState.contact.left).toBeCloseTo(inMemoryState.contact.left, 2);
  expect(restoredVisibleState.contact.top).toBeCloseTo(inMemoryState.contact.top, 2);
  expect(restoredVisibleState.contact.width).toBeCloseTo(inMemoryState.contact.width, 2);
  expect(restoredVisibleState.contact.height).toBeCloseTo(inMemoryState.contact.height, 2);
  expect(restoredVisibleState.sticky.left).toBeCloseTo(inMemoryState.sticky.left, 2);
  expect(restoredVisibleState.sticky.top).toBeCloseTo(inMemoryState.sticky.top, 2);

  await openDesktopMenu(page);
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  const restoredLauncherGeometry = await page.getByTestId('button-folder-about').evaluate((element) => ({
    left: Number.parseFloat(element.style.left),
    top: Number.parseFloat(element.style.top),
  }));
  expect(restoredLauncherGeometry.left).toBeCloseTo(inMemoryState.launcher.left, 2);
  expect(restoredLauncherGeometry.top).toBeCloseTo(inMemoryState.launcher.top, 2);

  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey))
    .toEqual(recoveredSnapshot);
});

test('keeps storage recovery help visible and keyboard-operable on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', {
      configurable: true,
      value: () => {
        throw new Error('localStorage getItem blocked');
      },
    });
  });
  await page.reload();

  const storageNotice = page.getByTestId('notice-storage-unavailable');
  const storageHelp = page.getByRole('button', { name: 'How to restore saving' });
  await expect(storageNotice).toHaveCount(1);
  await expect(storageNotice).toBeVisible();
  await expect(storageHelp).toBeVisible();

  await storageHelp.focus();
  await expect(storageHelp).toBeFocused();
  expect(await storageHelp.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');

  const guidance = page.getByText('Leave private browsing, or allow this site to store site data in your browser settings.');
  const hideHelp = page.getByRole('button', { name: 'Hide help' });
  await expect(guidance).toBeVisible();
  await expect(hideHelp).toBeFocused();
  await expect(hideHelp).toHaveAttribute('aria-expanded', 'true');
  await expect(storageNotice).toHaveCount(1);

  for (const locator of [storageNotice, hideHelp, guidance]) {
    const bounds = await locator.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(480);
  }

  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'How to restore saving' })).toHaveAttribute('aria-expanded', 'false');
  await expect(guidance).toBeHidden();
  await expect(storageNotice).toHaveCount(1);
});

test('reflows storage recovery help with enlarged text without clipping controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', {
      configurable: true,
      value: () => {
        throw new Error('localStorage getItem blocked');
      },
    });
  });
  await page.reload();
  await page.addStyleTag({ content: '.storage-notice { font-size: 22px !important; }' });

  const storageNotice = page.getByTestId('notice-storage-unavailable');
  const storageHelp = page.getByRole('button', { name: 'How to restore saving' });
  await expect(storageNotice).toHaveCount(1);
  await expect(storageHelp).toBeVisible();

  await storageHelp.focus();
  await page.keyboard.press('Enter');

  const guidance = page.getByText('Leave private browsing, or allow this site to store site data in your browser settings.');
  const hideHelp = page.getByRole('button', { name: 'Hide help' });
  const retrySaving = page.getByRole('button', { name: 'Try saving again' });
  await expect(hideHelp).toBeFocused();
  await expect(guidance).toBeVisible();
  await expect(retrySaving).toBeVisible();
  await expect(storageNotice).toHaveCount(1);

  const noticeMetrics = await storageNotice.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
      bottom: bounds.bottom,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  });
  expect(noticeMetrics.left).toBeGreaterThanOrEqual(0);
  expect(noticeMetrics.right).toBeLessThanOrEqual(320);
  expect(noticeMetrics.top).toBeGreaterThanOrEqual(0);
  expect(noticeMetrics.bottom).toBeLessThanOrEqual(640);
  expect(noticeMetrics.scrollWidth).toBeLessThanOrEqual(noticeMetrics.clientWidth);

  await retrySaving.focus();
  await expect(retrySaving).toBeFocused();
  expect(await retrySaving.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await hideHelp.focus();
  await page.keyboard.press('Enter');
  const showHelp = page.getByRole('button', { name: 'How to restore saving' });
  await expect(showHelp).toHaveAttribute('aria-expanded', 'false');
  await expect(guidance).toBeHidden();
  await expect(storageNotice).toHaveCount(1);
  await showHelp.focus();
  await page.keyboard.press('Enter');
  await expect(retrySaving).toBeVisible();
  await retrySaving.focus();
  await page.keyboard.press('Enter');
  await expect(storageNotice).toHaveCount(0);
  await expect(page.getByTestId('notice-storage-restored')).toHaveCount(1);
});

test('resets a sticky rotation in both themes and keeps it upright after reload', async ({ page }) => {
  const sticky = page.getByTestId('sticky-sticky');
  const rotationHandle = page.getByTestId('button-rotate-sticky-top-right');
  const readRotation = () => sticky.evaluate((element) => element.style.getPropertyValue('--sticky-rotation'));

  await expect.poll(readRotation).toBe('-9deg');
  await openStickyMenu(page);
  await page.getByTestId('button-reset-sticky-rotation').click();
  await expect.poll(readRotation).toBe('0deg');

  await rotationHandle.focus();
  await rotationHandle.press('ArrowRight');
  await expect.poll(readRotation).toBe('1deg');
  await rotationHandle.press('Home');
  await expect.poll(readRotation).toBe('0deg');

  await openSettingsAndSetTheme(page, 'Dark');
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);

  await openStickyMenu(page);
  await expect(page.getByTestId('button-reset-sticky-rotation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect.poll(async () => page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    return saved.stickies?.find((item: { id: string }) => item.id === 'sticky')?.rotation;
  }, storageKey)).toBe(0);

  await page.reload();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect.poll(readRotation).toBe('0deg');
});

test('all ten sticky colors have distinct Low and High Contrast variants', async ({ page }) => {
  const colorNames = ['Lemon', 'Orange', 'Red', 'Cream', 'Teal', 'Blue', 'Purple', 'Berry', 'Forest', 'Charcoal'];
  const sticky = page.getByTestId('sticky-sticky');
  const surface = sticky.locator('.desktop-note-surface');
  await page.getByTestId('button-dock-terminal').click();
  const terminalInput = page.getByTestId('input-terminal-command');

  const setContrast = async (command: string) => {
    await terminalInput.fill(command);
    await terminalInput.press('Enter');
  };

  const collectVariants = async (mode: 'low' | 'high') => {
    const variants: { background: string; border: string; text: string }[] = [];
    for (const name of colorNames) {
      await openStickyMenu(page);
      const option = page.getByRole('menuitemradio', { name });
      const previewBorder = await option.evaluate((element) => getComputedStyle(element).borderColor);
      await option.click();
      await expect(sticky).toHaveAttribute('data-sticky-color', name.toLowerCase());
      const computed = await surface.evaluate((element) => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, border: style.borderColor, text: style.color };
      });
      expect(computed.border).toBe(previewBorder);
      if (mode === 'high') {
        expect(computed.background).toBe('rgb(0, 0, 0)');
        expect(computed.text).toBe('rgb(255, 255, 255)');
      }
      variants.push(computed);
    }
    return variants;
  };

  await setContrast('set low contrast on');
  const lowVariants = await collectVariants('low');
  expect(new Set(lowVariants.map(({ background }) => background)).size).toBe(colorNames.length);
  expect(new Set(lowVariants.map(({ border }) => border)).size).toBe(colorNames.length);

  await setContrast('set high contrast on');
  const highVariants = await collectVariants('high');
  expect(new Set(highVariants.map(({ border }) => border)).size).toBe(colorNames.length);

  const textarea = sticky.getByRole('textbox', { name: 'Sticky note 1 text' });
  await textarea.focus();
  await textarea.fill('Typing without a yellow focus box');
  await expect.poll(() => textarea.evaluate((element) => {
    const style = getComputedStyle(element);
    const placeholder = getComputedStyle(element, '::placeholder');
    return {
      outline: style.outlineStyle,
      shadow: style.boxShadow,
      placeholderColor: placeholder.color,
      placeholderOpacity: placeholder.opacity,
    };
  })).toEqual({
    outline: 'none',
    shadow: 'none',
    placeholderColor: 'rgb(255, 255, 255)',
    placeholderOpacity: '1',
  });
});

test('deletes only user-created stickies after confirmation and clears their saved layout', async ({ page }) => {
  const originalSticky = page.getByTestId('sticky-sticky');
  await expect(originalSticky.getByRole('button', { name: /Delete/ })).toHaveCount(0);
  await openStickyMenu(page);
  await expect(page.getByTestId('button-delete-sticky')).toHaveCount(0);
  await page.keyboard.press('Escape');

  const addStickyButton = page.getByTestId('button-add-sticky');
  await addStickyButton.focus();
  await page.keyboard.press('Enter');

  const createdSticky = page.getByTestId('sticky-sticky-2');
  const createdText = createdSticky.getByRole('textbox', { name: 'Sticky note 3 text' });
  const deleteButton = page.getByTestId('button-delete-sticky-2');
  await expect(createdSticky).toBeVisible();
  await createdText.fill('Delete this saved note.');

  const initialBox = await createdSticky.boundingBox();
  expect(initialBox).not.toBeNull();
  await createdSticky.locator('.note-label').hover({ force: true });
  await page.mouse.down();
  await page.mouse.move(initialBox!.x - 90, initialBox!.y + 65, { steps: 6 });
  await page.mouse.up();

  await expect.poll(async () => page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    return {
      sticky: saved.stickies?.find((item: { id: string }) => item.id === 'sticky-2'),
      position: saved.itemPositions?.['sticky-2'],
      size: saved.itemSizes?.['sticky-2'],
    };
  }, storageKey)).toMatchObject({
    sticky: { id: 'sticky-2', text: 'Delete this saved note.' },
    position: { left: expect.any(Number), top: expect.any(Number) },
    size: { width: expect.any(Number), height: expect.any(Number) },
  });

  await deleteButton.click();
  const deleteDialog = page.getByRole('alertdialog', { name: 'Delete this sticky?' });
  const cancelDelete = deleteDialog.getByRole('button', { name: 'Cancel' });
  const confirmDelete = page.getByTestId('button-confirm-delete-sticky');
  await expect(deleteDialog).toBeVisible();
  await expect(cancelDelete).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(confirmDelete).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancelDelete).toBeFocused();
  await cancelDelete.click();
  await expect(createdSticky).toBeVisible();
  await expect(createdText).toHaveValue('Delete this saved note.');
  await expect(deleteButton).toBeFocused();

  await deleteButton.focus();
  await page.keyboard.press('Enter');
  await expect(deleteDialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(deleteDialog).toHaveCount(0);
  await expect(createdSticky).toBeVisible();
  await expect(deleteButton).toBeFocused();

  await openStickyMenu(page, 'sticky-2');
  await page.getByRole('menuitem', { name: 'Delete this sticky…' }).click();
  await expect(deleteDialog).toBeVisible();
  await confirmDelete.focus();
  await page.keyboard.press('Enter');

  await expect(createdSticky).toHaveCount(0);
  await expect(page.getByTestId('button-add-sticky')).toBeFocused();
  await expect.poll(async () => page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    return {
      stickyIds: saved.stickies?.map((item: { id: string }) => item.id),
      hasPosition: Object.hasOwn(saved.itemPositions ?? {}, 'sticky-2'),
      hasSize: Object.hasOwn(saved.itemSizes ?? {}, 'sticky-2'),
    };
  }, storageKey)).toEqual({
    stickyIds: ['sticky', 'sticky-1'],
    hasPosition: false,
    hasSize: false,
  });

  await page.reload();
  await expect(page.getByTestId('sticky-sticky-2')).toHaveCount(0);
  await expect(page.getByTestId('sticky-sticky')).toBeVisible();
  const savedAfterReload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(savedAfterReload.stickies.map((item: { id: string }) => item.id)).toEqual(['sticky', 'sticky-1']);
  expect(savedAfterReload.itemPositions).not.toHaveProperty('sticky-2');
  expect(savedAfterReload.itemSizes).not.toHaveProperty('sticky-2');
});

test('keeps stickies hidden on mobile and tablet workspaces', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 640, workspaceClass: /workspace-managed/ },
    { width: 1024, height: 768, workspaceClass: /workspace-tablet-landscape/ },
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();

  await expect(page.locator('.osp-shell')).toHaveClass(viewport.workspaceClass);
    await expect(page.locator('[data-testid^="sticky-"]')).toHaveCount(0);
    await expect(page.getByTestId('button-dock-stickies')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /sticky/i })).toHaveCount(0);
  }
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
  await page.getByTestId('button-close-work').click();
  await page.getByTestId('button-close-about').click();
  await page.getByTestId('button-dock-contact').click();
  await page.getByTestId('button-dock-terminal').click();
  await page.getByTestId('button-dock-stickies').click();
  await page.getByTestId('button-dock-stickies').click();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  const resetDialog = page.getByRole('alertdialog', { name: 'Reset desktop?' });
  const cancelReset = page.getByTestId('button-cancel-reset');
  const confirmReset = page.getByTestId('button-confirm-reset');
  const desktop = page.locator('.desktop-area');
  await expect(resetDialog).toBeVisible();
  await expect(cancelReset).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(confirmReset).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cancelReset).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(resetDialog).toHaveCount(0);
  await expect(desktop).toBeFocused();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await cancelReset.click();
  await expect(resetDialog).toHaveCount(0);
  await expect(desktop).toBeFocused();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();
  await expect(desktop).toBeFocused();

  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.osp-shell')).toHaveClass(/icons-large/);
  await expect(page.getByTestId('button-folder-about')).toBeVisible();
  await expect(page.getByTestId('window-work')).toBeVisible();
  await expect(page.getByTestId('window-about')).toHaveClass(/is-active/);
  await expect(page.getByTestId('window-terminal')).toHaveCount(0);
  await expect(page.getByTestId('window-about')).toBeVisible();
  await expect(page.getByTestId('window-contact')).toHaveCount(0);
  await expect(page.getByTestId('sticky-sticky')).toBeVisible();
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

  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey)).toMatchObject({
    folderPositions: {},
    itemPositions: {},
    itemSizes: {},
    iconSize: 'large',
    snapToGrid: false,
    theme: 'light',
    showDesktopIcons: true,
    stickies: [{
      id: 'sticky',
      color: 'purple',
      text: "The best interfaces don\u2019t ask for attention. They earn trust, one tiny response at a time.",
      rotation: -9,
      author: 'john',
      createdAt: '09:42',
    }, {
      id: 'sticky-1',
      color: 'lemon',
      text: '',
      rotation: 7,
      author: 'user',
      createdAt: 'saved',
    }],
    dockPosition: 'bottom',
    wallpaperLight: { mode: 'picture', color: '#e8f0ec' },
    wallpaperDark: { mode: 'picture', color: '#111326' },
  });
});

test('saves the current desktop state as the default only after confirmation', async ({ page }) => {
  await page.getByTestId('window-work').dispatchEvent('mousedown');
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  await page.getByRole('menuitem', { name: 'Save state as default' }).click();

  const dialog = page.getByRole('alertdialog', { name: 'Overwrite current default state?' });
  const cancel = page.getByTestId('button-cancel-save-default');
  const overwrite = page.getByTestId('button-confirm-save-default');
  await expect(dialog).toBeVisible();
  await expect(cancel).toBeFocused();
  await expect(cancel).toHaveText('Cancel');
  await expect(overwrite).toHaveText('Overwrite');
  await cancel.click();
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), defaultStorageKey)).toBeNull();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Save state as default' }).click();
  await overwrite.click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId('notice-default-state-saved')).toBeVisible();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), defaultStorageKey))
    .toMatchObject({
      showDesktopIcons: false,
       windowStack: ['about', 'contact', 'terminal', 'settings', 'guide', 'work'],
    });

  await page.getByTestId('window-about').dispatchEvent('mousedown');
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  await expect(page.getByTestId('button-folder-about')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();

  await openDesktopMenu(page);
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'false');
  await page.keyboard.press('Escape');
  const restoredStack = await page.locator('[data-testid^="window-"]').evaluateAll((windows) => Object.fromEntries(
    windows.map((window) => [window.getAttribute('data-testid'), Number(window.getAttribute('style')?.match(/z-index:\s*(\d+)/)?.[1] ?? 0)]),
  ));
  expect(restoredStack['window-work']).toBeGreaterThan(restoredStack['window-about']);
  await expect(page.getByTestId('window-work')).toHaveClass(/is-active/);

  await page.getByTestId('button-dock-contact').click();
  await page.getByTestId('button-dock-terminal').click();
  await page.getByTestId('button-delete-sticky-1').click();
  await page.getByTestId('button-confirm-delete-sticky').click();
  await page.getByTestId('window-work').dispatchEvent('mousedown');

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Save state as default' }).click();
  await page.getByTestId('button-confirm-save-default').click();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), defaultStorageKey))
    .toMatchObject({
      windows: {
        about: true,
        work: true,
        contact: true,
        terminal: true,
      },
      activeWindow: 'work',
       windowStack: ['about', 'settings', 'guide', 'contact', 'terminal', 'work'],
      stickies: [{ id: 'sticky' }],
    });

  await page.getByTestId('button-close-contact').click();
  await page.getByTestId('button-close-terminal').click();
  await page.getByTestId('button-add-sticky').dispatchEvent('click');
  await page.getByTestId('button-add-sticky').dispatchEvent('click');
  await page.getByTestId('button-delete-sticky-2').dispatchEvent('click');
  await page.getByTestId('button-confirm-delete-sticky').click();
  await expect(page.locator('[data-testid^="sticky-"]')).toHaveCount(2);

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();

  await expect(page.getByTestId('window-about')).toBeVisible();
  await expect(page.getByTestId('window-work')).toBeVisible();
  await expect(page.getByTestId('window-contact')).toBeVisible();
  await expect(page.getByTestId('window-terminal')).toBeVisible();
  await expect(page.locator('[data-testid^="sticky-"]')).toHaveCount(1);
  await expect(page.getByTestId('sticky-sticky')).toBeVisible();
  await expect(page.getByTestId('window-work')).toHaveClass(/is-active/);
  const finalStack = await page.locator('[data-testid^="window-"]').evaluateAll((windows) => Object.fromEntries(
    windows.map((window) => [window.getAttribute('data-testid'), Number(window.getAttribute('style')?.match(/z-index:\s*(\d+)/)?.[1] ?? 0)]),
  ));
  expect(finalStack['window-work']).toBeGreaterThan(finalStack['window-terminal']);
  expect(finalStack['window-work']).toBeGreaterThan(finalStack['window-contact']);
});

// ─── Settings window & personalization ────────────────────────────────────────

test('Settings dock icon is present on desktop and opens the Settings window', async ({ page }) => {
  const settingsButton = page.getByTestId('button-dock-settings');
  await expect(settingsButton).toBeVisible();

  await settingsButton.click();
  const settingsWindow = page.getByTestId('window-settings');
  await expect(settingsWindow).toBeVisible();

  // Close button works
  await page.getByTestId('button-close-settings').click();
  await expect(settingsWindow).toHaveCount(0);

  // Re-opening from dock works
  await settingsButton.click();
  await expect(settingsWindow).toBeVisible();
});

test('Settings window is not shown on mobile and tablet viewports', async ({ page }) => {
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await expect(page.getByTestId('button-dock-settings')).toHaveCount(0);
  }
});

test('Settings window changes theme and persists across reload', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  const settingsWindow = page.getByTestId('window-settings');
  await expect(settingsWindow).toBeVisible();
  await openSettingsSection(page, 'theme');

  // Start in light theme; switch to dark via Settings
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
  await page.getByTestId('settings-theme-dark').click();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);

  // Switch back to light
  await page.getByTestId('settings-theme-light').click();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);

  // Dark persists across reload
  await page.getByTestId('settings-theme-dark').click();
  await page.getByTestId('button-close-settings').click();
  await page.reload();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-dark/);
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}').theme, storageKey))
    .toBe('dark');
});

test('Settings wallpaper mode: picture uses background image on desktop', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();

  // Default is picture mode; main element should have a backgroundImage style
  const desktop = page.locator('main.osp-shell');
  const bgImage = await desktop.evaluate((el) => (el as HTMLElement).style.backgroundImage);
  expect(bgImage).toMatch(/wallpaper-light/);

  await page.getByTestId('button-close-settings').click();
});

test('Settings wallpaper mode: color removes background image and applies solid color', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  await openSettingsSection(page, 'wallpaper');

  // Switch to color mode for the light theme — default color is #e8f0ec
  await page.getByTestId('settings-wallpaper-mode-color-light').click();

  // Color picker should appear
  await expect(page.getByTestId('color-picker')).toBeVisible();

  // Verify the default color hex is shown in the HEX field of the picker
  await page.getByTestId('cp-format-hex').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('E8F0EC');

  // Enter a new color via the HEX field
  await page.getByTestId('cp-field-hex').click({ clickCount: 3 });
  await page.getByTestId('cp-field-hex').fill('345678');
  await page.getByTestId('cp-field-hex').press('Enter');
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('345678');

  await page.getByTestId('button-close-settings').click();

  // Desktop background should now be a solid color, not a picture
  const shell = page.locator('main.osp-shell');
  const bgImage = await shell.evaluate((el) => (el as HTMLElement).style.backgroundImage);
  // In color mode the backgroundImage inline style is explicitly cleared to 'none'
  expect(bgImage).toBe('none');

  const bgColor = await shell.evaluate((el) => (el as HTMLElement).style.backgroundColor);
  // Browser normalises #345678 → rgb(52, 86, 120)
  expect(bgColor).toMatch(/345678|rgb\(52,\s*86,\s*120\)/i);

  // Saved state reflects color mode
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(saved.wallpaperLight.mode).toBe('color');
  expect(saved.wallpaperLight.color).toBe('#345678');
});

test('selected light and dark solid wallpaper colors persist in tablet and mobile layouts', async ({ page }) => {
  const shell = page.locator('main.osp-shell');

  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('cp-field-hex').fill('345678');
  await page.getByTestId('cp-field-hex').press('Enter');
  await page.getByTestId('button-close-settings').click();

  for (const viewport of [
    { width: 1024, height: 768, workspaceClass: /workspace-tablet-landscape/ },
    { width: 390, height: 844, workspaceClass: /workspace-managed/ },
  ]) {
    await page.setViewportSize(viewport);
    await expect(shell).toHaveClass(viewport.workspaceClass);
    await expect(shell).toHaveClass(/wallpaper-color/);
    await expect(shell).toHaveCSS('background-color', 'rgb(52, 86, 120)');
    await expect(shell).toHaveCSS('background-image', 'none');
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-theme-dark').click();
  await page.getByTestId('cp-field-hex').fill('654321');
  await page.getByTestId('cp-field-hex').press('Enter');
  await page.getByTestId('button-close-settings').click();

  for (const viewport of [
    { width: 1024, height: 768, workspaceClass: /workspace-tablet-landscape/ },
    { width: 390, height: 844, workspaceClass: /workspace-managed/ },
  ]) {
    await page.setViewportSize(viewport);
    await expect(shell).toHaveClass(viewport.workspaceClass);
    await expect(shell).toHaveClass(/theme-dark/);
    await expect(shell).toHaveClass(/wallpaper-color/);
    await expect(shell).toHaveCSS('background-color', 'rgb(101, 67, 33)');
    await expect(shell).toHaveCSS('background-image', 'none');
  }
});

test('desktop text personalization and theme-specific colors can be edited and persist', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await page.getByTestId('settings-section-trigger-theme').click();
  await page.getByTestId('settings-section-trigger-desktop-text').click();
  await page.getByTestId('settings-automatic-text-contrast-switch').click();
  const settingsWindow = page.getByTestId('window-settings');
  const editor = settingsWindow.locator('.settings-intro-editor');
  const capsuleSpacing = () => editor.locator('.settings-intro-field').evaluateAll(
    (items) => items.map((item) => {
      const style = getComputedStyle(item);
      return {
        top: style.paddingTop,
        right: style.paddingRight,
        bottom: style.paddingBottom,
        left: style.paddingLeft,
      };
    }),
  );
  const expectSymmetricCapsuleSpacing = async () => {
    const spacing = await capsuleSpacing();
    expect(spacing).toHaveLength(3);
    for (const padding of spacing) {
      expect(padding.top).toBe(padding.left);
      expect(padding.right).toBe(padding.left);
      expect(padding.bottom).toBe(padding.left);
    }
  };
  await expect.poll(() => editor.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(3);
  await expectSymmetricCapsuleSpacing();

  const settingsBox = await settingsWindow.boundingBox();
  const resizeHandle = settingsWindow.locator('.window-resize-e');
  const resizeBox = await resizeHandle.boundingBox();
  expect(settingsBox).not.toBeNull();
  expect(resizeBox).not.toBeNull();
  await page.mouse.move(resizeBox!.x + resizeBox!.width / 2, resizeBox!.y + resizeBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(settingsBox!.x + 540, resizeBox!.y + resizeBox!.height / 2);
  await page.mouse.up();
  await expect.poll(() => editor.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(1);
  await expectSymmetricCapsuleSpacing();

  const primaryInput = page.getByTestId('settings-intro-primary-text');
  await primaryInput.fill('Interfaces with intent.');

  await page.getByTestId('settings-intro-primary-color').click();
  const colorDialog = page.getByRole('dialog', { name: 'Primary headline color' });
  await expect(colorDialog).toBeVisible();
  await expect(page.locator('.text-color-dialog-overlay')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await colorDialog.getByTestId('cp-field-hex').fill('123456');
  await colorDialog.getByTestId('cp-field-hex').press('Enter');
  await page.keyboard.press('Escape');

  await page.getByTestId('settings-theme-dark').click();
  await page.getByTestId('settings-intro-primary-color').click();
  await expect(page.getByRole('dialog', { name: 'Primary headline color' })).toBeVisible();
  await page.getByRole('dialog', { name: 'Primary headline color' }).getByTestId('cp-field-hex').fill('FEDCBA');
  await page.getByRole('dialog', { name: 'Primary headline color' }).getByTestId('cp-field-hex').press('Enter');
  await page.keyboard.press('Escape');
  await page.getByTestId('button-close-settings').click();

  const primaryHeadline = page.locator('.desktop-intro h1 > span');
  await expect(primaryHeadline).toHaveText('Interfaces with intent.');
  await expect(primaryHeadline).toHaveCSS('color', 'rgb(254, 220, 186)');

  await page.reload();
  await expect(primaryHeadline).toHaveText('Interfaces with intent.');
  await expect(primaryHeadline).toHaveCSS('color', 'rgb(254, 220, 186)');

  await page.getByTestId('button-dock-settings').click();
  await page.getByTestId('settings-section-trigger-theme').click();
  await page.getByTestId('settings-theme-light').click();
  await page.getByTestId('button-close-settings').click();
  await expect(primaryHeadline).toHaveCSS('color', 'rgb(18, 52, 86)');

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(saved.introCustomization.text.primary).toBe('Interfaces with intent.');
  expect(saved.introCustomization.colors.light.primary).toBe('#123456');
  expect(saved.introCustomization.colors.dark.primary).toBe('#fedcba');
});

test('automatic desktop text contrast samples picture wallpaper and preserves personalized colors', async ({ page }) => {
  await page.evaluate((key) => {
    localStorage.setItem(key, JSON.stringify({
      theme: 'light',
      introCustomization: {
        automaticContrast: true,
        colors: {
          light: { primary: '#ff00ff' },
          dark: { primary: '#ff00ff' },
        },
      },
    }));
  }, storageKey);
  await page.reload();

  const primaryHeadline = page.locator('.desktop-intro h1 > span');
  await expect(primaryHeadline).toHaveAttribute('data-auto-contrast-color', /^#(?:111326|f7faf8|000000|ffffff)$/);
  await expect.poll(() => primaryHeadline.evaluate((element) => getComputedStyle(element).color))
    .toMatch(/^rgb\((?:17, 19, 38|247, 250, 248|0, 0, 0|255, 255, 255)\)$/);
  await expect(primaryHeadline).not.toHaveCSS('color', 'rgb(255, 0, 255)');

  await page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    localStorage.setItem(key, JSON.stringify({ ...saved, theme: 'dark' }));
  }, storageKey);
  await page.reload();
  await expect(primaryHeadline).toHaveAttribute('data-auto-contrast-color', /^#(?:111326|f7faf8|000000|ffffff)$/);
  await expect(primaryHeadline).not.toHaveCSS('color', 'rgb(255, 0, 255)');
  const bodyParagraph = page.locator('.desktop-intro > p');
  await expect(bodyParagraph).toHaveAttribute('data-auto-contrast-color', '#ffffff');
  await expect(bodyParagraph).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  await page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    localStorage.setItem(key, JSON.stringify({ ...saved, theme: 'light' }));
  }, storageKey);
  await page.reload();
  await page.getByTestId('button-dock-settings').click();
  await page.getByTestId('settings-section-trigger-wallpaper').click();
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('button-close-settings').click();
  await expect(primaryHeadline).toHaveAttribute('data-auto-contrast-color', '#111326');
  await expect(primaryHeadline).toHaveCSS('color', 'rgb(17, 19, 38)');

  await page.getByTestId('button-dock-settings').click();
  await page.getByTestId('settings-section-trigger-wallpaper').click();
  await page.getByTestId('settings-wallpaper-mode-picture-light').click();
  await page.getByTestId('settings-section-trigger-desktop-text').click();
  const automaticContrast = page.getByTestId('settings-automatic-text-contrast-switch');
  await expect(automaticContrast).toHaveAttribute('aria-checked', 'true');
  await automaticContrast.click();
  await expect(automaticContrast).toHaveAttribute('aria-checked', 'false');
  await page.getByTestId('button-close-settings').click();

  await expect(primaryHeadline).toHaveCSS('color', 'rgb(255, 0, 255)');
  await expect(primaryHeadline).not.toHaveAttribute('data-auto-contrast-color');
  await page.reload();
  await expect(primaryHeadline).toHaveCSS('color', 'rgb(255, 0, 255)');
  expect(await page.evaluate((key) => (
    JSON.parse(localStorage.getItem(key) ?? '{}').introCustomization.automaticContrast
  ), storageKey)).toBe(false);
});

test('automatic desktop text contrast meets AAA 7:1 on a solid wallpaper', async ({ page }) => {
  await page.evaluate((key) => {
    localStorage.setItem(key, JSON.stringify({
      theme: 'light',
      wallpaperLight: { mode: 'color', color: '#595959' },
      introCustomization: { automaticContrast: true },
    }));
  }, storageKey);
  await page.reload();

  const primaryHeadline = page.locator('.desktop-intro h1 > span');
  await expect(primaryHeadline).toHaveAttribute('data-auto-contrast-color', '#ffffff');
  const contrastRatio = await primaryHeadline.evaluate((element) => {
    const parse = (value: string) => value.match(/\d+/g)!.slice(0, 3).map(Number);
    const luminance = (channels: number[]) => {
      const linear = channels.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(parse(getComputedStyle(element).color));
    const background = luminance([89, 89, 89]);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrastRatio).toBeGreaterThanOrEqual(7);
});

test('settings sections collapse independently and allow multiple sections to stay open', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();

  const theme = page.getByTestId('settings-section-trigger-theme');
  const desktopText = page.getByTestId('settings-section-trigger-desktop-text');
  const wallpaper = page.getByTestId('settings-section-trigger-wallpaper');

  await expect(theme).toHaveAttribute('aria-expanded', 'false');
  await expect(desktopText).toHaveAttribute('aria-expanded', 'false');
  await expect(wallpaper).toHaveAttribute('aria-expanded', 'false');

  await theme.click();
  await desktopText.click();
  await expect(theme).toHaveAttribute('aria-expanded', 'true');
  await expect(desktopText).toHaveAttribute('aria-expanded', 'true');
  await expect(wallpaper).toHaveAttribute('aria-expanded', 'false');

  await theme.click();
  await expect(theme).toHaveAttribute('aria-expanded', 'false');
  await expect(desktopText).toHaveAttribute('aria-expanded', 'true');

  await page.getByTestId('settings-nav-accessibility').click();
  const display = page.getByTestId('settings-section-trigger-display');
  const motion = page.getByTestId('settings-section-trigger-motion');
  await expect(display).toHaveAttribute('aria-expanded', 'false');
  await expect(motion).toHaveAttribute('aria-expanded', 'false');
  await display.click();
  await motion.click();
  await expect(display).toHaveAttribute('aria-expanded', 'true');
  await expect(motion).toHaveAttribute('aria-expanded', 'true');
});

test('switching settings pages resets the content pane to the top', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  const content = page.getByTestId('window-settings').locator('.settings-content');

  for (const section of ['theme', 'desktop-text', 'wallpaper', 'surface-effects']) {
    await page.getByTestId(`settings-section-trigger-${section}`).click();
  }
  await content.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  await page.getByTestId('settings-nav-accessibility').click();
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBe(0);

  for (const section of ['display', 'motion', 'contrast']) {
    await page.getByTestId(`settings-section-trigger-${section}`).click();
  }
  await content.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  await page.getByTestId('settings-nav-personalization').click();
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBe(0);
});

test('solid color mode offers the original light and dark default color blocks', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-color-light').click();

  const lightPreset = page.getByTestId('settings-color-preset-light');
  const darkPreset = page.getByTestId('settings-color-preset-dark');
  await expect(lightPreset).toHaveAttribute('aria-pressed', 'true');
  await expect(darkPreset).toHaveAttribute('aria-pressed', 'false');

  await darkPreset.click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('111326');
  await expect(darkPreset).toHaveAttribute('aria-pressed', 'true');

  await lightPreset.click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('E8F0EC');
  await expect(lightPreset).toHaveAttribute('aria-pressed', 'true');
});

test('wallpaper choice persists across page reload', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');

  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('cp-field-hex').fill('345678');
  await page.getByTestId('cp-field-hex').press('Enter');

  await page.getByTestId('settings-theme-dark').click();
  await expect(page.getByTestId('settings-wallpaper-mode-color-dark')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('111326');
  await expect(page.locator('main.osp-shell')).toHaveCSS('background-color', 'rgb(17, 19, 38)');

  await page.getByTestId('button-close-settings').click();

  const savedBefore = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(savedBefore.wallpaperLight.mode).toBe('color');
  expect(savedBefore.wallpaperDark.mode).toBe('color');
  expect(savedBefore.wallpaperLight.color).toBe('#345678');
  expect(savedBefore.wallpaperDark.color).toBe('#111326');
  expect(savedBefore.theme).toBe('dark');

  await page.reload();

  const savedAfter = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(savedAfter.wallpaperLight).toEqual(savedBefore.wallpaperLight);
  expect(savedAfter.wallpaperDark).toEqual(savedBefore.wallpaperDark);
  expect(savedAfter.theme).toBe('dark');
});

test('save state as default includes wallpaper config, and reset restores it', async ({ page }) => {
  // Set color wallpaper for light theme
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('button-close-settings').click();

  // Save as default
  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Save state as default' }).click();
  await page.getByTestId('button-confirm-save-default').click();

  const savedDefault = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), defaultStorageKey);
  expect(savedDefault.wallpaperLight.mode).toBe('color');

  // Switch back to picture mode
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-picture-light').click();
  await page.getByTestId('button-close-settings').click();

  const desktop = page.locator('main.osp-shell');
  const bgImageAfterSwitch = await desktop.evaluate((el) => (el as HTMLElement).style.backgroundImage);
  expect(bgImageAfterSwitch).toMatch(/wallpaper-light/);

  // Reset desktop should restore the saved default (color mode)
  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();

  const bgImageAfterReset = await desktop.evaluate((el) => (el as HTMLElement).style.backgroundImage);
  // In color mode the backgroundImage inline style is explicitly cleared to 'none'
  expect(bgImageAfterReset).toBe('none');
  const bgColorAfterReset = await desktop.evaluate((el) => (el as HTMLElement).style.backgroundColor);
  expect(bgColorAfterReset).not.toBe('');

  const restoredSaved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  expect(restoredSaved.wallpaperLight.mode).toBe('color');
});

test('Picture to Solid Color restores each theme previous solid color', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('cp-field-hex').fill('123456');
  await page.getByTestId('cp-field-hex').press('Enter');
  await page.getByTestId('settings-wallpaper-mode-picture-light').click();
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('123456');

  await page.getByTestId('settings-theme-dark').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('111326');
});

test('custom solid colors remain independent when switching themes', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('cp-field-hex').fill('AABBCC');
  await page.getByTestId('cp-field-hex').press('Enter');

  await page.getByTestId('settings-theme-dark').click();
  await page.getByTestId('cp-field-hex').fill('223344');
  await page.getByTestId('cp-field-hex').press('Enter');
  await expect(page.getByTestId('settings-color-preset-light')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('settings-color-preset-dark')).toHaveAttribute('aria-pressed', 'false');

  await page.getByTestId('settings-theme-light').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('AABBCC');
  await page.getByTestId('settings-theme-dark').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('223344');
});

test('opposite preset becomes the saved default for the active theme', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-theme-dark').click();
  await page.getByTestId('settings-wallpaper-mode-color-dark').click();
  await page.getByTestId('settings-color-preset-light').click();
  await page.getByTestId('button-close-settings').click();

  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Save state as default' }).click();
  await page.getByTestId('button-confirm-save-default').click();
  const savedDefault = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), defaultStorageKey);
  expect(savedDefault.theme).toBe('dark');
  expect(savedDefault.wallpaperDark).toEqual({ mode: 'color', color: '#e8f0ec' });

  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-color-preset-dark').click();
  await page.getByTestId('button-close-settings').click();
  await openDesktopMenu(page);
  await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  await page.getByTestId('button-confirm-reset').click();

  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await expect(page.getByTestId('settings-theme-dark')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('E8F0EC');
  await expect(page.getByTestId('settings-color-preset-light')).toHaveAttribute('aria-pressed', 'true');
});

test('contrast themes preserve both underlying solid colors', async ({ page }) => {
  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await page.getByTestId('settings-wallpaper-mode-color-light').click();
  await page.getByTestId('cp-field-hex').fill('ABCDEF');
  await page.getByTestId('cp-field-hex').press('Enter');
  await page.getByTestId('settings-theme-dark').click();
  await page.getByTestId('cp-field-hex').fill('234567');
  await page.getByTestId('cp-field-hex').press('Enter');

  await page.getByTestId('settings-nav-accessibility').click();
  await openSettingsSection(page, 'contrast');
  await page.getByTestId('settings-a11y-contrast-high').click();
  await page.getByTestId('settings-a11y-contrast-none').click();
  await page.getByTestId('settings-nav-personalization').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('234567');
  await page.getByTestId('settings-theme-light').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('ABCDEF');
});

test('legacy identical solid colors load without being replaced', async ({ page }) => {
  await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key) ?? '{}');
    localStorage.setItem(key, JSON.stringify({
      ...state,
      theme: 'dark',
      wallpaperLight: { mode: 'color', color: '#445566' },
      wallpaperDark: { mode: 'color', color: '#445566' },
    }));
  }, storageKey);
  await page.reload();

  await page.getByTestId('button-dock-settings').click();
  await openSettingsSection(page, 'theme');
  await openSettingsSection(page, 'wallpaper');
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('445566');
  await page.getByTestId('settings-theme-light').click();
  await expect(page.getByTestId('cp-field-hex')).toHaveValue('445566');
});