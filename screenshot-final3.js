const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Step 1: Login via API to get token
  console.log('Step 1: API login...');
  const loginRes = await page.evaluate(async () => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@creatorhub.id', password: 'Admin123!' })
    });
    return await res.json();
  });
  console.log('Login response:', JSON.stringify(loginRes).substring(0, 200));
  
  // Step 2: Set token in localStorage
  const token = loginRes.token || loginRes.access_token;
  if (token) {
    console.log('Token received, setting localStorage...');
    await page.evaluate((t) => {
      localStorage.setItem('token', t);
      localStorage.setItem('auth_token', t);
    }, token);
  } else {
    console.log('No token in response, trying different approach...');
    // Navigate to login page and do it manually
    await page.goto('https://creatorhub.id/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Brand/Client button
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Brand') || text.includes('Client')) {
        await btn.click();
        console.log('Clicked Brand/Client');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
    
    // Fill form
    const inputs = await page.$$('input');
    for (const input of inputs) {
      const type = await page.evaluate(el => el.type, input);
      const placeholder = await page.evaluate(el => el.placeholder, input);
      console.log('  Input type:', type, 'placeholder:', placeholder);
      if (type === 'email' || placeholder.toLowerCase().includes('email')) {
        await input.type('admin@creatorhub.id');
        console.log('  -> Email filled');
      } else if (type === 'password') {
        await input.type('Admin123!');
        console.log('  -> Password filled');
      }
    }
    
    // Submit
    const allBtns = await page.$$('button[type="submit"]');
    if (allBtns.length > 0) {
      await allBtns[0].click();
      console.log('Submit clicked');
    } else {
      const allBtns2 = await page.$$('button');
      for (const btn of allBtns2) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Login') || text.includes('Masuk')) {
          await btn.click();
          console.log('Clicked:', text.trim());
          break;
        }
      }
    }
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log('Step 3: Navigate to service-hub...');
  await page.goto('https://creatorhub.id/dashboard/service-hub', { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log('Waiting for map and data...');
  await new Promise(r => setTimeout(r, 15000));
  
  console.log('Final URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('Body:', bodyText.substring(0, 300));

  await page.screenshot({ path: 'heatmap-final3.png', fullPage: false });
  console.log('Screenshot saved to heatmap-final3.png');
  await browser.close();
})();
