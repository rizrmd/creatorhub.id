const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Navigate to site first
  await page.goto('https://creatorhub.id', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Login via API
  console.log('Step 1: API login...');
  const loginRes = await page.evaluate(async () => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@creatorhub.id', password: 'Admin123!' })
    });
    return await res.json();
  });
  
  const token = loginRes.token || loginRes.access_token || loginRes.data?.token;
  console.log('Token length:', token?.length);

  if (token) {
    await page.evaluate((t) => {
      localStorage.setItem('auth_token', t);
    }, token);
    console.log('Token stored as auth_token');
  }

  // Navigate to service-hub
  console.log('Step 2: Navigate to service-hub...');
  await page.goto('https://creatorhub.id/dashboard/service-hub', { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log('Waiting for map and data to load...');
  await new Promise(r => setTimeout(r, 18000));
  
  console.log('Final URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('Body:', bodyText.substring(0, 300));

  await page.screenshot({ path: 'heatmap-final5.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
