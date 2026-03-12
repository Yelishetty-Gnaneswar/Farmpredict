const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  const content = await page.$eval('#root', el => el.innerHTML);
  console.log('root innerHTML length:', content.length);
  console.log(content.slice(0,500));
  await browser.close();
})();