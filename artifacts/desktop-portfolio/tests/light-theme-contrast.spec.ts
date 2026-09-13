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

test('light theme interactive hover and focus states meet WCAG AA contrast', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({ theme: 'dark' }));
  }, [storageKey]);
  await page.goto('/');
  await switchToLightTheme(page);

  const states: Array<{ name: string; locator: Locator }> = [
    { name: 'secondary quick action hover', locator: page.getByTestId('button-open-contact') },
    { name: 'primary quick action focus', locator: page.getByTestId('button-open-work') },
    { name: 'window control focus', locator: page.getByTestId('button-maximize-work') },
    { name: 'project link hover', locator: page.getByTestId('button-open-project-01') },
    { name: 'Dock item hover', locator: page.getByTestId('button-dock-contact') },
  ];

  for (const state of states) {
    await state.locator.hover();
    const hoverRatio = await contrastRatio(state.locator);
    expect(
      hoverRatio,
      `${state.name} contrast ${hoverRatio.toFixed(2)}:1 should meet WCAG AA`,
    ).toBeGreaterThanOrEqual(4.5);

    await state.locator.focus();
    await expect(state.locator).toBeFocused();
    const focusRatio = await contrastRatio(state.locator);
    expect(
      focusRatio,
      `${state.name} focus contrast ${focusRatio.toFixed(2)}:1 should meet WCAG AA`,
    ).toBeGreaterThanOrEqual(4.5);
  }

  await openDesktopMenu(page);
  const menuItem = page.getByRole('menuitem', { name: 'Auto arrange icons' });
  await menuItem.hover();
  const menuHoverRatio = await contrastRatio(menuItem);
  expect(menuHoverRatio, `menu hover contrast ${menuHoverRatio.toFixed(2)}:1 should meet WCAG AA`).toBeGreaterThanOrEqual(4.5);
  await menuItem.focus();
  const menuFocusRatio = await contrastRatio(menuItem);
  expect(menuFocusRatio, `menu focus contrast ${menuFocusRatio.toFixed(2)}:1 should meet WCAG AA`).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press('Escape');

  await page.getByTestId('button-dock-terminal').click();
  await page.getByTestId('input-terminal-command').fill('help');
  await page.getByTestId('input-terminal-command').press('Enter');
  const terminalExample = page.locator('.terminal-examples button').first();
  await terminalExample.hover();
  const terminalHoverRatio = await contrastRatio(terminalExample);
  expect(terminalHoverRatio, `terminal example hover contrast ${terminalHoverRatio.toFixed(2)}:1 should meet WCAG AA`).toBeGreaterThanOrEqual(4.5);
  await terminalExample.focus();
  const terminalFocusRatio = await contrastRatio(terminalExample);
  expect(terminalFocusRatio, `terminal example focus contrast ${terminalFocusRatio.toFixed(2)}:1 should meet WCAG AA`).toBeGreaterThanOrEqual(4.5);
});

test('light theme About, Contact, and case study windows meet WCAG AA contrast', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({ theme: 'dark' }));
  }, [storageKey]);
  await page.goto('/');
  await switchToLightTheme(page);

  await page.getByTestId('button-dock-about').click();
  await expect(page.getByTestId('window-about')).toBeVisible();
  const aboutRepresentatives = [
    { name: 'About heading', locator: page.locator('.window.about .window-body h2') },
    { name: 'About body copy', locator: page.locator('.window.about .window-body p').first() },
    { name: 'About fact label', locator: page.locator('.window.about .fact label').first() },
    { name: 'About fact value', locator: page.locator('.window.about .fact span').first() },
    { name: 'About signature', locator: page.locator('.window.about .signature') },
  ];

  await page.getByTestId('button-dock-contact').click();
  await expect(page.getByTestId('window-contact')).toBeVisible();
  const contactRepresentatives = [
    { name: 'Contact heading', locator: page.locator('.window.contact .window-body h2') },
    { name: 'Contact body copy', locator: page.locator('.window.contact .window-body p').first() },
    { name: 'Contact email button', locator: page.getByTestId('link-email-alex') },
    { name: 'Contact email address', locator: page.locator('.window.contact .window-body p').last() },
  ];

  await page.getByTestId('button-dock-work').click();
  await page.getByTestId('button-open-project-01').click();
  await expect(page.getByTestId('case-study-orbit')).toBeVisible();
  const caseStudyRepresentatives = [
    { name: 'Case study back link', locator: page.getByTestId('button-back-to-work') },
    { name: 'Case study heading', locator: page.locator('.case-study h2') },
    { name: 'Case study hero copy', locator: page.locator('.case-study-hero p') },
    { name: 'Case study role', locator: page.locator('.case-study-role') },
    { name: 'Case study metric value', locator: page.locator('.case-study-metrics strong').first() },
    { name: 'Case study metric label', locator: page.locator('.case-study-metrics span').first() },
    { name: 'Case study section heading', locator: page.locator('.case-study-sections h3').first() },
    { name: 'Case study section copy', locator: page.locator('.case-study-sections p').first() },
  ];

  for (const representative of [...aboutRepresentatives, ...contactRepresentatives, ...caseStudyRepresentatives]) {
    await expect(representative.locator, `${representative.name} should be visible`).toBeVisible();
    const ratio = await contrastRatio(representative.locator);
    expect(
      ratio,
      `${representative.name} contrast ${ratio.toFixed(2)}:1 should meet WCAG AA`,
    ).toBeGreaterThanOrEqual(4.5);
  }
});