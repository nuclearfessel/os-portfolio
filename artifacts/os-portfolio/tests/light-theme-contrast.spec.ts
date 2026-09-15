import { expect, test, type Locator, type Page } from '@playwright/test';

const storageKey = 'os-portfolio.desktop.v4';

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
  await openThemeSettings(page);
  await page.getByTestId('settings-theme-light').click();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
  await page.getByTestId('button-close-settings').click();
}

async function openThemeSettings(page: Page) {
  await page.getByTestId('button-dock-settings').click();
  await expect(page.getByTestId('window-settings')).toBeVisible();
  const trigger = page.getByTestId('settings-section-trigger-theme');
  if (await trigger.getAttribute('aria-expanded') !== 'true') await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
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

async function dockIconContrastRatio(item: Locator) {
  return item.evaluate((element) => {
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
    const ratio = (a: Color, b: Color) => {
      const lighter = Math.max(luminance(a), luminance(b));
      const darker = Math.min(luminance(a), luminance(b));
      return (lighter + 0.05) / (darker + 0.05);
    };

    const parentLayers: Color[] = [];
    for (let current = element.parentElement; current; current = current.parentElement) {
      const background = parseColor(getComputedStyle(current).backgroundColor);
      if (background.alpha > 0) parentLayers.push(background);
    }
    let parentBackground = { red: 255, green: 255, blue: 255, alpha: 1 };
    for (const layer of parentLayers.reverse()) parentBackground = composite(layer, parentBackground);

    const itemStyle = getComputedStyle(element);
    const gradientStops = itemStyle.backgroundImage
      .match(/rgba?\([^)]+\)/g)
      ?.map(parseColor) ?? [];
    const solid = parseColor(itemStyle.backgroundColor);
    const backgrounds = gradientStops.length > 0
      ? gradientStops.map((stop) => composite(stop, parentBackground))
      : [composite(solid, parentBackground)];
    const icon = element.querySelector('svg') ?? element;
    const foreground = parseColor(getComputedStyle(icon).color);

    return Math.min(...backgrounds.map((background) => ratio(composite(foreground, background), background)));
  });
}

test('light theme representative text meets WCAG AA contrast', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({
      theme: 'light',
      accessibility: { windowTransparency: false },
    }));
  }, [storageKey]);
  await page.goto('/');
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);

  await page.getByTestId('button-dock-terminal').click();
  await expect(page.getByTestId('window-terminal')).toBeVisible();
  await openDesktopMenu(page);
  await page.getByTestId('button-dock-work').hover();

  const representatives = [
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
    localStorage.setItem(key, JSON.stringify({
      theme: 'light',
      accessibility: { windowTransparency: false },
    }));
  }, [storageKey]);
  await page.goto('/');
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);

  const states: Array<{ name: string; locator: Locator }> = [
    { name: 'secondary quick action hover', locator: page.getByTestId('button-open-contact') },
    { name: 'primary quick action focus', locator: page.getByTestId('button-open-work') },
    { name: 'window control focus', locator: page.getByTestId('button-maximize-work') },
    { name: 'project link hover', locator: page.getByTestId('button-open-project-01') },
  ];

  for (const state of states) {
    await state.locator.hover({ force: true });
    await state.locator.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    const hoverRatio = await contrastRatio(state.locator);
    expect(
      hoverRatio,
      `${state.name} contrast ${hoverRatio.toFixed(2)}:1 should meet WCAG AA`,
    ).toBeGreaterThanOrEqual(4.5);

    await state.locator.focus();
    await expect(state.locator).toBeFocused();
    await state.locator.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
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

test('primary, secondary, and tertiary actions use their theme-specific treatments', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({
      theme: 'dark',
      accessibility: { windowTransparency: false },
    }));
  }, [storageKey]);
  await page.goto('/');

  const primaryAction = page.getByTestId('button-open-work');
  const tertiaryAction = page.getByTestId('button-open-contact');
  const projectAction = page.getByTestId('button-open-project-01');
  await page.locator('.desktop-note').evaluateAll((notes) => {
    for (const note of notes) (note as HTMLElement).style.pointerEvents = 'none';
  });
  await expect(primaryAction).toHaveCSS('background-color', 'rgb(228, 255, 91)');
  await primaryAction.hover();
  await expect(primaryAction).toHaveCSS('background-color', 'rgb(43, 47, 74)');
  await expect(primaryAction).toHaveCSS('color', 'rgb(228, 255, 91)');
  await tertiaryAction.hover();
  await expect(tertiaryAction).toHaveCSS('background-color', 'rgb(255, 141, 121)');
  await expect(tertiaryAction).toHaveCSS('color', 'rgb(17, 19, 38)');
  await expect(tertiaryAction).toHaveCSS('border-color', 'rgb(255, 141, 121)');
  await expect(projectAction).toHaveCSS('background-color', 'rgb(43, 47, 74)');
  await expect(projectAction).toHaveCSS('color', 'rgb(228, 255, 91)');
  await projectAction.hover();
  await expect(projectAction).toHaveCSS('background-color', 'rgb(228, 255, 91)');
  await expect(projectAction).toHaveCSS('color', 'rgb(17, 19, 38)');

  await page.getByTestId('button-dock-contact').click();
  const contactCta = page.getByTestId('link-email-john');
  await expect(contactCta).toHaveCSS('background-color', 'rgb(255, 141, 121)');
  await expect(contactCta).toHaveCSS('color', 'rgb(17, 19, 38)');
  await contactCta.hover();
  await expect(contactCta).toHaveCSS('background-color', 'rgb(228, 255, 91)');
  await expect(contactCta).toHaveCSS('border-color', 'rgb(228, 255, 91)');

  await page.getByTestId('button-dock-settings').click();
  await page.getByTestId('settings-nav-about').click();
  const settingsAction = page.getByTestId('settings-about-open-guide');
  await expect(settingsAction).toHaveCSS('background-color', 'rgb(43, 47, 74)');
  await expect(settingsAction).toHaveCSS('color', 'rgb(228, 255, 91)');
  await settingsAction.hover();
  await expect(settingsAction).toHaveCSS('background-color', 'rgb(228, 255, 91)');
  await expect(settingsAction).toHaveCSS('color', 'rgb(17, 19, 38)');

  await page.getByTestId('settings-nav-personalization').click();
  const themeTrigger = page.getByTestId('settings-section-trigger-theme');
  if (await themeTrigger.getAttribute('aria-expanded') !== 'true') await themeTrigger.click();
  await page.getByTestId('settings-theme-light').click();
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
  await expect(primaryAction).toHaveCSS('background-color', 'rgb(11, 102, 93)');
  await primaryAction.hover();
  await expect(primaryAction).toHaveCSS('background-color', 'rgb(237, 244, 241)');
  await expect(primaryAction).toHaveCSS('color', 'rgb(197, 78, 72)');
  await expect(primaryAction).toHaveCSS('border-color', 'rgb(197, 78, 72)');
  await tertiaryAction.hover();
  await expect(tertiaryAction).toHaveCSS('background-color', 'rgb(150, 63, 53)');
  await expect(tertiaryAction).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(tertiaryAction).toHaveCSS('border-color', 'rgb(150, 63, 53)');
  await page.getByTestId('settings-nav-about').click();
  await expect(settingsAction).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(settingsAction).toHaveCSS('color', 'rgb(197, 78, 72)');
  await settingsAction.hover();
  await expect(settingsAction).toHaveCSS('background-color', 'rgb(11, 102, 93)');
  await expect(settingsAction).toHaveCSS('color', 'rgb(247, 251, 249)');

  await page.getByTestId('button-close-settings').click();
  await page.getByTestId('button-dock-contact').click();
  await expect(contactCta).toHaveCSS('background-color', 'rgb(197, 78, 72)');
  await expect(contactCta).toHaveCSS('color', 'rgb(255, 255, 255)');
  await contactCta.hover();
  await expect(contactCta).toHaveCSS('background-color', 'rgb(11, 102, 93)');
  await expect(contactCta).toHaveCSS('border-color', 'rgb(11, 102, 93)');

  await page.getByTestId('button-dock-work').click();
  await expect(projectAction).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(projectAction).toHaveCSS('color', 'rgb(197, 78, 72)');
  await projectAction.hover();
  await expect(projectAction).toHaveCSS('background-color', 'rgb(11, 102, 93)');
  await expect(projectAction).toHaveCSS('color', 'rgb(247, 251, 249)');
});

test('Dock hover and focus preserve app identity and keep utility controls legible in both themes', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({ theme: 'dark' }));
  }, [storageKey]);
  await page.goto('/');

  const appIds = ['work', 'about', 'contact', 'terminal', 'stickies'];
  for (const theme of ['dark', 'light'] as const) {
    if (theme === 'light') {
      await openThemeSettings(page);
      await page.getByTestId('settings-theme-light').click();
      await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
      await page.getByTestId('button-close-settings').click();
    }

    const inactiveItems = page.locator('.dock:not(.dock-mobile-menu):not(.dock-tablet-menu) .dock-item:not(.active)');
    await inactiveItems.evaluateAll(async (items) => {
      await Promise.all(items.flatMap((item) => item.getAnimations().map((animation) => animation.finished)));
    });
    const inactiveBorders = await inactiveItems.evaluateAll((items) => (
      items.map((item) => {
        const style = getComputedStyle(item);
        return {
          color: style.borderTopColor,
          width: style.borderTopWidth,
          style: style.borderTopStyle,
        };
      })
    ));
    expect(inactiveBorders.every((border) => border.width === '1px' && border.style === 'solid')).toBe(true);
    const inactiveApplicationBorders = await page.locator(
      '.dock:not(.dock-mobile-menu):not(.dock-tablet-menu) .dock-item:not(.active):is([data-testid="button-dock-contact"], [data-testid="button-dock-terminal"], [data-testid="button-dock-stickies"])',
    ).evaluateAll((items) => items.map((item) => getComputedStyle(item).borderTopColor));
    expect(new Set(inactiveApplicationBorders).size).toBe(1);

    for (const id of appIds) {
      const item = page.getByTestId(`button-dock-${id}`);
      const before = await item.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, backgroundImage: style.backgroundImage };
      });
      await item.hover();
      await expect.poll(() => item.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, backgroundImage: style.backgroundImage };
      })).toEqual(before);
      await expect(item).toHaveCSS('filter', 'none');
      await expect(item).toHaveCSS('transform', 'none');
      await item.focus();
      await expect.poll(() => item.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, backgroundImage: style.backgroundImage };
      })).toEqual(before);
    }

    const utility = page.getByTestId('button-dock-settings');
    await utility.hover();
    await utility.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    const hoverRatio = await dockIconContrastRatio(utility);
    expect(hoverRatio, `${theme} Dock utility hover contrast should meet WCAG AA`).toBeGreaterThanOrEqual(4.5);
    await utility.focus();
    await utility.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    const focusRatio = await dockIconContrastRatio(utility);
    expect(focusRatio, `${theme} Dock utility focus contrast should meet WCAG AA`).toBeGreaterThanOrEqual(4.5);
  }
});

test('Dock open apps use active rings while only the focused app uses the edge pill', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({ theme: 'dark' }));
  }, [storageKey]);
  await page.goto('/');

  const expectClearActiveState = async (item: Locator, minimumPillWidth = 16) => {
    await expect(item).toHaveClass(/active/);
    await expect(item).toHaveClass(/focused/);
    await item.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    const readState = () => item.evaluate((element) => {
      const tile = getComputedStyle(element);
      const badge = getComputedStyle(element, '::after');
      return {
        color: tile.color,
        background: tile.background,
        borderColor: tile.borderColor,
        boxShadow: tile.boxShadow,
        outlineStyle: tile.outlineStyle,
        badgeDisplay: badge.display,
        badgeWidth: Number.parseFloat(badge.width),
        badgeHeight: Number.parseFloat(badge.height),
      };
    });
    const state = await readState();
    expect(state.boxShadow).not.toBe('none');
    expect(state.badgeDisplay).not.toBe('none');
    expect(state.badgeWidth).toBeGreaterThanOrEqual(minimumPillWidth);
    expect(state.badgeHeight).toBeGreaterThanOrEqual(3);
    await item.hover();
    await item.evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    await expect.poll(readState).toEqual(state);
  };

  for (const theme of ['dark', 'light'] as const) {
    if (theme === 'light') {
      await openThemeSettings(page);
      await page.getByTestId('settings-theme-light').click();
      await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);
    }

    await page.getByTestId('button-dock-work').click();
    await expectClearActiveState(page.getByTestId('button-dock-work'));
    await expect(page.getByTestId('button-dock-about')).toHaveClass(/active/);
    await expect(page.getByTestId('button-dock-about')).not.toHaveClass(/focused/);
    const settings = page.getByTestId('button-dock-settings');
    await settings.click();
    await expectClearActiveState(settings);
    await page.getByTestId('button-close-settings').click();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.dock-mobile-menu')).toBeVisible();
  await page.getByTestId('button-dock-about').click();
  await expectClearActiveState(page.getByTestId('button-dock-about'), 24);
  await expect(page.getByTestId('button-dock-work')).toHaveClass(/active/);
  await expect(page.getByTestId('button-dock-work')).not.toHaveClass(/focused/);
});

test('tablet and mobile Dock icons meet non-text contrast in every orientation', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({ theme: 'dark' }));
  }, [storageKey]);
  await page.goto('/');

  const viewports = [
    { name: 'tablet landscape', width: 1024, height: 768 },
    { name: 'tablet portrait', width: 768, height: 1024 },
    { name: 'mobile landscape', width: 844, height: 390 },
    { name: 'mobile portrait', width: 390, height: 844 },
  ];
  const iconIds = ['work', 'about', 'contact', 'mode'];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await expect(page.locator('.dock-mobile-menu, .dock-tablet-menu')).toBeVisible();

    for (const theme of ['dark', 'light'] as const) {
      const isLight = await page.locator('.osp-shell').evaluate((element) => element.classList.contains('theme-light'));
      if ((theme === 'light') !== isLight) await page.getByTestId('button-dock-mode').click();
      await expect(page.locator('.osp-shell')).toHaveClass(theme === 'light' ? /theme-light/ : /theme-dark/);

      for (const id of iconIds) {
        const item = page.getByTestId(`button-dock-${id}`);
        await item.evaluate(async (element) => {
          await Promise.all(element.getAnimations().map((animation) => animation.finished));
        });
        const ratio = await dockIconContrastRatio(item);
        expect(
          ratio,
          `${viewport.name} ${theme} ${id} icon contrast ${ratio.toFixed(2)}:1 should meet WCAG non-text contrast`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  }
});

test('light theme About, Contact, and case study windows meet WCAG AA contrast', async ({ page }) => {
  await page.addInitScript(([key]) => {
    localStorage.setItem(key, JSON.stringify({
      theme: 'light',
      accessibility: { windowTransparency: false },
    }));
  }, [storageKey]);
  await page.goto('/');
  await expect(page.locator('.osp-shell')).toHaveClass(/theme-light/);

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
    { name: 'Contact email button', locator: page.getByTestId('link-email-john') },
    { name: 'Contact email address', locator: page.locator('.window.contact .window-body p').last() },
  ];

  await page.getByTestId('button-dock-work').click();
  await page.getByTestId('button-open-project-01').click();
  await expect(page.getByTestId('case-study-01')).toBeVisible();
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

test('opens four distinct complete case studies from Work', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('button-dock-work').click();

  const studies = [
    { id: '01', name: 'Northstar Commerce System' },
    { id: '02', name: 'Signal Operations Platform' },
    { id: '03', name: 'Mosaic Health Toolkit' },
    { id: '04', name: 'Fieldnote Collaboration Kit' },
  ];

  for (const study of studies) {
    await page.getByTestId(`button-open-project-${study.id}`).click();
    const detail = page.getByTestId(`case-study-${study.id}`);
    await expect(detail).toBeVisible();
    await expect(detail.locator('.case-study-hero h2')).toHaveText(study.name);
    await expect(detail.locator('.case-study-metrics > div')).toHaveCount(3);
    await expect(detail.locator('.case-study-preview')).toBeVisible();
    await expect(detail.locator('.case-study-sections section')).toHaveCount(3);
    await page.getByTestId('button-back-to-work').click();
    await expect(page.getByTestId('card-project-01')).toBeVisible();
  }
});