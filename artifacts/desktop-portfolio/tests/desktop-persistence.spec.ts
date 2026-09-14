import { expect, test, type Page } from '@playwright/test';

const storageKey = 'fes-os.desktop.v4';

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

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload();
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

test('keeps keyboard focus predictable in desktop, dock, and sticky context menus', async ({ page }) => {
  const desktop = page.locator('.desktop-area');
  await desktop.focus();
  await openDesktopMenu(page);
  await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'View' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Desktop options' })).toHaveCount(0);
  await expect(desktop).toBeFocused();

  const dock = page.locator('.dock');
  await openDockMenu(page);
  await expect(page.getByRole('menuitemradio', { name: 'Top' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Right' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Dock options' })).toHaveCount(0);
  await expect(dock).toBeFocused();

  const stickyText = page.getByTestId('sticky-sticky').getByRole('textbox', { name: 'Sticky note 1 text' });
  await stickyText.focus();
  await openStickyMenu(page);
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

test('snaps desktop launchers to a 4px grid', async ({ page }) => {
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();

  const aboutFolder = page.getByTestId('button-folder-about');
  const initialBox = await aboutFolder.boundingBox();
  expect(initialBox).not.toBeNull();

  await aboutFolder.hover();
  await page.mouse.down();
  await page.mouse.move(initialBox!.x - 137, initialBox!.y + 43, { steps: 6 });
  await page.mouse.up();

  const position = await aboutFolder.evaluate((element) => ({
    left: Number.parseFloat(element.style.left),
    top: Number.parseFloat(element.style.top),
  }));
  expect(position.left % 4).toBeCloseTo(0, 5);
  expect(position.top % 4).toBeCloseTo(0, 5);
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
  await page.getByTestId('button-dock-terminal').click();
  const input = page.getByTestId('input-terminal-command');
  await input.fill('ls ~/work');
  await input.press('Enter');

  const output = page.getByTestId('window-terminal').locator('.terminal-output').last();
  await expect(output).toContainText('cedar-rei-ds.md');
  await expect(output).toContainText('intuitive-digital-ds.md');
  await expect(output).toContainText('simnow-2-ds.md');
  await expect(output).toContainText('win10-lang-installer.md');
  await expect(output).not.toContainText('orbit-crm');
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

  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
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

  await page.getByTestId('button-open-contact').click();
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

  await page.getByTestId('button-dock-stickies').click();
  const sticky = page.getByTestId('sticky-sticky');
  await expect(sticky).toBeVisible();
  const initialStickyBox = await sticky.boundingBox();
  expect(initialStickyBox).not.toBeNull();
  await sticky.locator('.note-label').hover({ force: true });
  await page.mouse.down();
  await page.mouse.move(initialStickyBox!.x - 100, initialStickyBox!.y + 65, { steps: 6 });
  await page.mouse.up();
  await sticky.getByRole('textbox', { name: 'Sticky note 1 text' }).fill('Recovery keeps the whole desktop.');

  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'Theme', 'Dark');
  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'View', 'Small icons');
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();
  await openDesktopMenu(page);
  await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  await openDockMenu(page);
  await page.getByRole('menuitemradio', { name: 'Right' }).click();

  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
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
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
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
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
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

  await openDesktopMenu(page);
  await chooseSubmenuOption(page, 'Theme', 'Dark');
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);

  await openStickyMenu(page);
  await expect(page.getByTestId('button-reset-sticky-rotation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect.poll(async () => page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key) ?? '{}');
    return saved.stickies?.find((item: { id: string }) => item.id === 'sticky')?.rotation;
  }, storageKey)).toBe(0);

  await page.reload();
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await expect.poll(readRotation).toBe('0deg');
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

    await expect(page.locator('.os-shell')).toHaveClass(viewport.workspaceClass);
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

  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
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
      color: 'purple',
      text: 'The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.',
      rotation: -9,
      author: 'fes',
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
  });
});