const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Navigate to localhost dev server
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // API login via production (proxied through vite)
  const loginRes = await page.evaluate(async () => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@creatorhub.id', password: 'Admin123!' })
    });
    return await res.json();
  });
  const token = loginRes.token || loginRes.access_token || loginRes.data?.token;
  if (token) {
    await page.evaluate((t) => { localStorage.setItem('auth_token', t); }, token);
  }

  // Navigate to service-hub
  await page.goto('http://localhost:5173/dashboard/service-hub', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('Waiting for map...');
  await new Promise(r => setTimeout(r, 12000));

  console.log('URL:', page.url());
  await page.screenshot({ path: 'heatmap-local.png', fullPage: false });
  console.log('Screenshot saved');
  await browser.close();
})();
