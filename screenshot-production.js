const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  await page.goto('https://creatorhub.id/servicehub', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Wait for map tiles and heatmap to render
  await new Promise(r => setTimeout(r, 12000));
  
  await page.screenshot({ path: 'heatmap-production.png', fullPage: false });
  console.log('Screenshot saved to heatmap-production.png');
  await browser.close();
})();
