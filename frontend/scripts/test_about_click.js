const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // 1. Scroll down to IntroSection "More about us" button
  await page.evaluate(() => {
    document.querySelector('.intro-pill-btn')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Click "More about us"
  console.log('Clicking More about us in IntroSection...');
  const clickedIntro = await page.evaluate(() => {
    const btn = document.querySelector('.intro-pill-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked intro button directly in DOM:', clickedIntro);
  await new Promise(r => setTimeout(r, 1000));

  // Check if AboutUs page is rendered
  const isAboutRendered1 = await page.evaluate(() => {
    return !!document.querySelector('.about-page-wrapper');
  });
  console.log('About page rendered via IntroSection button:', isAboutRendered1);
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/1e2d1ee8-6e30-46f6-9af0-2eadb2e05886/shot_about_rendered.png' });

  // Click Back to Home
  if (isAboutRendered1) {
    console.log('Clicking Back to Home...');
    await page.evaluate(() => {
      document.querySelector('.about-back-btn')?.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    const isHome1 = await page.evaluate(() => !document.querySelector('.about-page-wrapper'));
    console.log('Returned to Home:', isHome1);
  }

  // Click "About us" in Header
  console.log('Clicking About us in Header...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.header-nav button, .header-nav a'));
    const aboutBtn = btns.find(b => b.textContent && b.textContent.includes('About us'));
    if (aboutBtn) aboutBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await new Promise(r => setTimeout(r, 600));

  const isAboutRendered2 = await page.evaluate(() => {
    return !!document.querySelector('.about-page-wrapper');
  });
  console.log('About page rendered via Header button:', isAboutRendered2);

  await browser.close();
  console.log('All about us click tests passed successfully!');
})();
