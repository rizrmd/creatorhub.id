const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Login flow
  console.log('Step 1: Login page...');
  await page.goto('https://creatorhub.id/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click "Brand / Client" button
  const brandBtn = await page.$('button');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Brand') || text.includes('Client')) {
      await btn.click();
      console.log('Clicked Brand/Client button');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));

  // Now fill email/password
  console.log('Step 2: Filling credentials...');
  const emailInput = await page.$('input[type="email"], input[name="email"], input[type="text"]');
  if (emailInput) {
    await emailInput.click({ clickCount: 3 });
    await emailInput.type('admin@creatorhub.id');
    console.log('Email filled');
  }
  
  const passInput = await page.$('input[type="password"], input[name="password"]');
  if (passInput) {
    await passInput.type('Admin123!');
    console.log('Password filled');
  }

  // Click submit
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    console.log('Submit clicked');
  } else {
    const allBtns = await page.$$('button');
    for (const btn of allBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Login') || text.includes('Sign') || text.includes('Masuk')) {
        await btn.click();
        console.log('Clicked:', text.trim());
        break;
      }
    }
  }

  await new Promise(r => setTimeout(r, 5000));
  console.log('After login URL:', page.url());

  // Navigate to service-hub
  if (!page.url().includes('login')) {
    console.log('Step 3: Navigate to service-hub...');
    await page.goto('https://creatorhub.id/dashboard/service-hub', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Waiting for map to render...');
    await new Promise(r => setTimeout(r, 15000));
    
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('Page content:', bodyText.substring(0, 200));
  } else {
    console.log('Login failed, still on login page');
    const html = await page.evaluate(() => document.body.innerHTML.substring(0, 3000));
    console.log('HTML:', html.substring(0, 1500));
  }

  await page.screenshot({ path: 'heatmap-final2.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
