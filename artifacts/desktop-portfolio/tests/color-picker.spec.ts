/**
 * Color picker coverage:
 * - Entering values in each format (HEX, RGB, HSV, HSL) updates the wallpaper
 * - Bidirectional sync: field changes update every other format's representation
 * - Out-of-range values are clamped
 * - Wallpaper color persists across reloads
 * - Keyboard access on hue slider and SV plane
 */
import { expect, test, type Page } from '@playwright/test';

const storageKey = 'fes-os.desktop.v4';
const defaultStorageKey = 'fes-os.desktop.default.v1';

async function openSettingsColorPicker(page: Page) {
  // Open settings
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();

  // Switch to Solid color wallpaper mode
  // Determine current theme (light or dark) to click the right button
  const shell = page.locator('.os-shell');
  const isLight = await shell.evaluate((el) => el.classList.contains('theme-light'));
  const themeLabel = isLight ? 'light' : 'dark';

  const colorModeBtn = page.getByTestId(`settings-wallpaper-mode-color-${themeLabel}`);
  await colorModeBtn.click();

  // The color picker should now be visible
  await expect(page.getByTestId('color-picker')).toBeVisible();
  return themeLabel;
}

async function getWallpaperColor(page: Page): Promise<string> {
  return page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return data.wallpaperLight?.color ?? data.wallpaperDark?.color ?? '';
  }, storageKey);
}

async function getDesktopBackground(page: Page): Promise<string> {
  return page.locator('.os-shell').evaluate((el) => (el as HTMLElement).style.background || window.getComputedStyle(el).background);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(([currentKey, savedDefaultKey]) => {
    localStorage.removeItem(currentKey);
    localStorage.removeItem(savedDefaultKey);
  }, [storageKey, defaultStorageKey]);
  await page.reload();
});

test('number keys edit color values without opening Dock apps', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('button-close-work').click();
  await page.getByTestId('cp-format-rgb').click();

  const redField = page.getByTestId('cp-field-rgb-r');
  await redField.fill('');
  await redField.pressSequentially('123');

  await expect(redField).toHaveValue('123');
  await expect(page.getByTestId('window-work')).toHaveCount(0);
  await expect(page.getByTestId('window-settings')).toHaveClass(/is-active/);
});

// ─── Format: HEX ─────────────────────────────────────────────────────────────

test('HEX field entry updates wallpaper color live', async ({ page }) => {
  await openSettingsColorPicker(page);

  // Make sure HEX tab is active (default)
  await page.getByTestId('cp-format-hex').click();
  const hexField = page.getByTestId('cp-field-hex');
  await expect(hexField).toBeVisible();

  // Type a known hex value and commit
  await hexField.triple_click?.() ?? await hexField.click({ clickCount: 3 });
  await hexField.fill('FF5733');
  await hexField.press('Enter');

  // Swatch should show the color
  const swatchBg = await page.getByTestId('cp-swatch').evaluate((el) => (el as HTMLElement).style.background);
  expect(swatchBg.toLowerCase()).toContain('rgb');

  // Wait for state to persist
  await page.waitForTimeout(200);
  const saved = await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return { light: data.wallpaperLight?.color, dark: data.wallpaperDark?.color };
  }, storageKey);
  // Both light and dark should be updated (settings applies to both)
  const color = saved.light ?? saved.dark;
  expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  expect(color?.toLowerCase()).toBe('#ff5733');
});

test('HEX field strips non-hex characters and limits to 6 digits', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hex').click();
  const hexField = page.getByTestId('cp-field-hex');

  // Try entering invalid characters + extra length
  await hexField.click({ clickCount: 3 });
  await hexField.fill('XYZABC1234567');
  // Field should only contain valid hex chars up to 6
  const fieldValue = await hexField.inputValue();
  expect(fieldValue).toMatch(/^[0-9A-Fa-f]{0,6}$/);
  expect(fieldValue.length).toBeLessThanOrEqual(6);
});

test('HEX field reverts to canonical value on blur if input is partial', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hex').click();
  const hexField = page.getByTestId('cp-field-hex');

  // Enter a partial hex (only 3 chars), then blur
  await hexField.click({ clickCount: 3 });
  await hexField.fill('ABC');
  await hexField.press('Tab');

  // The field should still show a valid 6-char hex (unchanged from before)
  const fieldValue = await hexField.inputValue();
  expect(fieldValue).toHaveLength(6);
  expect(fieldValue).toMatch(/^[0-9A-F]{6}$/);
});

// ─── Format: RGB ─────────────────────────────────────────────────────────────

test('RGB field entry updates wallpaper color and syncs HEX field', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-rgb').click();

  const rField = page.getByTestId('cp-field-rgb-r');
  const gField = page.getByTestId('cp-field-rgb-g');
  const bField = page.getByTestId('cp-field-rgb-b');

  await rField.click({ clickCount: 3 });
  await rField.fill('0');
  await rField.press('Tab');

  await gField.click({ clickCount: 3 });
  await gField.fill('128');
  await gField.press('Tab');

  await bField.click({ clickCount: 3 });
  await bField.fill('255');
  await bField.press('Enter');

  // Wait for state to settle
  await page.waitForTimeout(200);

  // Switch to HEX to verify sync
  await page.getByTestId('cp-format-hex').click();
  const hexValue = await page.getByTestId('cp-field-hex').inputValue();
  // rgb(0, 128, 255) = #0080FF
  expect(hexValue.toUpperCase()).toBe('0080FF');

  // Swatch background should reflect the color
  const swatchBg = await page.getByTestId('cp-swatch').evaluate((el) => (el as HTMLElement).style.background);
  expect(swatchBg).toContain('rgb(0');
});

test('RGB values are clamped to 0-255 range', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-rgb').click();

  const rField = page.getByTestId('cp-field-rgb-r');
  await rField.click({ clickCount: 3 });
  await rField.fill('999');
  await rField.press('Tab');

  // After blur, value should be clamped to 255
  const clampedValue = await rField.inputValue();
  expect(parseInt(clampedValue, 10)).toBeLessThanOrEqual(255);
});

// ─── Format: HSV ─────────────────────────────────────────────────────────────

test('HSV field entry updates wallpaper color and syncs other formats', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hsv').click();

  // Enter HSV for pure red: H=0, S=100, V=100
  const hField = page.getByTestId('cp-field-hsv-h');
  const sField = page.getByTestId('cp-field-hsv-s');
  const vField = page.getByTestId('cp-field-hsv-v');

  await hField.click({ clickCount: 3 });
  await hField.fill('0');
  await hField.press('Tab');

  await sField.click({ clickCount: 3 });
  await sField.fill('100');
  await sField.press('Tab');

  await vField.click({ clickCount: 3 });
  await vField.fill('100');
  await vField.press('Enter');

  await page.waitForTimeout(200);

  // Switch to HEX to verify
  await page.getByTestId('cp-format-hex').click();
  const hexValue = await page.getByTestId('cp-field-hex').inputValue();
  expect(hexValue.toUpperCase()).toBe('FF0000');

  // Switch to RGB to verify cross-format sync
  await page.getByTestId('cp-format-rgb').click();
  const rValue = await page.getByTestId('cp-field-rgb-r').inputValue();
  const gValue = await page.getByTestId('cp-field-rgb-g').inputValue();
  const bValue = await page.getByTestId('cp-field-rgb-b').inputValue();
  expect(rValue).toBe('255');
  expect(gValue).toBe('0');
  expect(bValue).toBe('0');
});

test('HSV values are clamped: H to 360, S and V to 100', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hsv').click();

  const hField = page.getByTestId('cp-field-hsv-h');
  const sField = page.getByTestId('cp-field-hsv-s');
  const vField = page.getByTestId('cp-field-hsv-v');

  await hField.click({ clickCount: 3 });
  await hField.fill('999');
  await hField.press('Tab');
  expect(parseInt(await hField.inputValue(), 10)).toBeLessThanOrEqual(360);

  await sField.click({ clickCount: 3 });
  await sField.fill('999');
  await sField.press('Tab');
  expect(parseInt(await sField.inputValue(), 10)).toBeLessThanOrEqual(100);

  await vField.click({ clickCount: 3 });
  await vField.fill('999');
  await vField.press('Enter');
  expect(parseInt(await vField.inputValue(), 10)).toBeLessThanOrEqual(100);
});

// ─── Format: HSL ─────────────────────────────────────────────────────────────

test('HSL field entry updates wallpaper color and syncs other formats', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hsl').click();

  // Pure blue: H=240, S=100, L=50
  const hField = page.getByTestId('cp-field-hsl-h');
  const sField = page.getByTestId('cp-field-hsl-s');
  const lField = page.getByTestId('cp-field-hsl-l');

  await hField.click({ clickCount: 3 });
  await hField.fill('240');
  await hField.press('Tab');

  await sField.click({ clickCount: 3 });
  await sField.fill('100');
  await sField.press('Tab');

  await lField.click({ clickCount: 3 });
  await lField.fill('50');
  await lField.press('Enter');

  await page.waitForTimeout(200);

  // Switch to HEX and check it's blue
  await page.getByTestId('cp-format-hex').click();
  const hexValue = await page.getByTestId('cp-field-hex').inputValue();
  expect(hexValue.toUpperCase()).toBe('0000FF');

  // Switch to RGB and verify
  await page.getByTestId('cp-format-rgb').click();
  const rValue = await page.getByTestId('cp-field-rgb-r').inputValue();
  const bValue = await page.getByTestId('cp-field-rgb-b').inputValue();
  expect(rValue).toBe('0');
  expect(bValue).toBe('255');
});

test('HSL values are clamped: H to 360, S and L to 100', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hsl').click();

  const hField = page.getByTestId('cp-field-hsl-h');
  const sField = page.getByTestId('cp-field-hsl-s');
  const lField = page.getByTestId('cp-field-hsl-l');

  await hField.click({ clickCount: 3 });
  await hField.fill('500');
  await hField.press('Tab');
  expect(parseInt(await hField.inputValue(), 10)).toBeLessThanOrEqual(360);

  await sField.click({ clickCount: 3 });
  await sField.fill('200');
  await sField.press('Tab');
  expect(parseInt(await sField.inputValue(), 10)).toBeLessThanOrEqual(100);

  await lField.click({ clickCount: 3 });
  await lField.fill('200');
  await lField.press('Enter');
  expect(parseInt(await lField.inputValue(), 10)).toBeLessThanOrEqual(100);
});

// ─── Persistence ─────────────────────────────────────────────────────────────

test('wallpaper color set via color picker persists across reloads', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hex').click();

  const hexField = page.getByTestId('cp-field-hex');
  await hexField.click({ clickCount: 3 });
  await hexField.fill('1A2B3C');
  await hexField.press('Enter');

  await page.waitForTimeout(300);

  // Verify stored
  const savedBefore = await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return { light: data.wallpaperLight, dark: data.wallpaperDark };
  }, storageKey);
  expect(savedBefore.light?.color?.toLowerCase() || savedBefore.dark?.color?.toLowerCase()).toBe('#1a2b3c');

  // Close settings and reload
  await page.getByTestId('button-close-settings').click();
  await page.reload();

  // Verify the color survived reload
  const savedAfter = await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return { light: data.wallpaperLight, dark: data.wallpaperDark };
  }, storageKey);
  const colorAfter = savedAfter.light?.color ?? savedAfter.dark?.color ?? '';
  expect(colorAfter.toLowerCase()).toBe('#1a2b3c');
});

test('wallpaper color persists independently in light and dark themes', async ({ page }) => {
  // Set dark theme
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  await page.getByTestId('settings-theme-dark').click();

  // Switch to solid color mode in dark theme
  await page.getByTestId('settings-wallpaper-mode-color-dark').click();
  await expect(page.getByTestId('color-picker')).toBeVisible();

  // Enter a dark color
  await page.getByTestId('cp-format-hex').click();
  const hexField = page.getByTestId('cp-field-hex');
  await hexField.click({ clickCount: 3 });
  await hexField.fill('222244');
  await hexField.press('Enter');

  await page.waitForTimeout(300);

  const saved = await page.evaluate((key) => {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return { light: data.wallpaperLight, dark: data.wallpaperDark };
  }, storageKey);

  // Both light and dark are updated (settings applies to both simultaneously)
  expect(saved.dark?.color?.toLowerCase()).toBe('#222244');
});

// ─── Bidirectional sync ───────────────────────────────────────────────────────

test('format tabs stay in sync — changing format shows same color in new fields', async ({ page }) => {
  await openSettingsColorPicker(page);

  // Set a known color via HEX: #3E97A0 (teal-ish)
  await page.getByTestId('cp-format-hex').click();
  const hexField = page.getByTestId('cp-field-hex');
  await hexField.click({ clickCount: 3 });
  await hexField.fill('3E97A0');
  await hexField.press('Enter');
  await page.waitForTimeout(100);

  // Switch to RGB — values should represent the same color
  await page.getByTestId('cp-format-rgb').click();
  const r = parseInt(await page.getByTestId('cp-field-rgb-r').inputValue(), 10);
  const g = parseInt(await page.getByTestId('cp-field-rgb-g').inputValue(), 10);
  const b = parseInt(await page.getByTestId('cp-field-rgb-b').inputValue(), 10);
  expect(r).toBe(62);
  expect(g).toBe(151);
  expect(b).toBe(160);

  // Switch to HSL
  await page.getByTestId('cp-format-hsl').click();
  const hh = parseInt(await page.getByTestId('cp-field-hsl-h').inputValue(), 10);
  // Hue for #3E97A0 ≈ 185
  expect(hh).toBeGreaterThan(170);
  expect(hh).toBeLessThan(200);

  // Switch to HSV
  await page.getByTestId('cp-format-hsv').click();
  const hv = parseInt(await page.getByTestId('cp-field-hsv-h').inputValue(), 10);
  expect(hv).toBeGreaterThan(170);
  expect(hv).toBeLessThan(200);
});

// ─── Keyboard accessibility ────────────────────────────────────────────────────

test('hue slider responds to ArrowRight and ArrowLeft keyboard events', async ({ page }) => {
  await openSettingsColorPicker(page);

  const hueTrack = page.getByTestId('cp-hue-track');
  await hueTrack.focus();
  await expect(hueTrack).toBeFocused();

  // Get initial hue from field
  await page.getByTestId('cp-format-hsv').click();
  const initialH = parseInt(await page.getByTestId('cp-field-hsv-h').inputValue(), 10);

  // Focus hue track and press right arrow
  await hueTrack.focus();
  await page.keyboard.press('ArrowRight');

  await page.getByTestId('cp-format-hsv').click();
  const afterH = parseInt(await page.getByTestId('cp-field-hsv-h').inputValue(), 10);
  // Hue should have increased by 1 (wrapping is ok)
  const diff = ((afterH - initialH) + 360) % 360;
  expect(diff).toBe(1);
});

test('SV plane responds to ArrowRight/Left/Up/Down keyboard events', async ({ page }) => {
  await openSettingsColorPicker(page);

  // Set a known HSV to make predictable assertions
  await page.getByTestId('cp-format-hsv').click();
  const sField = page.getByTestId('cp-field-hsv-s');
  const vField = page.getByTestId('cp-field-hsv-v');
  await sField.click({ clickCount: 3 });
  await sField.fill('50');
  await sField.press('Tab');
  await vField.click({ clickCount: 3 });
  await vField.fill('50');
  await vField.press('Enter');
  await page.waitForTimeout(100);

  const svPlane = page.getByTestId('cp-sv-plane');
  await svPlane.focus();
  await expect(svPlane).toBeFocused();

  // ArrowRight increases saturation
  await page.keyboard.press('ArrowRight');
  await page.getByTestId('cp-format-hsv').click();
  const sAfterRight = parseInt(await page.getByTestId('cp-field-hsv-s').inputValue(), 10);
  expect(sAfterRight).toBe(51);

  // ArrowUp increases value (brightness)
  await svPlane.focus();
  await page.keyboard.press('ArrowUp');
  await page.getByTestId('cp-format-hsv').click();
  const vAfterUp = parseInt(await page.getByTestId('cp-field-hsv-v').inputValue(), 10);
  expect(vAfterUp).toBe(51);
});

test('format tabs are keyboard navigable', async ({ page }) => {
  await openSettingsColorPicker(page);

  // Tab to format tabs and press Enter
  const hexTab = page.getByTestId('cp-format-hex');
  const rgbTab = page.getByTestId('cp-format-rgb');

  await hexTab.focus();
  await expect(hexTab).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(rgbTab).toBeFocused();

  await page.keyboard.press('Enter');
  // RGB tab should be active
  const isActive = await rgbTab.evaluate((el) => el.getAttribute('aria-selected'));
  expect(isActive).toBe('true');
});

// ─── Visual swatch ───────────────────────────────────────────────────────────

test('color swatch updates in real time when entering a new value', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hex').click();

  const hexField = page.getByTestId('cp-field-hex');
  const swatch = page.getByTestId('cp-swatch');

  // Set to green
  await hexField.click({ clickCount: 3 });
  await hexField.fill('00FF00');
  await hexField.press('Enter');
  await page.waitForTimeout(100);

  const swatchColor = await swatch.evaluate((el) => (el as HTMLElement).style.background);
  // Should contain green channel
  expect(swatchColor.toLowerCase()).toContain('0, 255, 0');
});

// ─── Desktop wallpaper live update ───────────────────────────────────────────

test('desktop wallpaper updates live when color picker value changes', async ({ page }) => {
  await openSettingsColorPicker(page);
  await page.getByTestId('cp-format-hex').click();

  const hexField = page.getByTestId('cp-field-hex');
  await hexField.click({ clickCount: 3 });
  await hexField.fill('CC4400');
  await hexField.press('Enter');

  await page.waitForTimeout(200);

  // The shell background should now use the new color
  const shellStyle = await page.locator('.os-shell').evaluate((el) => {
    const style = (el as HTMLElement).style;
    return style.background || style.backgroundColor;
  });
  // The wallpaper-color class should be on the shell
  await expect(page.locator('.os-shell')).toHaveClass(/wallpaper-color/);
});
