import puppeteer from 'puppeteer-core';

async function testRefinedMonogram() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  const headerBbox = await page.evaluate(() => {
    const el = document.querySelector('.top-header');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 10), width: r.width + 40, height: r.height + 30 };
  });

  // Refined JNR Monogram with micro-floral crown
  const refinedSvg = `
    <svg viewBox="0 0 32 32" fill="none" class="logo-icon" xmlns="http://www.w3.org/2000/svg" style="width:28px; height:28px; flex-shrink:0;">
      <defs>
        <linearGradient id="jnrBrandG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff7e38" />
          <stop offset="100%" stop-color="#f05a22" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#f05a22" flood-opacity="0.3"/>
        </filter>
      </defs>
      <!-- J: Elegant hook -->
      <path d="M6.5 8H12V18.5C12 21.8 9.8 23.8 7.2 23.8C5.5 23.8 4.2 22.8 3.8 21.6" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- N: Vibrant orange core bridge -->
      <path d="M12 9.5L19.2 23.5V7.5" stroke="url(#jnrBrandG)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
      <!-- R: Flowing top loop & grounding kick -->
      <path d="M19.2 8H23.5C26 8 27.8 9.6 27.8 12C27.8 14.4 26 15.8 23.5 15.8H19.2M23.2 15.8L27.5 23.5" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Tiny brand accent pip -->
      <circle cx="15.8" cy="4.2" r="1.5" fill="#f05a22"/>
    </svg>
  `;

  await page.evaluate((svgHtml) => {
    const logoEl = document.querySelector('.header-logo');
    if (logoEl) {
      const oldSvg = logoEl.querySelector('svg');
      if (oldSvg) oldSvg.outerHTML = svgHtml;
    }
  }, refinedSvg);

  if (headerBbox) {
    await page.screenshot({
      path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/header_logo_refined_preview.png',
      clip: headerBbox
    });
  }

  // Also take full desktop viewport shot
  await page.screenshot({
    path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/header_logo_full_context.png',
    clip: { x: 0, y: 0, width: 1440, height: 350 }
  });

  await browser.close();
  console.log('Saved refined monogram preview');
}

testRefinedMonogram().catch(console.error);
