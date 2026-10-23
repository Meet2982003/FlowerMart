const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  // 1. Screen 1
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_screen1.png' });
  console.log('Saved shot_screen1.png');

  // 2. Scroll to Screen 2
  await page.evaluate(() => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_screen2.png' });
  console.log('Saved shot_screen2.png');

  // 3. Scroll to Screen 3 (Flower Animation)
  await page.evaluate(() => {
    const el = document.querySelector('#inspiration');
    if (el) {
      window.scrollTo(0, el.offsetTop + 600);
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_screen3.png' });
  console.log('Saved shot_screen3.png');

  // 4. Scroll to Screen 4 (Two Cards)
  await page.evaluate(() => {
    document.querySelector('#story')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_screen4.png' });
  console.log('Saved shot_screen4.png');

  // 5. Scroll to Screen 5 (Network Grid)
  await page.evaluate(() => {
    document.querySelector('#network')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_screen5.png' });
  console.log('Saved shot_screen5.png');

  await browser.close();
  console.log('All screenshots captured!');
})();
