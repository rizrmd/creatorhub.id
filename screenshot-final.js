const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Login first
  console.log('Navigating to login...');
  await page.goto('https://creatorhub.id/login', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  await new Promise(r => setTimeout(r, 2000));

  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('Login page:', bodyText.substring(0, 200));

  // Fill login form
  console.log('Filling login form...');
  
  // Try to find email input
  const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="Email"]');
  if (emailInput) {
    await emailInput.type('admin@creatorhub.id');
    console.log('Email filled');
  } else {
    console.log('No email input found');
    const html = await page.evaluate(() => document.body.innerHTML.substring(0, 2000));
    console.log('HTML:', html);
  }

  const passInput = await page.$('input[type="password"], input[name="password"]');
  if (passInput) {
    await passInput.type('Admin123!');
    console.log('Password filled');
  }

  // Click login button
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    await loginBtn.click();
    console.log('Login clicked');
  } else {
    console.log('No submit button found');
    const buttons = await page.$$('button');
    console.log('Buttons found:', buttons.length);
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      console.log('  Button:', text);
    }
  }

  await new Promise(r => setTimeout(r, 3000));
  
  const url = page.url();
  console.log('After login URL:', url);

  // Navigate to service-hub
  console.log('Navigating to service-hub...');
  await page.goto('https://creatorhub.id/dashboard/service-hub', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Wait for map and heatmap to load
  console.log('Waiting for map and data...');
  await new Promise(r => setTimeout(r, 15000));
  
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
  
  const finalText = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log('Final body:', finalText);

  await page.screenshot({ path: 'heatmap-final.png', fullPage: false });
  console.log('Screenshot saved to heatmap-final.png');
  await browser.close();
})();
