const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  
  // Navigate to the servicehub page
  await page.goto('http://localhost:4173/servicehub', { 
    waitUntil: 'networkidle2',
    timeout: 30000 
  });
  
  // Wait extra time for map tiles and React rendering
  await new Promise(r => setTimeout(r, 8000));
  
  await page.screenshot({ path: 'heatmap-preview3.png', fullPage: false });
  console.log('Screenshot saved to heatmap-preview3.png');
  await browser.close();
})();
