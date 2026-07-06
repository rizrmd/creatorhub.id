const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  // Listen for console messages
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating...');
  await page.goto('https://creatorhub.id/servicehub', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  console.log('Page loaded, waiting for content...');
  await new Promise(r => setTimeout(r, 5000));
  
  // Check page content
  const title = await page.title();
  console.log('Title:', title);
  
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('Body text:', bodyText);
  
  const html = await page.evaluate(() => document.body.innerHTML.substring(0, 1000));
  console.log('HTML:', html);

  // Wait more for map
  await new Promise(r => setTimeout(r, 10000));
  
  await page.screenshot({ path: 'heatmap-debug.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
