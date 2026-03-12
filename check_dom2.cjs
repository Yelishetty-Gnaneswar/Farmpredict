const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log('PAGE LOG:', msg.type(), msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });
  page.on('requestfailed', req => {
    console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText);
  });

  await page.goto('http://localhost:5173');
  const content = await page.$eval('#root', el => el.innerHTML);
  console.log('root innerHTML length:', content.length);
  console.log(content.slice(0,500));
  await browser.close();
})();