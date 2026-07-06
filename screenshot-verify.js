const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

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

  // Screenshot 1: Database hub
  console.log('Screenshot 1: Database hub');
  await page.goto('http://localhost:5173/dashboard/database', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'verify-database.png', fullPage: false });

  // Screenshot 2: Content Creators
  console.log('Screenshot 2: Content Creators');
  await page.goto('http://localhost:5173/dashboard/database/contentcreators', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: 'verify-creators.png', fullPage: false });

  // Screenshot 3: Service Hub
  console.log('Screenshot 3: Service Hub');
  await page.goto('http://localhost:5173/dashboard/service-hub', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 12000));
  await page.screenshot({ path: 'verify-servicehub.png', fullPage: false });

  console.log('All screenshots saved');
  await browser.close();
})();
