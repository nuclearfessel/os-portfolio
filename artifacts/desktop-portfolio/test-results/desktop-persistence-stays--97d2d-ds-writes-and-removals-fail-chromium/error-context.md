# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: desktop-persistence.spec.ts >> stays usable when browser storage reads, writes, and removals fail
- Location: tests/desktop-persistence.spec.ts:103:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('window-about')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByTestId('window-about') with timeout 5000ms
  - waiting for getByTestId('window-about')

```

```yaml
- main:
  - text: ALEX.OS / Brooklyn, NY / workspace open to good problems online 12:26 PM personal workspace / v1.0
  - heading "Thoughtful interfaces. Fast systems." [level=1]:
    - text: Thoughtful interfaces.
    - emphasis: Fast systems.
  - paragraph: Alex Rivera is a product-minded frontend engineer making software feel clear, capable, and a little more human.
  - button "open work"
  - button "say hello"
  - button "Double-click to open about folder": about
  - button "Double-click to focus work folder" [pressed]: work
  - button "Double-click to focus terminal application" [pressed]: terminal
  - button "Double-click to open Email Alex application": Email Alex
  - button "Double-click to open stickies application": stickies
  - complementary "Draggable sticky note 1":
    - text: field note / 004
    - button "Add sticky note"
    - textbox "Sticky note 1 text":
      - /placeholder: Write a note…
      - text: The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.
    - text: — alex, 09:42
    - button "Rotate sticky note 1 from top left, currently 3 degrees"
    - button "Rotate sticky note 1 from top right, currently 3 degrees"
    - button "Rotate sticky note 1 from bottom left, currently 3 degrees"
    - separator "Resize sticky note 1"
  - region "Selected work window":
    - strong: ~/alex/
    - text: selected work
    - button "Minimize Selected work": Minimize
    - button "Maximize Selected work": Maximize
    - button "Close Selected work": Close
    - text: projects / selected
    - heading "Things I’ve shipped." [level=2]
    - article:
      - text: "01"
      - heading "Orbit CRM" [level=3]
      - paragraph: A calmer command center for customer teams managing complex accounts.
      - text: PRODUCT / 2024
      - button "view case study"
    - article:
      - text: "02"
      - heading "Field Notes" [level=3]
      - paragraph: Offline-first field research software for teams who work beyond the signal.
      - text: SYSTEMS / 2023
      - button "coming soon" [disabled]
    - article:
      - text: "03"
      - heading "Signal Kit" [level=3]
      - paragraph: A living component library that turns product intent into shipped interface.
      - text: DESIGN ENG / 2023
      - button "coming soon" [disabled]
    - paragraph: 03 projects · 8 shipped systems · 0 design handoffs left behind
    - separator "Resize Selected work window from n"
    - separator "Resize Selected work window from ne"
    - separator "Resize Selected work window from e"
    - separator "Resize Selected work window from se"
    - separator "Resize Selected work window from s"
    - separator "Resize Selected work window from sw"
    - separator "Resize Selected work window from w"
    - separator "Resize Selected work window from nw"
  - region "Terminal window":
    - strong: ~/alex/
    - text: terminal
    - button "Minimize Terminal": Minimize
    - button "Maximize Terminal": Maximize
    - button "Close Terminal": Close
    - text: alex@studio:~$ whoami alex rivera / product-minded frontend engineer building thoughtful interfaces and fast systems. type “help” to explore. use ↑/↓ for history and Tab to complete. alex@studio:~$
    - textbox "Terminal command":
      - /placeholder: type a command
    - separator "Resize Terminal window from n"
    - separator "Resize Terminal window from ne"
    - separator "Resize Terminal window from e"
    - separator "Resize Terminal window from se"
    - separator "Resize Terminal window from s"
    - separator "Resize Terminal window from sw"
    - separator "Resize Terminal window from w"
    - separator "Resize Terminal window from nw"
  - navigation "Application dock. Drag to a screen edge or right-click to choose its position.":
    - button "Open about": About · 1
    - button "Open work": Work · 2
    - button "Open terminal": "Terminal · `"
    - button "Open contact": Contact · 3
    - button "Open or focus Stickies": Stickies
    - button "Show keyboard shortcuts": Shortcuts
  - text: click around, stay curious
- region "Notifications (F8)":
  - list
```

# Test source

```ts
  31  |   const initialBox = await aboutFolder.boundingBox();
  32  |   expect(initialBox).not.toBeNull();
  33  | 
  34  |   await aboutFolder.hover();
  35  |   await page.mouse.down();
  36  |   await page.mouse.move(initialBox!.x - 180, initialBox!.y + 100, { steps: 8 });
  37  |   await page.mouse.up();
  38  | 
  39  |   const movedStyle = await aboutFolder.evaluate((element) => ({
  40  |     left: element.style.left,
  41  |     top: element.style.top,
  42  |   }));
  43  |   expect(movedStyle.left).not.toBe('');
  44  |   expect(movedStyle.top).not.toBe('');
  45  | 
  46  |   await openDesktopMenu(page);
  47  |   await chooseSubmenuOption(page, 'View', 'Small icons');
  48  | 
  49  |   await openDesktopMenu(page);
  50  |   await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();
  51  | 
  52  |   await openDesktopMenu(page);
  53  |   await chooseSubmenuOption(page, 'Theme', 'Dark');
  54  | 
  55  |   await openDesktopMenu(page);
  56  |   await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  57  | 
  58  |   await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  59  |   await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  60  |   await expect(page.getByTestId('button-folder-about')).toBeHidden();
  61  | 
  62  |   const savedBeforeReload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  63  |   expect(savedBeforeReload.itemPositions['desktop-about']).toBeTruthy();
  64  |   expect(savedBeforeReload.iconSize).toBe('small');
  65  |   expect(savedBeforeReload.snapToGrid).toBe(true);
  66  |   expect(savedBeforeReload.theme).toBe('dark');
  67  |   expect(savedBeforeReload.showDesktopIcons).toBe(false);
  68  |   expect(Number.parseFloat(movedStyle.left)).toBeCloseTo(savedBeforeReload.itemPositions['desktop-about'].left, 2);
  69  |   expect(Number.parseFloat(movedStyle.top)).toBeCloseTo(savedBeforeReload.itemPositions['desktop-about'].top, 2);
  70  | 
  71  |   await page.reload();
  72  | 
  73  |   await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  74  |   await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  75  |   await expect(page.getByTestId('button-folder-about')).toBeHidden();
  76  |   const savedAfterReload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  77  |   expect(savedAfterReload).toEqual(savedBeforeReload);
  78  | 
  79  |   await openDesktopMenu(page);
  80  |   await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'true');
  81  |   await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'false');
  82  |   await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  83  |   const restoredStyle = await page.getByTestId('button-folder-about').evaluate((element) => ({
  84  |     left: element.style.left,
  85  |     top: element.style.top,
  86  |   }));
  87  |   expect(restoredStyle).toEqual(movedStyle);
  88  | });
  89  | 
  90  | test('falls back to safe defaults when saved data is corrupted', async ({ page }) => {
  91  |   await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, '{not-json']);
  92  |   await page.reload();
  93  | 
  94  |   await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  95  |   await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  96  |   await expect(page.getByTestId('button-folder-about')).toBeVisible();
  97  | 
  98  |   await openDesktopMenu(page);
  99  |   await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'false');
  100 |   await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'true');
  101 | });
  102 | 
  103 | test('stays usable when browser storage reads, writes, and removals fail', async ({ page }) => {
  104 |   await page.addInitScript(() => {
  105 |     const attempts = { getItem: 0, setItem: 0, removeItem: 0 };
  106 |     Object.defineProperty(window, '__storageFailureAttempts', {
  107 |       configurable: true,
  108 |       value: attempts,
  109 |     });
  110 | 
  111 |     for (const method of ['getItem', 'setItem', 'removeItem'] as const) {
  112 |       Object.defineProperty(Storage.prototype, method, {
  113 |         configurable: true,
  114 |         value: () => {
  115 |           attempts[method] += 1;
  116 |           throw new Error(`localStorage ${method} blocked`);
  117 |         },
  118 |       });
  119 |     }
  120 |   });
  121 |   await page.reload();
  122 | 
  123 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  124 |   await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  125 |   await expect(page.getByTestId('button-folder-about')).toBeVisible();
  126 |   expect(await page.evaluate(() => (
  127 |     window as typeof window & { __storageFailureAttempts: { getItem: number } }
  128 |   ).__storageFailureAttempts.getItem)).toBeGreaterThan(0);
  129 | 
  130 |   await page.getByTestId('button-dock-about').click();
> 131 |   await expect(page.getByTestId('window-about')).toBeVisible();
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  132 | 
  133 |   await openDesktopMenu(page);
  134 |   await chooseSubmenuOption(page, 'Theme', 'Dark');
  135 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  136 |   expect(await page.evaluate(() => (
  137 |     window as typeof window & { __storageFailureAttempts: { setItem: number } }
  138 |   ).__storageFailureAttempts.setItem)).toBeGreaterThan(0);
  139 | 
  140 |   await openDesktopMenu(page);
  141 |   await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  142 |   await expect(page.getByRole('alertdialog', { name: 'Reset desktop?' })).toBeVisible();
  143 |   await page.getByTestId('button-confirm-reset').click();
  144 | 
  145 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  146 |   await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  147 |   await expect(page.getByTestId('button-folder-about')).toBeVisible();
  148 |   expect(await page.evaluate(() => (
  149 |     window as typeof window & { __storageFailureAttempts: { removeItem: number } }
  150 |   ).__storageFailureAttempts.removeItem)).toBeGreaterThan(0);
  151 | });
  152 | 
  153 | test('Reset desktop restores every default after confirmation', async ({ page }) => {
  154 |   await page.evaluate(([key, state]) => localStorage.setItem(key, JSON.stringify(state)), [
  155 |     storageKey,
  156 |     {
  157 |       folderPositions: {},
  158 |       itemPositions: {
  159 |         'desktop-about': { left: 120, top: 140 },
  160 |         sticky: { left: 44, top: 55 },
  161 |       },
  162 |       itemSizes: { sticky: { width: 240, height: 160 } },
  163 |       iconSize: 'small',
  164 |       snapToGrid: true,
  165 |       theme: 'dark',
  166 |       showDesktopIcons: false,
  167 |       stickies: [{
  168 |         id: 'sticky',
  169 |         color: 'blue',
  170 |         text: 'Changed note',
  171 |         rotation: -2,
  172 |         author: 'user',
  173 |         createdAt: 'saved',
  174 |       }],
  175 |       dockPosition: 'left',
  176 |     },
  177 |   ]);
  178 |   await page.reload();
  179 | 
  180 |   await openDesktopMenu(page);
  181 |   await page.getByRole('menuitem', { name: 'Reset desktop…' }).click();
  182 |   await expect(page.getByRole('alertdialog', { name: 'Reset desktop?' })).toBeVisible();
  183 |   await page.getByTestId('button-confirm-reset').click();
  184 | 
  185 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-light/);
  186 |   await expect(page.locator('.os-shell')).toHaveClass(/icons-large/);
  187 |   await expect(page.getByTestId('button-folder-about')).toBeVisible();
  188 |   const resetLauncherStyle = await page.getByTestId('button-folder-about').evaluate((element) => ({
  189 |     left: element.style.left,
  190 |     top: element.style.top,
  191 |   }));
  192 |   expect(resetLauncherStyle).toEqual({ left: '', top: '' });
  193 |   const resetStickyStyle = await page.getByTestId('sticky-sticky').evaluate((element) => ({
  194 |     left: element.style.left,
  195 |     top: element.style.top,
  196 |     width: element.style.width,
  197 |     height: element.style.height,
  198 |   }));
  199 |   expect(resetStickyStyle).toEqual({ left: '', top: '', width: '', height: '' });
  200 | 
  201 |   await openDesktopMenu(page);
  202 |   await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'false');
  203 |   await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'true');
  204 | 
  205 |   await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey)).toEqual({
  206 |     folderPositions: {},
  207 |     itemPositions: {},
  208 |     itemSizes: {},
  209 |     iconSize: 'large',
  210 |     snapToGrid: false,
  211 |     theme: 'light',
  212 |     showDesktopIcons: true,
  213 |     stickies: [{
  214 |       id: 'sticky',
  215 |       color: 'lemon',
  216 |       text: 'The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.',
  217 |       rotation: 3,
  218 |       author: 'alex',
  219 |       createdAt: '09:42',
  220 |     }],
  221 |     dockPosition: 'bottom',
  222 |   });
  223 | });
```