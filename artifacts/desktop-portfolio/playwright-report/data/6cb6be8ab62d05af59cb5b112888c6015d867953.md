# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: desktop-persistence.spec.ts >> stays usable when browser storage reads, writes, and removals fail
- Location: tests/desktop-persistence.spec.ts:129:1

# Error details

```
Error: expect(received).toBeCloseTo(expected, precision)

Expected: 0
Received: 674

Expected precision:    2
Expected difference: < 0.005
Received difference:   674
```

# Page snapshot

```yaml
- generic [ref=f2e2]:
  - main [ref=f2e3]:
    - generic [ref=f2e4]:
      - generic [ref=f2e5]:
        - generic [ref=f2e8]: ALEX.OS
        - generic [ref=f2e9]: /
        - generic [ref=f2e10]: Brooklyn, NY
        - generic [ref=f2e11]: /
        - generic [ref=f2e12]: workspace
      - generic [ref=f2e13]:
        - generic [ref=f2e14]: open to good problems
        - generic [ref=f2e15]: online
        - generic [ref=f2e22]: 2:23 PM
    - status: Saving restored. Current desktop changes are saved.
    - generic [ref=f2e23]:
      - generic [ref=f2e24]:
        - text: personal workspace / v1.0
        - heading [level=1] [ref=f2e25]:
          - text: Thoughtful interfaces.
          - emphasis [ref=f2e26]: Fast systems.
        - paragraph [ref=f2e27]: Alex Rivera is a product-minded frontend engineer making software feel clear, capable, and a little more human.
        - generic [ref=f2e28]:
          - button "open work" [ref=f2e29] [cursor=pointer]
          - button "say hello" [ref=f2e32] [cursor=pointer]
      - complementary "Draggable sticky note 1" [ref=f2e35]:
        - generic [ref=f2e36]:
          - generic [ref=f2e37]: field note / 004
          - button "Add sticky note" [ref=f2e38] [cursor=pointer]
          - textbox "Sticky note 1 text" [ref=f2e41]:
            - /placeholder: Write a note…
            - text: Recovery keeps the whole desktop.
          - generic [ref=f2e42]: — alex, 09:42
        - button "Rotate sticky note 1 from top left, currently 3 degrees. Press Home or 0 to reset" [ref=f2e43]
        - button "Rotate sticky note 1 from top right, currently 3 degrees. Press Home or 0 to reset" [ref=f2e44]
        - button "Rotate sticky note 1 from bottom left, currently 3 degrees. Press Home or 0 to reset" [ref=f2e45]
        - separator "Resize sticky note 1" [ref=f2e46]
      - region "Selected work window" [ref=f2e47]:
        - generic [ref=f2e48]:
          - generic [ref=f2e49]:
            - strong [ref=f2e50]: ~/alex/
            - text: selected work
          - generic [ref=f2e51]:
            - button "Minimize Selected work" [ref=f2e52] [cursor=pointer]:
              - generic: Minimize
            - button "Maximize Selected work" [ref=f2e55] [cursor=pointer]:
              - generic: Maximize
            - button "Close Selected work" [ref=f2e58] [cursor=pointer]:
              - generic: Close
        - generic [ref=f2e61]:
          - text: projects / selected
          - heading "Things I’ve shipped." [level=2] [ref=f2e62]
          - generic [ref=f2e63]:
            - article [ref=f2e64]:
              - generic [ref=f2e65]: "01"
              - generic [ref=f2e66]:
                - heading "Orbit CRM" [level=3] [ref=f2e67]
                - paragraph [ref=f2e68]: A calmer command center for customer teams managing complex accounts.
              - generic [ref=f2e69]: PRODUCT / 2024
              - button "view case study" [ref=f2e70] [cursor=pointer]
            - article [ref=f2e73]:
              - generic [ref=f2e74]: "02"
              - generic [ref=f2e75]:
                - heading "Field Notes" [level=3] [ref=f2e76]
                - paragraph [ref=f2e77]: Offline-first field research software for teams who work beyond the signal.
              - generic [ref=f2e78]: SYSTEMS / 2023
              - button "coming soon" [disabled] [ref=f2e79]
            - article [ref=f2e80]:
              - generic [ref=f2e81]: "03"
              - generic [ref=f2e82]:
                - heading "Signal Kit" [level=3] [ref=f2e83]
                - paragraph [ref=f2e84]: A living component library that turns product intent into shipped interface.
              - generic [ref=f2e85]: DESIGN ENG / 2023
              - button "coming soon" [disabled] [ref=f2e86]
          - paragraph [ref=f2e87]: 03 projects · 8 shipped systems · 0 design handoffs left behind
        - separator "Resize Selected work window from n" [ref=f2e88]
        - separator "Resize Selected work window from ne" [ref=f2e89]
        - separator "Resize Selected work window from e" [ref=f2e90]
        - separator "Resize Selected work window from se" [ref=f2e91]
        - separator "Resize Selected work window from s" [ref=f2e92]
        - separator "Resize Selected work window from sw" [ref=f2e93]
        - separator "Resize Selected work window from w" [ref=f2e94]
        - separator "Resize Selected work window from nw" [ref=f2e95]
      - region "Start a conversation window" [ref=f2e96]:
        - generic [ref=f2e97]:
          - generic [ref=f2e98]:
            - strong [ref=f2e99]: ~/alex/
            - text: start a conversation
          - generic [ref=f2e100]:
            - button "Minimize Start a conversation" [ref=f2e101] [cursor=pointer]:
              - generic: Minimize
            - button "Maximize Start a conversation" [ref=f2e104] [cursor=pointer]:
              - generic: Maximize
            - button "Close Start a conversation" [ref=f2e107] [cursor=pointer]:
              - generic: Close
        - generic [ref=f2e110]:
          - text: contact.txt
          - heading "Have a hard problem?" [level=2] [ref=f2e111]
          - paragraph [ref=f2e112]: Tell me what you’re making, where it’s stuck, and what “better” would feel like. I’ll get back to you with a considered reply, usually within a couple of days.
          - link "email alex" [ref=f2e113] [cursor=pointer]:
            - /url: mailto:hello@alexrivera.dev
          - paragraph [ref=f2e116]: hello@alexrivera.dev
        - separator "Resize Start a conversation window from n" [ref=f2e117]
        - separator "Resize Start a conversation window from ne" [ref=f2e118]
        - separator "Resize Start a conversation window from e" [ref=f2e119]
        - separator "Resize Start a conversation window from se" [ref=f2e120]
        - separator "Resize Start a conversation window from s" [ref=f2e121]
        - separator "Resize Start a conversation window from sw" [ref=f2e122]
        - separator "Resize Start a conversation window from w" [ref=f2e123]
        - separator "Resize Start a conversation window from nw" [ref=f2e124]
      - region "Terminal window" [ref=f2e125]:
        - generic [ref=f2e126]:
          - generic [ref=f2e127]:
            - strong [ref=f2e128]: ~/alex/
            - text: terminal
          - generic [ref=f2e129]:
            - button "Minimize Terminal" [ref=f2e130] [cursor=pointer]:
              - generic: Minimize
            - button "Maximize Terminal" [ref=f2e133] [cursor=pointer]:
              - generic: Maximize
            - button "Close Terminal" [ref=f2e136] [cursor=pointer]:
              - generic: Close
        - generic [ref=f2e139]:
          - generic [ref=f2e140]:
            - generic [ref=f2e141]: alex@studio:~$
            - generic [ref=f2e142]: whoami
          - generic [ref=f2e143]: alex rivera / product-minded frontend engineer building thoughtful interfaces and fast systems.
          - generic [ref=f2e144]: type “help” to explore. use ↑/↓ for history and Tab to complete.
          - generic [ref=f2e145]:
            - generic [ref=f2e146]: alex@studio:~$
            - textbox "Terminal command" [ref=f2e147]:
              - /placeholder: type a command
        - separator "Resize Terminal window from n" [ref=f2e148]
        - separator "Resize Terminal window from ne" [ref=f2e149]
        - separator "Resize Terminal window from e" [ref=f2e150]
        - separator "Resize Terminal window from se" [ref=f2e151]
        - separator "Resize Terminal window from s" [ref=f2e152]
        - separator "Resize Terminal window from sw" [ref=f2e153]
        - separator "Resize Terminal window from w" [ref=f2e154]
        - separator "Resize Terminal window from nw" [ref=f2e155]
    - navigation "Application dock. Drag to a screen edge or right-click to choose its position." [ref=f2e156]:
      - button "Open work" [ref=f2e157] [cursor=pointer]:
        - generic: Work · 2
      - button "Open about" [ref=f2e160] [cursor=pointer]:
        - generic: About · 1
      - button "Open contact" [ref=f2e164] [cursor=pointer]:
        - generic: Contact · 3
      - button "Open terminal" [ref=f2e167] [cursor=pointer]:
        - generic: "Terminal · `"
      - button "Open or focus Stickies" [ref=f2e170] [cursor=pointer]:
        - generic: Stickies
      - button "Show keyboard shortcuts" [ref=f2e173] [cursor=pointer]:
        - generic: Shortcuts
    - generic [ref=f2e177]: click around, stay curious
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  222 |   const initialStickyBox = await sticky.boundingBox();
  223 |   expect(initialStickyBox).not.toBeNull();
  224 |   await sticky.locator('.note-label').hover({ force: true });
  225 |   await page.mouse.down();
  226 |   await page.mouse.move(initialStickyBox!.x - 100, initialStickyBox!.y + 65, { steps: 6 });
  227 |   await page.mouse.up();
  228 |   await sticky.getByRole('textbox', { name: 'Sticky note 1 text' }).fill('Recovery keeps the whole desktop.');
  229 | 
  230 |   await openDesktopMenu(page);
  231 |   await chooseSubmenuOption(page, 'Theme', 'Dark');
  232 |   await openDesktopMenu(page);
  233 |   await chooseSubmenuOption(page, 'View', 'Small icons');
  234 |   await openDesktopMenu(page);
  235 |   await page.getByRole('menuitemcheckbox', { name: 'Snap to grid' }).click();
  236 |   await openDesktopMenu(page);
  237 |   await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  238 |   await openDockMenu(page);
  239 |   await page.getByRole('menuitemradio', { name: 'Right' }).click();
  240 | 
  241 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  242 |   await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  243 |   await expect(aboutFolder).toBeHidden();
  244 |   await expect(page.locator('.desktop-area')).toHaveClass(/dock-space-right/);
  245 |   await expect(storageNotice).toHaveCount(1);
  246 |   expect(await page.evaluate(() => (
  247 |     window as typeof window & { __storageFailureAttempts: { setItem: number } }
  248 |   ).__storageFailureAttempts.setItem)).toBeGreaterThan(0);
  249 | 
  250 |   const visibleInMemoryState = await page.evaluate(() => {
  251 |     const readGeometry = (selector: string) => {
  252 |       const element = document.querySelector<HTMLElement>(selector);
  253 |       if (!element) throw new Error(`Missing ${selector}`);
  254 |       return {
  255 |         left: Number.parseFloat(element.style.left),
  256 |         top: Number.parseFloat(element.style.top),
  257 |         width: Number.parseFloat(element.style.width),
  258 |         height: Number.parseFloat(element.style.height),
  259 |       };
  260 |     };
  261 |     return {
  262 |       contact: readGeometry('[data-testid="window-contact"]'),
  263 |       sticky: readGeometry('[data-testid="sticky-sticky"]'),
  264 |       stickyText: (document.querySelector('[aria-label="Sticky note 1 text"]') as HTMLTextAreaElement).value,
  265 |     };
  266 |   });
  267 |   const inMemoryState = { launcher: launcherGeometry, ...visibleInMemoryState };
  268 | 
  269 |   const attemptsBeforeRetry = await page.evaluate(() => (
  270 |     window as typeof window & { __storageFailureAttempts: { setItem: number } }
  271 |   ).__storageFailureAttempts.setItem);
  272 |   await retrySaving.click();
  273 |   await expect(storageNotice).toHaveCount(1);
  274 |   await expect(storageRestored).toHaveCount(0);
  275 |   await expect(recoveryGuidance).toBeVisible();
  276 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  277 |   await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  278 |   await expect(aboutFolder).toBeHidden();
  279 |   await expect(page.locator('.desktop-area')).toHaveClass(/dock-space-right/);
  280 |   await expect(sticky.getByRole('textbox', { name: 'Sticky note 1 text' })).toHaveValue(inMemoryState.stickyText);
  281 |   expect(await page.evaluate(() => {
  282 |     const readGeometry = (selector: string) => {
  283 |       const element = document.querySelector<HTMLElement>(selector);
  284 |       if (!element) throw new Error(`Missing ${selector}`);
  285 |       return {
  286 |         left: Number.parseFloat(element.style.left),
  287 |         top: Number.parseFloat(element.style.top),
  288 |         width: Number.parseFloat(element.style.width),
  289 |         height: Number.parseFloat(element.style.height),
  290 |       };
  291 |     };
  292 |     return {
  293 |       contact: readGeometry('[data-testid="window-contact"]'),
  294 |       sticky: readGeometry('[data-testid="sticky-sticky"]'),
  295 |       stickyText: (document.querySelector('[aria-label="Sticky note 1 text"]') as HTMLTextAreaElement).value,
  296 |     };
  297 |   })).toEqual(visibleInMemoryState);
  298 |   expect(await page.evaluate(() => (
  299 |     window as typeof window & { __storageFailureAttempts: { setItem: number } }
  300 |   ).__storageFailureAttempts.setItem)).toBe(attemptsBeforeRetry + 1);
  301 | 
  302 |   await page.evaluate(() => (
  303 |     window as typeof window & { __allowStorage: () => void }
  304 |   ).__allowStorage());
  305 |   await retrySaving.click();
  306 |   await expect(storageNotice).toHaveCount(0);
  307 |   await expect(storageRestored).toHaveText('Saving restored. Current desktop changes are saved.');
  308 |   await expect(storageRestored).toHaveAttribute('role', 'status');
  309 |   await expect(storageRestored).toHaveAttribute('aria-live', 'polite');
  310 |   const recoveredSnapshot = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey);
  311 |   expect(recoveredSnapshot).toMatchObject({
  312 |     iconSize: 'small',
  313 |     snapToGrid: true,
  314 |     theme: 'dark',
  315 |     showDesktopIcons: false,
  316 |     stickies: [{
  317 |       id: 'sticky',
  318 |       text: inMemoryState.stickyText,
  319 |     }],
  320 |     dockPosition: 'right',
  321 |   });
> 322 |   expect(recoveredSnapshot.itemPositions['desktop-about'].left).toBeCloseTo(inMemoryState.launcher.left, 2);
      |                                                                 ^ Error: expect(received).toBeCloseTo(expected, precision)
  323 |   expect(recoveredSnapshot.itemPositions['desktop-about'].top).toBeCloseTo(inMemoryState.launcher.top, 2);
  324 |   expect(recoveredSnapshot.itemPositions.contact.left).toBeCloseTo(inMemoryState.contact.left, 2);
  325 |   expect(recoveredSnapshot.itemPositions.contact.top).toBeCloseTo(inMemoryState.contact.top, 2);
  326 |   expect(recoveredSnapshot.itemPositions.sticky.left).toBeCloseTo(inMemoryState.sticky.left, 2);
  327 |   expect(recoveredSnapshot.itemPositions.sticky.top).toBeCloseTo(inMemoryState.sticky.top, 2);
  328 |   expect(recoveredSnapshot.itemSizes.contact.width).toBeCloseTo(inMemoryState.contact.width, 2);
  329 |   expect(recoveredSnapshot.itemSizes.contact.height).toBeCloseTo(inMemoryState.contact.height, 2);
  330 |   await expect(contactWindow).toBeVisible();
  331 | 
  332 |   await page.reload();
  333 | 
  334 |   await expect(page.getByTestId('notice-storage-unavailable')).toHaveCount(0);
  335 |   await expect(page.locator('.os-shell')).toHaveClass(/theme-dark/);
  336 |   await expect(page.locator('.os-shell')).toHaveClass(/icons-small/);
  337 |   await expect(page.getByTestId('button-folder-about')).toBeHidden();
  338 |   await expect(page.locator('.desktop-area')).toHaveClass(/dock-space-right/);
  339 |   await page.getByTestId('button-dock-contact').click();
  340 |   await expect(page.getByTestId('window-contact')).toBeVisible();
  341 |   await expect(page.getByTestId('sticky-sticky').getByRole('textbox', { name: 'Sticky note 1 text' }))
  342 |     .toHaveValue(inMemoryState.stickyText);
  343 | 
  344 |   const restoredVisibleState = await page.evaluate(() => {
  345 |     const readGeometry = (selector: string) => {
  346 |       const element = document.querySelector<HTMLElement>(selector);
  347 |       if (!element) throw new Error(`Missing ${selector}`);
  348 |       return {
  349 |         left: Number.parseFloat(element.style.left),
  350 |         top: Number.parseFloat(element.style.top),
  351 |         width: Number.parseFloat(element.style.width),
  352 |         height: Number.parseFloat(element.style.height),
  353 |       };
  354 |     };
  355 |     return {
  356 |       contact: readGeometry('[data-testid="window-contact"]'),
  357 |       sticky: readGeometry('[data-testid="sticky-sticky"]'),
  358 |     };
  359 |   });
  360 |   expect(restoredVisibleState.contact.left).toBeCloseTo(inMemoryState.contact.left, 2);
  361 |   expect(restoredVisibleState.contact.top).toBeCloseTo(inMemoryState.contact.top, 2);
  362 |   expect(restoredVisibleState.contact.width).toBeCloseTo(inMemoryState.contact.width, 2);
  363 |   expect(restoredVisibleState.contact.height).toBeCloseTo(inMemoryState.contact.height, 2);
  364 |   expect(restoredVisibleState.sticky.left).toBeCloseTo(inMemoryState.sticky.left, 2);
  365 |   expect(restoredVisibleState.sticky.top).toBeCloseTo(inMemoryState.sticky.top, 2);
  366 | 
  367 |   await openDesktopMenu(page);
  368 |   await expect(page.getByRole('menuitemcheckbox', { name: 'Snap to grid' })).toHaveAttribute('aria-checked', 'true');
  369 |   await expect(page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' })).toHaveAttribute('aria-checked', 'false');
  370 |   await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  371 |   const restoredLauncherGeometry = await page.getByTestId('button-folder-about').evaluate((element) => ({
  372 |     left: Number.parseFloat(element.style.left),
  373 |     top: Number.parseFloat(element.style.top),
  374 |   }));
  375 |   expect(restoredLauncherGeometry.left).toBeCloseTo(inMemoryState.launcher.left, 2);
  376 |   expect(restoredLauncherGeometry.top).toBeCloseTo(inMemoryState.launcher.top, 2);
  377 | 
  378 |   await openDesktopMenu(page);
  379 |   await page.getByRole('menuitemcheckbox', { name: 'Show desktop icons' }).click();
  380 |   await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), storageKey))
  381 |     .toEqual(recoveredSnapshot);
  382 | });
  383 | 
  384 | test('keeps storage recovery help visible and keyboard-operable on narrow screens', async ({ page }) => {
  385 |   await page.setViewportSize({ width: 320, height: 480 });
  386 |   await page.addInitScript(() => {
  387 |     Object.defineProperty(Storage.prototype, 'getItem', {
  388 |       configurable: true,
  389 |       value: () => {
  390 |         throw new Error('localStorage getItem blocked');
  391 |       },
  392 |     });
  393 |   });
  394 |   await page.reload();
  395 | 
  396 |   const storageNotice = page.getByTestId('notice-storage-unavailable');
  397 |   const storageHelp = page.getByRole('button', { name: 'How to restore saving' });
  398 |   await expect(storageNotice).toHaveCount(1);
  399 |   await expect(storageNotice).toBeVisible();
  400 |   await expect(storageHelp).toBeVisible();
  401 | 
  402 |   await storageHelp.focus();
  403 |   await expect(storageHelp).toBeFocused();
  404 |   expect(await storageHelp.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
  405 |   await page.keyboard.press('Enter');
  406 | 
  407 |   const guidance = page.getByText('Leave private browsing, or allow this site to store site data in your browser settings.');
  408 |   const hideHelp = page.getByRole('button', { name: 'Hide help' });
  409 |   await expect(guidance).toBeVisible();
  410 |   await expect(hideHelp).toBeFocused();
  411 |   await expect(hideHelp).toHaveAttribute('aria-expanded', 'true');
  412 |   await expect(storageNotice).toHaveCount(1);
  413 | 
  414 |   for (const locator of [storageNotice, hideHelp, guidance]) {
  415 |     const bounds = await locator.boundingBox();
  416 |     expect(bounds).not.toBeNull();
  417 |     expect(bounds!.x).toBeGreaterThanOrEqual(0);
  418 |     expect(bounds!.y).toBeGreaterThanOrEqual(0);
  419 |     expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  420 |     expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(480);
  421 |   }
  422 | 
```