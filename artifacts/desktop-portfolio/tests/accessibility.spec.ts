/**
 * Accessibility settings panel tests
 * Tests for: sidebar navigation, toggles (scrollbars/transparency/animations),
 * animation speed chips, contrast themes, wallpaper disable/restore, persistence,
 * save-as-default, reset-desktop, and keyboard accessibility.
 */
import { expect, test, type Page } from '@playwright/test';

const storageKey = 'fes-os.desktop.v4';
const defaultStorageKey = 'fes-os.desktop.default.v1';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.evaluate(
    ([k, d]) => { localStorage.removeItem(k); localStorage.removeItem(d); },
    [storageKey, defaultStorageKey],
  );
}

async function openSettings(page: Page) {
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
}

async function closeSettings(page: Page) {
  await page.getByTestId('button-close-settings').click();
  await expect(page.getByTestId('window-settings')).not.toBeVisible();
}

async function goToAccessibility(page: Page) {
  await page.getByTestId('settings-nav-accessibility').click();
  await expect(page.getByTestId('settings-nav-accessibility')).toHaveAttribute('aria-current', 'page');
}

async function goToPersonalization(page: Page) {
  await page.getByTestId('settings-nav-personalization').click();
  await expect(page.getByTestId('settings-nav-personalization')).toHaveAttribute('aria-current', 'page');
}

async function openContextMenu(page: Page) {
  await page.locator('.desktop-area').evaluate((el) => {
    el.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true, cancelable: true, clientX: 300, clientY: 200,
    }));
  });
  await expect(page.getByRole('menu', { name: 'Desktop options' })).toBeVisible();
}

async function clickMenuItem(page: Page, name: string) {
  await page.getByRole('menuitem', { name }).click();
}

// ─── Setup ───────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);
  await page.reload();
  await page.waitForLoadState('networkidle');
  // Ensure desktop mode (viewport is wide enough)
  await page.setViewportSize({ width: 1280, height: 800 });
});

// ═════════════════════════════════════════════════════════════════════════════
// 1. Sidebar navigation
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Settings sidebar navigation', () => {
  test('opens with Personalization active by default', async ({ page }) => {
    await openSettings(page);
    const navItem = page.getByTestId('settings-nav-personalization');
    await expect(navItem).toHaveAttribute('aria-current', 'page');
  });

  test('switches to Accessibility section', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    // The heading should be visible
    await expect(page.locator('.settings-heading').filter({ hasText: 'Accessibility' })).toBeVisible();
  });

  test('Accessibility nav item loses active class when switching back', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await goToPersonalization(page);
    const accessibilityItem = page.getByTestId('settings-nav-accessibility');
    await expect(accessibilityItem).not.toHaveAttribute('aria-current', 'page');
    const personalizationItem = page.getByTestId('settings-nav-personalization');
    await expect(personalizationItem).toHaveAttribute('aria-current', 'page');
  });

  test('keyboard navigation: Tab reaches both nav buttons', async ({ page }) => {
    await openSettings(page);
    const personalizationBtn = page.getByTestId('settings-nav-personalization');
    const accessibilityBtn = page.getByTestId('settings-nav-accessibility');
    await personalizationBtn.focus();
    await expect(personalizationBtn).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(accessibilityBtn).toBeFocused();
  });

  test('keyboard: Enter on Accessibility nav button activates section', async ({ page }) => {
    await openSettings(page);
    const accessibilityBtn = page.getByTestId('settings-nav-accessibility');
    await accessibilityBtn.focus();
    await page.keyboard.press('Enter');
    await expect(accessibilityBtn).toHaveAttribute('aria-current', 'page');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. Always show scrollbars toggle
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Always show scrollbars toggle', () => {
  test('toggle is off by default', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const switchEl = page.getByTestId('settings-a11y-scrollbars-switch');
    await expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });

  test('window scrollbar fades in on hover and out when the pointer leaves', async ({ page }) => {
    await openSettings(page);
    const settingsWindow = page.getByTestId('window-settings');
    const settingsContent = page.locator('.settings-content');
    const thumbColor = () => settingsContent.evaluate((element) =>
      getComputedStyle(element, '::-webkit-scrollbar-thumb').backgroundColor,
    );

    await expect.poll(thumbColor).toBe('rgba(0, 0, 0, 0)');
    await settingsWindow.hover();
    await expect.poll(thumbColor).not.toBe('rgba(0, 0, 0, 0)');
    await page.mouse.move(0, 100);
    await expect.poll(thumbColor).toBe('rgba(0, 0, 0, 0)');
  });

  test('toggling on sets data-always-scrollbars on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-always-scrollbars'),
    );
    expect(attrSet).toBe(true);
  });

  test('persistent scrollbars keep the styled thumb and transparent track', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.move(0, 100);

    const settingsContent = page.locator('.settings-content');
    await expect.poll(() => settingsContent.evaluate((element) =>
      getComputedStyle(element, '::-webkit-scrollbar-thumb').backgroundColor,
    )).not.toBe('rgba(0, 0, 0, 0)');
    await expect.poll(() => settingsContent.evaluate((element) =>
      getComputedStyle(element, '::-webkit-scrollbar-track').backgroundColor,
    )).toBe('rgba(0, 0, 0, 0)');
    await expect.poll(() => settingsContent.evaluate((element) =>
      getComputedStyle(element, '::-webkit-scrollbar').width,
    )).toBe('6px');
    await expect.poll(() => settingsContent.evaluate((element) => {
      const thumb = getComputedStyle(element, '::-webkit-scrollbar-thumb');
      return [thumb.borderRightWidth, thumb.backgroundClip];
    })).toEqual(['2px', 'padding-box']);
    await expect.poll(() => settingsContent.evaluate((element) =>
      getComputedStyle(element, '::-webkit-scrollbar-button').display,
    )).toBe('none');
    await expect.poll(() => settingsContent.evaluate((element) => {
      const button = getComputedStyle(element, '::-webkit-scrollbar-button');
      return [button.width, button.height];
    })).toEqual(['0px', '0px']);
    await expect.poll(() => settingsContent.evaluate((element) =>
      getComputedStyle(element).scrollbarColor,
    )).toBe('auto');
  });

  test('toggling off removes data-always-scrollbars from <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    // turn on
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    // turn off
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-always-scrollbars'),
    );
    expect(attrSet).toBe(false);
  });

  test('toggle aria-checked reflects state', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const switchEl = page.getByTestId('settings-a11y-scrollbars-switch');
    await switchEl.click();
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
    await switchEl.click();
    await expect(switchEl).toHaveAttribute('aria-checked', 'false');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. System transparency controls
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Transparency effects', () => {
  test('transparency is on by default', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const switchEl = page.getByTestId('settings-a11y-transparency-switch');
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
    await goToPersonalization(page);
    await expect(page.getByTestId('settings-personalization-window-transparency-slider')).toHaveValue('20');
    await expect(page.getByTestId('settings-personalization-sticky-transparency-slider')).toHaveValue('20');
    await expect(page.getByTestId('settings-personalization-blur-slider')).toHaveValue('12');
  });

  test('window transparency slider updates the level and root CSS variable', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    const slider = page.getByTestId('settings-personalization-window-transparency-slider');
    await slider.fill('55');
    await expect(page.getByTestId('settings-personalization-window-transparency-value')).toHaveText('55%');
    await expect(slider).toHaveAttribute('aria-valuetext', '55% transparent');
    expect(await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--accessibility-transparency'),
    )).toBe('55%');
    await expect.poll(() => page.getByTestId('settings-personalization-window-transparency-track').evaluate((element) => {
      const rail = getComputedStyle(element, '::before');
      const thumb = getComputedStyle(element, '::after');
      return [rail.height, rail.top, rail.transform, thumb.height, thumb.top, thumb.transform];
    })).toEqual(['4px', '10px', 'matrix(1, 0, 0, 1, 0, -2)', '14px', '10px', 'matrix(1, 0, 0, 1, 0, -7)']);
  });

  test('sticky transparency slider updates the level and root CSS variable', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    const slider = page.getByTestId('settings-personalization-sticky-transparency-slider');
    await slider.fill('45');
    await expect(page.getByTestId('settings-personalization-sticky-transparency-value')).toHaveText('45%');
    await expect(slider).toHaveAttribute('aria-valuetext', '45% transparent');
    expect(await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--sticky-transparency'),
    )).toBe('45%');
    await expect.poll(() => page.getByTestId('settings-personalization-sticky-transparency-track').evaluate((element) => {
      const rail = getComputedStyle(element, '::before');
      const thumb = getComputedStyle(element, '::after');
      return [rail.height, rail.top, rail.transform, thumb.height, thumb.top, thumb.transform];
    })).toEqual(['4px', '10px', 'matrix(1, 0, 0, 1, 0, -2)', '14px', '10px', 'matrix(1, 0, 0, 1, 0, -7)']);
  });

  test('blur slider updates the level and root CSS variable', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    const slider = page.getByTestId('settings-personalization-blur-slider');
    await slider.fill('20');
    await expect(page.getByTestId('settings-personalization-blur-value')).toHaveText('20px');
    await expect(slider).toHaveAttribute('aria-valuetext', '20 pixels of blur');
    expect(await page.evaluate(() =>
      document.documentElement.style.getPropertyValue('--surface-blur'),
    )).toBe('20px');
  });

  test('all three effect sliders share one row in a large window and stack when narrowed', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    const settingsWindow = page.getByTestId('window-settings');
    const sliderGrid = page.getByTestId('settings-transparency-grid');

    await expect.poll(() => sliderGrid.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').length,
    )).toBe(3);

    await settingsWindow.evaluate((element) => {
      element.style.width = '560px';
    });

    await expect.poll(() => sliderGrid.evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(' ').length,
    )).toBe(1);
  });

  test('transparency and blur toggles independently control their level sliders', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-transparency-switch').click();
    await goToPersonalization(page);
    await expect(page.getByTestId('settings-personalization-window-transparency')).not.toBeVisible();
    await expect(page.getByTestId('settings-personalization-sticky-transparency')).not.toBeVisible();
    await expect(page.getByTestId('settings-personalization-blur')).toBeVisible();

    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-blur-switch').click();
    await goToPersonalization(page);
    await expect(page.getByTestId('settings-personalization-blur')).not.toBeVisible();
    await expect(page.getByTestId('settings-transparency-disabled-notice')).toBeVisible();
  });

  test('turning transparency off sets data-no-transparency on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-transparency-switch').click();
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-no-transparency'),
    );
    expect(attrSet).toBe(true);
  });

  test('turning transparency back on removes data-no-transparency', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    // turn off
    await page.getByTestId('settings-a11y-transparency-switch').click();
    // turn on
    await page.getByTestId('settings-a11y-transparency-switch').click();
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-no-transparency'),
    );
    expect(attrSet).toBe(false);
  });

  test('turning blur effects off removes backdrop blur without changing transparency', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-blur-switch').click();
    expect(await page.evaluate(() => ({
      noBlur: document.documentElement.hasAttribute('data-no-blur'),
      transparencyEnabled: document.documentElement.hasAttribute('data-transparency-enabled'),
    }))).toEqual({ noBlur: true, transparencyEnabled: true });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. UI animations toggle and speed
// ═════════════════════════════════════════════════════════════════════════════

test.describe('UI animations toggle', () => {
  test('animations are on by default', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const switchEl = page.getByTestId('settings-a11y-animations-switch');
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  test('speed group is visible when animations are on', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await expect(page.getByTestId('settings-a11y-speed-group')).toBeVisible();
  });

  test('turning off animations hides the speed group', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-animations-switch').click();
    await expect(page.getByTestId('settings-a11y-speed-group')).not.toBeVisible();
  });

  test('turning off animations sets data-no-animations on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-animations-switch').click();
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-no-animations'),
    );
    expect(attrSet).toBe(true);
  });

  test('turning animations back on removes data-no-animations', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-animations-switch').click();
    await page.getByTestId('settings-a11y-animations-switch').click();
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-no-animations'),
    );
    expect(attrSet).toBe(false);
  });

  test('turning animations and transparency off activates fast UI mode', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-animations-switch').click();
    await page.getByTestId('settings-a11y-transparency-switch').click();
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.hasAttribute('data-fast-ui'),
    )).toBe(true);

    const timing = await page.getByTestId('window-settings').evaluate((element) => {
      const style = getComputedStyle(element);
      return { animationName: style.animationName, transitionDuration: style.transitionDuration };
    });
    expect(timing.animationName).toBe('none');
    expect(timing.transitionDuration).toBe('0s');
  });
});

test.describe('Animation speed chips', () => {
  test('Default speed is selected by default', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const defaultChip = page.getByTestId('settings-a11y-speed-default');
    await expect(defaultChip).toHaveAttribute('aria-checked', 'true');
  });

  test('selecting Less sets data-anim-speed="less" on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-speed-less').click();
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-anim-speed'),
    );
    expect(value).toBe('less');
  });

  test('selecting More sets data-anim-speed="more" on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-speed-more').click();
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-anim-speed'),
    );
    expect(value).toBe('more');
  });

  test('selecting Default removes data-anim-speed from <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-speed-less').click();
    await page.getByTestId('settings-a11y-speed-default').click();
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-anim-speed'),
    );
    expect(value).toBeNull();
  });

  test('only one speed chip is selected at a time', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-speed-less').click();
    const lessChip = page.getByTestId('settings-a11y-speed-less');
    const defaultChip = page.getByTestId('settings-a11y-speed-default');
    const moreChip = page.getByTestId('settings-a11y-speed-more');
    await expect(lessChip).toHaveAttribute('aria-checked', 'true');
    await expect(defaultChip).toHaveAttribute('aria-checked', 'false');
    await expect(moreChip).toHaveAttribute('aria-checked', 'false');
  });

  test('speed chips have role="radio"', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await expect(page.getByTestId('settings-a11y-speed-less')).toHaveAttribute('role', 'radio');
    await expect(page.getByTestId('settings-a11y-speed-default')).toHaveAttribute('role', 'radio');
    await expect(page.getByTestId('settings-a11y-speed-more')).toHaveAttribute('role', 'radio');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. Contrast themes
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Contrast themes', () => {
  test('Standard contrast is selected by default', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const standardBtn = page.getByTestId('settings-a11y-contrast-none');
    await expect(standardBtn).toHaveAttribute('aria-checked', 'true');
  });

  test('contrast option buttons have role="radio"', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await expect(page.getByTestId('settings-a11y-contrast-none')).toHaveAttribute('role', 'radio');
    await expect(page.getByTestId('settings-a11y-contrast-low')).toHaveAttribute('role', 'radio');
    await expect(page.getByTestId('settings-a11y-contrast-high')).toHaveAttribute('role', 'radio');
  });

  test('selecting Low contrast sets data-contrast="low" on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-low').click();
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-contrast'),
    );
    expect(value).toBe('low');
  });

  test('selecting High contrast sets data-contrast="high" on <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-contrast'),
    );
    expect(value).toBe('high');
  });

  test('returning to Standard removes data-contrast from <html>', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();
    await page.getByTestId('settings-a11y-contrast-none').click();
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-contrast'),
    );
    expect(value).toBeNull();
  });

  test('only one contrast option is selected at a time', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();
    await expect(page.getByTestId('settings-a11y-contrast-high')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByTestId('settings-a11y-contrast-none')).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByTestId('settings-a11y-contrast-low')).toHaveAttribute('aria-checked', 'false');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. Contrast themes disable wallpaper controls
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Contrast themes disable wallpaper controls', () => {
  test('Low contrast hides wallpaper controls and shows notice', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-low').click();
    await goToPersonalization(page);
    // The disabled notice should be visible
    await expect(page.locator('.settings-wallpaper-disabled-notice')).toBeVisible();
    // Wallpaper mode chips should not be visible
    await expect(page.getByTestId('settings-wallpaper-mode-picture-light')).not.toBeVisible();
    await expect(page.getByTestId('settings-wallpaper-mode-color-light')).not.toBeVisible();
  });

  test('High contrast hides wallpaper controls and shows notice', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();
    await goToPersonalization(page);
    await expect(page.locator('.settings-wallpaper-disabled-notice')).toBeVisible();
    await expect(page.getByTestId('settings-wallpaper-mode-picture-light')).not.toBeVisible();
  });

  test('Standard contrast restores wallpaper controls', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();
    await page.getByTestId('settings-a11y-contrast-none').click();
    await goToPersonalization(page);
    await expect(page.locator('.settings-wallpaper-disabled-notice')).not.toBeVisible();
    await expect(page.getByTestId('settings-wallpaper-mode-picture-light')).toBeVisible();
  });

  test('wallpaper description text changes when contrast is active', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    // Initially shows normal description
    await expect(
      page.locator('.settings-description').filter({ hasText: 'Your wallpaper choice stays selected' }),
    ).toBeVisible();
    // Now enable a contrast theme
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-low').click();
    await goToPersonalization(page);
    await expect(
      page.locator('.settings-description').filter({ hasText: 'Wallpaper is disabled while a contrast theme is active.' }),
    ).toBeVisible();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. Persistence across reload
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Accessibility prefs persist across reload', () => {
  test('always-show-scrollbars pref survives reload', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-always-scrollbars'),
    );
    expect(attrSet).toBe(true);
  });

  test('transparency-off pref survives reload', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-transparency-switch').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-no-transparency'),
    );
    expect(attrSet).toBe(true);
  });

  test('blur preference and level survive reload', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    await page.getByTestId('settings-personalization-blur-slider').fill('20');
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-blur-switch').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(await page.evaluate((key) => ({
      noBlur: document.documentElement.hasAttribute('data-no-blur'),
      blurLevel: JSON.parse(localStorage.getItem(key) ?? '{}').accessibility?.blurLevel,
    }), storageKey)).toEqual({ noBlur: true, blurLevel: 20 });
  });

  test('window transparency level survives reload', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    await page.getByTestId('settings-personalization-window-transparency-slider').fill('45');
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await openSettings(page);
    await goToPersonalization(page);
    await expect(page.getByTestId('settings-personalization-window-transparency-slider')).toHaveValue('45');
  });

  test('sticky transparency level survives reload', async ({ page }) => {
    await openSettings(page);
    await goToPersonalization(page);
    await page.getByTestId('settings-personalization-sticky-transparency-slider').fill('35');
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await openSettings(page);
    await goToPersonalization(page);
    await expect(page.getByTestId('settings-personalization-sticky-transparency-slider')).toHaveValue('35');
  });

  test('animations-off pref survives reload', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-animations-switch').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    const attrSet = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-no-animations'),
    );
    expect(attrSet).toBe(true);
  });

  test('animation speed "Less" pref survives reload', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-speed-less').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-anim-speed'),
    );
    expect(value).toBe('less');
  });

  test('high contrast pref survives reload', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    const value = await page.evaluate(() =>
      document.documentElement.getAttribute('data-contrast'),
    );
    expect(value).toBe('high');
  });

  test('all accessibility prefs are stored in localStorage', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    await page.getByTestId('settings-a11y-blur-switch').click();
    await page.getByTestId('settings-a11y-speed-more').click();
    await page.getByTestId('settings-a11y-animations-switch').click();

    await closeSettings(page);

    const stored = await page.evaluate((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.accessibility ?? null;
    }, storageKey);

    expect(stored).not.toBeNull();
    expect(stored.alwaysShowScrollbars).toBe(true);
    expect(stored.blurEffects).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. Save state as default
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Save as Default includes accessibility prefs', () => {
  test('saving state as default stores accessibility in default storage key', async ({ page }) => {
    // Set a non-default accessibility pref
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    await closeSettings(page);

    // Save as default via context menu
    await page.locator('.desktop-area').evaluate((el) => {
      el.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true, cancelable: true, clientX: 300, clientY: 200,
      }));
    });
    await expect(page.getByRole('menu', { name: 'Desktop options' })).toBeVisible();
    await page.getByRole('menuitem', { name: /save.*default/i }).click();
    await page.getByTestId('button-confirm-save-default').click();

    const defaults = await page.evaluate((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw).accessibility ?? null;
    }, defaultStorageKey);

    expect(defaults?.alwaysShowScrollbars).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. Reset desktop clears accessibility prefs
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Reset Desktop resets accessibility prefs', () => {
  test('reset removes custom accessibility prefs', async ({ page }) => {
    // Set non-default prefs
    await openSettings(page);
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-scrollbars-switch').click();
    await page.getByTestId('settings-a11y-contrast-high').click();
    await closeSettings(page);

    // Verify they're active
    let contrast = await page.evaluate(() =>
      document.documentElement.getAttribute('data-contrast'),
    );
    expect(contrast).toBe('high');

    // Open desktop menu → Reset
    await page.locator('.desktop-area').evaluate((el) => {
      el.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true, cancelable: true, clientX: 300, clientY: 200,
      }));
    });
    await expect(page.getByRole('menu', { name: 'Desktop options' })).toBeVisible();
    await page.getByRole('menuitem', { name: /reset/i }).click();

    // Confirm in the reset dialog
    const confirmButton = page.getByRole('button', { name: /reset/i }).last();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // After reset, contrast should be removed
    contrast = await page.evaluate(() =>
      document.documentElement.getAttribute('data-contrast'),
    );
    expect(contrast).toBeNull();

    const scrollbars = await page.evaluate(() =>
      document.documentElement.hasAttribute('data-always-scrollbars'),
    );
    expect(scrollbars).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 10. Keyboard accessibility of toggle switches
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Toggle switch keyboard accessibility', () => {
  test('toggle switches have role="switch"', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    await expect(page.getByTestId('settings-a11y-scrollbars-switch')).toHaveAttribute('role', 'switch');
    await expect(page.getByTestId('settings-a11y-transparency-switch')).toHaveAttribute('role', 'switch');
    await expect(page.getByTestId('settings-a11y-animations-switch')).toHaveAttribute('role', 'switch');
  });

  test('toggle switch can be activated with Space key', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const switchEl = page.getByTestId('settings-a11y-scrollbars-switch');
    await switchEl.focus();
    await page.keyboard.press('Space');
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  test('toggle switch can be activated with Enter key', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    const switchEl = page.getByTestId('settings-a11y-scrollbars-switch');
    await switchEl.focus();
    await page.keyboard.press('Enter');
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });

  test('toggle row label is clickable and toggles the switch', async ({ page }) => {
    await openSettings(page);
    await goToAccessibility(page);
    // Click the label text, not the switch button itself
    const label = page.locator('label[data-testid="settings-a11y-scrollbars"]');
    await label.click({ position: { x: 20, y: 10 } });
    const switchEl = page.getByTestId('settings-a11y-scrollbars-switch');
    await expect(switchEl).toHaveAttribute('aria-checked', 'true');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 11. Wallpaper restore after contrast change
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Wallpaper state is preserved when contrast theme is toggled', () => {
  test('switching to color wallpaper then enabling contrast and returning to Standard restores color wallpaper', async ({ page }) => {
    // Switch to color wallpaper
    await openSettings(page);
    await goToPersonalization(page);
    const colorModeChip = page.getByTestId('settings-wallpaper-mode-color-light');
    await colorModeChip.click();
    await expect(colorModeChip).toHaveClass(/is-selected/);

    // Enable high contrast
    await goToAccessibility(page);
    await page.getByTestId('settings-a11y-contrast-high').click();

    // Return to Standard
    await page.getByTestId('settings-a11y-contrast-none').click();

    // Wallpaper controls should be back, still showing color mode
    await goToPersonalization(page);
    await expect(page.getByTestId('settings-wallpaper-mode-color-light')).toHaveClass(/is-selected/);
  });
});
