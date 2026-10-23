const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  // Scroll to intro section
  await page.evaluate(() => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_screen2_fixed.png' });

  // Scroll to flower hero section
  await page.evaluate(() => {
    document.querySelector('#inspiration')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_flower_start.png' });

  // Scroll inside pinned scrub
  await page.evaluate(() => {
    window.scrollBy({ top: 750, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_flower_mid_rotation.png' });

  await browser.close();
  console.log('Flower shots captured!');
})();
