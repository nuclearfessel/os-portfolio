import { expect, test, type Locator, type Page } from '@playwright/test';

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

async function switchToLightTheme(page: Page) {
  await openDesktopMenu(page);
  const themeRow = page.getByRole('menuitem', { name: 'Theme' }).locator('..');
  await themeRow.hover();
  await page.getByRole('menuitemradio', { name: 'Light' }).click();
  await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    type Color = { red: number; green: number; blue: number; alpha: number };

    const parseColor = (value: string): Color => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return {
        red: channels[0] ?? 0,
        green: channels[1] ?? 0,
        blue: channels[2] ?? 0,
        alpha: channels[3] ?? 1,
      };
    };
    const composite = (foreground: Color, background: Color): Color => {
      const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
      if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };
      return {
        red: (foreground.red * foreground.alpha + background.red * background.alpha * (1 - foreground.alpha)) / alpha,
        green: (foreground.green * foreground.alpha + background.green * background.alpha * (1 - foreground.alpha)) / alpha,
        blue: (foreground.blue * foreground.alpha + background.blue * background.alpha * (1 - foreground.alpha)) / alpha,
        alpha,
      };
    };
    const luminance = ({ red, green, blue }: Color) => {
      const linear = [red, green, blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };

    const backgrounds: Color[] = [];
    for (let current: Element | null = element; current; current = current.parentElement) {
      const background = parseColor(getComputedStyle(current).backgroundColor);
      if (background.alpha > 0) backgrounds.push(background);
    }
    let background = { red: 255, green: 255, blue: 255, alpha: 1 };
    for (const layer of backgrounds.reverse()) background = composite(layer, background);

    const foreground = composite(parseColor(getComputedStyle(element).color), background);
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  });
}

test('light theme representative text meets WCAG AA contrast', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({ theme: 'dark' }));
  }, [storageKey]);
  await page.goto('/');
  await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  await switchToLightTheme(page);

  await openDesktopMenu(page);
  await page.getByTestId('button-dock-work').hover();

  const representatives = [
    { surface: 'desktop', locator: page.locator('.desktop-intro p') },
    { surface: 'window', locator: page.locator('.window.work .window-title') },
    { surface: 'card', locator: page.getByTestId('card-project-01').locator('p') },
    { surface: 'terminal', locator: page.locator('.terminal-output').first() },
    { surface: 'menu', locator: page.getByRole('menuitem', { name: 'Auto arrange icons' }) },
    { surface: 'sticky note', locator: page.getByTestId('sticky-sticky').locator('.sticky-text') },
    { surface: 'dock', locator: page.getByTestId('button-dock-work').locator('span') },
  ];

  for (const representative of representatives) {
    await expect(representative.locator, `${representative.surface} text should be visible`).toBeVisible();
    const ratio = await contrastRatio(representative.locator);
    expect(
      ratio,
      `${representative.surface} text contrast ${ratio.toFixed(2)}:1 should meet WCAG AA`,
    ).toBeGreaterThanOrEqual(4.5);
  }
});