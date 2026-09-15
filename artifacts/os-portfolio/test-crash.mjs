import { chromium } from '@playwright/test';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(1000);
  console.log('HTML:', await page.content());
  await browser.close();
})();
