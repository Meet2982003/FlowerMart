import puppeteer from 'puppeteer-core';

async function testFlowerHeroLayouts() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  // Test Option 1: Top & Bottom framing (Two lines)
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Playfair+Display:ital,wght@0,700;1,600&family=Outfit:wght@700;800;900&family=Bebas+Neue&family=Cinzel:wght@700;800&display=swap" rel="stylesheet">
    <style>
      :root {
        --accent-purple: #8572f5;
        --bg-cream: #fbf7ee;
        --font-display: 'Plus Jakarta Sans', sans-serif;
      }
      body {
        margin: 0;
        padding: 0;
        background: #171615;
        font-family: var(--font-display);
      }
      .test-section {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: var(--bg-cream);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 60px 0;
        box-sizing: border-box;
      }
      .top-track, .bottom-track {
        width: 100%;
        display: flex;
        justify-content: center;
        white-space: nowrap;
        z-index: 5;
      }
      .banner-line {
        font-size: clamp(60px, 7.5vw, 110px);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--accent-purple);
        line-height: 1;
        opacity: 0.95;
      }
      .center-flower {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        width: 420px;
        height: 420px;
      }
      .center-flower img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 25px 45px rgba(70, 30, 90, 0.28));
      }
    </style>
  </head>
  <body>
    <!-- Layout 1: Top & Bottom Framing -->
    <div class="test-section" id="opt1">
      <div class="top-track">
        <span class="banner-line">ONCE IN A LIFETIME</span>
      </div>

      <div class="center-flower">
        <img src="http://localhost:3001/assets/purple_flower.png" alt="Flower" />
      </div>

      <div class="bottom-track">
        <span class="banner-line">MAKE IT MEMORABLE</span>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/flower_layout_option1_stacked.png' });

  // Test Option 2: Single line with flower in front of text, but text brought to FRONT or given high contrast
  const html2 = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
      :root {
        --accent-purple: #8572f5;
        --bg-cream: #fbf7ee;
        --font-display: 'Plus Jakarta Sans', sans-serif;
      }
      body {
        margin: 0;
        padding: 0;
        background: #171615;
        font-family: var(--font-display);
      }
      .test-section {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: var(--bg-cream);
        overflow: hidden;
        display: grid;
        place-items: center;
      }
      .center-flower {
        grid-area: 1 / 1;
        z-index: 2;
        width: 440px;
        height: 440px;
      }
      .center-flower img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 25px 45px rgba(70, 30, 90, 0.25));
      }
      .text-wrapper {
        grid-area: 1 / 1;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        pointer-events: none;
      }
      .banner-line {
        font-size: clamp(65px, 8.5vw, 130px);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: #ffffff;
        -webkit-text-stroke: 2.5px var(--accent-purple);
        line-height: 1;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }
      .banner-line .solid-part {
        color: var(--accent-purple);
        -webkit-text-stroke: 0;
      }
    </style>
  </head>
  <body>
    <!-- Layout 2: Text layered in front with stroke / solid contrast -->
    <div class="test-section">
      <div class="center-flower">
        <img src="http://localhost:3001/assets/purple_flower.png" alt="Flower" />
      </div>
      <div class="text-wrapper">
        <span class="banner-line">
          <span class="solid-part">ONCE IN LIFETIME </span>
          <span>MAKE IT </span>
          <span class="solid-part">MEMORABLE</span>
        </span>
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(html2);
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/flower_layout_option2_overlay.png' });

  // Test Option 3: Wide spaced track so "MAKE IT" is placed visibly
  const html3 = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
      :root {
        --accent-purple: #8572f5;
        --bg-cream: #fbf7ee;
        --font-display: 'Plus Jakarta Sans', sans-serif;
      }
      body {
        margin: 0;
        padding: 0;
        background: #171615;
        font-family: var(--font-display);
      }
      .test-section {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: var(--bg-cream);
        overflow: hidden;
        display: grid;
        place-items: center;
      }
      .center-flower {
        grid-area: 1 / 1;
        z-index: 10;
        width: 360px;
        height: 360px;
      }
      .center-flower img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 20px 40px rgba(70, 30, 90, 0.25));
      }
      .text-wrapper {
        grid-area: 1 / 1;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        width: 100%;
      }
      .banner-line {
        font-size: clamp(55px, 7vw, 110px);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--accent-purple);
        line-height: 1;
        display: flex;
        align-items: center;
        gap: 380px; /* Gap exactly fits the flower! */
      }
    </style>
  </head>
  <body>
    <!-- Layout 3: Center Gap where flower sits between left and right phrases -->
    <div class="test-section">
      <div class="text-wrapper">
        <div class="banner-line">
          <span>ONCE IN A LIFETIME</span>
          <span>MAKE IT MEMORABLE</span>
        </div>
      </div>
      <div class="center-flower">
        <img src="http://localhost:3001/assets/purple_flower.png" alt="Flower" />
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(html3);
  await page.screenshot({ path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/flower_layout_option3_gap.png' });

  await browser.close();
  console.log('Saved all 3 layout tests');
}

testFlowerHeroLayouts().catch(console.error);
