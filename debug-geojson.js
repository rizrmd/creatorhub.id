const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('https://creatorhub.id', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Check GeoJSON properties
  const result = await page.evaluate(async () => {
    const KABUPATEN_KOTA_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Kota%20Kabupaten%20simplified.json";
    const res = await fetch(KABUPATEN_KOTA_URL);
    const topo = await res.json();
    const topojson = await import('https://esm.sh/topojson-client@3');
    const geo = topojson.feature(topo, topo.objects.gadm36_IDN_2);
    
    // Find Jakarta features
    const jakarta = geo.features.filter(f => {
      const p = f.properties;
      return JSON.stringify(p).toLowerCase().includes('jakarta');
    });
    
    return jakarta.map(f => ({
      NAME_1: f.properties?.NAME_1,
      NAME_2: f.properties?.NAME_2,
      type: f.geometry?.type,
      props: Object.keys(f.properties || {}),
    }));
  });

  console.log('Jakarta features:', JSON.stringify(result, null, 2));
  await browser.close();
})();
