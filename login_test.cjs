const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/login');
  await page.fill('input[name="email"]', 'foobar@example.com');
  await page.fill('input[name="password"]', 'mypassword');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  const url = page.url();
  console.log('After submit, url =', url);
  const content = await page.content();
  console.log('Page title or body snippet:', content.slice(0,500));
  await browser.close();
})();